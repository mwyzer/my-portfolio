"use client";

import { useEffect, useState, useRef, type ElementType } from "react";

interface DecryptedTextProps {
  /** The target text to reveal */
  text: string;
  /** Speed of character changes in ms */
  speed?: number;
  /** Characters to use for scrambling */
  chars?: string;
  /** Whether to animate on mount automatically */
  animate?: boolean;
  /** Class name for the text element */
  className?: string;
  /** HTML tag */
  as?: ElementType;
  /** Callback when animation completes */
  onComplete?: () => void;
}

const DEFAULT_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function DecryptedText({
  text,
  speed = 50,
  chars = DEFAULT_CHARS,
  animate = true,
  className = "",
  as: Tag = "span",
  onComplete,
}: DecryptedTextProps) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!animate || reducedMotion) {
      setDisplay(text);
      return;
    }

    const length = text.length;
    let frame = 0;
    frameRef.current = 0;

    // Build reveal schedule: each character reveals after a delay
    const maxFrames = length * 3; // total scramble frames

    intervalRef.current = setInterval(() => {
      frame++;

      if (frame >= maxFrames) {
        setDisplay(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete?.();
        return;
      }

      // Characters reveal progressively from left to right
      const revealedCount = Math.floor((frame / maxFrames) * length);

      const result = Array.from({ length }, (_, i) => {
        if (i < revealedCount) return text[i];
        // Random scramble char
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");

      setDisplay(result);
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, chars, animate, onComplete]);

  const Comp = Tag as any;
  return <Comp className={className}>{display}</Comp>;
}
