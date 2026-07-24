"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

function getMessageText(msg: { role: string; parts: unknown[] }): string {
  const parts = msg.parts as { type: string; text?: string }[];
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent/chat" }),
    onError: (err) => console.error("[chat-widget] useChat error:", err),
    onFinish: (msg) => console.log("[chat-widget] onFinish:", msg),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi there! 👋 I'm Wyzer's AI assistant. Ask me anything about his background, skills, projects, or experience — I'm here to help!",
          },
        ],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    if (!hasOpened) setHasOpened(true);
  };

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
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 btn btn-circle btn-primary shadow-lg btn-lg animate-bounce-slow hover:animate-none"
          aria-label="Open chat with AI assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[22rem] sm:w-[26rem] h-[32rem] rounded-2xl shadow-2xl flex flex-col bg-base-100 border border-base-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-primary text-primary-content shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold text-sm">AI Secretary</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="btn btn-ghost btn-xs btn-circle"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) =>
              msg.role === "assistant" ? (
                <div key={msg.id} className="chat chat-start">
                  <div className="chat-bubble chat-bubble-accent text-sm leading-relaxed whitespace-pre-wrap">
                    {getMessageText(msg)}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="chat chat-end">
                  <div className="chat-bubble chat-bubble-primary text-sm leading-relaxed">
                    {getMessageText(msg)}
                  </div>
                </div>
              )
            )}
            {isLoading && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-accent">
                  <span className="loading loading-dots loading-sm" />
                </div>
              </div>
            )}
            {error && (
              <div className="alert alert-error text-xs">
                <span>⚠️ {error.message || "Failed to get response"}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-base-300 bg-base-200 shrink-0"
          >
            <input
              type="text"
              name="message"
              placeholder="Ask about Wyzer..."
              className="input input-bordered input-sm flex-1"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm btn-circle"
              disabled={isLoading}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
