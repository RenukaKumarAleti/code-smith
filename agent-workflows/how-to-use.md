# How the Agent Workflow Master Prompt Works
## A Complete Usage Guide with Real Examples

**Prompt version:** Agent Workflow Master Prompt v2.0
**Project used in examples:** ShiftSync (B2B workforce scheduling SaaS)
**Read time:** ~15 minutes

---

## What This Prompt Actually Is

Most developers use AI assistants as a code autocomplete — paste a problem, get an answer, move on. The Agent Workflow Master Prompt turns your AI assistant into something different: a persistent project brain that shows up every session knowing exactly where you are, what's at risk, and whether the code you're writing is production-grade.

It does three things simultaneously in every session:

1. **Tracks** your project — deadlines, tasks, blockers, velocity
2. **Guards** your architecture — conventions, patterns, drift, decisions
3. **Enforces** code quality — automatically, on every code block, every session

It is not a one-time prompt. It is a workflow you run for the entire life of a project.

---

## The Mental Model

Think of it as a cockpit rather than a chatbot.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   YOUR AI ASSISTANT                                         │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │    PM    │  │Architect │  │Developer │  │    QA    │  │
│   │  Agent   │  │  Agent   │  │  Agent   │  │  Agent   │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│   │   Tech   │  │Security  │  │   Docs   │                 │
│   │   Debt   │  │  Agent   │  │  Agent   │                 │
│   └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│   ════════════════════════════════════════════════════════  │
│   🛡️  CODE ENFORCER — always active — watches every line   │
│   ════════════════════════════════════════════════════════  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↑                  ↑                  ↑
    ARCHITECTURE.md    PROGRESS.md       CHANGELOG.md
    (SSOT — locked)   (current state)   (history)
```

The two files at the bottom — `PROGRESS.md` and `CHANGELOG.md` — are the project's memory. They survive between sessions. Everything the agents know about your project lives in those two files.

---

## Before Your First Session — What You Need

Three things must exist before you start:

| What | Where it comes from | Why it matters |
|---|---|---|
| `ARCHITECTURE.md` with SSOT section | Architect Master Prompt output | Locks the tech stack and conventions for the Enforcer |
| `PROGRESS.md` (blank template) | Copied from the prompt | Agents read this every session |
| `CHANGELOG.md` (blank template) | Copied from the prompt | Tracks every decision and change |

If you ran the PRD Generator and Architect Prompt first, you already have the PRD and Blueprint. The SSOT section of `ARCHITECTURE.md` is what gets pasted into the workflow prompt.

**On session 1 only**, you also paste the full PRD. From session 2 onwards, the PRD is summarised inside PROGRESS.md and you don't need to paste it again.

---

## The Four Session Modes — Pick One Every Time

This is the most important operational decision each session. Mode determines which agents activate, which documents you need to paste, and how much context is consumed.

```
FULL MODE ────────── Sprint start, planning, major decisions
TASK MODE ────────── Daily coding on a known task (most common)
REVIEW MODE ──────── Code review, no new feature work
HOTFIX MODE ──────── Fixing a specific bug
```

### Why modes exist

Without modes, every session loads everything — PRD, full blueprint, full changelog, all agents. By session 20, that's 20,000+ tokens of overhead before you've written a single line. Modes let you load only what the session actually needs.

**Realistic session mix on a 4-month project:**

| Mode | Frequency | When |
|---|---|---|
| FULL | ~10% of sessions | Sprint kick-off, planning, milestone reviews |
| TASK | ~60% of sessions | Daily coding — this is your default |
| REVIEW | ~20% of sessions | PR reviews, pre-milestone code pass |
| HOTFIX | ~10% of sessions | Bug reports, production issues |

---

## How to Start a Session — Step by Step

### Session opening template

```
[PASTE THE AGENT WORKFLOW MASTER PROMPT]

---
MODE: TASK
---
[PASTE ARCHITECTURE.md — SSOT SECTION ONLY]
---
[PASTE PROGRESS.md — ACTIVE SECTION ONLY]
---
Task for this session:
Implement the shift swap request endpoint — T-014
Module: scheduling
File to create: apps/api/src/modules/scheduling/swap-request.controller.ts
```

That is a complete TASK MODE session opener. ~3,500 tokens total. The agent knows your stack, your conventions, where you are in the project, and exactly what you want to build today.

---

## Full Mode Example — Sprint Kick-off

**What you paste:**

```
MODE: FULL

