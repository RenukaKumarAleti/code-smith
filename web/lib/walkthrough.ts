import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Step } from "./steps";

const REPO_ROOT = path.resolve(process.cwd(), "..");

export async function loadPromptText(step: Step): Promise<string | null> {
  if (!step.files.prompt) return null;
  const fullPath = path.join(REPO_ROOT, step.folder, step.files.prompt);
  try {
    return await readFile(fullPath, "utf8");
  } catch {
    return null;
  }
}
