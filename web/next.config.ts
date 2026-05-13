import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  outputFileTracingExcludes: {
    "*": [
      ".pnpm-store/**/*",
      "../.pnpm-store/**/*",
      "node_modules/.cache/**/*",
      "node_modules/@shikijs/langs/dist/**/*.mjs.map",
      "node_modules/shiki/dist/**/*.map",
      "node_modules/@esbuild/**/*",
      "node_modules/@swc/core-*/**/*",
    ],
  },
};

export default config;
