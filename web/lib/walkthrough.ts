import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Step, StepKey } from "./steps";

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

/**
 * Describes which prior-step outputs should be appended to the prompt
 * as context when running this step in the walkthrough.
 */
export const STEP_DEPENDENCIES: Record<StepKey, StepKey[]> = {
  "prd-generator": [],
  architect: ["prd-generator"],
  "design-spec": ["prd-generator", "architect"],
  "feature-spec": ["prd-generator", "architect"],
  "agent-workflows": ["architect"],
  "code-evaluator": ["prd-generator", "architect", "feature-spec"],
};

export const STEP_OUTPUT_LABEL: Record<StepKey, string> = {
  "prd-generator": "PRD",
  architect: "ARCHITECTURE",
  "design-spec": "DESIGN-SPEC",
  "feature-spec": "FEATURE-SPEC",
  "agent-workflows": "SESSION (PROGRESS + CHANGELOG)",
  "code-evaluator": "AUDIT REPORT",
};
