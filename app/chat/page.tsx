import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata = {
  title: "Chat with Kranthi's AI | Portfolio",
  description: "Ask Kranthi's AI assistant about his experience, projects, and skills.",
};

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <ChatInterface />
    </main>
  );
}
