# PRD Generator Master Prompt — Full Example Walkthrough

**Project:** ShiftSync — B2B Workforce Scheduling SaaS for SMBs
**Document Type:** Example conversation showing question batches → developer answers → final PRD

---

## How to Read This File

This file shows the complete conversation flow when using the PRD Generator Master Prompt.
Each section shows:
- The prompt's question batch
- The founder/PM's answers
- The final enterprise PRD output

---

## Initial Input (What the Founder Typed)

> "I want to build a scheduling app for small businesses — restaurants, retail shops, that kind of thing. Managers post shifts, employees pick them up or get assigned. They can swap shifts, request time off, and managers approve everything. I want to charge monthly per location."

---

## Batch 1 of 7 — Problem & Users

**PRD Generator:**

Before I build your PRD, I need to resolve gaps across 7 areas. I'll go in batches.

**Batch 1 / 7 — Problem & Users**

1. Who are the primary users? You've mentioned managers and employees — are there additional roles (e.g. owner/admin who manages multiple locations, HR, payroll staff)? What permissions differ between them?

2. What is the core problem being solved — is this replacing pen-and-paper/WhatsApp group scheduling, an existing tool like Deputy or 7shifts, or a manual spreadsheet process? What's the primary pain point: last-minute no-shows, scheduling conflicts, labour law compliance, or something else?

3. What is the typical business profile of your target customer — number of employees per location, industry mix (restaurants vs. retail vs. other), and are these owner-operated single locations or multi-location chains?

---

**Founder's Answer:**

> Three roles: Owner (manages billing + all locations), Manager (builds schedules, approves requests), Employee (views schedule, claims open shifts, requests time off, swaps). Most customers replacing WhatsApp groups and spreadsheets — main pain is managers spending 2-3 hours/week manually coordinating. Target: 5-50 employees per location, mostly restaurants and retail, mix of single-location and small chains (2-5 locations). Chains need the owner to see all locations in one dashboard.

---

## Batch 2 of 7 — Core Features

**PRD Generator:**

**Batch 2 / 7 — Core Features**

4. For shift creation: should managers be able to create repeating/template schedules (e.g. "every Tuesday same as last week"), or is every week built from scratch? Is drag-and-drop scheduling in scope for v1?

5. For shift swaps and open shifts: when an employee requests a swap, does it auto-approve if both parties agree, or does a manager always need to approve the final step? For open shifts, can any eligible employee claim them, or do managers control eligibility (by role, skill, or hours already worked)?

6. What notifications are required — push, SMS, email? Is real-time chat between managers and employees in scope, or is messaging out of scope for v1?

---

**Founder's Answer:**

> Template schedules yes — "copy last week" with ability to edit. Drag-and-drop is a nice-to-have, not v1 blocker. Shift swaps need manager final approval always. Open shifts: manager defines who's eligible by role (e.g. only "Barista" role can claim barista shifts). Notifications: push + email for v1, SMS is v2. No chat — out of scope entirely.

---

## Batch 3 of 7 — User Flows & Business Logic

**PRD Generator:**

**Batch 3 / 7 — User Flows & Business Logic**

7. Time-off requests: what types are needed (paid leave, unpaid, sick, etc.)? Does the system need to track leave balances and deduct them, or just route the approval workflow?

8. For scheduling rules: should the system enforce minimum rest between shifts (e.g. no shifts within 8 hours of each other), maximum weekly hours, or overtime warnings? Are these configurable per location or global?

9. Employee onboarding: how do employees join — does the manager invite them by email, or can employees self-register with a location code? What happens to historical data when an employee leaves?

---

**Founder's Answer:**

> Time-off types: Paid, Unpaid, Sick. No balance tracking in v1 — just approval workflow. Scheduling rules: overtime warning (configurable threshold, default 40hrs/week) and min-rest-between-shifts (configurable, default 8hrs) — these are warnings, not hard blocks. Configurable per location. Employees join by manager email invite only. When an employee is removed, their historical shifts are retained but anonymised after 90 days.

---

## Batch 4 of 7 — Integrations

**PRD Generator:**

**Batch 4 / 7 — Integrations**

10. Payroll integration: is exporting shift/hours data to payroll systems (QuickBooks, Gusto, ADP, etc.) required for v1, or is a CSV export sufficient as the bridge?

11. Calendar sync: should published schedules sync to employee personal calendars (Google Calendar, Apple Calendar, Outlook)? One-way or two-way?

12. Time & attendance: is clock-in/clock-out (with GPS geofencing or QR code at location) in scope for v1, or is ShiftSync purely scheduling with no time-tracking?

---

**Founder's Answer:**

> Payroll: CSV export only for v1. We'll add Gusto/QuickBooks native integration in v2. Calendar sync: yes, one-way push to Google Calendar and Apple Calendar for employees when their schedule is published. Clock-in/out: out of scope for v1. Scheduling only.

---

## Batch 5 of 7 — Business Context

**PRD Generator:**

**Batch 5 / 7 — Business Context**

13. Pricing and billing: you mentioned monthly per location — what's the intended price point? Is billing handled in-app (Stripe), or invoiced manually? Are there plans to offer a free tier or trial?

14. Who are the 2-3 competitors you're most concerned about, and what is ShiftSync's differentiator — lower price, better UX for non-tech owners, specific industry focus, something else?

15. What is the go-to-market motion — direct sales, product-led growth (self-serve trial), or channel partners (POS vendors, restaurant groups)?

---

**Founder's Answer:**