[ARCHITECTURE.md — SSOT section]
[PROGRESS.md — full file]
[CHANGELOG.md — last 10 sessions]

Starting Sprint 2. Let's review where we are and plan the week.
```

**What the prompt outputs:**

```
════════════════════════════════════════════════════════════════
  SHIFTSYNC  |  SESSION 8  |  2024-02-05  |  FULL MODE
════════════════════════════════════════════════════════════════
  SSOT locked: Node.js 20 + Express 4 + Prisma 5 + PostgreSQL 15
               Pattern: Modular Monolith / Service-Repository
  Mode:        FULL
  Agents:      PM + Architect + Developer + QA + Debt + Security
  Documents:   PRD —  Blueprint ✅  CHANGELOG ✅  PROGRESS ✅
════════════════════════════════════════════════════════════════
```

Then each agent runs in sequence:

---

### Project Manager Agent Output (FULL MODE)

```
┌─────────────────────────────────────────────────────┐
│  🗂️  PROJECT MANAGER                                │
├─────────────────────────────────────────────────────┤
│  Status: 🟡 At Risk                                 │
│                                                     │
│  DEADLINES                                          │
│  🟢 Sprint 2      Feb 16    11 days left            │
│  🟡 Milestone M2  Feb 28    23 days                 │
│     Notifications + Calendar Sync not yet started  │
│  🟡 Release v1.0  Mar 29    52 days                 │
│                                                     │
│  VELOCITY                                           │
│  Actual: 3.2 pts/day  |  Planned: 4.0 pts/day       │
│  Projected sprint close: Feb 19 (3 days late)       │
│  Projected v1.0 ship:    Apr 06 (8 days late)       │
│                                                     │
│  TODAY'S TOP 3                                      │
│  1. 🔴 Notifications module not started — on the   │
│        critical path for M2. Needs to begin today. │
│  2. 🟡 Velocity 20% below plan. Either reduce S2   │
│        scope or extend by 3 days.                  │
│  3. 🟡 B-002 (swap request bug) open 4 days —      │
│        QA gate risk if unresolved before M2.       │
│                                                     │
│  ⚠️  At current pace v1.0 ships Apr 06 not Mar 29. │
│      Recommend: defer drag-and-drop (F-011) to v1.1│
│      to recover 8 points and restore buffer.       │
└─────────────────────────────────────────────────────┘
```

---

### Architect Agent Output (FULL MODE — with drift detection on session 8)

```
┌─────────────────────────────────────────────────────┐
│  🏛️  ARCHITECT                                      │
├─────────────────────────────────────────────────────┤
│  Architecture: ⚠️  Minor Drift Detected             │
│  Drift score:  🟡 Minor                             │
│                                                     │
│  DRIFT FLAGS                                        │
│  ⚠️  apps/api/src/modules/scheduling/               │
│      shift.controller.ts — line 47                  │
│      Business logic found in controller:            │
│      Overtime calculation (should be in             │
│      rules.service.ts per SSOT pattern)             │
│      → DR-001: Move overtimeCheck() to rules.service│
│                                                     │
│  PENDING DECISIONS                                  │
│  ❓ D-004: Swap request expiry — run as a           │
│      scheduled job or check lazily on read?         │
│      Impacts: T-014, T-015  Open: 3 days            │
│                                                     │
│  RECORDED THIS SESSION                              │
│  (none yet — session just started)                  │
└─────────────────────────────────────────────────────┘
```

---

### Developer Agent Output (FULL MODE)

```
┌─────────────────────────────────────────────────────┐
│  💻 DEVELOPER                                       │
├─────────────────────────────────────────────────────┤
│  Sprint 2: 6/18 tasks done (33%)                    │
│                                                     │
│  NEXT UNBLOCKED TASKS                               │
│  F-005 — Shift Swap Requests                        │
│    → T-014: swap-request.controller.ts              │
│    → T-015: swap-request.service.ts                 │
│                                                     │
│  F-007 — Notifications                              │
│    → T-019: notifications module scaffold           │
│    → T-020: push.service.ts (web-push integration)  │
│                                                     │
│  DEPENDENCY CHAIN                                   │
│  T-022 (calendar sync) blocked until               │
│  T-020 (notifications) is done                     │
│                                                     │
│  COVERAGE RISK                                      │
│  ⚠️  F-004 (Open Shifts) — 80% built, 0% tests      │
└─────────────────────────────────────────────────────┘
```

---

### Session Summary Banner

```
════════════════════════════════════════════════════════════════
  READY  |  ShiftSync  |  2024-02-05  |  Session 8
