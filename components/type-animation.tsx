"use client";

import { useState, useEffect, useRef } from "react";

const titles = [
  "Senior SDET",
  "Automation Expert",
  "Performance Testing Specialist",
  "API Testing Engineer",
  "AI-Driven QA Leader",
];

const TYPING_SPEED = 80; // ms per character
const DELETING_SPEED = 40; // ms per character (faster)
const PAUSE_AFTER_TYPE = 2000; // pause after fully typed
const PAUSE_AFTER_DELETE = 300; // pause after fully deleted

/**
 * True letter-by-letter typewriter with blinking cursor.
 * Types each character one at a time, pauses, then deletes one at a time.
 */
export function TypeAnimation({ className }: { className?: string }) {
  const [text, setText] = useState("");
  const titleIdx = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    const currentTitle = titles[titleIdx.current];

    // Determine what to do next
    if (!isDeleting.current) {
      // === TYPING ===
      if (text.length < currentTitle.length) {
        // Still typing — add one character after delay
        const timer = setTimeout(() => {
          setText(currentTitle.slice(0, text.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(timer);
      } else {
        // Finished typing — pause, then start deleting
        const timer = setTimeout(() => {
          isDeleting.current = true;
          setText(""); // trigger re-render to start deleting
        }, PAUSE_AFTER_TYPE);
        return () => clearTimeout(timer);
      }
    } else {
      // === DELETING ===
      if (text.length > 0) {
        // Still deleting — remove one character after delay
        const timer = setTimeout(() => {
          setText(currentTitle.slice(0, text.length - 1));
        }, DELETING_SPEED);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting — move to next title
        const timer = setTimeout(() => {
          titleIdx.current = (titleIdx.current + 1) % titles.length;
          isDeleting.current = false;
          setText(""); // trigger re-render to start typing next
        }, PAUSE_AFTER_DELETE);
        return () => clearTimeout(timer);
      }
    }
  }, [text]); // re-run whenever text changes

  return (
    <span className={className} aria-live="polite" aria-label={titles[titleIdx.current]}>
      {text}
      <span
        className="inline-block w-[3px] h-[1em] bg-current ml-0.5 align-middle"
        style={{ animation: "blink 1s step-end infinite" }}
        aria-hidden="true"
      />
    </span>
  );
}
