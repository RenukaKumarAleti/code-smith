import { readFile } from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { Step } from "./steps";

const REPO_ROOT = path.resolve(process.cwd(), "..");

export type DocFile = "prompt" | "howToUse" | "example";

export type RenderedDoc = {
  html: string;
  raw: string;
  headings: { id: string; text: string; depth: number }[];
};

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  defaultLang: "plaintext",
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypePrettyCode, prettyCodeOptions)
  .use(rehypeStringify);

export async function loadDoc(step: Step, file: DocFile): Promise<RenderedDoc | null> {
  const fileName = step.files[file];
  if (!fileName) return null;

  const fullPath = path.join(REPO_ROOT, step.folder, fileName);

  let raw: string;
  try {
    raw = await readFile(fullPath, "utf8");
  } catch {
    return null;
  }

  const tree = processor.parse(raw);
  const transformed = await processor.run(tree);
  const html = String(processor.stringify(transformed));
  const headings = extractHeadings(raw);

  return { html, raw, headings };
}

function extractHeadings(md: string) {
  const lines = md.split("\n");
  const out: { id: string; text: string; depth: number }[] = [];
  let inCodeBlock = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const match = /^(#{1,4})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const depth = match[1].length;
    const text = match[2].replace(/`/g, "").trim();
    const id = slugify(text);
    out.push({ id, text, depth });
  }
  return out;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
