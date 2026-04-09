# How to Use the Architect Master Prompt
## A Complete Guide with Real Examples

**Prompt:** Architect Master Prompt v2.0
**Project used in examples:** ShiftSync (B2B workforce scheduling SaaS)
**Read time:** ~12 minutes

---

## What This Prompt Does

You have a PRD. It tells you *what* to build.

The Architect Master Prompt answers the next question: *how* do you build it?

It reads your PRD and — after asking you the right technical questions — produces
a complete technical blueprint. This blueprint becomes the foundation for every
coding decision in your project. It also produces the **Single Source of Truth
(SSOT)** — the one document your AI assistant reads at the start of every coding
session to stay consistent.

Think of the PRD as the architect's brief. The blueprint is the building plan.
You need both before the first brick is laid.

---

## What It Produces

One document — `ARCHITECTURE.md` — covering seven sections:

| Section | What's inside |
|---|---|
| **0 — SSOT** | Tech stack versions, naming rules, shared types, API format, import rules, code checklist |
| **1 — Frontend** | Module structure, folder layout, state management, accessibility |
| **2 — Backend** | Module structure, database schemas, system diagrams |
| **3 — Integrations** | API contracts, third-party connections, webhook handling, retry logic |
| **4 — Security** | OWASP mitigations, auth flow diagram, permissions table |
| **5 — Testing** | Unit, integration and E2E strategy, frameworks, coverage targets |
| **6 — DevOps** | Hosting, CI/CD pipeline, environment variables, monitoring |

**The most important section is Section 0 — the SSOT.**
Everything else in the project references it. Every AI coding session starts by
reading it. Every generated file is checked against it.

---

## Before You Start

You need one thing before using this prompt:

✅ **A completed PRD** from the PRD Generator prompt (saved as `PRD.md`)

That is it. You do not need to have made any technical decisions yet.
The prompt helps you make them — correctly, in the right order, with the right questions.

---

## The Two Phases

### Phase 0 — Questions First (mandatory)

The prompt never jumps straight to writing the blueprint.

First it reads your PRD carefully. Then it asks you clarifying questions in small
batches of 3–4. These questions cover things the PRD does not answer — technical
decisions that will shape the entire codebase.

You answer. It asks the next batch. This continues until every technical ambiguity
is resolved. Only then does it write the blueprint.

**This phase exists for a good reason.** A blueprint written on wrong assumptions
costs you weeks to undo. Fifteen minutes of questions upfront saves that.

### Phase 1 — Blueprint Generation

Once you say the magic words — **"Phase 0 is complete. Generate the blueprint."** —
it writes the full `ARCHITECTURE.md` in one complete output.

You save that file to your project. You never generate it again unless something
fundamental changes (new tech, major pivot, scale change).

---

## Step-by-Step Usage

### Step 1 — Open the prompt file

Open `product-initialisation/master-prompt-...` and copy everything inside it.

### Step 2 — Paste into your AI assistant

Open your AI assistant (Claude, ChatGPT, Cursor — any of them).
Paste the full prompt contents first.

### Step 3 — Paste your PRD

Immediately after the prompt, paste the full contents of your `PRD.md`.

Your message should look like this:

```
[full Architect Master Prompt contents]

---

Here is my PRD:

[full PRD.md contents]
```

### Step 4 — Answer the question batches

The AI will now read the PRD and ask its first batch of questions. Answer them
honestly and specifically. The more precise your answers, the better the blueprint.

Batches typically cover these areas across 4 rounds:
- Round 1: Domain structure, real-time needs, async requirements
- Round 2: Auth model, multi-tenancy, frontend structure
- Round 3: Database decisions, background jobs, scale strategy
- Round 4: Infrastructure, deployment preferences, monitoring needs

### Step 5 — Trigger the blueprint

When the AI has no more questions, it will tell you it is ready.
Type exactly:

```
Phase 0 is complete. Generate the blueprint.
```

### Step 6 — Save the output

