# How to Use the Feature Spec Master Prompt
## A Complete Usage Guide

**Prompt:** Feature Spec Master Prompt v1.0
**Project used in examples:** ShiftSync (B2B workforce scheduling SaaS)
**Read time:** ~10 minutes

---

## What Problem This Solves

When you open a coding session and say "build the shift swap feature," your AI
assistant has to guess what that means. It reads the PRD, fills in the gaps with
assumptions, and starts writing code.

For simple features — a single actor, one endpoint, no side effects — that works
fine. For complex features — multiple actors in sequence, entities changing states,
notifications firing, other records auto-updating — those assumptions become bugs.

The Feature Spec Prompt closes that gap. It sits between your PRD and your first
coding session for a feature. It asks the right questions first, then produces a
contract that answers:

- Exactly what API endpoints are needed and what shape they have
- Every state an entity can be in and what triggers each change
- Every edge case and what the system should do in each one
- What tests need to be written and what they should verify
- What counts as "done" — in binary yes/no terms the Validator can check

Your coding session then loads this spec instead of the full PRD. The AI writes
code against a contract, not a guess.

---

## Where It Sits in the Pipeline

```
PRD.md  ──►  ARCHITECTURE.md  ──►  FEATURE-SPEC-[F-ID].md  ──►  TASK MODE
               (Architect)         (Feature Spec Prompt)       (Agent Workflow)
                                    ← YOU ARE HERE →
```

You run it once per feature — not once per project.
You do not need it for every feature. See the "When to use it" section below.

---

## When to Use It

Run the Feature Spec Prompt when a feature meets **any** of these:

```
✅ Multiple actors interact in sequence
   (e.g. employee initiates → co-worker accepts → manager approves)

✅ An entity has more than 2 possible status values
   (e.g. PENDING → PENDING_MANAGER → APPROVED / DENIED / EXPIRED / CANCELLED)

✅ The feature touches more than one backend module
   (e.g. scheduling module calls notifications module)

✅ External services are involved
   (Stripe, Google Calendar, push notifications, email)

✅ Two users could act on the same thing at the same time
   (e.g. two employees claiming the same open shift)

✅ The feature is estimated as L or XL size

✅ There are compliance requirements
   (audit logging, PII handling, data retention rules)

✅ You cannot list all the edge cases in your head right now
```

Skip it when a feature meets **all** of these:

```
✅ Single actor only
✅ Single module only
✅ No external service calls
✅ The entity does not change states
✅ Estimated S or M size
✅ You can list every edge case in under 2 minutes
```

**When in doubt — run it.** A 20-minute spec session prevents a 2-day
debugging session later.

---

## Step-by-Step Usage

### Step 1 — Gather your inputs

You need three things:

| Input | What it is | Where to get it |
|---|---|---|
| PRD.md | Your product requirements | Output of PRD Generator prompt |
| SSOT section | Section 0 of ARCHITECTURE.md | Output of Architect prompt |
| Feature ID | Which feature to spec (e.g. F-005) | Your PROGRESS.md |

You do not need to paste the full ARCHITECTURE.md — just Section 0 (the SSOT).

### Step 2 — Open your AI assistant

Start a fresh context window. Paste in this order:

```
[Feature Spec Master Prompt — full contents]

---
PRD (or the relevant feature section):
[paste PRD.md or the specific feature section]

---
SSOT from ARCHITECTURE.md:
[paste Section 0 only]

---
Feature to spec: F-005 — Shift Swap Requests
```

### Step 3 — Answer the question batches

The prompt will ask questions in batches of 3–4. It will not write the spec until
all gaps are resolved. Answer specifically — vague answers produce vague specs.

Typical batches cover:
- **Batch 1:** Actor flow, sequencing, and timing
- **Batch 2:** Concurrent operations and permissions
- **Batch 3:** Notifications, data, and failure handling

### Step 4 — Trigger the spec

When the prompt signals it has no more questions, type:

```
Phase 0 complete. Generate the spec.
```

### Step 5 — Save the output

Create a `specs/` folder in your project root if it does not exist.
Save the output as:

```
specs/FEATURE-SPEC-[F-ID]-[feature-name].md
```

Example: `specs/FEATURE-SPEC-F-005-shift-swaps.md`

Commit it to your repo. It is part of the feature, not a temporary document.

