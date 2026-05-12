# HOW TO USE THIS PROMPT

The Design Spec is **optional**. It sits between Step 2 (Architect) and Step 3 (Feature Spec). Skip it for backend-heavy or internal tools. Use it when the product is user-facing and visually differentiated.

---

## 30-Second Decision: Do I Need a Design Spec?

Run a Design Spec if **any two** of these are true:

- [ ] The product is consumer-facing, prosumer, or design-led
- [ ] You do not have an existing component library / brand to honor
- [ ] You want a monotone or distinctive visual identity, not a default Tailwind look
- [ ] The PRD includes at least three user-facing screens with rich interaction (not just forms)
- [ ] Accessibility is a hard requirement (compliance, regulated industry, education, accessibility-first audience)
- [ ] You have Figma mockups and want a written contract that pins them to tokens

Skip it if **all** of these are true:

- [ ] It is an internal tool, admin panel, or back-office UI
- [ ] You will use an off-the-shelf component library and accept its defaults
- [ ] Speed of shipping outranks visual distinctiveness for v1

---

## Inputs You Need Ready

Before pasting the prompt:

1. **PRD.md** — from Step 1
2. **The SSOT section of ARCHITECTURE.md** — from Step 2
3. **Optional:** Figma file links, screenshots, or 3–5 reference URLs (sites/apps you want this to feel like)
4. **Optional:** existing logo, palette, or type choices you must honor

---

## Start a Session

1. Paste `design-spec-master-prompt.md` into your AI assistant — Claude, ChatGPT, Cursor, anything.
2. Immediately after, paste your `PRD.md` and the SSOT section from `ARCHITECTURE.md`.
3. If you have Figma links or screenshots, paste them now with a one-line note: *"These are exploratory mockups, not source of truth — use them as direction."* (Adjust the note to your reality.)
4. Wait for the Phase 0 questions. They come in batches of 3–4. Answer fully. Partial answers are fine; vague answers trigger follow-ups.
5. When the assistant has run out of questions, type:

   ```
   Phase 0 is complete. Generate the design spec.
   ```

6. Save the output as `design-spec/DESIGN-SPEC.md` in your project repo.
7. If a `tokens.json` sidecar was produced, save it next to the spec.

---

## What You Get Back

A single Markdown file with:

- **Design SSOT** — locked tokens (color, type, spacing, radii, shadows, motion, z-index, breakpoints)
- **Brand & voice direction** — written, not aspirational
- **Layout system** — grid, containers, density rules
- **Component inventory** — every atom/molecule/organism with variants, states, a11y
- **Wireframes** — one per major surface, in ASCII or Mermaid
- **Motion patterns** — entry/exit, reduced-motion contract, motion budget
- **State matrix** — what every interactive component does in every state
- **Accessibility spec** — WCAG 2.2 AA floor, AAA where opted in
- **Responsive spec** — per breakpoint, what happens
- **Acceptance criteria** — binary checklist (≥15 items) the Code Evaluator scores against

---

## How It Plugs Into the Rest of the System

| When | Reads the Design Spec | What it does with it |
|---|---|---|
| Step 3 — Feature Spec | Yes (UI features only) | Pulls component names + states into the feature contract |
| Step 4 — Agent Workflows | Yes — the SSOT section is loaded every UI session | Code Enforcer checks UI code against tokens, states, a11y rules |
| Step 5 — Code Evaluator | Yes | Scores the design acceptance criteria as part of the audit |

The Design SSOT (Section 0 of the spec) is the part you actually paste into every UI coding session. Treat it like the Architecture SSOT — a locked reference, not a draft.

---

## Figma & Reference Material

The prompt accepts Figma file links and screenshots in Phase 0, but it does not require them. Three common shapes:

| You have… | What the prompt does |
|---|---|
| No visual references | Generates the spec from the PRD + a few direction questions |
| Loose mockups or screenshots | Uses them as direction, generates a spec that matches the vibe but is implementation-ready |
| A complete Figma source of truth | Pins the spec to your Figma file, flags divergences, lists frame IDs for Step 4 sessions to pull |

If you want your Step 4 sessions to actively read Figma frames, install the Figma MCP server in your assistant and the spec's Phase 3 will list the frame IDs each session should fetch.

---

## When to Re-Run the Design Spec

- **Brand change** — major rebrand. Regenerate.
- **New surface area** — adding a new user-facing module (e.g., adding consumer mobile to a web product). Add to the existing spec, do not regenerate.
- **A11y requirement upgrade** — moving from AA to AAA on certain surfaces. Update Section 7 only.

Otherwise, the Design Spec is a one-time investment per project, just like the Architecture Blueprint.

---

## See Also

- [`anthropics/skills`](https://github.com/anthropics/skills) — official Anthropic skills (includes design)
- [`nexu-io/open-design`](https://github.com/nexu-io/open-design) — 57 design skills + 71 design systems
- [`anthropic.com/news/claude-design-anthropic-labs`](https://www.anthropic.com/news/claude-design-anthropic-labs) — Anthropic's Claude Design

Load one of these as a skill bundle in your assistant when you want a richer design vocabulary than what the prompt produces alone.
