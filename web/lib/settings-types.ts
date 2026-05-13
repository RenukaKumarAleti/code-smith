export type Settings = {
  apiKey: string;
  model: string;
};

export const DEFAULT_MODEL = "claude-sonnet-4-6";

export const SETTINGS_KEY = "codesmith:settings:v1";

export const AVAILABLE_MODELS = [
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6 (recommended)" },
  { id: "claude-opus-4-7", label: "Opus 4.7 (highest quality, slower)" },
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5 (fastest, cheapest)" },
];
