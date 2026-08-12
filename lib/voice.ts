"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "./api";

/**
 * Browser voice: speech-to-text (Web Speech API) + text-to-speech.
 * No backend or API keys — everything runs in the browser. Feature-detect
 * and fail gracefully (returns "unsupported") where the browser lacks it.
 */

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

type RecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return (typeof ctor === "function" ? ctor : null) as RecognitionCtor | null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Hook around the Web Speech API. `onFinal` fires once when listening ends,
 * with the accumulated final transcript — callers push that into the input.
 */
export function useSpeechRecognition(onFinal?: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  // Detect support after hydration — SSR always renders "unsupported" so the
  // server and client HTML match (the mic appears once hydrated if available).
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTextRef = useRef("");
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => {
    setSupported(isSpeechRecognitionSupported());
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    // Cancel any in-flight recognition first.
    recognitionRef.current?.stop();
    finalTextRef.current = "";

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const piece = result[0]?.transcript ?? "";
        if (result.isFinal) finalTextRef.current += piece;
        else interim += piece;
      }
      setTranscript((finalTextRef.current + interim).trim());
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      const final = finalTextRef.current.trim();
      if (final) onFinalRef.current?.(final);
    };

    recognition.onerror = (e) => {
      console.warn("[voice] recognition error:", e.error);
      recognitionRef.current = null;
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setTranscript("");
    setListening(true);
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return { listening, supported, transcript, startListening, stopListening };
}

/** Read text aloud via speechSynthesis. Returns true if speech started. */
export function speakText(text: string, onend?: () => void): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  const clean = text.replace(/[*#`>_~|]/g, "").slice(0, 1200);
  if (!clean.trim()) return false;
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1;
  utterance.pitch = 1;
  if (onend) utterance.onend = onend;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
}

/* ------------------------------------------------------------------ */
/* Cloud TTS with graceful fallback to the browser's speechSynthesis.  */
/* Long replies are split into sentence chunks and played back-to-back. */
/* ------------------------------------------------------------------ */

let cloudAudio: HTMLAudioElement | null = null;
let speechToken = 0; // incremented to invalidate in-flight speech chains

function stopCloudSpeech(): void {
  if (cloudAudio) {
    cloudAudio.pause();
    cloudAudio.currentTime = 0;
    cloudAudio.src = "";
    cloudAudio = null;
  }
}

/** Stops any in-flight speech (cloud audio + browser synthesis). */
export function stopAllSpeech(): void {
  speechToken++; // cancels any queued/streaming cloud chain
  stopCloudSpeech();
  stopSpeaking();
}

interface SpeakOptions {
  voice?: string;
  onend?: () => void;
  onerror?: () => void;
}

const DEFAULT_VOICE = "Amy";

/* One-time audio unlock: browsers (esp. Safari/iOS) only allow programmatic
 * audio playback after a user gesture. Priming the AudioContext on the first
 * pointer/keyboard interaction lets the assistant speak reliably even when
 * play() happens a few seconds after the user's last click. */
let audioUnlocked = false;
function unlockAudio(): void {
  if (audioUnlocked || typeof window === "undefined") return;
  audioUnlocked = true;
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as Record<string, unknown>).webkitAudioContext;
    if (typeof Ctor === "function") {
      const ctx = new (Ctor as typeof AudioContext)();
      void ctx.resume().catch(() => undefined);
    }
  } catch {
    /* ignore */
  }
}
if (typeof window !== "undefined") {
  const unlock = () => unlockAudio();
  window.addEventListener("pointerdown", unlock, { capture: true, once: true });
  window.addEventListener("keydown", unlock, { capture: true, once: true });
}

function toSpeechClean(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "Code block omitted. ")
    .replace(/[*#`>_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split into <=max-char pieces on sentence boundaries (markdown already stripped). */
function splitSpeech(text: string, max = 750): string[] {
  const parts: string[] = [];
  let rest = text;
  while (rest.length > max) {
    let cut = rest.lastIndexOf(". ", max);
    if (cut < max * 0.6) cut = rest.lastIndexOf(" ", max);
    if (cut < max * 0.6) cut = max;
    parts.push(rest.slice(0, cut + 1).trim());
    rest = rest.slice(cut + 1).trim();
  }
  if (rest) parts.push(rest);
  return parts.filter(Boolean);
}

/**
 * Speak text using the cloud TTS route (natural voice). If the cloud call
 * fails (offline, provider hiccup), falls back to the browser's
 * speechSynthesis so the assistant never goes silent.
 */
export function speakViaCloud(text: string, opts: SpeakOptions = {}): void {
  const clean = toSpeechClean(text).slice(0, 4000);
  if (!clean) return;

  const chunks = splitSpeech(clean);
  if (!chunks.length) return;

  const token = ++speechToken;
  stopCloudSpeech();
  stopSpeaking();

  let index = 0;

  const fallbackToBrowser = () => {
    if (token !== speechToken) return;
    if (!speakText(clean, opts.onend)) opts.onerror?.();
  };

  const playNext = () => {
    if (token !== speechToken) return;
    if (index >= chunks.length) {
      opts.onend?.();
      return;
    }
    const chunk = chunks[index++];
    fetch(apiUrl("/api/tts"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: chunk, voice: opts.voice ?? DEFAULT_VOICE }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("tts route failed");
        const blob = await res.blob();
        if (!blob.size) throw new Error("empty audio");
        if (token !== speechToken) return; // cancelled while fetching
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        cloudAudio = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          if (cloudAudio === audio) cloudAudio = null;
          playNext();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          if (cloudAudio === audio) cloudAudio = null;
          fallbackToBrowser();
        };
        audio.play().catch(() => fallbackToBrowser());
      })
      .catch(() => fallbackToBrowser());
  };

  playNext();
}
