# 🔨 CODE-SMITH

### Turn any idea into production-ready software — with AI doing the heavy lifting at every step.

CODE-SMITH is a collection of five AI prompts that work together as a complete system.
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
├── prd-generator/           ← STEP 1: Turn your idea into a detailed plan
│   ├── prd-generator-pr...  │  The prompt itself (copy this into your AI)
│   ├── example.md           │  See a real example of what it produces
│   └── how-to-use.md        │  Step-by-step usage guide
│
├── product-initialisation/  ← STEP 2: Turn your plan into a technical blueprint
│   ├── master-prompt-...    │  The prompt itself
│   ├── example.md           │  See a real example of what it produces
│   └── how-to-use.md        │  Step-by-step usage guide
│
├── feature-spec/            ← STEP 3: Write a precise contract for each feature
│   ├── feature-spec-pr...   │  The prompt itself
│   ├── example.md           │  See a real example of what it produces
│   └── how-to-use.md        │  Step-by-step usage guide
│
├── agent-workflows/         ← STEP 4: Manage every coding session
│   ├── work-flows-gen...    │  The prompt itself
│   ├── how-to-use.md        │  Step-by-step usage guide
│   └── example.md           │  See a real example of a full session
│
├── code-evaluator/          ← STEP 5: Check your code before you ship
│   ├── prodution-quality... │  The prompt itself
│   └── example.md           │  See a real example of what it produces
│
└── README.md                ← You are here
```

---

## The Big Picture — How It All Connects

Think of building software like building a house.

You start with an idea. Then you write the plan. Then you draw the blueprint.
Then you spec out each room in detail. Then you build, day by day.
Before you hand over the keys, you do a final inspection.

CODE-SMITH gives you a prompt for every one of those stages — in the right order.

```
YOUR IDEA
    │
    ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1 — PRD GENERATOR                                          │
│  prd-generator/                                                  │
│                                                                  │
│  You type one sentence. The prompt asks you questions in small   │
│  batches until it understands your product completely. Then it   │
│  writes a full 16-section product plan — features, users, rules, │
│  edge cases, business model, compliance, timeline. Everything.   │
│                                                                  │
│  Output: PRD.md                                                  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ PRD.md
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 2 — ARCHITECT (Product Initialisation)                     │
│  product-initialisation/                                         │
│                                                                  │
│  Takes your product plan and designs the technical structure.    │
│  What tech to use. How the files are organised. What the         │
│  database looks like. How everything connects. How to keep       │
│  it secure. How to test and deploy it.                           │
│                                                                  │
│  Also creates your SSOT — a single locked reference that every  │
│  coding session reads first so all code stays consistent.        │
│                                                                  │
│  Output: ARCHITECTURE.md (with SSOT)                            │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ PRD.md + ARCHITECTURE.md
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 3 — FEATURE SPEC                                           │
│  feature-spec/                                                   │
│                                                                  │
│  Before building a complex feature, this prompt writes the       │
│  exact contract for it. Every API endpoint and its shape.        │
│  Every state the data can be in. Every edge case and what        │
│  should happen. Pre-written test descriptions. A binary          │
│  checklist of what counts as done.                               │
│                                                                  │
│  Run once per feature — not once per project. Skip for simple   │
│  features. Essential for anything complex.                       │
│                                                                  │
│  Output: specs/FEATURE-SPEC-[F-ID]-[name].md                    │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ ARCHITECTURE.md + Feature Spec
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 4 — AGENT WORKFLOWS                                        │
│  agent-workflows/                                                │
│                                                                  │
│  The prompt you use every single coding day. Paste it at the    │
│  start of every session. Your AI becomes a full team:            │
│                                                                  │
│    🗂️  Project Manager  — tracks deadlines and pace              │
│    🏛️  Architect        — guards your technical decisions         │
│    💻  Developer        — plans tasks and maps dependencies      │
│    🧪  QA Engineer      — tracks test coverage and bugs          │
│    🛡️  Code Enforcer    — reviews every line of code written     │
│    🔧  Tech Debt        — watches quality trend across sessions  │
│    🔐  Security         — flags vulnerabilities as they appear   │
│    📝  Documentation    — catches undocumented code              │
│                                                                  │
│  Keeps two files updated as your project memory:                 │
│  PROGRESS.md (current state) + CHANGELOG.md (full history)      │
│                                                                  │
│  Output: CHANGELOG.md + PROGRESS.md (updated every session)     │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ Code + Feature Spec + CHANGELOG
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 5 — CODE EVALUATOR                                         │
│  code-evaluator/                                                 │
│                                                                  │
│  Before any launch or milestone, this reads your code and        │
│  scores it against your original plan and Feature Specs.         │
│  Finds security holes, missing features, quality problems,       │
│  and loose ends — then gives you a prioritised fix list.         │
│                                                                  │
│  Grades your project A to F. Scores out of 100.                  │
│                                                                  │
│  Output: Audit Report with scores + fix list                     │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
                    PRODUCTION-GRADE SHIPPED CODE
