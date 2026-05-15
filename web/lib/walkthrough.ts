import docsData from "./generated/docs.json";
import type { Step } from "./steps";

type RawDocsMap = Record<string, { prompt?: { raw: string } }>;

const docs = docsData as RawDocsMap;

export async function loadPromptText(step: Step): Promise<string | null> {
  return docs[step.key]?.prompt?.raw ?? null;
}