════════════════════════════════════════════════════════════════
  Overall:    🟡 At Risk
  Sprint 2:   11 days left — 33% done
              Projected close: Feb 19 (3 days late)
  Milestone:  M2 — 23 days — 2 features not started
  Release:    v1.0 — 52 days — buffer tight
  Drift:      🟡 Minor — 1 controller violation (DR-001)
  Debt:       🟢 Low

  Must address today:
    1. Start F-007 Notifications — critical path for M2
    2. Resolve D-004 (swap expiry mechanism)
    3. Add tests to F-004 Open Shifts before marking complete

  Code Enforcer active. All code reviewed against SSOT.
  What would you like to work on?
════════════════════════════════════════════════════════════════
```

---

## Task Mode Example — Daily Coding Session

This is what 60% of your sessions look like. Lean, focused, low token overhead.

**What you paste:**

```
MODE: TASK

[ARCHITECTURE.md — SSOT section only]

Active sprint tasks:
T-014: Create swap-request.controller.ts in modules/scheduling/
T-015: Create swap-request.service.ts in modules/scheduling/

No blockers. D-004 resolved: swap expiry checked lazily on read.

Let's build T-014 first.
```

**What the prompt outputs:**

```
════════════════════════════════════════════════════════════════
  SHIFTSYNC  |  SESSION 9  |  2024-02-06  |  TASK MODE
════════════════════════════════════════════════════════════════
  SSOT locked: Node.js 20 + Express 4 + Prisma 5
               Pattern: Modular Monolith / Service-Repository
════════════════════════════════════════════════════════════════
💻 Dev: T-014 → swap-request.controller.ts. T-015 next. No blockers.
Code Enforcer active.

Ready. Building T-014.
```

No long agent banners. One status line. Straight to the work.

Then it produces the controller code, and immediately after — without you asking — the Enforcer runs:

---

## The Code Enforcer in Action

### Scenario A — Clean Code (✅ Production-grade)

The agent writes `swap-request.controller.ts` correctly:

```typescript
// apps/api/src/modules/scheduling/swap-request.controller.ts
import { Router, Request, Response } from 'express';
import { requireAuth } from '../../core/middleware/auth.middleware';
import { requireRole } from '../../core/middleware/rbac.middleware';
import { validate } from '../../core/middleware/validate.middleware';
import { swapRequestService } from './swap-request.service';
import { createSwapRequestSchema } from './scheduling.schemas';
import { logger } from '../../core/logger';

export const swapRequestRouter = Router();

swapRequestRouter.post(
  '/',
  requireAuth,
  requireRole('EMPLOYEE'),
  validate(createSwapRequestSchema),
  async (req: Request, res: Response) => {
    try {
      const request = await swapRequestService.createSwapRequest(
        req.user.userId,
        req.locationId,
        req.body
      );
      return res.status(201).json({ success: true, data: request });
    } catch (error) {
      logger.error({ error }, 'Failed to create swap request');
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' }
      });
    }
  }
);
```

**Enforcer output:**

```
┌─────────────────────────────────────────────────────┐
│  🛡️  CODE ENFORCER                                  │
├─────────────────────────────────────────────────────┤
│  Stack: Node.js 20 + Express 4 + Prisma 5           │
│  Pattern: Modular Monolith / Service-Repository     │
│  SSOT: loaded — project conventions applied         │
│                                                     │
│  TIER 1 RESULTS                                     │
│  ✅ Security — auth + role middleware present        │
│  ✅ Input validation — Zod schema via middleware     │
│  ✅ No secrets hardcoded                            │
│  ✅ Error handling — try/catch + logger             │
│  ✅ Architecture — business logic in service, not   │
│     controller (SSOT pattern followed)             │
│  ✅ Response shape — standard envelope used         │
│  ✅ Module boundaries — no cross-module imports     │
│  ✅ Type safety — no implicit any                   │
│                                                     │
│  TIER 2 FLAGS                                       │
│  (none)                                             │
│                                                     │
│  VERDICT                                            │
│  ✅ Production-grade — ready to ship                │
└─────────────────────────────────────────────────────┘
```

---

### Scenario B — Advisory Flags (⚠️ Shippable with advisories)

You paste some existing code for a review:

```
standards check:

