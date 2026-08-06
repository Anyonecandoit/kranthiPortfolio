"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { supabase } from "./supabase";
import { trackEvent } from "./analytics";
import { DEFAULT_AGENT_ID, getAgent } from "./agents";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
  suggestion?: string;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  isTyping: boolean;
  setIsTyping: (v: boolean) => void;
  clearMessages: () => void;
  sendChat: (text: string) => Promise<void>;
  agentId: string;
  setAgent: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/** Maximum messages shown in the floating widget. */
const MAX_WIDGET_MESSAGES = 20;
/** Maximum messages sent to the API (prevents context overflow). */
const MAX_API_MESSAGES = 60;

/**
 * Persists a user + assistant message pair to Supabase when the user is
 * authenticated. Silently no-ops if not logged in or on error.
 */
async function persistMessages(
  userId: string,
  conversationIdRef: React.MutableRefObject<string | null>,
  userMsg: { role: string; content: string },
  assistantMsg: { role: string; content: string },
  agentName?: string,
) {
  try {
    if (!conversationIdRef.current) {
      const title = userMsg.content.slice(0, 80) || "New Conversation";
      const agentTitle = agentName ? `[${agentName}] ${title}` : title;
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .insert({ user_id: userId, title: agentTitle })
        .select("id")
        .single();
      if (convErr || !conv) return;
      conversationIdRef.current = conv.id;
    }
    const convId = conversationIdRef.current;
    await supabase.from("messages").insert([
      { conversation_id: convId, role: userMsg.role as "user" | "assistant", content: userMsg.content },
      { conversation_id: convId, role: assistantMsg.role as "user" | "assistant", content: assistantMsg.content },
    ]);
  } catch {
    // Persistence is best-effort — don't break the UX if the DB is down.
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [agentId, setAgentId] = useState<string>(DEFAULT_AGENT_ID);
  const conversationIdRef = useRef<string | null>(null);
  const loadedConversationRef = useRef(false);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = null;
  }, []);

  const setAgent = useCallback((id: string) => {
    setAgentId(id);
    // Each agent has its own thread — switching starts fresh.
    setMessages([]);
    conversationIdRef.current = null;
    trackEvent("agent_select", { agent: id });
  }, []);

  /* ----------------------------------------------------------------
   * Load the most recent conversation for a newly authenticated user.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!user || loadedConversationRef.current) return;
    loadedConversationRef.current = true;

    (async () => {
      try {
        const { data: conv } = await supabase
          .from("conversations")
          .select("id")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();
        if (!conv) return;
        conversationIdRef.current = conv.id;

        const { data: rows } = await supabase
          .from("messages")
          .select("id, role, content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: true });
        if (!rows?.length) return;

        setMessages(
          rows.map((r) => ({
            id: r.id,
            role: r.role as "user" | "assistant",
            content: r.content,
            timestamp: new Date(r.created_at),
          })),
        );
      } catch {
        // Best-effort — start with empty state if load fails.
      }
    })();
  }, [user]);

  const sendChat = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    // Build the transcript to send: use at most MAX_API_MESSAGES,
    // taking the most recent messages so context is fresh.
    const transcript = [...messages, userMsg];
    const apiTranscript = transcript.length > MAX_API_MESSAGES
      ? transcript.slice(-MAX_API_MESSAGES)
      : transcript;

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    trackEvent("chat_message", { role: "user" });

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    let fullContent = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiTranscript.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          agentId,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "API Error", suggestion: "" }));
        throw new Error(err.error || "API Error");
      }

      const modelUsed = response.headers.get("X-Model-Used") || "";
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullContent, model: modelUsed } : m
            )
          );
        }
      }

      // Persist to Supabase (best-effort, logged-in users only).
      if (user?.id) {
        persistMessages(user.id, conversationIdRef,
          { role: "user", content: text },
          { role: "assistant", content: fullContent },
          getAgent(agentId)?.name,
        );
      }

      // Enforce widget message cap: trim old messages beyond MAX_WIDGET_MESSAGES.
      setMessages((prev) =>
        prev.length > MAX_WIDGET_MESSAGES ? prev.slice(-MAX_WIDGET_MESSAGES) : prev
      );
    } catch (error) {
      const msg = (error as Error).message || "API Error";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `⚠️ ${msg}` } : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, user?.id, agentId]);

  return (
    <ChatContext.Provider value={{ messages, addMessage, updateMessage, isTyping, setIsTyping, clearMessages, sendChat, agentId, setAgent }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