> Pricing: $29/month per location, annual plan at $279. Stripe for billing, in-app. 14-day free trial, no credit card required. Competitors: 7shifts (restaurant-focused, expensive), Deputy (too complex for SMBs), Homebase (closest comp). Differentiator: dead-simple UX, 10-minute setup promise, and owner multi-location dashboard done right. GTM: PLG — self-serve trial, then content marketing + Google Ads targeting "restaurant scheduling software" keywords.

---

## Batch 6 of 7 — Compliance & Security

**PRD Generator:**

**Batch 6 / 7 — Compliance & Security**

16. Data residency: will ShiftSync serve customers in the EU/UK, triggering GDPR obligations, or is the initial market US-only?

17. Labour law compliance: some US states (California, Oregon, NY) have predictive scheduling laws requiring advance notice of schedules. Should the system surface warnings when a schedule is published with insufficient notice (e.g. less than 14 days advance)?

18. Data sensitivity: ShiftSync will store employee names, contact details, and work schedules. Is any additional PII collected — date of birth, government ID, wage/salary data? What are the data retention requirements?

---

**Founder's Answer:**

> US-only for v1. GDPR not in scope yet. Predictive scheduling warnings: yes, include a configurable notice-period warning (default 14 days, admin can adjust). No wage/salary data stored. PII collected: name, email, phone, role, employment type (full-time/part-time). No DOB or government ID. Retention: active data indefinitely, deleted employee data anonymised after 90 days (already confirmed above).

---

## Batch 7 of 7 — Timeline & Scale

**PRD Generator:**

**Batch 7 / 7 — Timeline & Scale**

19. What is the target launch date for v1, and what does the development team look like — solo founder with contractors, small in-house team, or agency build?