Copy the full output. Save it as `ARCHITECTURE.md` in your project root.

This file stays in your repo for the entire life of the project.

---

## Full Example Walkthrough — ShiftSync

### What was pasted to start

```
[Architect Master Prompt v2.0 — full contents]

---

Here is my PRD:

[ShiftSync PRD v1.0 — full contents]
```

---

### Question Batch 1 — Domain Structure and Real-Time

**Architect asks:**

> PRD received. Before generating the blueprint I need to resolve
> technical ambiguities. Starting with the highest-impact decisions.
>
> **Batch 1 of 4**
>
> 1. The PRD has five distinct workflows: scheduling, open-shifts/swaps,
>    time-off, notifications, and billing. Should each map to a separate
>    backend module, or do scheduling + open-shifts + swaps share one module
>    since they all touch the Shift entity?
>
> 2. When a manager publishes a schedule, all employees get notifications
>    and calendar sync fires. Does the manager's UI need to show real-time
>    progress of that fan-out, or is fire-and-forget acceptable?
>
> 3. The owner dashboard shows all locations. Is this a live real-time view
>    or is polling on page load acceptable?

**Developer answers:**

> Backend modules: yes, keep scheduling + open-shifts + swaps as one
> `scheduling` module. They all touch Shift. Separate modules for:
> auth/users, time-off, notifications, billing, calendar-sync. 6 total.
>
> Publish fan-out: fire-and-forget is fine. Manager sees "Published"
> instantly. No progress tracking.
>
> Owner dashboard: poll on page load + manual refresh button. No WebSocket
> needed anywhere in v1.

---

### Question Batch 2 — Async Jobs and Queue Architecture

**Architect asks:**

> **Batch 2 of 4**
>
> 4. Notification fan-out could hit hundreds of push + email events on Monday
>    morning peak. Tolerance for delay — is 3–5 minutes across the whole
>    fan-out acceptable, or do all employees need notification within 1 minute?
>
> 5. The PRD specifies retry logic for calendar sync failures. Where should
>    retry state live — a database-backed job table, or AWS SQS? This affects
>    infrastructure complexity for a 2-person contractor team.
>
> 6. The CSV export needs to handle up to 1 year of shift data. Should this
>    be synchronous (user waits, download starts) or async (user gets a
>    download link via email when ready)?

**Developer answers:**

> 3–5 minutes across the fan-out is fine. No sub-minute delivery needed.
>
> Keep it simple — database-backed job table. No SQS in v1. A background_jobs
> table with status polling is sufficient. Add queue if we need it at scale.
>
> CSV export: synchronous for v1. Move async if it takes too long at scale.
> Don't over-engineer now.

---

### Question Batch 3 — Auth, Multi-Tenancy, Frontend Structure

**Architect asks:**

> **Batch 3 of 4**
>
> 7. Multi-tenancy: Organisation → Location → Users. When a manager logs in
>    they operate within one location. When an owner logs in they can switch.
>    Should the selected location live in the JWT (requires re-issue on switch)
>    or in frontend session state (JWT stays generic, location sent via header)?
>
> 8. The frontend needs three distinct layouts — Owner dashboard, Manager
>    schedule builder, Employee view. Should these be three separate route
>    modules each with their own layout, or one adaptive layout that changes
>    by role?
>
> 9. The EmployeeRole entity drives open-shift eligibility. Is eligibility
>    checked client-side (filter the UI) or server-side (authoritative check
>    at the claim endpoint)?

**Developer answers:**

> Location context: keep out of JWT. JWT encodes org_id, user_id, global role.
> Selected location lives in frontend state. API calls send X-Location-Id header.
> Backend validates user has access to that location on every request.
>
> Frontend layouts: three separate route modules — owner/, manager/, employee/.
> Each has its own layout and data layer. Role-based routing at router level.
>
> Role eligibility: server-side always. Client-side filtering is UX only.
> The claim endpoint validates authoritatively.

---

