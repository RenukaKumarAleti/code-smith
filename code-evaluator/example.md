# Project Validator & Audit Master Prompt — Complete Flow Example

> **About this document:** This is a real-world walkthrough of the full audit flow using a fictional but realistic project — a **Task Management SaaS App called "Taskly"**. Follow the conversation from start to finish to understand exactly how to use the prompt in practice.

---

## The Project: Taskly

**What it is:** A SaaS task management web app where teams can create projects, assign tasks, set deadlines, and track progress. Think of it as a simplified Trello + Asana hybrid.

**Tech Stack:** React (frontend), Node.js + Express (backend), PostgreSQL (database), JWT for auth, hosted on AWS.

---

## STEP 1 — Developer Submits the PRD

The developer pastes the following PRD into the chat:

---

> **Taskly PRD (v1.2)**
>
> **Overview:** Taskly allows teams to manage work through projects and tasks. Users can register, log in, create projects, add tasks to projects, assign tasks to team members, set due dates, and mark tasks as complete.
>
> **Features:**
> 1. User registration and login with email/password.
> 2. Users can create, edit, and delete projects.
> 3. Users can create tasks inside projects with a title, description, due date, and assignee.
> 4. Tasks can be marked as To Do, In Progress, or Done.
> 5. Users receive email notifications when a task is assigned to them.
> 6. A dashboard shows all tasks assigned to the logged-in user across all projects.
> 7. Admins can manage team members — invite, remove, and change roles.
> 8. Basic search to find tasks by title.
>
> **Out of Scope:** Mobile app, time tracking, file attachments, billing/subscriptions.

---

## STEP 2 — AI Response: Phase 0 Pre-Audit Clarification

The AI reads the PRD and immediately begins asking clarifying questions **before touching any code.**

---

**🤖 AI:**

Thanks for sharing the Taskly PRD. Before I begin the audit, I have some clarifications on flows and features that are ambiguous or underspecified. Let's work through these in small batches.

**Batch 1 of 3 — Roles & Permissions:**

1. **Admin vs Member scope:** The PRD mentions Admins can invite, remove, and change roles — but it doesn't define what roles exist beyond "Admin." Are there only two roles (Admin and Member), or are there others like "Viewer" or "Project Manager"? This affects how authorization is audited throughout the codebase.

2. **Project ownership:** When a user creates a project, are they automatically its Admin? Or is there a separate concept of a "Project Owner" that is distinct from the organization-level Admin?

3. **Cross-project visibility:** Can a Member see all projects in the organization, or only projects they have been explicitly added to? The PRD does not specify this, and it has major security implications.

---

## STEP 3 — Developer Answers Batch 1

**👨‍💻 Developer:**

1. There are only two roles: **Admin** and **Member**. Admins have full access; Members can only manage their own tasks.
2. Yes, the user who creates a project is automatically its Admin for that project.
3. Members can only see projects they have been explicitly added to.

---

## STEP 4 — AI Asks Batch 2

**🤖 AI:**

Got it — clear role separation. Moving to the next batch.

**Batch 2 of 3 — Notifications & Search:**

4. **Email notification triggers:** The PRD says users get notified when a task is assigned to them. Are there any other notification triggers — like when a due date is approaching, or when a task they own is marked Done? Or is assignment the only trigger?

5. **Search scope:** The PRD mentions "basic search to find tasks by title." Does this search across all tasks the user has access to (across projects), or is it scoped to a single active project at a time?

6. **Task deletion:** The PRD covers project deletion but does not mention task deletion. Can individual tasks be deleted? And if a project is deleted, what happens to its tasks — are they cascade-deleted, or soft-deleted and recoverable?

---

## STEP 5 — Developer Answers Batch 2

**👨‍💻 Developer:**

4. Assignment is the only notification trigger for now. No due date reminders yet.
5. Search is global — it searches across all projects the user has access to.
6. Yes, tasks can be deleted individually. When a project is deleted, all its tasks are **hard deleted** via cascade. No soft delete or recovery.

---

## STEP 6 — AI Asks Batch 3

**🤖 AI:**

Understood. One final batch before I'm confident to proceed.

**Batch 3 of 3 — Assumption Flags:**

7. **Assumption — JWT strategy:** I'm assuming the app uses short-lived access tokens with a refresh token rotation strategy. If it's using a single long-lived JWT with no refresh mechanism, I'll flag that differently in the security audit. Can you confirm?

