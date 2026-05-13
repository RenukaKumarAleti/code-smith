"use client";

import { useEffect, useState } from "react";
import { AVAILABLE_MODELS } from "@/lib/settings-types";
import { hasApiKey, useSettings } from "@/lib/use-settings";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: Props) {
  const { settings, update, clear, hydrated } = useSettings();
  const [draftKey, setDraftKey] = useState("");
  const [draftModel, setDraftModel] = useState(settings.model);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraftKey(settings.apiKey);
    setDraftModel(settings.model);
    setRevealed(false);
  }, [open, settings.apiKey, settings.model]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function save() {
    update({ apiKey: draftKey.trim(), model: draftModel });
    onClose();
  }

  function maskKey(k: string) {
    if (!k) return "";
    if (k.length < 12) return k;
    return `${k.slice(0, 7)}…${k.slice(-4)}`;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-bg p-6 shadow-[0_40px_120px_-32px_rgba(10,10,10,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-subtle">
            Settings
          </p>
          <h2
            id="settings-modal-title"
            className="mt-2 font-display text-2xl tracking-tight"
          >
            Anthropic API key
          </h2>
          <p className="mt-2 text-sm text-muted">
            Used to run AI mode for Steps 1, 2, and 2.5. The key is stored only in this
            browser&apos;s <span className="font-mono">localStorage</span> and sent on
            each request through our edge proxy — we never log it.
          </p>
        </header>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="apiKey"
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-subtle"
            >
              Key
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="apiKey"
                type={revealed ? "text" : "password"}
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                placeholder="sk-ant-..."
                spellCheck={false}
                autoComplete="off"
                className="block w-full rounded-md border border-border bg-bg px-4 py-3 font-mono text-sm text-fg outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-fg/10"
              />
              <button
                type="button"
                onClick={() => setRevealed((r) => !r)}
                className="shrink-0 rounded-md border border-border px-3 font-mono text-xs uppercase tracking-wider text-muted hover:border-border-strong hover:text-fg"
              >
                {revealed ? "Hide" : "Show"}
              </button>
            </div>
            {hydrated && hasApiKey(settings) && draftKey === settings.apiKey ? (
              <p className="mt-2 font-mono text-xs text-subtle">
                Current: {maskKey(settings.apiKey)}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-subtle">
              Get one at{" "}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-border-strong underline-offset-4 hover:text-fg"
              >
                console.anthropic.com/settings/keys
              </a>
              . Your key &amp; the token usage are billed to your Anthropic account.
            </p>
          </div>

          <div>
            <label
              htmlFor="model"
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-subtle"
            >
              Default model
            </label>
            <select
              id="model"
              value={draftModel}
              onChange={(e) => setDraftModel(e.target.value)}
              className="mt-2 block w-full rounded-md border border-border bg-bg px-3 py-3 text-sm text-fg outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-fg/10"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <footer className="mt-7 flex items-center justify-between border-t border-border pt-5">
          <button
            type="button"
            onClick={() => {
              if (
                confirm("Clear the saved API key from this browser?") &&
                hydrated
              ) {
                clear();
                setDraftKey("");
              }
            }}
            disabled={!hasApiKey(settings)}
            className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear saved key
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted hover:border-border-strong hover:text-fg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-md bg-fg px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              Save
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