export async function getLocationScheduleSummary(locationId: string, weekStart: string) {
  const shifts = await prisma.shift.findMany({ where: { locationId, status: 'PUBLISHED' } });
  const employees = await prisma.userLocation.findMany({ where: { locationId } });
  const openShifts = shifts.filter(s => s.isOpen);
  const assignedShifts = shifts.filter(s => !s.isOpen);
  const coverageRate = assignedShifts.length / (assignedShifts.length + openShifts.length) * 100;
  const totalHours = shifts.reduce((sum, s) => {
    return sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 3600000;
  }, 0);
  const employeeHoursMap = {};
  for (const shift of assignedShifts) {
    if (!employeeHoursMap[shift.assignedUserId]) employeeHoursMap[shift.assignedUserId] = 0;
    employeeHoursMap[shift.assignedUserId] += (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 3600000;
  }
  return { coverageRate, totalHours, employeeHoursMap, openShiftCount: openShifts.length };
}
```

**Enforcer output:**

```
┌─────────────────────────────────────────────────────┐
│  🛡️  CODE ENFORCER                                  │
├─────────────────────────────────────────────────────┤
│  TIER 1 RESULTS                                     │
│                                                     │
│  ⚠️  VIOLATION: Raw Prisma in Service Layer         │
│  📍 prisma.shift.findMany() and                     │
│     prisma.userLocation.findMany() called directly  │
│  ❌ SSOT rule: DB access only via module repository  │
│  💥 Creates scattered query logic, untestable, and  │
│     breaks repository abstraction across the app    │
│  ✅ Fix: call shiftRepository.findPublishedByWeek() │
│     and userLocationRepository.findByLocation()     │
│                                                     │
│  ⚠️  VIOLATION: Missing return type declaration     │
│  📍 Function signature has no return type           │
│  ❌ SSOT rule: return types on all exported functions│
│  ✅ Fix: async function getLocationScheduleSummary( │
│     ...): Promise<ScheduleSummary>                  │
│                                                     │
│  TIER 2 FLAGS                                       │
│  ⚠️  Function is 24 lines — approaching 30 limit.   │
│     Consider extracting hour-calculation logic into │
│     a shared calculateShiftHours(shift) util.       │
│  ⚠️  Magic number 3600000 — suggest:                │
│     const MS_PER_HOUR = 3_600_000                   │
│  ⚠️  employeeHoursMap typed as {} — use             │
│     Record<string, number>                          │
│                                                     │
│  VERDICT                                            │
│  ❌ Not production-grade — 2 Tier 1 SSOT violations │
│     Fix repository calls and return type first.     │
└─────────────────────────────────────────────────────┘
```

---

### Scenario C — Critical Escalation (🚨 Halt)

You paste a rushed authentication handler:

```typescript
app.post('/auth/login', async (req, res) => {
  const user = await db.query(
    `SELECT * FROM users WHERE email = '${req.body.email}'`
  );
  if (user.rows[0].password === req.body.password) {
    const token = jwt.sign({ userId: user.rows[0].id }, 'mysecretkey');
    res.json({ token, user: user.rows[0] });
  } else {
    res.json({ error: 'Invalid credentials' });
  }
});
```

**Enforcer output:**

```
🚨 CRITICAL — DO NOT SHIP THIS CODE
   5 Tier 1 violations in auth login handler.
   I will not generate dependent code until this is resolved.
   Full corrected version follows — replace the original entirely.

┌─────────────────────────────────────────────────────┐
│  🛡️  CODE ENFORCER — CRITICAL                       │
├─────────────────────────────────────────────────────┤
│  TIER 1 — 5 VIOLATIONS                              │
│                                                     │
│  ⚠️  VIOLATION 1: SQL Injection                     │
│  ❌ String interpolation in SQL query               │
│  💥 Complete DB compromise with a single request    │
│  ✅ Use Prisma ORM — no raw SQL                     │
│                                                     │
│  ⚠️  VIOLATION 2: Plaintext Password Comparison     │
│  ❌ Direct string equality on password              │
│  💥 All user passwords exposed if DB is breached    │
│  ✅ bcrypt.compare(req.body.password, user.passwordHash)│
│                                                     │
│  ⚠️  VIOLATION 3: Hardcoded JWT Secret              │
│  ❌ 'mysecretkey' literal in jwt.sign()             │
│  💥 Any attacker can forge tokens for any user      │
│  ✅ jwt.sign(payload, config.jwtSecret)             │
│                                                     │
│  ⚠️  VIOLATION 4: PII Leak in Response              │
│  ❌ user.rows[0] dumps entire DB row including hash │
│  💥 Password hash, internal IDs sent to client      │
│  ✅ Return only { id, email, name, globalRole }     │
│                                                     │
│  ⚠️  VIOLATION 5: Error Response Leaks State        │
│  ❌ res.json({ error }) with HTTP 200               │
│  💥 Confirms email exists (user enumeration attack) │
│  ✅ Always return 401 with identical message for    │
│     both wrong email and wrong password             │
│                                                     │
│  VERDICT                                            │
│  ❌ Not production-grade — 5 critical violations    │
└─────────────────────────────────────────────────────┘

✅ Corrected version:

// apps/api/src/modules/auth/auth.controller.ts
router.post('/login',
  validate(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      if (!result) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
        });
      }
      return res.json({ success: true, data: result });
    } catch {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' }
      });
    }
  }
);
```

---

## Review Mode Example — Pre-Milestone Code Pass

**What you paste:**

```
MODE: REVIEW