### Question Batch 4 — Database, Deployment, Scale

**Architect asks:**

> **Batch 4 of 4**
>
> 10. The shifts table will grow fast — potentially 65M+ rows at year 1.
>     Should we design partitioning into the schema now, or defer and add
>     indexing strategy only?
>
> 11. AWS is confirmed. ECS + Fargate (containerised), EC2 (self-managed),
>     or Lambda (serverless)? Each has different cold-start and Monday
>     morning peak-load characteristics.
>
> 12. The PRD mentions rules_config as a JSON column on Location. Should
>     this be a freeform JSONB column or typed scalar columns?

**Developer answers:**

> Partitioning: defer. Add a created_at index and composite index on
> (location_id, start_time) from day one. Revisit partitioning at 10M rows.
>
> AWS: ECS + Fargate. Containerised deploys, no server management.
> Docker backend + frontend via CloudFront/S3.
>
> rules_config: typed scalar columns. We know exactly what the rules are.
> JSONB flexibility not needed.

---

### Triggering the Blueprint

**Developer types:**

```
Phase 0 is complete. Generate the blueprint.
```

**Architect responds:**

> All technical gaps resolved. Generating ARCHITECTURE.md now.

---

## What the SSOT Section Looks Like (Section 0)

This is the most important part of the output. Here is a real example:

```markdown
## Section 0 — Single Source of Truth (SSOT)

> Commit this file to your repo as ARCHITECTURE.md.
> Paste Section 0 at the start of every AI coding session.

### Tech Stack — Pinned Versions

| Layer            | Technology                        | Version  |
|------------------|-----------------------------------|----------|
| Frontend         | React                             | 18.x     |
| Language         | TypeScript                        | 5.x      |
| Build tool       | Vite                              | 5.x      |
| Styling          | Tailwind CSS                      | 3.x      |
| State            | Zustand + TanStack Query          | 4.x / 5.x|
| Backend runtime  | Node.js                           | 20.x LTS |
| Backend framework| Express                           | 4.x      |
| ORM              | Prisma                            | 5.x      |
| Database         | PostgreSQL                        | 15.x     |
| Auth             | JWT (15min) + refresh rotation    | —        |
| Validation       | Zod (shared frontend + backend)   | 3.x      |
| Testing          | Vitest + Supertest + Playwright   | 1.x      |

### API Contract Format

Every response uses this envelope — no exceptions:

// Success
{ success: true, data: T, meta?: { page, pageSize, total } }

// Error
{ success: false, error: { code: string, message: string, details?: unknown } }

### Naming Conventions

| Artefact              | Convention    | Example                    |
|-----------------------|---------------|----------------------------|
| Files (frontend)      | kebab-case    | schedule-grid.tsx          |
| Files (backend)       | kebab-case    | shift.service.ts           |
| React components      | PascalCase    | ScheduleGrid               |
| React hooks           | camelCase     | useShifts                  |
| Database tables       | snake_case    | shift_swap_requests        |
| API routes            | kebab-case    | /api/time-off-requests     |
| Error codes           | SCREAMING     | SHIFT_NOT_FOUND            |

### Module Import Rules

ALLOWED:
  Any module  → shared/types
  Any module  → core/ (db, logger, auth middleware)
  Frontend    → core/ui (shared components)

FORBIDDEN:
  moduleA internals → moduleB internals
  Controller        → raw Prisma client (use repository only)
  Business logic    → process.env directly (use config service)

### Code Generation Checklist

Every AI-generated file must pass all 10 before accepting:

  [ ] No TypeScript any — all entities use shared types
  [ ] Response uses standard API envelope
  [ ] File named in kebab-case (PascalCase for React components only)
  [ ] Error codes defined in module's errors.ts
  [ ] No cross-module internal imports
  [ ] Config via config service — never process.env in business logic
  [ ] DB access via repository only
  [ ] Zod validation before any business logic
  [ ] Audit log written for state-changing operations
  [ ] No console.log — use shared logger service
```