```

---

## What Lives in Your Project Folder

As you move through the steps, your project folder builds up like this:

```
your-project/
│
├── PRD.md                               ← from Step 1
├── ARCHITECTURE.md                      ← from Step 2 (contains SSOT)
├── PROGRESS.md                          ← from Step 4 (updated every session)
├── CHANGELOG.md                         ← from Step 4 (updated every session)
│
├── specs/                               ← from Step 3 (one file per feature)
│   ├── FEATURE-SPEC-F-005-shift-swaps.md
│   ├── FEATURE-SPEC-F-006-time-off.md
│   └── FEATURE-SPEC-F-007-notifications.md
│
└── src/                                 ← your actual code
```

These files are your project's memory. They stay in your repo.
They get updated as your project grows.

---

## How the Three Core Documents Connect

Once Steps 1 through 3 are done, three documents drive everything that follows:

| Document | Created in | Read by | What it does |
|---|---|---|---|
| `ARCHITECTURE.md` (SSOT) | Step 2 | Steps 3, 4, 5 | Locks conventions — every file checked against it |
| `FEATURE-SPEC-[F-ID].md` | Step 3 | Steps 4, 5 | The contract each feature is built and scored against |
| `PROGRESS.md` + `CHANGELOG.md` | Step 4 | Step 4 ongoing | The memory that carries state between sessions |

The SSOT and Feature Spec are what the Code Enforcer in Step 4 checks code against.
The Feature Spec acceptance criteria are what the Code Evaluator in Step 5 scores against.
Everything is connected. Nothing is standalone.

---

## Step-by-Step Guide

### Step 1 — PRD Generator
📁 `prd-generator/`

**What it does**

PRD stands for Product Requirements Document — the written plan for your product.
Most people skip this and start building. That is why most projects run over time.

This prompt asks you questions in batches across 7 areas: the problem and users,
the features, user flows, integrations, business context, compliance, and timeline.
It will not write the plan until every gap is filled.
When done you have a 16-section document covering everything a developer needs.

**How to use it**

1. Copy `prd-generator/prd-generator-pr...` and paste into your AI
2. Type your idea — one sentence is enough:
   > *"I want to build an app where restaurant managers post shifts and staff pick them up"*
3. Answer the questions 3–4 at a time
4. Save the output as `PRD.md`

**See a real example first:** `prd-generator/example.md`

---

### Step 2 — Architect
📁 `product-initialisation/`

**What it does**

Reads your PRD and designs the technical structure — not what to build but how.
Covers tech stack, folder layout, database design, security, testing, and deployment.

Creates the **SSOT** — a locked reference sheet every coding session reads first.
This keeps all code consistent across the whole project — same naming, same patterns,
same conventions, no matter when a file was written or who wrote it.

**How to use it**

1. Copy `product-initialisation/master-prompt-...` and paste into your AI
2. Paste your `PRD.md` straight after
3. Answer the technical questions in batches
4. Type: **"Phase 0 is complete. Generate the blueprint."**
5. Save the output as `ARCHITECTURE.md`

The SSOT section of `ARCHITECTURE.md` is pasted into every session from here on.

**See a real example:** `product-initialisation/example.md`

---

### Step 3 — Feature Spec
📁 `feature-spec/`

**What it does**

When you tell an AI to "build the shift swap feature," it fills gaps with assumptions.
For complex features those assumptions become bugs.

This prompt writes a precise contract for each feature before coding starts:

- Every API endpoint and the exact shape of its data
- Every state the data can be in and what triggers each change
- Every edge case and exactly what should happen
- Pre-written test descriptions a developer can implement directly
- A binary pass/fail checklist of what counts as done

Coding sessions load this spec as their reference. The Code Enforcer checks
code against it. The Code Evaluator scores the feature against it.

**You do not use this for every feature.** Only when a feature is complex.
The how-to-use guide has a 30-second decision checklist.

**How to use it**

1. Copy `feature-spec/feature-spec-pr...` and paste into your AI
2. Paste your `PRD.md` and the SSOT section from `ARCHITECTURE.md`
3. Name the feature: *"Feature to spec: F-005 — Shift Swap Requests"*
4. Answer the question batches
5. Type: **"Phase 0 complete. Generate the spec."**
6. Save to `specs/FEATURE-SPEC-[F-ID]-[name].md`

**See a real example:** `feature-spec/example.md` — a full spec with 7 states,
16 edge cases, and 15 acceptance criteria.

---

### Step 4 — Agent Workflows
📁 `agent-workflows/`

**What it does**

The prompt you use every single coding day. Paste it at the start of every session.

Your AI becomes a full team. Eight specialists running simultaneously:

| Role | What they do |
|---|---|
| 🗂️ Project Manager | Tracks deadlines, calculates pace, flags what needs attention |
| 🏛️ Architect | Catches code that drifts from your blueprint |
| 💻 Developer | Plans tasks, maps what is blocked by what |
| 🧪 QA Engineer | Tracks test coverage, escalates old open bugs |
| 🛡️ Code Enforcer | Reviews every line of code automatically |
| 🔧 Tech Debt | Tracks whether code quality is improving or declining |
| 🔐 Security | Flags vulnerabilities as they appear |
| 📝 Documentation | Catches undocumented functions and missing config |

**Session modes** — choose one to control cost and focus:

| Mode | Use when | What loads |
|---|---|---|
| **FULL** | Sprint start, planning | Everything — all agents, full files |
| **TASK** | Daily coding (most common) | SSOT + today's tasks only |
| **REVIEW** | Code review before milestone | SSOT + files to review |
| **HOTFIX** | Fixing a specific bug | SSOT + bug description |

**The two memory files**

At session end the AI writes updated versions of two files. You copy them back
to your repo. Next session you paste them in. That is how memory works here.

- **PROGRESS.md** — the current state of the whole project
- **CHANGELOG.md** — the permanent record of every decision and change

**How to use it — daily**

Session start:
1. Declare mode: `MODE: TASK`
2. Paste SSOT from `ARCHITECTURE.md`
3. Paste active section of `PROGRESS.md`
4. Paste the relevant Feature Spec if building a complex feature
5. Say what you want to work on

Session end:
1. Type `session summary`
2. Copy the updated `CHANGELOG.md` and `PROGRESS.md`
3. Paste them into your repo and commit

**Full guide with real examples:** `agent-workflows/how-to-use.md`

---

### Step 5 — Code Evaluator
📁 `code-evaluator/`

**What it does**

Use before any release or at the end of each milestone. It reads your code
alongside your PRD and Feature Specs and gives you an honest report card.

Seven scored sections:

| Check | What it looks for |
|---|---|
| PRD Compliance | Did you build everything you planned? |
| Feature Quality | Are edge cases handled or just the easy path? |
| Code Quality | Is the code clean, consistent, maintainable? |
| Security | Any vulnerabilities? (industry-standard checks) |
| Loose Ends | TODOs in production? Unhandled errors? Race conditions? |
| Improvements | What to fix now versus what can wait |
| Production Readiness | Overall grade A to F — scored out of 100 |

When Feature Specs exist the Evaluator scores their acceptance criteria directly.
Each unchecked criterion becomes a finding in the report.

**How to use it**

1. Copy `code-evaluator/prodution-quality-and...` and paste into your AI
2. Paste your `PRD.md`, the relevant Feature Specs, and your code files
3. Answer the clarifying questions
4. Receive the full report with scores and a prioritised fix list

**See a real example:** `code-evaluator/example.md` — a project that scored
51 out of 100 with two critical security problems caught before going live.

---

## Quick Reference — Commands You Will Use Most

Once you are in Step 4 daily, these are the commands you will reach for most:

```
mark complete: [task ID]
→ Marks a task done. Updates PROGRESS.md automatically.

