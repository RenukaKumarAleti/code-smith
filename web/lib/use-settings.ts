"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_MODEL, SETTINGS_KEY, type Settings } from "./settings-types";

function readSettings(): Settings {
  if (typeof window === "undefined") return { apiKey: "", model: DEFAULT_MODEL };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { apiKey: "", model: DEFAULT_MODEL };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      apiKey: parsed.apiKey || "",
      model: parsed.model || DEFAULT_MODEL,
    };
  } catch {
    return { apiKey: "", model: DEFAULT_MODEL };
  }
}

function writeSettings(s: Settings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("codesmith:settings-changed"));
  } catch {
    // quota — silent
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    model: DEFAULT_MODEL,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
    setHydrated(true);

    const sync = () => setSettings(readSettings());
    window.addEventListener("storage", sync);
    window.addEventListener("codesmith:settings-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("codesmith:settings-changed", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeSettings(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSettings({ apiKey: "", model: DEFAULT_MODEL });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(SETTINGS_KEY);
        window.dispatchEvent(new CustomEvent("codesmith:settings-changed"));
      } catch {
        // ignore
      }
    }
  }, []);

  return { settings, hydrated, update, clear };
}

export function hasApiKey(s: Settings) {
  return Boolean(s.apiKey && s.apiKey.length > 10);
}
