"use client";

import { useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X, Send, Sparkles } from "lucide-react";

function getMessageText(msg: { role: string; parts: unknown[] }): string {
  const parts = msg.parts as { type: string; text?: string }[];
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent/chat" }),
    []
  );

  const initialMessages = useMemo(
    () => [
      {
        id: "welcome",
        role: "assistant" as const,
        parts: [
          {
            type: "text" as const,
            text: "Hi there! 👋 I'm Wyzer's AI assistant. Ask me anything about his background, skills, projects, or experience — I'm here to help!",
          },
        ],
      },
    ],
    []
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (err) => console.error("[chat-widget] useChat error:", err),
    onFinish: (msg) => console.log("[chat-widget] onFinish:", msg),
    messages: initialMessages,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const inputEl = form.elements.namedItem("message") as HTMLInputElement;
    const text = inputEl?.value?.trim();
    if (!text || isLoading) return;
    console.log("[chat-widget] sending:", text);
    sendMessage({ parts: [{ type: "text", text }] });
    form.reset();
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[22rem] sm:w-[26rem] h-[32rem] rounded-2xl shadow-2xl flex flex-col overflow-hidden border"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          borderColor: "var(--color-accent-hover)",
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold text-sm">AI Secretary</span>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) =>
          msg.role === "assistant" ? (
            <div key={msg.id} className="flex justify-start">
              <div
                className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {getMessageText(msg)}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end">
              <div
                className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md text-sm leading-relaxed"
                style={{
                  background: "var(--color-accent)",
                  color: "#fff",
                }}
              >
                {getMessageText(msg)}
              </div>
            </div>
          )
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-2.5 rounded-2xl rounded-bl-md"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-dim)", animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-dim)", animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-dim)", animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div
            className="px-3 py-2 rounded-lg text-xs"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--color-error)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <span>⚠️ {error.message || "Failed to get response"}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t shrink-0"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <input
          type="text"
          name="message"
          placeholder="Ask about Wyzer..."
          className="flex-1 px-3 py-2 text-sm rounded-lg outline-none transition-colors"
          style={{
            background: "var(--bg)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
          disabled={isLoading}
          autoFocus
          onFocus={(e) => { e.target.style.borderColor = "var(--color-accent)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-all disabled:opacity-50"
          style={{
            background: isLoading ? "var(--surface-hover)" : "var(--color-accent)",
            color: "#fff",
          }}
          disabled={isLoading}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