---

## What the Database Schema Section Looks Like (Section 2)

The blueprint produces full TypeScript interfaces and Prisma schemas
for every entity in your system. Here is a real example from ShiftSync:

```prisma
model Shift {
  id             String      @id @default(cuid())
  locationId     String
  assignedUserId String?
  roleId         String
  startTime      DateTime
  endTime        DateTime
  status         ShiftStatus @default(DRAFT)
  isOpen         Boolean     @default(false)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  location     Location      @relation(fields: [locationId], references: [id])
  assignedUser User?         @relation(fields: [assignedUserId], references: [id])
  role         EmployeeRole  @relation(fields: [roleId], references: [id])

  @@index([locationId, startTime])
}
```

Every entity from your PRD gets a schema entry. No guessing the structure
when you start coding — it is already defined.

---

## What the System Diagram Looks Like (Section 2)

The blueprint produces Mermaid.js diagrams that render in GitHub, Notion,
and Confluence. Here is the schedule publish flow from ShiftSync:

```
sequenceDiagram
    participant M as Manager (Browser)
    participant API as API Server
    participant DB as PostgreSQL
    participant JQ as Job Runner
    participant N as Notification Service

    M->>API: POST /schedules/:weekId/publish
    API->>API: Verify JWT + RBAC
    API->>DB: Update shifts DRAFT → PUBLISHED
    API->>DB: Insert BackgroundJob NOTIFICATION_FANOUT
    API->>DB: Insert BackgroundJob CALENDAR_SYNC
    API-->>M: 200 { success: true, data: { published: true } }

    loop Every 10 seconds
        JQ->>DB: Fetch PENDING jobs
        JQ->>N: Handle NOTIFICATION_FANOUT
        N->>N: Send push + email per employee
        N->>DB: Mark job COMPLETED
    end
```

You get diagrams like this for auth flows, system architecture,
ER relationships, and CI/CD pipelines — all in the same document.

---

## How to Use ARCHITECTURE.md After It Is Generated

### In every coding session (Agent Workflow)

Paste the SSOT section (Section 0) at the start of every TASK, REVIEW,
or HOTFIX session. The Code Enforcer reads it and enforces your specific
conventions — not generic ones.

```
MODE: TASK

[paste Section 0 of ARCHITECTURE.md here]

[paste active PROGRESS.md here]

Task: build the shift swap controller — T-014
```

### When onboarding a new developer

Hand them `ARCHITECTURE.md` before they touch any code. Section 0 tells
them the rules. Section 2 shows them the database. Section 4 shows them
the security model. They can be productive in hours instead of days.

### When the AI generates a file

Tell the AI to check the file against the Code Generation Checklist
in Section 0 before outputting it. This single habit eliminates most
inconsistency problems before they reach your codebase.

### When something changes

If you change tech stack, add a major module, or change the API contract —
update `ARCHITECTURE.md` first. Then update your code. Never the other way around.
The SSOT is always the source of truth, not the code.

---

## Common Questions

**Do I have to answer all the questions? Can I skip some?**

Answer all of them. The questions exist because the blueprint will be wrong
without those answers. A guess in Phase 0 becomes a bug in month 2.
If you genuinely do not know an answer, say so — the prompt will help
you decide rather than leaving a gap.

**What if my tech stack is already decided?**

Tell the prompt at the start: "Our stack is already decided — React 18,
Node.js 20, Prisma, PostgreSQL, AWS ECS. Skip any questions about stack
choice." The prompt will accept this and focus its questions on structure,
patterns, and integration decisions instead.

**Can I regenerate the blueprint later?**

You can — but treat it like a significant event, not a routine step.
Regenerating the blueprint mid-project means you need to reconcile the
new blueprint with all code already written. It is better to update
specific sections of `ARCHITECTURE.md` by hand when things change.

**What if my PRD is rough or incomplete?**

