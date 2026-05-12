"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API may be blocked; fall through quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-border-strong hover:text-fg"
      aria-live="polite"
    >
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
          copied ? "bg-fg" : "bg-subtle"
        }`}
      />
      {copied ? "Copied" : label}
    </button>
  );
}
