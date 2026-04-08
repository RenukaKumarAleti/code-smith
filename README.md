# 🔨 CODE-SMITH

### Turn any idea into production-ready software — with AI doing the heavy lifting at every step.

CODE-SMITH is a collection of four AI prompts that work together as a complete system.
You start with a rough idea. You end with clean, production-grade code.

Each prompt handles one stage of building software. Use them in order, pass the output
of one into the next, and your AI assistant becomes a full development team.

**No coding experience needed to use the prompts.**
**Works with Claude, ChatGPT, Gemini, Cursor, Windsurf — any AI assistant.**

---

## What's Inside

```
CODE-SMITH/
│
├── prd-generator/          ← STEP 1: Turn your idea into a detailed plan
│   ├── prd-generator-pr... │  The prompt itself (copy this into your AI)
│   ├── example.md          │  See a real example of what it produces
│   └── how-to-use.md       │  Step-by-step usage guide
│
├── product-initialisation/ ← STEP 2: Turn your plan into a technical blueprint
│   ├── master-prompt-...   │  The prompt itself
│   └── example.md          │  See a real example of what it produces
│
├── agent-workflows/        ← STEP 3: Manage every coding session
│   ├── work-flows-gen...   │  The prompt itself
│   └── how-to-use.md       │  Step-by-step usage guide
│
├── code-evaluator/         ← STEP 4: Check your code before you ship
│   ├── prodution-quality.. │  The prompt itself
│   └── example.md          │  See a real example of what it produces
│
└── README.md               ← You are here
```

---

## The Big Picture — How It All Connects

Think of building software like building a house.

You wouldn't start laying bricks without a blueprint. And you wouldn't hand the
blueprint to builders without a site manager keeping things on track.
CODE-SMITH gives you all four stages — in the right order.

```
YOUR IDEA  ──────────────────────────────────────────►  SHIPPED PRODUCT
    │                                                          ▲
    │                                                          │
    ▼                                                          │
┌─────────────────┐                                           │
│  STEP 1         │  "I want to build a scheduling app        │
│  PRD Generator  │   for restaurants"                        │
│                 │         ↓                                  │
│  prd-generator/ │  Turns your rough idea into a             │
│                 │  complete 16-section product document      │
│                 │  with features, user flows, rules,         │
│                 │  and requirements. No gaps.               │
└────────┬────────┘                                           │
         │ Outputs: PRD.md                                    │
         ▼                                                    │
┌─────────────────┐                                           │
│  STEP 2         │  Takes your product document and          │
│  Architect      │  designs the technical structure —         │
│                 │  what tech to use, how files are          │
│  product-       │  organised, how the database looks,        │
│  initialisation/│  how everything connects.                 │
│                 │                                           │
│                 │  Also creates your SSOT — a single        │
│                 │  reference sheet that locks your          │
│                 │  tech choices for the whole project.      │
└────────┬────────┘                                           │
         │ Outputs: ARCHITECTURE.md (with SSOT)              │
         ▼                                                    │
┌─────────────────┐                                           │
│  STEP 3         │  You use this every single coding day.    │
│  Agent          │  Paste it at the start of every session   │
│  Workflows      │  and your AI becomes:                     │
│                 │   • A project manager tracking deadlines  │
│  agent-         │   • An architect catching bad decisions   │
│  workflows/     │   • A developer planning your tasks       │
│                 │   • A QA engineer checking test coverage  │
│                 │   • A code enforcer reviewing every line  │
│                 │                                           │
│                 │  Keeps two files updated as your memory:  │
│                 │  PROGRESS.md + CHANGELOG.md               │
└────────┬────────┘                                           │
         │ Outputs: CHANGELOG.md, PROGRESS.md                │
         ▼                                                    │
┌─────────────────┐                                           │
│  STEP 4         │  Before you launch (or at any checkpoint) │
│  Code Evaluator │  this scores your code against your       │
│                 │  original plan. It finds security holes,  │
│  code-          │  missing features, and quality problems   │
│  evaluator/     │  — and tells you exactly what to fix.     │
│                 │                                           │
│                 │  Gives your project a grade: A to F.      │
└─────────────────┘                                           │
         │ Outputs: Audit Report with scores + fix list       │
         └──────────────────────────────────────────────────►┘
```

---

## Step 1 — PRD Generator

📁 `prd-generator/`

### What it does

PRD stands for Product Requirements Document. It is the written plan for your product —
what it does, who uses it, what the rules are, how it handles edge cases.

Most people skip this step and jump straight to building. That is why most software
projects run over time and over budget — the plan was never clear to begin with.

This prompt asks you questions in small batches (3–4 at a time) across 7 areas:

1. Who has the problem and what is the problem
2. What the core features are
3. How users move through the product
4. What other tools it connects to
5. The business context (pricing, competitors)
6. Compliance and security needs
7. Timeline and scale