[ARCHITECTURE.md — SSOT section]

Pre-milestone review. Paste 4 files from the scheduling module
for a full Enforcer pass before M2 sign-off.

[paste files]
```

**What happens:**
- No startup banner
- No PM/Dev/Architect output
- Straight to Enforcer review on each file
- QA agent summarises coverage status at the end

Useful the day before a milestone — focused, no noise.

---

## Hotfix Mode Example — Production Bug

**What you paste:**

```
MODE: HOTFIX

[ARCHITECTURE.md — SSOT section]

Bug B-007 (Critical): Shift swap auto-approving without manager
confirmation. Filed this morning. Production.

Affected file: apps/api/src/modules/scheduling/swap-request.service.ts
Symptom: swapRequestService.processCoworkerAcceptance() is calling
approveSwap() internally instead of setting status to PENDING_MANAGER.

Fix and Enforcer review please.
```

**What happens:**
- No startup banner whatsoever
- Straight to diagnosis and fix
- Enforcer runs on the corrected code
- One CHANGELOG entry logged at the end

Absolute minimum overhead for a production issue.

---

## The Commands — Quick Reference

You can issue these at any point during a session:

### Code Commands
```
standards check: [paste code]
  → Full Enforcer review on any code, any time

fix: the swap service is calling prisma directly instead of the repository
  → Agent diagnoses and produces the corrected version

why: no cross-module imports
  → Agent explains the architectural reason behind a specific SSOT rule

generate checklist
  → Runs the 10-point Code Generation Checklist on the last file produced
```

### Project Tracking Commands
```
mark complete: T-014
  → Updates PROGRESS.md, logs to CHANGELOG

add bug: swap notification fires twice on co-worker accept | severity: medium
  → Creates B-008, adds to PROGRESS.md

raise blocker: waiting for Google OAuth credentials from client
  → Creates BL-004, flags impacted tasks

resolve blocker: BL-004
  → Marks resolved, unblocks affected tasks

defer: F-011 to v1.1
  → Removes from sprint, logs DEFER entry in CHANGELOG

log decision: swap expiry checked lazily on read — no background job in v1
  → Creates D-005 DECISION entry — never archived
```

### Agent Commands
```
run pm
  → Re-runs just the Project Manager agent (useful mid-session after changes)

run architect
  → Re-runs Architect agent — checks any decisions made this session

drift check
  → Forces an architectural drift scan now regardless of session number

security audit
  → Runs the full monthly Security Agent check on demand

velocity check
  → Recalculates projected finish dates with current session data
```

### Deadline Commands
```
add deadline: M3 Billing Complete | 2024-03-01
update deadline: Sprint 2 | 2024-02-19
deadline status
  → Shows all deadlines with current risk levels and projected dates
```

---

## The Two Files — Your Project's Memory

### How PROGRESS.md works

This file is **fully rewritten every session close**. It is the living state of your project. You paste the current version at session start; you copy the updated version at session close.

Active section structure (what gets loaded in TASK mode — lean):

```markdown
## ACTIVE THIS SESSION

Sprint 2 — 9 days left — 44% done
Velocity: 3.2 pts/day (planned: 4.0)
Projected close: Feb 19 (3 days late)

Next unblocked:
  F-005 Swap Requests → T-014 (in progress), T-015 (next)
  F-007 Notifications → T-019 (not started — START TODAY)

