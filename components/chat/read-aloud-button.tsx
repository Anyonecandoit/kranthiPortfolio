"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speakViaCloud, stopAllSpeech } from "@/lib/voice";
import { cn } from "@/lib/utils";

/**
 * "Read aloud" toggle on assistant messages. Uses the natural cloud voice
 * (same engine as the floating voice assistant), with browser TTS fallback.
 */
export function ReadAloudButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = () => {
    if (speaking) {
      stopAllSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakViaCloud(text, {
        onend: () => setSpeaking(false),
        onerror: () => setSpeaking(false),
      });
    }
  };

  return (
    <button
      onClick={toggle}
      title={speaking ? "Stop reading" : "Read aloud"}
      aria-label={speaking ? "Stop reading" : "Read aloud"}
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium transition-colors",
        speaking ? "text-violet-400" : "text-gray-600 hover:text-violet-400"
      )}
    >
      {speaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
    </button>
  );
}