It will not write your plan until all the gaps are filled. When it is done,
you have a 16-section document that covers everything.

### How to use it

1. Open `prd-generator/prd-generator-pr...` and copy the full contents
2. Paste it into your AI assistant
3. After the prompt, type your idea — one sentence is fine:
   > *"I want to build an app where restaurant managers can post shifts and employees can pick them up"*
4. Answer the questions as they come — in batches of 3–4
5. When all questions are answered, the AI writes your PRD
6. Save the output as `PRD.md` in your project folder

**Not sure what to expect?** Read `prd-generator/example.md` first — it shows the
complete conversation from rough idea to finished PRD for a real project.

---

## Step 2 — Product Initialisation (Architect)

📁 `product-initialisation/`

### What it does

Once you have your PRD, this prompt reads it and designs how the software is built —
not what it does (that is the PRD's job) but how it is structured underneath.

It produces a blueprint that covers:

- What tech stack to use (and which versions)
- How to organise your folders and files
- What the database looks like (all the tables and relationships)
- How the frontend and backend talk to each other
- How security is handled
- How to test the code
- How to deploy it

Most importantly, it creates the **Single Source of Truth (SSOT)** — a reference
sheet that locks all your decisions in one place. Every time your AI generates code
for this project, it reads the SSOT first so every file is consistent with every other.

Think of it as: the PRD says *what* to build. The blueprint says *how* to build it.

### How to use it

1. Open `product-initialisation/master-prompt-...` and copy the full contents
2. Paste it into your AI assistant, followed by your `PRD.md`
3. Answer the technical questions it asks (in batches of 3–4)
4. When ready, tell it: **"Phase 0 is complete. Generate the blueprint."**
5. Save the output as `ARCHITECTURE.md` in your project folder

**The SSOT section of `ARCHITECTURE.md` is the most important output.**
You will paste this into every coding session from now on.

**See a real example** in `product-initialisation/example.md`.

---

## Step 3 — Agent Workflows

📁 `agent-workflows/`

### What it does

This is the prompt you use every day while building. You paste it at the start of
every coding session. It turns your AI assistant into a full team of specialists
that work alongside you.

**The five permanent team members:**

| Role | What they do |
|---|---|
| 🗂️ Project Manager | Tracks your deadlines, checks if you are on pace, tells you what needs attention today |
| 🏛️ Architect | Makes sure code decisions match your blueprint, catches architectural drift |
| 💻 Developer | Plans which tasks to tackle, maps what is blocked by what |
| 🧪 QA Engineer | Tracks test coverage, flags bugs, escalates issues open too long |
| 🛡️ Code Enforcer | Reviews every line of code written — automatically, every session |

**Plus three always-on support agents:**

| Role | What they do |
|---|---|
| 🔧 Tech Debt | Tracks quality trend across sessions — are things getting better or worse? |
| 🔐 Security | Flags new dependencies, unprotected endpoints, exposed personal data |
| 📝 Documentation | Catches undocumented functions, missing env variable definitions |

**The Code Enforcer** is the most important one. Every time any code appears in
your session — code you wrote, code you pasted, code the AI wrote — the Enforcer
reviews it automatically. It has two levels:

- 🔴 **Must fix before shipping** — security holes, wrong patterns, type errors
- 🔵 **Should consider** — code that works but could be cleaner

### Session Modes — Save tokens, stay focused

You do not need everything every session. Declare a mode at the start:

| Mode | Use it when | What loads |
|---|---|---|
| **FULL** | Starting a sprint, planning the week | Everything — all agents, full files |
| **TASK** | Daily coding on a specific task | SSOT + today's tasks only |
| **REVIEW** | Reviewing code before a milestone | SSOT + files to review |
| **HOTFIX** | Fixing a specific bug | SSOT + the bug description |

Most of your sessions will be **TASK MODE**. It is lean and fast.

### The two memory files

The system keeps two files that carry your project's memory across sessions:

- **PROGRESS.md** — the current state (features, tasks, bugs, blockers, deadlines)
- **CHANGELOG.md** — the full history (every decision, every fix, every change)

At the end of every session, the AI writes updated versions of both files.
You copy them back into your project folder. Next session, you paste them in again.
That is how the AI remembers everything between sessions.

### How to use it — daily workflow

**Session start:**
1. Copy the prompt from `agent-workflows/work-flows-gen...`
2. Paste it into your AI assistant
3. Declare your mode: `MODE: TASK`
4. Paste the SSOT section from your `ARCHITECTURE.md`
5. Paste the active section of your `PROGRESS.md`
6. Tell it what you want to work on today

**During the session:**
- Write or review code — the Enforcer runs automatically
- Use commands like `mark complete: T-014` or `add bug: login failing on mobile | severity: high`
- Ask for any agent on demand: `run pm` or `drift check`

**Session end:**
1. Type `session summary`
2. Copy the updated `CHANGELOG.md` and `PROGRESS.md` the AI outputs
3. Paste them back into your repo
4. Commit everything

**Full usage guide with real examples:** `agent-workflows/how-to-use.md`

---

## Step 4 — Code Evaluator

📁 `code-evaluator/`

### What it does

Use this before any major release or milestone. It reads your code alongside your
original PRD and gives you an honest report card.

It checks seven things:

| Check | What it looks for |
|---|---|
| PRD Compliance | Did you build everything you said you would? |
| Feature Quality | Are edge cases handled or just the happy path? |
| Code Quality | Is the code clean, consistent, and maintainable? |
| Security | Are there vulnerabilities? (OWASP Top 10) |
| Loose Ends | TODOs in production? Unhandled errors? Race conditions? |
| Improvements | What to fix now vs. what can wait |
| Production Readiness | Overall grade: A to F |

It gives you a score out of 100 and a letter grade. More importantly, it gives you
a prioritised list of exactly what to fix before you go live.

### How to use it

1. Copy the prompt from `code-evaluator/prodution-quality-and...`
2. Paste it into your AI assistant, followed by your `PRD.md` and your code
3. Answer the clarifying questions it asks
4. Receive the full audit report with scores and fix list

**See a real example** in `code-evaluator/example.md` — including a project that
scored 51/100 with two critical security vulnerabilities found.

---

## Quick Reference — The Four Commands You Need Most

Once you are running Step 3 daily, these are the commands you will use the most:

```
mark complete: [task ID]
→ Tells the system a task is done. Updates your progress automatically.

add bug: [description] | severity: critical / high / medium / low
→ Logs a bug. The QA agent tracks it and escalates if it sits open too long.

log decision: [what you decided and why]
→ Records an architectural decision permanently. Never gets deleted. Searchable later.

session summary
→ Closes the session. AI outputs updated PROGRESS.md and CHANGELOG.md to copy back.
```

---

## The Golden Rule

> **Working code is not enough.**
>
> Code that passes tests but is messy, insecure, or inconsistent is still a problem.
> It just hasn't caused pain yet.
>
> CODE-SMITH enforces production quality at every step — not as an option,
> but as the default. Every line reviewed. Every decision logged. Every session closed.

---

## FAQ

**Do I need to be a developer to use this?**
You need to understand the product you are building. A developer (or AI) does the
actual coding. The prompts are designed so that even a non-technical founder can
run the PRD Generator and Architect steps to produce documents a developer can use.

**Which AI assistant should I use?**
Any of them. Claude, ChatGPT, Gemini, Cursor, Windsurf — these prompts work with
all of them. Claude Sonnet is recommended for the best balance of quality and cost.

**Do I use all four prompts on every project?**
Yes, in order. Steps 1 and 2 are done once at the start. Step 3 is used every
coding session. Step 4 is used at milestones and before launch.

**What if I already have a PRD or blueprint?**
Skip to the step you need. Step 3 works as long as you have an `ARCHITECTURE.md`
with a SSOT section. If you do not have one, run Step 2 first — it only takes one session.

**How long does each step take?**
- Step 1 (PRD Generator): 20–40 minutes of Q&A, then the AI writes it
- Step 2 (Architect): 15–30 minutes of Q&A, then the AI writes the blueprint
- Step 3 (Agent Workflows): 5 minutes to open a session, runs alongside your work
- Step 4 (Code Evaluator): 15–30 minutes per audit

**What are PROGRESS.md and CHANGELOG.md?**
They are the two files that give the AI memory between sessions. The AI cannot
remember your last conversation — these files replace that memory. Always save
and commit them at the end of every session.

---

## Repo Folder Guide

| Folder | Contains | When you need it |
|---|---|---|
| `prd-generator/` | The PRD prompt + example + guide | At the start of a project |
| `product-initialisation/` | The Architect prompt + example | After you have a PRD |
| `agent-workflows/` | The Workflow prompt + usage guide | Every coding session |
| `code-evaluator/` | The Audit prompt + example | Before launch / at milestones |

Every folder has at least one `example.md` so you can see what the output looks like
before using the prompt yourself. Read the example first — it makes the prompt much
easier to use.

---

## Start Here

If this is your first time using CODE-SMITH:

1. **Read** `prd-generator/example.md` — see what a finished product plan looks like
2. **Read** `product-initialisation/example.md` — see what a technical blueprint looks like
3. **Read** `agent-workflows/how-to-use.md` — understand the daily workflow
4. **Open** `prd-generator/prd-generator-pr...` and paste it into your AI with your idea
5. **Follow the steps** in order from there

The whole system is designed so each step feeds naturally into the next.
You will know exactly what to do at each stage.

---

*Built to make production-grade software development accessible — for solo founders,
small teams, and anyone who wants to build the right way from day one.*