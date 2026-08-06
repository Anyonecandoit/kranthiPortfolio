"use client";

import { Mic } from "lucide-react";
import { useSpeechRecognition } from "@/lib/voice";
import { cn } from "@/lib/utils";

/**
 * Mic button for the chat input. Uses the browser's SpeechRecognition API —
 * renders nothing when unsupported. `onTranscript` fires once with the final
 * transcript when listening stops.
 */
export function VoiceInputButton({
  onTranscript,
  disabled,
  className,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const { listening, supported, startListening, stopListening } =
    useSpeechRecognition(onTranscript);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => (listening ? stopListening() : startListening())}
      disabled={disabled}
      title={listening ? "Stop listening" : "Speak to type"}
      aria-label={listening ? "Stop listening" : "Speak to type"}
      className={cn(
        "shrink-0 flex items-center justify-center transition-colors",
        listening ? "text-red-400" : "text-gray-500 hover:text-violet-400",
        className
      )}
    >
      {listening ? (
        <span className="w-3 h-3 rounded-sm bg-red-400 animate-pulse" />
      ) : (
        <Mic size={16} />
      )}
    </button>
  );
}