Blockers: none
Open bugs: B-002 (Medium, 5 days), B-007 (Critical, 0 days)
Pending decisions: D-004 swap expiry (3 days open)
```

Completed features collapse to a `## Completed` section after 2 sessions. They stay in the file for reference but are not loaded in TASK/HOTFIX modes.

---

### How CHANGELOG.md works

This file is **append-only**. Sessions are never deleted — only rolled to an archive file after 30 sessions. DECISION entries are permanent and never archived.

```markdown
# Changelog — ShiftSync

## Summary
Active sessions: 9 | Archived: 0 | Features shipped: 3
Total Tier 1 violations caught: 12 | Total corrected: 12

---

## 2024-02-06 — Session 9 — TASK MODE

- [Developer]  | FEAT     | T-014: swap-request.controller.ts — complete
- [Enforcer]   | QUALITY  | T-014 — 0 Tier 1 violations, 0 Tier 2 flags. ✅
- [Architect]  | DECISION | D-004: Swap expiry checked lazily on read.
                            No background job in v1. Revisit if expiry
                            accuracy becomes a support issue.
- [Developer]  | FEAT     | T-015: swap-request.service.ts — in progress

---

## 2024-02-05 — Session 8 — FULL MODE

- [PM Agent]   | DEADLINE | Sprint 2 projected close Feb 19 — 3 days late.
                            Recommend deferring F-011 drag-and-drop to v1.1.
- [Architect]  | DRIFT    | 🟡 Minor — DR-001: overtimeCheck() in controller,
                            should be in rules.service.ts. Added to backlog.
- [Enforcer]   | QUALITY  | 2 Tier 1 violations in existing code corrected.
                            Raw Prisma in service layer + missing return type.
- [PM Agent]   | DEFER    | F-011 drag-and-drop deferred to v1.1.
                            Recovers 8 points — restores v1.0 buffer.
```

---

## Session Close — How It Works

When you type `session summary` or tell the agent you're done:

```
════════════════════════════════════════════════════════════════
  SESSION CLOSE  |  ShiftSync  |  2024-02-06  |  Session 9
════════════════════════════════════════════════════════════════
  Done this session:
    ✅ T-014: swap-request.controller.ts — complete
    ✅ D-004: swap expiry decision logged

  Carried forward:
    🔄 T-015: swap-request.service.ts — 60% done
    ⬜ T-019: notifications module scaffold

  Architecture:
    Drift score: 🟢 Clean (DR-001 from S8 still open)
    Decisions logged: 1 (D-004)

  Security:
    Flags raised: 0

  Code quality:
    Tier 1 violations caught: 0
    Tier 2 flags raised: 1 (magic number in hour calc)
    SSOT violations: 0
    Trend (last 5 sessions): Improving ↘

  Tech debt:
    Debt score: 🟢 Low
    New debt items: 0

  Changelog entries written: 4
  Velocity: 3.4 pts/day — projected sprint close: Feb 18 (2 days late)
════════════════════════════════════════════════════════════════
⬇️  Updated CHANGELOG.md and PROGRESS.md follow.
    Copy them back into your project repo.
════════════════════════════════════════════════════════════════
```

After this banner, the agent outputs the full updated CHANGELOG.md and PROGRESS.md as copyable blocks. You paste them back into your repo. That's it — that's the entire session close workflow.

---

## How the Agents Interact — Conflict Example

Scenario: PM wants to ship F-007 Notifications this sprint. QA says coverage on F-005 Swap Requests is at 0%. Architect says a schema change is needed before notifications can work cleanly.

Without a conflict protocol, these three agents just output independently and you have to resolve the tension yourself.

With the conflict resolution protocol:

```
⚠️  AGENT CONFLICT DETECTED

    PM Agent recommends: prioritise F-007 Notifications (schedule risk)
    QA Agent flags: F-005 has 0% test coverage (quality gate)
    Architect Agent: schema change needed before F-007 (technical dependency)

    Resolution by priority order:
      Architecture dependency (rank 5) > Quality gate (rank 4) > Schedule (rank 1)

    Decision: F-007 cannot start until schema change is complete.
              F-005 tests must be added before F-007 is marked complete.
              F-007 start pushed to tomorrow at earliest.

    Risk accepted: sprint timeline slips ~1 day.
    Logged as: D-006 DECISION in CHANGELOG.

    Recommendation: add F-005 tests as T-016 today (2 hour task).
                    Schema change as T-017. F-007 starts tomorrow.
```

