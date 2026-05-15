import docsData from "./generated/docs.json";
import type { Step } from "./steps";

export type DocFile = "prompt" | "howToUse" | "example";

export type RenderedDoc = {
  html: string;
  raw: string;
  headings: { id: string; text: string; depth: number }[];
};

type DocsMap = Record<string, Partial<Record<DocFile, RenderedDoc>>>;

const docs = docsData as DocsMap;

export async function loadDoc(step: Step, file: DocFile): Promise<RenderedDoc | null> {
  return docs[step.key]?.[file] ?? null;
}