---

## How to Use the Spec in Coding Sessions

### In TASK MODE (building the feature)

Paste the spec alongside the SSOT at the start of your session:

```
MODE: TASK

[SSOT section from ARCHITECTURE.md]

---
[FEATURE-SPEC-F-005-shift-swaps.md — full contents]

---
Task: Build T-014 — swap-request.controller.ts
```

The Code Enforcer now checks code against both:
- Your SSOT conventions (naming, module boundaries, API envelope)
- Your feature spec (API contract shape, correct error codes, right status values)

If the controller uses the wrong error code from Section 3, that is a Tier 1
SSOT violation. If the response shape does not match the spec, that is caught
immediately — before you move to the next file.

### In REVIEW MODE (checking the feature before merge)

```
MODE: REVIEW

[SSOT section]

---
[FEATURE-SPEC-F-005-shift-swaps.md]

---
[paste all files from the scheduling module for this feature]
```

The Enforcer and QA agent check every file against the spec.
The acceptance criteria in Section 10 become the review checklist.

### With the Code Evaluator (pre-launch audit)

```
[Code Evaluator prompt]

---
[PRD.md]

---
[FEATURE-SPEC-F-005-shift-swaps.md]

---
[code files for this feature]
```

The Validator scores Section 10's acceptance criteria — each unchecked criterion
is a finding in the audit report. This is how the spec connects to your final
production readiness score.

---

## What Each Section of the Spec Does

### Section 1 — Feature Summary
One paragraph written for a developer seeing this feature for the first time.
Answers: what is it, who uses it, why does it exist.

### Section 2 — Actors and Permissions
A table of who can do what — and what happens when the wrong person tries.
Includes the exact HTTP status code and error code for every permission violation.
This is what the Enforcer checks against when reviewing auth middleware placement.

### Section 3 — API Contract
The exact shape of every endpoint. Not prose — actual field names, types,
validation rules, and error responses. Written using your SSOT envelope format.
This is the contract the controller and service layer are built against.

### Section 4 — State Machine
A Mermaid diagram plus a transition table. Every status value, every trigger,
every actor, every side effect (notifications, jobs, cascading updates).
Required for any entity with more than two states. No prose substitutes.

### Section 5 — Happy Path Flow
The normal success scenario, step by step. One action per line. Includes
side effects at each step. Lets a developer trace the full flow before
writing a single line of code.

### Section 6 — Edge Case Table
Every way the feature can be triggered incorrectly or hit an unexpected state.
Organised by category: wrong role, duplicate action, concurrent operation,
external failure, mid-flow state changes.
Each row has a scenario, precondition, expected behaviour, HTTP code, and
error code. Nothing is left as "handled gracefully."

### Section 7 — Module Impact Map
Which backend modules are touched and how. Prevents cross-module import
violations before they happen. Defines exactly which new methods need to be
added to which service and repository files.

### Section 8 — Schema Changes
New tables, new columns, new indexes — with Prisma definitions and reasons.
Flags any new shared types that need to be added to ARCHITECTURE.md.
If no changes are needed, states that explicitly.

### Section 9 — Pre-Written Test Cases
Unit tests, integration tests, and E2E tests — written as descriptions, not
code. Specific enough that a developer or AI assistant knows exactly what to
verify and what the pass condition is.

### Section 10 — Acceptance Criteria
The binary checklist that defines "done." Every criterion follows the format:
"Given [condition], when [action], then [outcome]." Every edge case and every
state transition maps to at least one criterion. The Validator scores against this.

### Section 11 — Out of Scope
Explicitly names what this feature does NOT include. Prevents scope creep
during the build and gives the Validator a clear boundary.

### Section 12 — Dependencies
What must exist before this feature can be built. Flags blockers clearly.
Links to feature IDs and task IDs in PROGRESS.md.

---

## Updating the Spec Mid-Build

Sometimes a technical discovery during coding changes what the spec says.
A new edge case surfaces. The API contract needs an extra field. A state
transition was missed.

When this happens:

1. Update the relevant section in the spec file
2. Bump the spec version number (1.0 → 1.1) at the top
3. Log the change in CHANGELOG.md:
   ```
   [Architect] | CHANGE | FEATURE-SPEC-F-005 v1.1 — Added E-17:
   concurrent approval attempt when request is being approved. 409 INVALID_STATE_TRANSITION.
   ```