20. Scale expectations at launch and 12 months: how many locations and total employees should the system comfortably handle? What are the expected peak load moments (e.g. Monday morning when managers publish the week's schedule)?

21. What is the stack preference or constraint — any existing choices made for frontend, backend, database, or hosting? Or is the architecture fully open?

---

**Founder's Answer:**

> Target: public beta in 4 months. Team: solo founder + 2 contract developers. Scale: comfortable at 500 locations / 25,000 employees at launch, targeting 5,000 locations / 250,000 employees at 12 months. Peak load: Monday mornings when schedules publish and notifications fan out to all employees. Stack: React + TypeScript frontend, Node.js backend, PostgreSQL, hosted on AWS. No hard constraints beyond that.

---

## All Gaps Resolved — Generating PRD

**PRD Generator:**

All 7 discovery areas are complete. No unresolved ambiguities. Generating your enterprise PRD now.

---

---

# ShiftSync — Product Requirements Document

**Version:** 1.0
**Status:** Draft — Pending Stakeholder Review
**Date:** [Current Date]
**Author:** PRD Generator Master Prompt
**Project Type:** B2B SaaS — Workforce Scheduling — SMB / Multi-Tenant

---

## Table of Contents

1. Executive Summary
2. Problem Statement
3. Goals & Success Metrics
4. Target Users, Personas & Permission Matrix
5. Market & Business Context
6. Scope
7. User Stories
8. Feature Requirements
9. User Flows
10. Non-Functional Requirements
11. Compliance
12. Integrations
13. Data Requirements
14. Milestones & Timeline
15. Open Questions
16. Risks & Mitigations

---

## 1. Executive Summary

ShiftSync is a B2B SaaS workforce scheduling platform built for small and medium-sized businesses in the restaurant and retail sectors. It replaces informal, error-prone scheduling via WhatsApp groups and spreadsheets with a structured, role-aware scheduling workflow that managers can operate in under 10 minutes per week.

The product is multi-tenant, supporting owners who manage multiple locations under a single account and billing relationship. Core capabilities include template-based schedule creation, shift claiming and swapping with manager approval, time-off request routing, one-way calendar sync to Google and Apple Calendar, and automated scheduling-rule warnings (overtime, rest period, predictive scheduling notice).

ShiftSync is priced at $29/month per location (or $279/year), billed via Stripe, with a 14-day no-credit-card-required free trial. The go-to-market motion is product-led growth targeting US-based SMBs, competing primarily against 7shifts and Deputy on simplicity and setup speed.

**v1 target:** Public beta in 4 months, built by a solo founder and 2 contract developers. Stack: React + TypeScript, Node.js, PostgreSQL, AWS.

---

## 2. Problem Statement

### The Problem

Small business owners and managers in restaurants and retail spend 2–3 hours per week manually coordinating employee schedules. The current state — WhatsApp groups for shift swaps, spreadsheets for weekly rosters, individual texts for time-off requests — creates three compounding failure modes:

- **Last-minute no-shows** caused by miscommunication in informal channels
- **Manager time drain** from repeated back-and-forth on scheduling changes
- **No visibility** for owners running multiple locations — each location is a blind spot

### The Gap Existing Tools Leave

Enterprise-grade solutions (Deputy, 7shifts) are either over-engineered for the 5–50 employee SMB, too expensive at scale, or require multi-day onboarding. SMBs need something that works from day one with minimal training.

### The ShiftSync Proposition

ShiftSync reduces manager scheduling time from ~2.5 hours/week to under 30 minutes via template scheduling, structured approval workflows, and automated rule-checking — with a 10-minute setup promise as the core brand differentiator.

---

## 3. Goals & Success Metrics

### Business Goals

| Goal | Metric | Target |
|------|--------|--------|
| Achieve product-market fit | Free trial → paid conversion rate | ≥ 25% within 90 days of beta |
| Revenue milestone | MRR | $15,000 by month 6 post-launch |
| Retention | Monthly location churn rate | < 3% |
| Scale infrastructure | Supported locations | 500 at launch; 5,000 at month 12 |

### Product Goals

| Goal | Metric | Target |
|------|--------|--------|
| Deliver on 10-min setup promise | Median time from signup to first published schedule | ≤ 10 minutes |
| Reduce manager scheduling time | Self-reported time on scheduling per week | ≤ 30 minutes (from ~2.5 hours) |
| Notification reliability | Push + email delivery rate | ≥ 99% within 5 minutes of trigger |
| System availability | Uptime | 99.9% monthly SLA |

### Anti-Goals (What Success Is NOT)

- ShiftSync v1 does not aim to replace payroll software
- ShiftSync v1 does not include time and attendance (clock-in/out)
- ShiftSync v1 does not include in-app messaging or chat

---

## 4. Target Users, Personas & Permission Matrix

### Personas

**Persona 1 — The Owner (Maria, 42)**
Owns 3 restaurant locations. Spends Monday mornings reviewing how each location is staffed. Currently uses phone calls to check in with each manager. Primary need: a single dashboard showing all location schedules and flagged issues without having to log into each location separately.

**Persona 2 — The Manager (James, 28)**
Floor manager at a 22-person café. Builds the schedule every Thursday for the following week. Spends most of his scheduling time on swap requests over text. Primary need: build a schedule fast using last week as a template, approve/deny requests in one place, and know the schedule has been communicated automatically.

**Persona 3 — The Employee (Sofia, 22)**
Part-time retail worker with a variable schedule. Checks her schedule on her phone. Sometimes needs to swap shifts when her college schedule changes. Primary need: see her upcoming schedule clearly, submit requests without chasing her manager on WhatsApp, and get notified when her schedule changes.

### Permission Matrix

| Action | Owner | Manager | Employee |
|--------|-------|---------|----------|
| Create/edit locations | ✅ | ❌ | ❌ |
| Manage billing | ✅ | ❌ | ❌ |
| View all location dashboards | ✅ | ❌ (own location only) | ❌ |
| Create/edit/delete shifts | ✅ | ✅ | ❌ |
| Publish schedule | ✅ | ✅ | ❌ |
| Copy last week's schedule | ✅ | ✅ | ❌ |
| Approve/deny shift swaps | ✅ | ✅ | ❌ |
| Approve/deny time-off requests | ✅ | ✅ | ❌ |
| Post open shifts | ✅ | ✅ | ❌ |
| Claim open shifts | ❌ | ❌ | ✅ (if eligible by role) |
| Request shift swap | ❌ | ❌ | ✅ |
| Submit time-off request | ❌ | ❌ | ✅ |
| View own schedule | ✅ | ✅ | ✅ |
| Invite employees | ✅ | ✅ | ❌ |
| Remove employees | ✅ | ✅ | ❌ |
| Configure scheduling rules | ✅ | ✅ (own location) | ❌ |
| Export CSV (hours data) | ✅ | ✅ | ❌ |
| Connect calendar sync | ❌ | ❌ | ✅ (own calendar) |

---

## 5. Market & Business Context

### Market

- **TAM:** US SMB workforce scheduling software market — $2.1B (2024), growing at ~11% CAGR driven by labour compliance complexity and gig economy normalisation.
- **SAM:** US restaurants and retail businesses with 5–50 employees — approximately 850,000 locations.
- **SOM (Year 1):** 5,000 paying locations at $29/month = $1.74M ARR.

### Competitive Landscape

| Competitor | Positioning | Weakness ShiftSync Exploits |
|------------|-------------|----------------------------|
| 7shifts | Restaurant-focused, strong features | $29.99–$135/month per location; complex for <20 employees |
| Deputy | Broad industry, enterprise-grade | Steep learning curve; overkill for SMB |
| Homebase | Free tier, HR-adjacent | Free plan limitations push users to expensive tiers; cluttered UX |

### Differentiators

1. **10-minute setup promise** — onboarding designed to first published schedule in under 10 minutes
2. **Owner multi-location dashboard** — purpose-built for small chains, not bolted on
3. **Dead-simple UX** — opinionated interface with no configuration paralysis

### Business Model

- **Pricing:** $29/month per location (monthly), $279/year per location (annual — 20% discount)
- **Trial:** 14 days free, no credit card required
- **Billing:** Stripe — in-app self-serve
- **Unit economics target:** < 3 months payback period on CAC; LTV/CAC > 3x at 12 months

---

## 6. Scope

### In Scope — v1

- Multi-tenant SaaS with Owner / Manager / Employee roles
- Location management (Owner creates/edits locations; each location is independently schedulable)
- Template-based schedule creation ("copy last week")
- Open shift posting and claiming (by role eligibility)
- Shift swap requests with mandatory manager approval
- Time-off requests (Paid, Unpaid, Sick) — approval workflow only, no balance tracking
- Scheduling rule warnings: overtime threshold and minimum rest between shifts (configurable per location; warnings only, not hard blocks)
- Predictive scheduling notice warning (configurable advance notice window, default 14 days)
- Employee invite via email
- Push and email notifications for all schedule events
- One-way calendar sync: published schedule → Google Calendar and Apple Calendar (employee opt-in)
- CSV export of shift/hours data for payroll
- Stripe billing: trial, subscription, upgrade/downgrade, cancellation
- Mobile-responsive web application (no native app in v1)

### Out of Scope — v1

- Native iOS/Android mobile applications
- SMS notifications
- Time and attendance / clock-in / clock-out
- Payroll system native integrations (Gusto, QuickBooks, ADP)
- In-app messaging or chat
- Leave balance tracking and accrual
- Drag-and-drop schedule builder (nice-to-have; deferred to v1.1)
- GDPR compliance (EU/UK market not targeted in v1)
- Wage and salary data
- AI-based schedule suggestions or demand forecasting

### Assumptions

- All users access ShiftSync via web browser (desktop and mobile-responsive)
- Managers publish schedules at least 14 days in advance for predictive scheduling warnings to be meaningful
- Employees have an email address for account creation and notifications
- Payment is per location, not per user seat — unlimited users per location within plan

### Dependencies

- Stripe API for billing and subscription management
- Firebase Cloud Messaging (FCM) or equivalent for push notifications
- SendGrid (or equivalent) for transactional email
- Google Calendar API and Apple CalDAV for calendar sync
- AWS infrastructure (ECS / RDS / S3 / CloudFront)

### Constraints

- 4-month build timeline with 2 contract developers
- v1 stack locked: React + TypeScript, Node.js, PostgreSQL, AWS
- No native mobile app — web-only to contain scope

---

## 7. User Stories

**Priority Coding:** 🔴 Must-Have (MVP blocker) | 🟡 Should-Have (launch quality) | 🟢 Nice-to-Have (v1.1)

### Owner Stories

| # | Story | Priority |
|---|-------|----------|
| O-1 | As an Owner, I can create and name locations, so that each business site has its own scheduling environment | 🔴 |
| O-2 | As an Owner, I can view a dashboard of all locations showing current week staffing at a glance | 🔴 |
| O-3 | As an Owner, I can manage billing, upgrade plans, and view invoice history | 🔴 |
| O-4 | As an Owner, I can promote an Employee to Manager or demote a Manager back to Employee | 🟡 |

### Manager Stories

| # | Story | Priority |
|---|-------|----------|
| M-1 | As a Manager, I can build a weekly schedule by copying last week's schedule as a starting template | 🔴 |
| M-2 | As a Manager, I can create, edit, and delete individual shifts including role, start time, end time, and assigned employee | 🔴 |
| M-3 | As a Manager, I can post open (unassigned) shifts that eligible employees can claim | 🔴 |
| M-4 | As a Manager, I can publish a schedule so that all employees are notified and it syncs to their calendars | 🔴 |
| M-5 | As a Manager, I can see a warning when a shift assignment would result in an overtime threshold breach | 🔴 |
| M-6 | As a Manager, I can see a warning when a shift is scheduled with less than the minimum rest period after another shift | 🔴 |
| M-7 | As a Manager, I can see a warning when publishing a schedule with less than the configured advance notice window | 🟡 |
| M-8 | As a Manager, I can approve or deny shift swap requests with a single tap and reason | 🔴 |
| M-9 | As a Manager, I can approve or deny time-off requests (Paid, Unpaid, Sick) | 🔴 |
| M-10 | As a Manager, I can export shift data as CSV for a selected date range for payroll processing | 🟡 |
| M-11 | As a Manager, I can invite employees by email and assign them a role | 🔴 |
| M-12 | As a Manager, I can remove an employee from the location (their data is retained and anonymised after 90 days) | 🟡 |
| M-13 | As a Manager, I can configure overtime threshold and minimum rest period rules for my location | 🟡 |

### Employee Stories

| # | Story | Priority |
|---|-------|----------|
| E-1 | As an Employee, I can view my upcoming schedule for the current and next 4 weeks | 🔴 |
| E-2 | As an Employee, I can claim an open shift that matches my assigned role | 🔴 |
| E-3 | As an Employee, I can request a shift swap with a specific co-worker and a reason | 🔴 |
| E-4 | As an Employee, I can submit a time-off request (Paid, Unpaid, Sick) with a date range and reason | 🔴 |
| E-5 | As an Employee, I receive push and email notifications when my schedule is published, changed, or a request is actioned | 🔴 |
| E-6 | As an Employee, I can connect my Google or Apple Calendar to receive my schedule as calendar events | 🟡 |
| E-7 | As an Employee, I can see the status (Pending, Approved, Denied) of all my submitted requests | 🔴 |

---

## 8. Feature Requirements

---

### Feature 1: Schedule Builder

**Functional Requirements:**
- Manager can view a weekly calendar grid for their location, scrollable by week
- Manager can create a shift by selecting a day, time slot, assigning a role and optionally an employee
- Manager can copy the previous week's schedule into the current week as an editable template
- All shifts in a draft state are visible only to managers and owners until published
- Manager can delete any shift in draft state; published shifts can be edited with an edit reason captured

**Acceptance Criteria:**
- Copy last week creates an identical grid of shifts with draft status; any subsequent employee assignment changes do not affect the original week's record
- Draft schedule shows a clear visual state distinguishing it from published state
- When a shift is edited after publishing, the assigned employee receives a notification of the change

**Edge Cases:**
- Copy last week when no previous week exists → UI shows empty template with helpful prompt
- Copying a week that had open (unassigned) shifts → copies shift structure with no assignee; posts as open shift
- Manager edits a shift while employee has already added it to their calendar → calendar event is updated via re-sync on next publish action

**Business Rules:**
- Only one draft schedule can exist per location per week; overwriting a draft replaces it after a confirmation prompt
- A shift must have a role assigned; employee assignment is optional (unassigned shifts become open shifts on publish)
- Shift duration must be between 1 hour and 16 hours

**Audit Logging:**
- Log: schedule created, shift added, shift edited (with before/after values), schedule published, schedule copied from week [X]
- Actor and timestamp on every event

---

### Feature 2: Open Shifts & Claiming

**Functional Requirements:**
- Manager can mark any draft shift as open (unassigned) before publishing
- On publish, open shifts are visible to all employees whose assigned role matches the shift's required role
- Employee can claim an open shift; claim triggers a notification to the manager for final confirmation
- Manager can confirm or reject the claim; employee is notified of the outcome

**Acceptance Criteria:**
- An employee whose role does not match the shift's required role cannot see or claim that open shift
- After a claim is confirmed by the manager, the shift appears in the employee's schedule and triggers a calendar sync event
- If a manager rejects a claim, the open shift returns to claimable state

**Edge Cases:**
- Two employees claim the same open shift simultaneously → first confirmed claim wins; second claimant is notified that the shift was filled
- Employee claims a shift and then the manager deletes the shift → employee is notified the shift was cancelled

**Business Rules:**
- An employee cannot claim a shift that conflicts with an existing approved shift in their schedule (system shows a warning and blocks the claim)
- Overtime warnings apply to the claiming employee at the point of claim; manager is shown the warning before confirming

**Audit Logging:**
- Log: open shift posted, claim submitted (by whom), claim confirmed/rejected (by whom)

---

### Feature 3: Shift Swap Requests

**Functional Requirements:**
- Employee can initiate a swap request by selecting one of their upcoming shifts and choosing a co-worker to swap with
- The target co-worker is notified and must accept or decline the swap before it reaches the manager
- Only after both employees agree does the request appear in the manager's approval queue
- Manager approves or denies the final swap; both employees are notified of the outcome

**Acceptance Criteria:**
- Swap request is only valid if both employees share the same role (or if the target shift is role-compatible)
- The swap does not take effect until manager approval; both employees' schedules reflect the change only after approval
- Manager can add a note when denying a swap

**Edge Cases:**
- Target co-worker does not respond within 48 hours → swap request auto-expires; initiating employee is notified
- Co-worker accepts but manager has already filled the shift through another mechanism → manager sees conflict warning in approval queue

**Business Rules:**
- Swaps must be initiated at least 24 hours before the earlier of the two shift start times
- Manager approval is always required — no auto-approval even if both employees agree

**Audit Logging:**
- Log: swap initiated, co-worker accepted/declined, manager approved/denied, auto-expiry event

---

### Feature 4: Time-Off Requests

**Functional Requirements:**
- Employee can submit a time-off request with type (Paid / Unpaid / Sick), date range, and optional reason
- Manager receives a notification and can approve or deny with an optional note
- Approved time-off blocks the employee from being scheduled during that period (system surfaces a warning if manager attempts to assign them)
- Employee can cancel a pending time-off request at any time

**Acceptance Criteria:**
- Time-off request list is visible to the employee with status (Pending / Approved / Denied / Cancelled)
- Manager's schedule view shows an indicator on days with approved time-off for each employee
- No balance deduction or accrual tracking — approval workflow only

**Edge Cases:**
- Employee submits time-off for a period already fully scheduled → manager is shown the affected shifts in the approval view and can approve the time-off while managing affected shifts separately
- Employee is removed from the location with a pending time-off request → request is auto-cancelled; no notification required

**Business Rules:**
- No limit on the number of pending time-off requests per employee in v1
- Sick time-off requests can be submitted retroactively (i.e. for today or a past date)

**Audit Logging:**
- Log: request submitted, approved (by whom), denied (by whom, with reason), cancelled (by whom)

---

### Feature 5: Scheduling Rule Warnings

**Functional Requirements:**
- **Overtime Warning:** When a manager assigns a shift that would cause an employee to exceed the configured weekly hours threshold (default: 40 hours), a non-blocking warning is shown inline before the shift is saved
- **Minimum Rest Warning:** When a manager assigns a shift that begins less than the configured minimum rest period after the employee's previous shift ends (default: 8 hours), a non-blocking warning is shown
- **Predictive Scheduling Warning:** When a manager publishes a schedule for a week that starts less than the configured advance notice window in the future (default: 14 days), a warning is shown before confirming publish
- All warnings are configurable per location by the manager or owner
- All warnings are advisory — manager can override and proceed

**Acceptance Criteria:**
- Warnings are displayed inline at the point of action (shift assignment or publish), not as a separate validation step
- Each warning clearly identifies which employee and which rule is being triggered
- Configuration UI allows the manager to set hours threshold, rest period, and notice window per location

**Edge Cases:**
- Manager changes configuration to a lower threshold mid-week when shifts already saved → existing shifts are not retroactively flagged; new assignments use new threshold
- Employee works approved overtime → warning still fires; override by manager is logged

**Audit Logging:**
- Log: warning triggered (type, employee, shift), warning overridden (by whom)

---

### Feature 6: Notifications

**Functional Requirements:**
- Push notifications (web push via FCM or equivalent) and email notifications are sent for all schedule events:
  - Schedule published (to all employees in the location)
  - Shift added or changed after publish (to affected employee)
  - Open shift claimed and confirmed (to claiming employee)
  - Swap request received (co-worker), accepted/declined (initiating employee), approved/denied (both employees)
  - Time-off request: submitted (manager), approved/denied (employee)
- Notification preferences: employees can opt out of email notifications but not push (push is required for schedule changes)

**Acceptance Criteria:**
- Push and email notifications delivered within 5 minutes of trigger event under normal load
- Notification content is human-readable and includes enough context to act without opening the app (e.g. "Your shift swap request for Saturday 6pm has been approved by James")
- Employees who have not enabled push notifications receive email only

**Edge Cases:**
- Push notification fails (device offline) → falls back to email; push retried once device comes online
- Employee has no email (edge case: invited by phone number in future) → push only in v1 (phone invite is out of scope)

**Audit Logging:**
- Log: notification sent (type, recipient, channel), delivery failure

---

### Feature 7: Calendar Sync (One-Way to Google & Apple Calendar)

**Functional Requirements:**
- Employee can connect their Google Calendar or Apple Calendar via OAuth / CalDAV from their profile settings
- When a schedule is published, all shifts assigned to the employee are pushed as calendar events to their connected calendar
- When a published shift is edited, the corresponding calendar event is updated
- When a shift is deleted or an employee's schedule changes (swap approved, time-off approved), affected calendar events are updated or removed

**Acceptance Criteria:**
- Calendar events include: shift title (role + location name), start and end time, and location address
- Employee can disconnect calendar sync at any time; existing events in their personal calendar are not removed on disconnect
- Calendar sync runs asynchronously — does not block or delay the publish action

**Edge Cases:**
- Google OAuth token expires → sync silently fails; employee is notified in the app that their calendar connection needs to be re-authorised
- Apple CalDAV credentials become invalid → same handling as Google token expiry

**Audit Logging:**
- Log: calendar connected (provider), calendar sync triggered, sync failure (provider, reason)

---

### Feature 8: Billing & Subscription (Stripe)

**Functional Requirements:**
- Free 14-day trial on signup — no credit card required
- At trial end, owner is prompted to add payment method; subscription activates on payment
- Plans: Monthly ($29/location/month) and Annual ($279/location/year)
- Billing is per location — adding a new location creates a new Stripe subscription item
- Owner can upgrade (monthly → annual), downgrade (annual → monthly at next renewal), and cancel (active until period end)
- Invoice history visible in the app

**Acceptance Criteria:**
- Trial countdown is visible in the app UI from day 1 (e.g. "X days remaining in your trial")
- Failed payment triggers email notification and 3-day grace period before access is restricted
- Cancellation does not immediately terminate access; access continues until the end of the paid period

**Edge Cases:**
- Owner cancels mid-trial → account immediately downgraded to read-only after cancellation confirmed
- Owner adds a location during an annual plan → prorated charge for remainder of annual period
- Stripe webhook fails to deliver → idempotent retry with Stripe webhook signature validation

**Business Rules:**
- Trial locations are limited to 1 location during the trial period
- All billing actions are Owner-only; Managers cannot access billing

**Audit Logging:**
- Log: trial started, trial expired, subscription activated, plan changed, payment failed, payment succeeded, subscription cancelled

---

## 9. User Flows

### Flow 1: Manager Builds and Publishes a Weekly Schedule

```
Manager logs in
    → Navigates to Schedule tab for their location
    → Selects target week
    → Clicks "Copy Last Week"
        ↳ [No previous week exists] → Empty template shown with prompt: "No previous schedule found. Start from scratch."
    → Reviews copied draft schedule
    → Makes edits (add/remove/reassign shifts)
        ↳ [Overtime warning triggered] → Inline warning shown → Manager proceeds or removes shift
        ↳ [Rest period warning triggered] → Inline warning shown → Manager proceeds or reassigns
    → Clicks "Publish Schedule"
        ↳ [Predictive scheduling warning: < 14 days notice] → Confirmation modal shown → Manager confirms or cancels
    → Schedule published
        → All assigned employees receive push + email notification
        → All employees with connected calendars receive calendar events
        → Open shifts become claimable by eligible employees
```

**Failure Branch:** If publish fails (network error) → schedule remains in draft state; error toast with retry option

---

### Flow 2: Employee Claims an Open Shift

```
Employee receives notification: "New open shift available — Saturday 10am–4pm [Barista]"
    → Opens app → Open Shifts tab
    → Sees shift details (role, time, location)
    → Clicks "Claim Shift"
        ↳ [Role mismatch] → Shift not visible or Claim button disabled
        ↳ [Schedule conflict] → Warning shown: "This shift overlaps with your approved shift on [date]. You cannot claim it."
        ↳ [Overtime warning] → Warning shown; claim still submittable
    → Claim submitted
    → Manager receives notification: "[Employee name] has claimed the Saturday 10am shift"
    → Manager approves or denies
        → [Approved] → Shift appears in employee's schedule; calendar event created
        → [Denied] → Employee notified; open shift returns to claimable pool
```

---

### Flow 3: Shift Swap Request

```
Employee A selects their shift → clicks "Request Swap"
    → Selects Employee B from eligible co-workers
    → Enters optional reason
    → Submits request
    → Employee B receives notification: "Employee A wants to swap shifts with you. [Date/time details]"
    → Employee B accepts or declines
        → [Declined] → Employee A notified; swap closed
        → [Auto-expiry after 48 hours] → Employee A notified; swap closed
        → [Accepted] → Request appears in Manager's approval queue
    → Manager reviews and approves or denies
        → [Approved] → Both schedules updated; both employees notified; calendar events updated
        → [Denied] → Both employees notified with optional manager note; original schedules unchanged
```

---

### Flow 4: Owner Onboards a New Location

```
Owner logs in → Locations tab → "Add Location"
    → Enters location name and address
    → Location created (starts on owner's existing subscription; prorated charge applied if annual plan)
    → Owner assigns a manager or becomes default manager for the location
    → Manager invited by email
    → Manager accepts invite → sets password → accesses location schedule
```

**Failure Branch:** Owner on trial (1 location limit) → "Add Location" button prompts trial upgrade to paid plan

---

## 10. Non-Functional Requirements

### Performance

| Requirement | Target |
|-------------|--------|
| Schedule page initial load | < 2 seconds on 4G mobile |
| Publish action (trigger + fan-out notifications) | Asynchronous — publish confirms in < 1 second; notifications delivered within 5 minutes |
| CSV export generation | < 5 seconds for up to 1 year of data per location |
| API response time (p95) | < 500ms for all read endpoints |

### Scalability

- System must support 500 locations / 25,000 employees at launch
- System must scale to 5,000 locations / 250,000 employees by month 12
- Notification fan-out on Monday morning (peak load) must handle concurrent publish events from ~10% of locations within a 30-minute window without degradation
- Database connection pooling required; read replicas for schedule and notification queries at scale

### Security

- All data in transit encrypted via TLS 1.2+
- All passwords hashed with bcrypt (minimum cost factor 12)
- JWT-based authentication with refresh token rotation
- Role-based access control (RBAC) enforced at API layer — no client-side permission enforcement
- Stripe webhook requests validated via signature verification
- Rate limiting on all public-facing auth endpoints (login, invite acceptance)
- No PII logged in application logs — employee names and emails must be masked in log output

### Accessibility

- WCAG 2.1 Level AA compliance for all primary scheduling workflows
- All interactive elements keyboard-navigable
- Sufficient colour contrast on schedule status indicators (draft vs. published, warning states)

### Compatibility

- Responsive web: Chrome (latest 2), Firefox (latest 2), Safari (latest 2), Edge (latest 2)
- Mobile-responsive down to 375px viewport width (iPhone SE baseline)
- No native mobile app in v1

### Reliability

- 99.9% monthly uptime SLA
- Automated database backups: daily full backup, point-in-time recovery for last 7 days
- Graceful degradation: if calendar sync service is unavailable, publish action still succeeds; sync is queued for retry

---

## 11. Compliance

### US Labour Law — Predictive Scheduling

Several US states (California, Oregon, New York, Illinois) and cities have enacted predictive scheduling laws requiring advance notice of work schedules (typically 14 days). ShiftSync's configurable predictive scheduling warning (Feature 5) directly supports compliance. ShiftSync does not enforce hard compliance — it provides the warning tooling; legal compliance responsibility remains with the employer.

**Note:** ShiftSync should include in its terms of service that it is a scheduling tool and not a labour law compliance product. Owners are responsible for ensuring they meet applicable state and local laws.

### Data Privacy — US (v1)

- ShiftSync is US-only in v1; GDPR and CCPA compliance are out of scope for v1
- PII collected: full name, email address, phone number, role, employment type
- No financial data, government ID, date of birth, or wage/salary data stored
- Deleted/removed employee records are retained in anonymised form (name and contact details nulled) for 90 days after removal to maintain scheduling history integrity, then fully purged

### GDPR / CCPA — Deferred

- GDPR is explicitly out of scope for v1 (US market only)
- CCPA: review recommended before launch given California as a likely customer state — lightweight data request and deletion workflow may be required

### PCI-DSS

- ShiftSync does not store, process, or transmit payment card data directly
- All payment handling is delegated to Stripe (PCI-DSS Level 1 certified)
- ShiftSync is out of PCI-DSS scope

### SOC 2

- Not required for v1 launch
- Architecture should be designed with SOC 2 Type II readiness in mind for enterprise sales motions in Year 2

---

## 12. Integrations

### 1. Stripe (Billing)

- **Type:** REST API + Webhooks
- **Usage:** Subscription creation, trial management, payment collection, invoice retrieval
- **Authentication:** Stripe Secret Key (server-side only; never exposed to client)
- **Webhooks consumed:**
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
  - `invoice.payment_succeeded`
- **Failure behaviour:** Webhook delivery failures trigger Stripe's built-in retry (up to 3 days). ShiftSync processes all webhook events idempotently using Stripe's event ID.
- **Retry policy:** All Stripe API calls wrapped in exponential backoff (max 3 retries, 500ms base delay)

### 2. Google Calendar API

- **Type:** OAuth 2.0 + Google Calendar REST API
- **Usage:** Push employee shifts as calendar events on schedule publish; update/delete events on schedule changes
- **Authentication:** Per-employee OAuth token stored encrypted at rest; refresh token rotation handled automatically
- **Failure behaviour:** On token expiry or API error, sync is queued for retry (3 attempts with 15-minute intervals); employee notified in-app after 3 failures
- **Scope required:** `https://www.googleapis.com/auth/calendar.events`

### 3. Apple Calendar (CalDAV)

- **Type:** CalDAV protocol
- **Usage:** Same as Google Calendar — push shift events on publish and updates
- **Authentication:** Employee provides Apple ID credentials via iCloud CalDAV endpoint
- **Failure behaviour:** Same retry and notification pattern as Google Calendar

### 4. Email Provider (SendGrid or equivalent)

- **Type:** REST API
- **Usage:** All transactional emails (invite, schedule published, request approved/denied, payment alerts)
- **Failure behaviour:** Failed sends retried 3 times with exponential backoff; permanent failures (invalid email) logged and flagged in admin panel
- **Note:** Transactional emails only — no marketing emails via this integration

### 5. Push Notification Provider (FCM or equivalent)

- **Type:** REST API
- **Usage:** Web push notifications for all schedule events
- **Failure behaviour:** Failed pushes retried once; fallback to email if push permanently fails
- **Device token management:** Tokens refreshed on each app load; stale tokens purged after 30 days of non-use

---

## 13. Data Requirements

### Core Entities

| Entity | Key Fields | Classification |
|--------|-----------|----------------|
| Organisation | id, name, owner_user_id, created_at | Internal |
| Location | id, org_id, name, address, timezone, rules_config (JSON) | Internal |
| User | id, org_id, email, name, phone, role (OWNER/MANAGER/EMPLOYEE), status (ACTIVE/REMOVED), created_at | PII |
| UserLocation | user_id, location_id, role_at_location, employment_type, is_active | Internal |
| EmployeeRole | id, location_id, name (e.g. "Barista", "Cashier") | Internal |
| Shift | id, location_id, assigned_user_id (nullable), role_id, start_time, end_time, status (DRAFT/PUBLISHED/CANCELLED), is_open | Internal |
| SwapRequest | id, initiating_user_id, target_user_id, initiating_shift_id, target_shift_id, status, created_at | Internal |
| TimeOffRequest | id, user_id, location_id, type (PAID/UNPAID/SICK), start_date, end_date, status, reason, manager_note | Sensitive |
| CalendarConnection | id, user_id, provider (GOOGLE/APPLE), access_token_encrypted, refresh_token_encrypted, last_synced_at | Sensitive |
| Notification | id, user_id, type, channel (PUSH/EMAIL), payload, delivered_at, failed_at | Internal |
| SubscriptionEvent | id, org_id, stripe_event_id, type, amount, created_at | Financial |
| AuditLog | id, actor_user_id, action, entity_type, entity_id, before_state (JSON), after_state (JSON), created_at | Internal |

### Data Classification

| Classification | Description | Examples |
|----------------|-------------|---------|
| PII | Personally identifiable information | Name, email, phone |
| Sensitive | Requires encryption at rest | OAuth tokens, time-off reasons |
| Financial | Billing and payment events | Subscription events, Stripe data |
| Internal | Operational data, no special handling | Shifts, roles, schedules |

### Data Retention

| Data Type | Retention Policy |
|-----------|-----------------|
| Active employee records | Indefinite while employed |
| Removed employee personal data | Anonymised 90 days after removal; shift history retained with anonymised reference |
| Audit logs | Retained for 2 years |
| Stripe events | Retained for 7 years (financial record requirement) |
| Notification logs | Retained for 90 days |
| CalendarConnection tokens | Deleted immediately on disconnect |

---

## 14. Milestones & Timeline

**Target: Public Beta in 4 months from project start**

| Milestone | Target Date | Key Deliverables |
|-----------|-------------|-----------------|
| M0 — Project Kickoff | Week 1 | Finalised PRD, architecture blueprint signed off, repo and CI/CD scaffolded |
| M1 — Auth & Tenant Foundation | End of Week 3 | Multi-tenant auth (Owner/Manager/Employee), location model, invite flow |
| M2 — Core Scheduling | End of Week 6 | Schedule builder, copy last week, shift CRUD, draft/publish state |
| M3 — Requests & Workflows | End of Week 9 | Open shifts, swap requests, time-off requests, manager approval flows |
| M4 — Notifications & Calendar | End of Week 11 | Push + email notifications, Google Calendar sync, Apple Calendar sync |
| M5 — Billing & Rules | End of Week 13 | Stripe billing (trial, subscribe, cancel), scheduling rule warnings |
| M6 — QA & Beta Prep | End of Week 15 | Full QA pass, performance testing, CSV export, beta onboarding flow |
| M7 — Public Beta | End of Week 16 | Production launch, monitoring live, first 10 beta customers onboarded |

**Post-Beta Roadmap (v1.1 / v2 — not in scope for this PRD):**
- Drag-and-drop schedule builder
- SMS notifications
- Native iOS and Android apps
- Gusto and QuickBooks payroll integrations
- Leave balance tracking

---

## 15. Open Questions

| # | Question | Owner | Due Date |
|---|----------|-------|----------|
| OQ-1 | Should the manager receive a daily digest of pending requests (swaps, time-off) or only real-time notifications? Daily digest is common in competitor products and reduces notification fatigue. | Product | Before M3 |
| OQ-2 | Should the Owner dashboard surface any proactive alerts (e.g. "Location X has 3 unfilled open shifts this week") or is passive visibility sufficient for v1? | Product | Before M2 |
| OQ-3 | CCPA review: does ShiftSync's data handling for California customers require a data deletion request workflow before v1 launch? Legal review recommended. | Founder | Before M6 |
| OQ-4 | Is the 10-minute setup promise achievable without a guided onboarding wizard? Current scope has no explicit onboarding flow — should this be added to M6? | Product + Design | Before M5 |
| OQ-5 | For the annual plan proration on adding a new location — is prorating at the current period's daily rate acceptable, or should we bill the full monthly amount? Stripe supports both; need a billing policy decision. | Founder | Before M5 |

---

## 16. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R-1 | 4-month timeline is aggressive for 2 contract developers + solo founder. Scope creep on drag-and-drop or native notifications could delay launch. | High | High | Drag-and-drop explicitly deferred. Weekly sprint reviews to catch scope drift. M6 is a buffer week for QA before launch. |
| R-2 | Notification fan-out on Monday morning peak causes system degradation as customer count grows. | Medium | High | Design notification dispatch as an async job queue (e.g. AWS SQS + worker) from M4 onwards. Load test fan-out before beta launch. |
| R-3 | Google Calendar OAuth token management is complex; silent sync failures erode trust in the product. | Medium | Medium | Implement clear in-app re-auth prompts; monitor sync failure rates post-launch as a key health metric. |
| R-4 | Stripe webhook failures cause subscription state desync (e.g. customer cancels but retains access). | Low | High | All webhook handlers are idempotent; Stripe's 3-day retry window covers transient failures. Reconciliation job runs daily to compare Stripe state vs. local subscription state. |
| R-5 | Competitor (Homebase) has a free tier that undercuts ShiftSync's 14-day trial as a conversion mechanic. | Medium | Medium | Monitor free trial conversion rates in the first 60 days. If conversion < 15%, consider extending trial to 21 days or adding a free 1-location-forever tier. |
| R-6 | CCPA compliance gap if California customers make data deletion requests pre-launch with no workflow in place. | Medium | Low-Medium | OQ-3 — legal review before M6. Lightweight manual delete process as a stopgap if automated workflow not built in time. |

---

*End of Document — ShiftSync PRD v1.0*

*Next step: Feed this PRD into the Architect Master Prompt to generate the technical blueprint.*