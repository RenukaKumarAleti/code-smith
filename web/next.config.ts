import type { NextConfig } from "next";
import path from "node:path";

const repoRoot = path.join(process.cwd(), "..");

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: repoRoot,
  outputFileTracingExcludes: {
    "*": [
      "**/.pnpm-store/**/*",
      "**/node_modules/.cache/**/*",
      "**/node_modules/@shikijs/langs/dist/**/*.mjs.map",
      "**/node_modules/shiki/dist/**/*.map",
      "**/node_modules/@esbuild/**/*",
      "**/node_modules/@swc/core-*/**/*",
    ],
  },
  outputFileTracingIncludes: {
    "/playground/[id]/[step]": [
      "../prd-generator/**/*.md",
      "../product-initialisation/**/*.md",
      "../design-spec/**/*.md",
      "../feature-spec/**/*.md",
      "../agent-workflows/**/*.md",
      "../code-evaluator/**/*.md",
    ],
  },
};

export default config;
