# CODE-SMITH — Web

The animated docs site for CODE-SMITH. Built with Next.js 15 (App Router), React 19, Tailwind v4. Reads the markdown files in the parent folders at build time — no content duplication.

## Develop

```bash
cd web
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Build

```bash
pnpm build
pnpm start
```

## Deploy

Auto-deploys to `codesmith.spotmies.ai` via Vercel on push to `main`. Set the Vercel project root to `web/`.

## Where things live

| Path | What it is |
|---|---|
| `app/page.tsx` | Marketing landing |
| `app/docs/page.tsx` | Docs index |
| `app/docs/[step]/page.tsx` | Per-step page (renders the parent folder's markdown) |
| `lib/steps.ts` | Canonical step metadata (name, slug, blurb, inputs/outputs) |
| `lib/docs.ts` | Reads and renders `../<step>/*.md` |
| `components/` | UI primitives |

## Brand

Monotone warm grayscale. Display = Instrument Serif, body = Inter, mono = JetBrains Mono. All tokens in `app/globals.css`.