add bug: [description] | severity: critical / high / medium / low
→ Logs a bug. Tracked and escalated if it sits open too long.

log decision: [what you decided and why]
→ Records a permanent decision. Never deleted. Always findable later.

standards check: [paste any code]
→ Runs a full Code Enforcer review on any existing code, any time.

drift check
→ Scans recent code for deviations from your ARCHITECTURE.md conventions.

session summary
→ Closes the session. Outputs updated PROGRESS.md and CHANGELOG.md to copy back.
```

---

## The Golden Rule

> **Working code is not enough.**
>
> Code that passes tests but is messy, insecure, or inconsistent is still a problem.
> It just has not caused pain yet.
>
> CODE-SMITH enforces production quality at every step — through the Feature Spec
> contract in Step 3, the Code Enforcer in Step 4, and the final audit in Step 5.
> Every line reviewed. Every decision logged. Every session closed clean.

---

## FAQ

**Do I need to be a developer to use this?**
You need to understand the product you are building. A developer or AI does the
actual coding. Steps 1 and 2 are designed so a non-technical founder can produce
documents a developer can act on immediately.

**Which AI assistant should I use?**
Any of them. Claude, ChatGPT, Gemini, Cursor, Windsurf — these prompts work with
all of them. Claude Sonnet is recommended for the best balance of quality and cost.

**Do I use all five prompts on every project?**
Steps 1, 2, 4, and 5 are used on every project. Step 3 (Feature Spec) is run
per feature — only for features complex enough to need it. The how-to-use guide
includes a quick checklist to help you decide in 30 seconds.

**What if I already have a PRD or blueprint?**
Start at whichever step you need. Step 4 works as long as you have an
`ARCHITECTURE.md` with a SSOT section. Step 3 works as long as you have a PRD
and SSOT. You do not have to start from scratch.

**How long does each step take?**

| Step | Time |
|---|---|
| Step 1 — PRD Generator | 20–40 min of questions, then AI writes it |
| Step 2 — Architect | 15–30 min of questions, then AI writes it |
| Step 3 — Feature Spec | 15–25 min per feature |
| Step 4 — Agent Workflows | 5 min to open, runs alongside your work |
| Step 5 — Code Evaluator | 15–30 min per audit |

**What are PROGRESS.md and CHANGELOG.md?**
They replace the AI's memory between sessions. The AI cannot remember your last
conversation — these two files carry everything forward. Always save and commit
them at the end of every session. This is the one habit the whole system depends on.

**Do I need a Feature Spec for every feature?**
No. Only for features that are complex. The `feature-spec/how-to-use.md` guide
has a decision checklist that takes 30 seconds to run through.

---

## Start Here

If this is your first time using CODE-SMITH:

1. **Read** `prd-generator/example.md` — see what a finished product plan looks like
2. **Read** `product-initialisation/example.md` — see what a technical blueprint looks like
3. **Read** `feature-spec/example.md` — see what a feature contract looks like
4. **Read** `agent-workflows/how-to-use.md` — understand the daily workflow
5. **Open** `prd-generator/prd-generator-pr...` and paste it into your AI with your idea
6. **Follow the steps** in order from there

The whole system is designed so each step feeds naturally into the next.
The output of one step is the input for the next.
You will always know exactly what to do.

---

## Folder Guide

| Folder | Contains | When you need it |
|---|---|---|
| `prd-generator/` | PRD prompt + example + guide | Start of every project |
| `product-initialisation/` | Architect prompt + example + guide | After you have a PRD |
| `feature-spec/` | Feature Spec prompt + example + guide | Before building complex features |
| `agent-workflows/` | Workflow prompt + example + guide | Every coding session |
| `code-evaluator/` | Audit prompt + example | Before launch and at milestones |

Every folder has at least one `example.md` so you can see the output before
using the prompt yourself. Read the example first — it makes everything faster.

---

*Built to make production-grade software development accessible —
for solo founders, small teams, and anyone who wants to build the right way from day one.*