The conflict is resolved transparently, the decision is logged, and the reasoning is visible. No guessing.

---

## How This Connects to the Other Three Prompts

```
                        YOUR IDEA
                           ↓
        ┌──────────────────────────────────┐
        │  1. PRD GENERATOR                │
        │  Vague idea → Enterprise PRD     │
        │  Output: PRD.md                  │
        └──────────────────┬───────────────┘
                           ↓ PRD.md
        ┌──────────────────────────────────┐
        │  2. ARCHITECT MASTER PROMPT      │
        │  PRD → Technical Blueprint       │
        │  Output: ARCHITECTURE.md (SSOT)  │
        └──────────────────┬───────────────┘
                           ↓ PRD.md + ARCHITECTURE.md
        ┌──────────────────────────────────┐
        │  3. AGENT WORKFLOW ← YOU ARE HERE│
        │  Every development session       │
        │  Output: CHANGELOG.md            │
        │          PROGRESS.md             │
        └──────────────────┬───────────────┘
                           ↓ Code + CHANGELOG.md + PROGRESS.md
        ┌──────────────────────────────────┐
        │  4. VALIDATOR & AUDIT PROMPT     │
        │  At milestones + pre-launch      │
        │  Output: Audit report + scores   │
        └──────────────────────────────────┘
                           ↓
                  PRODUCTION-GRADE SHIPPED CODE
```

**What each prompt hands to the next:**

- PRD Generator → hands `PRD.md` to the Architect
- Architect → hands `ARCHITECTURE.md` (with SSOT) to the Workflow prompt
- Workflow prompt → hands `CHANGELOG.md` + `PROGRESS.md` to the Validator
- Validator → hands audit scores and fix list back to the Workflow prompt for the next sprint

The SSOT section of `ARCHITECTURE.md` is the connective tissue — it locks the conventions that both the Architect and the Workflow Enforcer operate from. Without it, the Enforcer enforces generic standards. With it, the Enforcer enforces *your* standards.

---

## Common Mistakes to Avoid

**Mistake 1 — Running FULL MODE every session**
FULL MODE loads everything. Use it for sprint starts only. TASK MODE is your daily driver. Loading the full PRD and full changelog every day is wasted tokens and context.

**Mistake 2 — Not saving PROGRESS.md at session close**
The agents have no memory between sessions. If you don't copy the updated PROGRESS.md back to your repo, the next session starts blind. Make session close a non-negotiable habit — it takes 30 seconds.

**Mistake 3 — Ignoring Tier 2 flags because they're advisory**
Tier 2 flags don't block shipping. But if you ignore them every session, they accumulate into the tech debt that slows the project in month 3. A good rule: no more than 3 unresolved Tier 2 flags per feature before it's marked complete.

**Mistake 4 — Not declaring a session mode**
If you don't declare a mode, the agent defaults to TASK and flags the assumption. That's fine, but you lose the benefit of the explicit loading decision. Get in the habit of declaring mode as the first line.

**Mistake 5 — Pasting the whole CHANGELOG in TASK MODE**
Only the last 10 sessions are needed in FULL MODE. TASK MODE doesn't need CHANGELOG at all. Pasting the full file wastes context and slows the session.

**Mistake 6 — Skipping the SSOT paste**
This is the most common mistake. If you don't paste the SSOT section from ARCHITECTURE.md, the Enforcer has no project-specific conventions to enforce. It falls back to generic standards and misses your specific naming rules, envelope format, and module boundaries.

---

## Quick-Start Checklist

Before your first session:
- [ ] Run PRD Generator → have `PRD.md`
- [ ] Run Architect Prompt → have `ARCHITECTURE.md` with SSOT section
- [ ] Copy blank `PROGRESS.md` template from the prompt into your repo
- [ ] Copy blank `CHANGELOG.md` template from the prompt into your repo

Every session open:
- [ ] Declare session mode
- [ ] Paste SSOT section from `ARCHITECTURE.md`
- [ ] Paste active section of `PROGRESS.md` (TASK mode) or full file (FULL mode)
- [ ] State what you want to work on

Every session close:
- [ ] Type `session summary`
- [ ] Copy updated `CHANGELOG.md` to repo
- [ ] Copy updated `PROGRESS.md` to repo
- [ ] Commit both files

---
