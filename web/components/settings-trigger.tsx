"use client";

import { useState } from "react";
import { hasApiKey, useSettings } from "@/lib/use-settings";
import { SettingsModal } from "./settings-modal";

export function SettingsTrigger({
  variant = "header",
}: {
  variant?: "header" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const { settings, hydrated } = useSettings();
  const hasKey = hydrated && hasApiKey(settings);

  if (variant === "inline") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-dashed border-border-strong px-4 py-2.5 text-sm text-muted transition-colors hover:border-fg hover:text-fg"
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${hasKey ? "bg-fg" : "bg-subtle"}`}
          />
          {hasKey ? "API key saved" : "Add Anthropic API key to enable AI"}
        </button>
        <SettingsModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open settings"
        className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${hasKey ? "bg-fg" : "bg-subtle"}`}
        />
        Settings
      </button>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