8. **Assumption — Email provider:** I'm assuming a third-party provider (like SendGrid or AWS SES) is used for email notifications, not a raw SMTP setup. Is that correct?

9. **Unanswered edge case — Assignee removal:** If a task is assigned to a Member, and that Member is later removed from the organization by an Admin, what happens to their assigned tasks? The PRD does not address this at all.

---

## STEP 7 — Developer Answers Batch 3

**👨‍💻 Developer:**

7. Single long-lived JWT. No refresh tokens. Token expiry is set to 7 days.
8. We use **SendGrid** for emails, yes.
9. Good catch — we haven't handled that. Tasks remain assigned to the removed user. It's a known loose end we haven't solved.

---

## STEP 8 — Developer Triggers Phase 1

**👨‍💻 Developer:**

> "Phase 0 is complete. Proceed to intake."

---

## STEP 9 — AI Response: Phase 1 Intake & Context Gathering

**🤖 AI:**

Perfect — all PRD ambiguities are resolved. Now let me establish the technical context.

**Intake Batch 1:**

1. **Deployment environment:** Is this deployed on AWS (EC2, ECS, Lambda, or something else)? And is there a staging environment separate from production?

2. **Project stage:** Is Taskly live in production with real users, in beta, or still in development/MVP stage?

3. **Known concerns:** Are there specific areas you're already worried about — performance, security, a particular feature that felt rushed?

---

## STEP 10 — Developer Answers Phase 1

**👨‍💻 Developer:**

1. AWS EC2 with a single instance. No load balancer yet. Staging and production share the same `.env` file with different values manually swapped. No separate staging environment.
2. We have **50 real users** in early production. Soft-launched 3 weeks ago.
3. We're worried about the auth system. We also shipped the search feature in a hurry and didn't write any tests for it.

---

## STEP 11 — Developer Triggers Phase 2

**👨‍💻 Developer:**

> "Phase 1 is complete. Run the audit."

---

## STEP 12 — AI Generates the Full Audit Report

---

# 📋 Taskly — Production Audit Report

**Audited by:** AI Expert Architect & Security Auditor
**Project:** Taskly v1.2
**Stage:** Early Production (50 users, 3 weeks live)
**Date:** 2025-07-15

---

## Scoring System

| Score | Grade | Meaning |
|-------|-------|---------|
| 90–100 | A | Production-ready / Excellent |
| 75–89 | B | Good with minor gaps |
| 60–74 | C | Functional but needs work |
| 40–59 | D | Significant issues present |
| 0–39 | F | Critical failures / Not production-safe |

---

## Section 1: PRD Compliance Score

Comparing the codebase against all 8 PRD requirements:

| PRD Requirement | Status | Notes |
|-----------------|--------|-------|
| 1. User registration & login | ✅ Complete | Email/password auth implemented |
| 2. Create, edit, delete projects | ✅ Complete | All three operations present |
| 3. Create tasks with title, description, due date, assignee | ⚠️ Partial | Due date field exists but is not validated — past dates are accepted |
| 4. Task status: To Do, In Progress, Done | ✅ Complete | Enum correctly implemented in DB |
| 5. Email notification on task assignment | ⚠️ Partial | SendGrid integrated but no error handling if email delivery fails silently |
| 6. Dashboard of tasks assigned to user | ✅ Complete | Query correctly scoped to logged-in user |
| 7. Admin: invite, remove, change roles | ⚠️ Partial | Invite and remove work; role change endpoint exists but has no authorization check |
| 8. Search tasks by title | ❌ Broken | Uses raw string interpolation in SQL query — returns incorrect results and introduces injection risk |
| Orphaned task handling on member removal | ❌ Missing | Not in PRD and not implemented — tasks remain dangling |
| Cascade delete on project deletion | 🚫 Undocumented | Works correctly but not documented anywhere in the codebase |

**PRD Compliance Score: 62 / 100 (Grade: C)**

---

## Section 2: Feature Implementation Quality Score

- **Task due date** accepts any date including dates in the past. No frontend or backend validation enforces future-only dates.
- **Role change endpoint** (`PATCH /api/admin/users/:id/role`) performs no check to verify the requester is actually an Admin. Any authenticated user can call it.
- **Email notifications** are fired via a `sendEmail()` call with no try/catch. If SendGrid returns a 5xx or rate limit error, the task is still saved but the notification is silently dropped — no retry, no logging.
- **Search** only handles the happy path (single keyword, clean string). Partial matches, special characters, and empty strings are not handled gracefully.
- **Dashboard query** works correctly but fetches all task columns including internal metadata. No field selection — over-fetching data on every load.

