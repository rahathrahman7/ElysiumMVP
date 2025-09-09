"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Msg = { role: "user" | "assistant"; content: string };

export default function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm your Elysium concierge. Ask me about diamonds, metals, or certifications." },
  ]);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Basic focus trap
  useEffect(() => {
    if (!open) return;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && active === last) { first.focus(); e.preventDefault(); }
    };
    window.addEventListener("keydown", trap);
    return () => window.removeEventListener("keydown", trap);
  }, [open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    // Placeholder assistant reply (no AI yet)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Thanks! A specialist will respond shortly. In the meantime, would you like guidance on diamond colour (D–F), clarity (VS1+), or metal (18k gold & platinum)?",
        },
      ]);
    }, 400);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Elysium concierge"
        className="fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-[var(--gold)] bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:bg-white transition"
      >
        <span className="sr-only">Open chat</span>
        {/* minimal speech bubble icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-600">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Elysium concierge chat"
        aria-modal="true"
        className={[
          "fixed z-50 flex flex-col rounded-3xl border border-neutral-200 bg-white/85 backdrop-blur-md",
          "shadow-[0_20px_60px_rgba(0,0,0,0.20)] transition-all duration-200",
          open
            ? "opacity-100 scale-100"
            : "pointer-events-none opacity-0 scale-95",
          // position
          "bottom-20 right-4 w-[min(92vw,420px)] h-[min(70vh,640px)] md:bottom-6 md:right-6",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 rounded-t-3xl border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full border border-[var(--gold)] bg-[var(--ivory)]">
              <Image src="/brand/elysium-mark.svg" alt="" width={16} height={16} />
            </div>
            <div>
              <div className="font-serif text-[15px] text-neutral-900">Elysium Concierge</div>
              <div className="text-[11px] text-neutral-500">Typically replies within minutes</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-50"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth custom-scroll">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={[
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 shadow",
                  m.role === "user"
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-[var(--ivory)] text-neutral-900 border border-neutral-200 rounded-bl-sm",
                ].join(" ")}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          className="border-t border-neutral-200 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about diamonds, metals, certification…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              aria-label="Message Elysium concierge"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full border border-[var(--gold)] bg-white px-3 py-1.5 text-xs hover:bg-[color-mix(in_srgb,var(--gold)_10%,#fff)]"
            >
              Send
            </button>
          </div>
          <div className="mt-1 text-[10px] text-neutral-500">
            Powered by Elysium. We recommend D–F colour, VS1+ clarity, 18k gold & platinum, GIA/IGI certification.
          </div>
        </form>
      </div>
    </>
  );
}