4. Update the acceptance criteria if the change affects what "done" means
5. Re-run the Enforcer on any code already written that touches the changed section

Do not silently update the spec. Version it and log it. Future you — and any
developer joining mid-project — needs to know what changed and why.

---

## Commands You Can Use Mid-Session

After generating the spec, you can continue using the Feature Spec prompt in
the same session to refine it:

```
add edge case: employee tries to swap a shift they were assigned to after the schedule published but before their confirmation
→ Adds a new row to Section 6 with scenario, expected behaviour, and error code

update acceptance criteria: AC-08 — also require that the audit log entry
is written for the APPROVED transition
→ Updates AC-08 in Section 10

bump version: added two edge cases for concurrent approval
→ Increments spec version to 1.1, logs the change

export test cases
→ Outputs only Section 9 in a clean format ready to paste into your test file

check coverage: AC-01, AC-02, AC-07, AC-08
→ Confirms which of these criteria are covered by the test cases in Section 9
```

---

## Common Mistakes to Avoid

**Rushing Phase 0**
Vague answers to Phase 0 questions produce vague edge case tables and incomplete
state machines. The spec is only as good as the answers it was built from.
Take the 15 minutes. Answer specifically.

**Not saving the spec to the repo**
The spec is part of the feature. It belongs in `specs/` alongside your code.
A spec that exists only in a chat window is lost the moment the session closes.

**Skipping the spec for "medium" features**
The spec is most valuable for features that look medium-sized but have hidden
complexity. Swap requests look like a simple CRUD operation until you map the
state machine and find seven terminal states and twelve edge cases.

**Not loading the spec in TASK MODE sessions**
The spec is useless if you do not paste it into coding sessions. The Code Enforcer
cannot check API contract compliance if it has not read the contract. Make it a habit:
SSOT + spec before every session that touches this feature.

**Treating the spec as frozen**
The spec is a living document. When you discover something the spec missed,
update it, version it, and log it. A spec that diverges from the code is worse
than no spec — it creates false confidence.

---

## Quick-Start Checklist

Before running the prompt:
- [ ] PRD.md is complete
- [ ] ARCHITECTURE.md with SSOT section exists
- [ ] Feature ID confirmed in PROGRESS.md
- [ ] Feature meets "when to use it" criteria

Running Phase 0:
- [ ] Pasted prompt + PRD + SSOT + feature ID
- [ ] Answered all question batches specifically
- [ ] No unresolved ambiguities remain
- [ ] Typed "Phase 0 complete. Generate the spec."

After receiving the spec:
- [ ] `specs/` folder created in project root
- [ ] Spec saved as `FEATURE-SPEC-[F-ID]-[name].md`
- [ ] Spec committed to repo
- [ ] Dependencies in Section 12 checked against PROGRESS.md
- [ ] New shared types in Section 8 (if any) added to ARCHITECTURE.md

Using the spec:
- [ ] Pasted into every TASK MODE session for this feature
- [ ] Pasted into Code Evaluator when auditing this feature
- [ ] Updated and versioned whenever something changes mid-build

---

## How This Fits in CODE-SMITH

```
STEP 1          STEP 2            STEP 2.5             STEP 3          STEP 4
PRD          Architect         Feature Spec         Agent           Code
Generator  →  Prompt       →   Prompt (this)   →  Workflows    →  Evaluator

PRD.md    ARCHITECTURE.md   FEATURE-SPEC-       CHANGELOG.md   Audit Report
                            [F-ID].md           PROGRESS.md
```

Step 2.5 is not mandatory for every feature. Use it for any feature complex
enough to have ambiguity. The output feeds directly into Step 3 (TASK MODE
coding sessions) and Step 4 (the Validator's audit against acceptance criteria).

The three documents a TASK MODE session needs:
1. SSOT from `ARCHITECTURE.md` — how to write the code
2. `FEATURE-SPEC-[F-ID].md` — what the code must do
3. Current sprint tasks from `PROGRESS.md` — what to build today

That is the entire context. No full PRD. No full blueprint. Just the contract
and the conventions — enough to build the feature correctly, nothing more.

---

*One spec per feature. Built once. Used every session.*
*The contract that turns assumptions into requirements.*