**Feature Implementation Score: 58 / 100 (Grade: D)**

---

## Section 3: Code Quality & Optimisation Score

```
📍 Location: src/api/search.js — Line 34
⚠️  Issue: Raw string interpolation used in SQL query
        `SELECT * FROM tasks WHERE title LIKE '%${query}%'`
💡 Recommendation: Use parameterized query:
        `SELECT * FROM tasks WHERE title ILIKE $1`, [`%${query}%`]
```

```
📍 Location: src/api/tasks.js — Line 78
⚠️  Issue: Dashboard endpoint fetches SELECT * — all columns including
        internal flags, timestamps, and foreign keys returned to client
💡 Recommendation: Explicitly select only required fields:
        SELECT id, title, status, due_date, assignee_id
```

```
📍 Location: src/utils/email.js — Line 12
⚠️  Issue: sendEmail() has no error handling. Unhandled promise rejection
        will crash the Node process in uncaught exception scenarios
💡 Recommendation: Wrap in try/catch with structured error logging
```

```
📍 Location: src/middleware/auth.js — Line 5
⚠️  Issue: JWT secret is hardcoded as a fallback string:
        jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey')
💡 Recommendation: Remove fallback entirely. Throw at startup if
        JWT_SECRET env var is missing
```

```
📍 Location: src/api/projects.js — Lines 102–145
⚠️  Issue: Project creation, update, and delete are three near-identical
        blocks of try/catch/respond logic with no shared abstraction
💡 Recommendation: Extract into a reusable async route handler wrapper
```

- Several files contain `// TODO: add validation here` comments that have shipped to production.
- `console.log()` statements are present in 6 production route files — no structured logging in place.

**Code Quality & Optimisation Score: 55 / 100 (Grade: D)**

---

## Section 4: Security Audit Score

```
🔴 CRITICAL

📍 Location: src/api/search.js — Line 34
🛡️  Vulnerability: SQL Injection via unparameterized LIKE query
💥 Impact: Attacker can exfiltrate entire database, drop tables,
        or bypass access controls with a crafted search string
💡 Fix: Replace with parameterized query using $1 placeholder
```

```
🔴 CRITICAL

📍 Location: src/api/admin.js — Line 67
🛡️  Vulnerability: Missing authorization check on role-change endpoint
        PATCH /api/admin/users/:id/role has no Admin role verification
💥 Impact: Any authenticated Member can promote themselves to Admin
💡 Fix: Add requireAdmin middleware to this route immediately
```

```
🟠 HIGH

📍 Location: src/middleware/auth.js — Line 5
🛡️  Vulnerability: Hardcoded JWT fallback secret 'mysecretkey'
💥 Impact: If JWT_SECRET env var is ever missing, tokens are signed
        with a known public string — trivially forgeable by anyone
💡 Fix: Remove the || 'mysecretkey' fallback. Fail loudly at startup
```

```
🟠 HIGH

📍 Location: Auth configuration
🛡️  Vulnerability: 7-day long-lived JWT with no refresh token rotation
💥 Impact: Stolen tokens remain valid for 7 days with no revocation
        mechanism. No way to log out a compromised session server-side
💡 Fix: Implement refresh token rotation with a token blacklist or
        short-lived access tokens (15 min) + refresh token (7 days)
```

```
🟡 MEDIUM

📍 Location: src/api/*.js — All route files
🛡️  Vulnerability: No rate limiting on any endpoint including login
💥 Impact: Brute force attacks on login, credential stuffing,
        and enumeration attacks are unrestricted
💡 Fix: Add express-rate-limit middleware, especially on /auth routes
```

```
🟡 MEDIUM

📍 Location: Express app configuration
🛡️  Vulnerability: No helmet.js or equivalent security headers
💥 Impact: App is missing X-Frame-Options, Content-Security-Policy,
        and X-Content-Type-Options headers
💡 Fix: Add helmet middleware — app.use(helmet())
```

