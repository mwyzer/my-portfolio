"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle } from "lucide-react";

// ChatPanel pulls in useChat + the AI SDK transport (~34 KiB) and is only
// needed once a visitor actually opens the widget — most never do, so it's
// code-split out and fetched on first click instead of on every page load.
const ChatPanel = dynamic(() => import("./chat-panel"), {
  loading: () => (
    <div
      className="fixed bottom-6 right-6 z-50 w-[22rem] sm:w-[26rem] h-[32rem] rounded-2xl shadow-2xl border flex items-center justify-center"
      style={{ background: "var(--surface-elevated)", borderColor: "var(--border)" }}
    >
      <span className="text-sm" style={{ color: "var(--text-dim)" }}>Loading…</span>
    </div>
  ),
});

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow hover:animate-none transition-all"
          style={{ background: "var(--color-accent)", color: "#fff" }}
          aria-label="Open chat with AI assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}