Run the PRD Generator first and get a complete PRD. The Architect prompt
is designed to receive a well-formed PRD. Feeding it a rough half-page
idea will produce a weak blueprint because the architectural decisions
depend on product decisions — who the users are, what the compliance
requirements are, what the scale targets are. Those answers come from
the PRD.

**How long does Phase 0 take?**

Usually 15–25 minutes of back-and-forth. 4 question batches of 3–4
questions each. The questions are direct — you will not need to research
anything, just make decisions.

**Can I use this prompt without the rest of CODE-SMITH?**

Yes. If you already have a PRD from somewhere else, this prompt will
still produce a solid blueprint. The SSOT it produces will work with
the Agent Workflow prompt even if you did not use the PRD Generator.
The only requirement is a completed product requirements document as input.

---

## Mistakes to Avoid

**Rushing Phase 0**

The most common mistake is giving vague answers to get to the blueprint faster.
"I don't know, whatever works" is not an answer the blueprint can use.
Every vague answer becomes an assumption — and assumptions in blueprints
become expensive surprises in code.

**Not saving ARCHITECTURE.md to your repo**

Some developers treat the blueprint as a one-off reference and never commit it.
Then they lose context, the AI drifts from the original decisions, and
inconsistencies pile up. Commit `ARCHITECTURE.md` to the root of your repo
on day one and treat it as a living document.

**Ignoring the SSOT section because it looks like boilerplate**

Section 0 looks like a table of conventions. It feels like admin.
It is actually the most operationally important part of the entire system.
The Agent Workflow prompt's Code Enforcer does nothing useful without it.
Every coding session that skips the SSOT paste is a session where the
AI enforces generic standards instead of your specific ones.

**Regenerating the blueprint instead of updating it**

When something changes — a new integration, a schema addition, a
different deployment target — update the relevant section of
`ARCHITECTURE.md` directly. Do not re-run Phase 0 and regenerate
everything. The cost of reconciling a fresh blueprint with existing
code is almost always higher than the cost of a targeted update.

**Using the blueprint as documentation instead of a decision record**

The blueprint is not user documentation and it is not API documentation.
It is the record of your architectural decisions and the conventions
that flow from them. Keep it accurate. Update it when decisions change.
Archive the old version with a date so you know when a decision changed.

---

## Quick-Start Checklist

Before starting:
- [ ] PRD.md is complete (ran through PRD Generator)
- [ ] AI assistant is open with a fresh context window

Running Phase 0:
- [ ] Pasted full prompt + full PRD.md
- [ ] Answered every question batch specifically
- [ ] No "I don't know" answers left open
- [ ] AI confirmed it has no more questions

Generating the blueprint:
- [ ] Typed "Phase 0 is complete. Generate the blueprint."
- [ ] Full output received — all 7 sections present
- [ ] Saved as ARCHITECTURE.md in project root
- [ ] Committed to repo

Using ARCHITECTURE.md going forward:
- [ ] Section 0 (SSOT) pasted into first Agent Workflow session
- [ ] ARCHITECTURE.md shared with all developers on the project
- [ ] Decision to update ARCHITECTURE.md logged in CHANGELOG

---

## Where This Fits in the Full System

```
   STEP 1               STEP 2               STEP 3              STEP 4
PRD Generator  →  Architect Prompt  →  Agent Workflows  →  Code Evaluator
                  ← YOU ARE HERE →

Input:  PRD.md          Input:  ARCHITECTURE.md     Input:  ARCHITECTURE.md
                                + PROGRESS.md                + Code
Output: PRD.md          Output: ARCHITECTURE.md     Output: Audit Report
                                (with SSOT)                  + Scores
```

The SSOT section of `ARCHITECTURE.md` is the bridge between this step
and every coding session that follows. Without it, the Agent Workflow
prompt enforces generic best practices. With it, the Enforcer knows
your exact conventions, your module boundaries, your API envelope shape,
and your naming rules — and enforces all of them automatically.

---

*One session to answer the questions. One document for the life of the project.*
*That is the Architect Master Prompt.*