```
🟢 LOW

📍 Location: API error responses
🛡️  Vulnerability: Stack traces returned in error responses in dev mode
        but NODE_ENV is not enforced — can leak in production
💡 Fix: Ensure error handler checks NODE_ENV === 'production'
        and strips stack traces before responding
```

**Security Score: 34 / 100 (Grade: F)**

---

## Section 5: Vulnerability & Loose Ends Report

| Priority | Location | Issue | Recommended Action |
|----------|----------|-------|--------------------|
| 🔴 Critical | src/api/search.js:34 | SQL Injection vulnerability | Parameterize the query immediately |
| 🔴 Critical | src/api/admin.js:67 | No auth check on role-change route | Add requireAdmin middleware |
| 🟠 High | src/utils/email.js:12 | Unhandled promise rejection in sendEmail() | Wrap in try/catch + add retry logic |
| 🟠 High | src/middleware/auth.js:5 | Hardcoded JWT fallback secret | Remove fallback, fail at startup |
| 🟠 High | Deployment | Staging and production share manually swapped .env | Set up proper environment separation |
| 🟠 High | Database | Orphaned tasks when a member is removed | Define and implement a resolution policy |
| 🟡 Medium | src/api/tasks.js:23 | Due date accepts past dates with no validation | Add server-side date validation |
| 🟡 Medium | src/api/tasks.js:78 | SELECT * on dashboard query | Specify explicit column list |
| 🟡 Medium | src/api/*.js (6 files) | console.log() in production routes | Replace with structured logger (e.g., pino, winston) |
| 🟡 Medium | Entire codebase | No rate limiting on any endpoint | Add express-rate-limit middleware |
| 🟡 Medium | Express config | No security headers (helmet) | Add helmet middleware |
| 🟢 Low | src/api/projects.js:102–145 | Duplicated try/catch/respond logic | Extract into shared route handler wrapper |
| 🟢 Low | Multiple files | TODO/FIXME comments in production | Resolve or convert to tracked issues |
| 🟢 Low | No tests | Search feature has zero test coverage | Write unit + integration tests for search |

---

## Section 6: Improvements & Recommendations

**🔴 Immediate (Fix before next user session):**
- Patch the SQL injection in `search.js` — this is an open door to the entire database right now.
- Add the `requireAdmin` middleware to the role-change endpoint — any Member can currently make themselves Admin.

**🟠 Short-Term (This week):**
- Remove the hardcoded JWT fallback secret.
- Wrap `sendEmail()` in try/catch with logging and a basic retry mechanism.
- Add `express-rate-limit` to all auth endpoints.
- Add `helmet` middleware to the Express app — single line, immediate benefit.
- Implement proper environment separation — do not manually swap `.env` files between staging and production.
- Define and implement the orphaned task policy for removed members (reassign to project Admin, or unassign).

**🟡 Medium-Term (Next 1–2 sprints):**
- Migrate from long-lived JWT to short-lived access token + refresh token rotation.
- Add server-side validation for task due dates.
- Replace all `SELECT *` queries with explicit field selection.
- Replace `console.log()` with a structured logger (pino or winston).
- Write unit and integration tests for the search feature.

**🟢 Long-Term (Backlog):**
- Move from a single EC2 instance to an auto-scaling group behind a load balancer.
- Set up a proper CI/CD pipeline — currently deployments appear to be manual.
- Introduce a staging environment that mirrors production with isolated data.
- Add an audit log table to track Admin actions (role changes, member removal).
- Evaluate soft-delete strategy for projects and tasks to support recovery flows.

---

## Section 7: Overall Production-Readiness Score

| Category | Score | Grade |
|----------|-------|-------|
| PRD Compliance | 62 / 100 | C |
| Feature Implementation Quality | 58 / 100 | D |
| Code Quality & Optimisation | 55 / 100 | D |
| Security | 34 / 100 | F |
| Vulnerability & Loose Ends | 48 / 100 | D |
| **Overall Production-Readiness** | **51 / 100** | **D** |

---

### Executive Summary

Taskly has a solid product foundation — the core project and task management flows are implemented and functional, and the database schema is well-structured for the use case. However, two critical security vulnerabilities — an open SQL injection in the search feature and an unauthorized role-escalation endpoint — make the current build unsafe for continued production use and must be patched immediately before any further user growth. With the two critical fixes applied and the short-term hardening items addressed over the next sprint, Taskly can reach a B-grade production-readiness level; as it stands today, it is **not safe for production** in its current state.