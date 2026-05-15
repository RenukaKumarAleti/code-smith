import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { STEPS, type Step } from "../lib/steps";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const OUT_DIR = path.join(process.cwd(), "lib", "generated");
const OUT_FILE = path.join(OUT_DIR, "docs.json");

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

type Heading = { id: string; text: string; depth: number };
type RenderedDoc = { html: string; raw: string; headings: Heading[] };
type DocFileKey = "prompt" | "howToUse" | "example";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractHeadings(md: string): Heading[] {
  const lines = md.split("\n");
  const out: Heading[] = [];
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
    out.push({ id: slugify(text), text, depth });
  }
  return out;
}

async function render(step: Step, key: DocFileKey): Promise<RenderedDoc | null> {
  const fileName = step.files[key];
  if (!fileName) return null;
  const fullPath = path.join(REPO_ROOT, step.folder, fileName);
  let raw: string;
  try {
    raw = await readFile(fullPath, "utf8");
  } catch (err) {
    console.warn(`[build-docs] missing: ${fullPath}`);
    return null;
  }
  const tree = processor.parse(raw);
  const transformed = await processor.run(tree);
  const html = String(processor.stringify(transformed));
  return { html, raw, headings: extractHeadings(raw) };
}

async function main() {
  const docs: Record<string, Partial<Record<DocFileKey, RenderedDoc>>> = {};
  const keys: DocFileKey[] = ["prompt", "howToUse", "example"];

  for (const step of STEPS) {
    const stepDocs: Partial<Record<DocFileKey, RenderedDoc>> = {};
    for (const key of keys) {
      const rendered = await render(step, key);
      if (rendered) stepDocs[key] = rendered;
    }
    docs[step.key] = stepDocs;
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(docs));
  const totalDocs = Object.values(docs).reduce((n, s) => n + Object.keys(s).length, 0);
  console.log(`[build-docs] wrote ${totalDocs} docs across ${Object.keys(docs).length} steps → ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
