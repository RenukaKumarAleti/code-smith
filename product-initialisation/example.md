# Full Example Walkthrough

**PRD used:** ShiftSync v1.0 (from `prd-generator-master-prompt-example.md`)

---

### Initial Input (What the Developer Provided)

> [Pastes ShiftSync PRD v1.0 in full]

---

### Phase 0 — Batch 1 of 4

**Architect:**

PRD received. Before generating the blueprint, I need to resolve four areas of technical ambiguity. Starting with the highest-impact decisions.

**Batch 1 / 4 — Domain Boundaries & Real-Time**

1. The PRD has five distinct workflows: scheduling, open-shifts/swaps, time-off, notifications, and billing. Should each of these map to a separate backend module, or do you see scheduling + open-shifts + swaps as a single `scheduling` module since they share the `Shift` entity? This decision locks the module boundary structure for the entire backend.

2. When a manager publishes a schedule, all employees receive push + email notifications and calendar sync fires. Is there any requirement for the manager's UI to show real-time progress of the fan-out (e.g. "12 of 22 employees notified"), or is fire-and-forget acceptable — manager sees "Published" and notifications happen in the background?

3. The owner multi-location dashboard needs to show current week staffing across all locations. Is this a real-time live view (e.g. changes in one location reflect in the dashboard instantly) or is a near-real-time poll (e.g. refresh every 60 seconds or on page load) acceptable?

---

**Developer's Answer:**

> Backend modules: yes, keep scheduling + open-shifts + swaps together as one `scheduling` module — they all touch Shift. Separate modules for: auth/users, time-off, notifications, billing, calendar-sync. That's 6 modules total.
>
> Publish fan-out: fire-and-forget is fine. Manager sees "Published" instantly. No progress tracking needed.
>
> Owner dashboard: poll on page load + manual refresh button is fine. No real-time WebSocket needed anywhere in v1.

---

### Phase 0 — Batch 2 of 4

**Architect:**

**Batch 2 / 4 — Async Jobs & Queue Architecture**

4. The notification fan-out on publish (potentially hundreds of push + email events per publish, with Monday morning peak load) and the calendar sync (Google + Apple API calls per shift per employee) are both async operations. What's the tolerance for delay — is it acceptable if a 50-employee location's notifications arrive over 3–5 minutes, or do all employees need to be notified within 1 minute of publish?

5. The PRD specifies retry logic for calendar sync failures (3 attempts, 15-minute intervals). Where should this retry state live — a simple database-backed job table (polling approach), or a message queue (AWS SQS)? The answer affects infrastructure complexity vs. operational simplicity for a 2-person contractor team.

6. The shift data CSV export is described as taking < 5 seconds for up to 1 year of data per location. At 250,000 employees / 5,000 locations at month 12, a single location could have ~50,000+ shift records per year. Should export be synchronous (user waits, download starts) or async (user requests, gets a download link via email when ready)?

---

**Developer's Answer:**

> Notification delay: 3–5 minutes across the whole fan-out is fine. We don't need sub-minute delivery.
>
> Retry state: keep it simple — database-backed job table (no SQS in v1). We'll add a queue if we need it at scale. A `background_jobs` table with status polling is sufficient.
>
> CSV export: synchronous for v1. If it takes longer than 5 seconds at scale we'll move it async then. Don't over-engineer now.

---

### Phase 0 — Batch 3 of 4

**Architect:**

**Batch 3 / 4 — Auth, Multi-Tenancy & Frontend State**

7. Multi-tenancy model: the PRD has Organisations → Locations → Users. When a Manager logs in, they operate within a single location context. When an Owner logs in, they can switch between locations. Should the selected location context be stored in the JWT (requires re-issue on switch) or in the frontend session state (JWT stays generic, location context is a frontend concern resolved at API call time via a header or query param)?

8. The frontend needs to handle three distinct layouts — Owner dashboard (multi-location), Manager schedule builder, Employee view. Given the modular monolith constraint, should these be three separate route modules each with their own layout component and data-fetching layer, or a single adaptive layout that changes based on the user's role?

9. The `EmployeeRole` entity (e.g. "Barista", "Cashier") is location-scoped and drives open-shift eligibility. When an employee claims a shift, is role eligibility checked client-side (filter the UI) or server-side (authoritative check at claim endpoint)? This determines whether role data needs to be part of the auth token payload.

---

**Developer's Answer:**

> Location context: keep it out of the JWT. JWT encodes org_id, user_id, and global role (OWNER/MANAGER/EMPLOYEE). Selected location context lives in frontend state (React context + localStorage persistence). API calls send `X-Location-Id` header; backend validates that the user has access to that location on every request.
>
> Frontend layouts: three separate route modules — `owner/`, `manager/`, `employee/`. Each has its own layout and data layer. Role-based routing enforced at the router level.
>
> Role eligibility check: server-side always — client-side filtering is UX only. The claim endpoint validates role match authoritatively.

---

### Phase 0 — Batch 4 of 4

**Architect:**

**Batch 4 / 4 — Database, Deployment & Scale**

10. The PostgreSQL schema will have a `shifts` table that all queries touch. With 250,000 employees and 5,000 locations at month 12, shifts will accumulate fast (assuming avg 5 shifts/employee/week = ~65M shifts/year). Should we design partitioning or archiving strategy into the schema now (e.g. partition `shifts` by `location_id` or by date range), or is this deferred until needed?

11. AWS is confirmed. Within AWS — are we using ECS + Fargate (containerised, managed), EC2 (self-managed), or Lambda (serverless) for the backend? The modular monolith pattern fits all three but has different cold-start, scaling, and cost profiles. Given the Monday morning peak load pattern, which do you prefer?

12. The PRD mentions `rules_config` as a JSON column on the `Location` entity. This stores per-location overtime threshold, min rest period, and predictive scheduling notice window. Should this be a freeform JSONB column or a set of typed scalar columns? JSONB is flexible but harder to validate; typed columns are rigid but queryable and schema-safe.

---

**Developer's Answer:**

> Partitioning: defer for now. Add a `created_at` index and a composite index on `(location_id, start_time)` from day one. Revisit partitioning at 10M rows.
>
> AWS: ECS + Fargate. We want containerised deploys with no server management. Docker-based backend + frontend served via CloudFront/S3.
>
> rules_config: typed scalar columns on Location. We know exactly what the rules are and they won't change in v1. JSONB flexibility not needed here.

---

### All Technical Gaps Resolved

**Architect:**

Phase 0 complete. All module boundaries, async patterns, auth model, and infrastructure choices are resolved. Generating blueprint now.

---

---

# ShiftSync — Technical Blueprint

**Version:** 1.0
**Status:** Approved for Development
**Derived From:** ShiftSync PRD v1.0
**Architecture Pattern:** Modular Monolith (Frontend + Backend)
**Commit this document to repo as:** `ARCHITECTURE.md`

---

## Table of Contents

- [Section 0 — Single Source of Truth (SSOT)](#section-0--single-source-of-truth-ssot)
- [Section 1 — UI & Frontend](#section-1--ui--frontend)
- [Section 2 — Backend & Architecture](#section-2--backend--architecture)
- [Section 3 — Integrations](#section-3--integrations)
- [Section 4 — Security](#section-4--security)
- [Section 5 — Testing](#section-5--testing)
- [Section 6 — DevOps & Deployment](#section-6--devops--deployment)

---

## Section 0 — Single Source of Truth (SSOT)

> **This section is the law.** Every AI code-generation session, every developer, every PR must conform to the definitions below. When generating code with an AI assistant, paste this section as the first block of context before any instructions.

---

### 0.1 Tech Stack — Pinned Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React | 18.x |
| Frontend language | TypeScript | 5.x |
| Build tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| Component library | shadcn/ui (Radix primitives) | latest |
| State management | Zustand | 4.x |
| Server state / data fetching | TanStack Query (React Query) | 5.x |
| Frontend routing | React Router | 6.x |
| Form handling | React Hook Form + Zod | 7.x / 3.x |
| Backend runtime | Node.js | 20.x LTS |
| Backend framework | Express | 4.x |
| Backend language | TypeScript | 5.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 15.x |
| Auth tokens | JWT (jsonwebtoken) | 9.x |
| Password hashing | bcrypt | 5.x |
| Email | SendGrid SDK | 7.x |
| Push notifications | web-push | 3.x |
| Background jobs | Custom (DB-backed `background_jobs` table) | — |
| Validation | Zod (shared between frontend and backend) | 3.x |
| Testing — unit/integration | Vitest | 1.x |
| Testing — E2E | Playwright | 1.x |
| Containerisation | Docker | latest |
| Hosting | AWS ECS + Fargate | — |
| CDN / static hosting | AWS CloudFront + S3 | — |
| CI/CD | GitHub Actions | — |

---

### 0.2 Environment Variable Schema

All environment variables must be defined in `.env.example` at the repo root. Never commit `.env`. All variables are required unless marked `[optional]`.

```
# ── Application ──────────────────────────────────────────
NODE_ENV=development|staging|production
PORT=3001
FRONTEND_URL=https://app.shiftsync.io

# ── Database ─────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host:5432/shiftsync

# ── Auth ─────────────────────────────────────────────────
JWT_SECRET=<min 32 chars, randomly generated>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# ── Stripe ───────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...

# ── SendGrid ─────────────────────────────────────────────
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@shiftsync.io

# ── Web Push ─────────────────────────────────────────────
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:support@shiftsync.io

# ── Google Calendar ──────────────────────────────────────
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://api.shiftsync.io/calendar/google/callback

# ── AWS ──────────────────────────────────────────────────
AWS_REGION=us-east-1
AWS_S3_BUCKET=shiftsync-exports          # [optional — for future async exports]

# ── Monitoring ───────────────────────────────────────────
SENTRY_DSN=https://...                   # [optional]
```

---

### 0.3 API Contract Format

Every API response — success or error — uses this envelope:

**Success:**
```typescript
{
  success: true,
  data: T,           // typed payload
  meta?: {           // optional pagination
    page: number,
    pageSize: number,
    total: number
  }
}
```

**Error:**
```typescript
{
  success: false,
  error: {
    code: string,    // machine-readable, SCREAMING_SNAKE_CASE e.g. "SHIFT_NOT_FOUND"
    message: string, // human-readable, safe to display
    details?: unknown // validation errors, field-level issues
  }
}
```

HTTP status codes:
- `200` — success
- `201` — resource created
- `400` — validation error / bad request
- `401` — unauthenticated
- `403` — unauthorised (authenticated but insufficient permissions)
- `404` — resource not found
- `409` — conflict (e.g. duplicate claim, concurrent edit)
- `422` — business rule violation (e.g. swap request inside 24hr window)
- `500` — internal server error

---

### 0.4 Shared Core Type Definitions

These types are defined once in `packages/shared/types/` and imported by both frontend and backend. No duplicating entity shapes.

```typescript
// packages/shared/types/enums.ts
export type UserRole = 'OWNER' | 'MANAGER' | 'EMPLOYEE';
export type ShiftStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED' | 'EXPIRED';
export type TimeOffType = 'PAID' | 'UNPAID' | 'SICK';
export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type CalendarProvider = 'GOOGLE' | 'APPLE';
export type NotificationChannel = 'PUSH' | 'EMAIL';

// packages/shared/types/entities.ts
export interface Organisation {
  id: string;
  name: string;
  ownerUserId: string;
  createdAt: string; // ISO 8601
}

export interface Location {
  id: string;
  orgId: string;
  name: string;
  address: string;
  timezone: string;          // IANA timezone string e.g. "America/New_York"
  overtimeThresholdHours: number;    // default 40
  minRestHours: number;              // default 8
  predictiveNoticeWindowDays: number; // default 14
  createdAt: string;
}

export interface User {
  id: string;
  orgId: string;
  email: string;
  name: string;
  phone?: string;
  globalRole: UserRole;
  createdAt: string;
}

export interface UserLocation {
  userId: string;
  locationId: string;
  roleAtLocation: UserRole;
  employmentType: 'FULL_TIME' | 'PART_TIME';
  isActive: boolean;
}

export interface EmployeeRole {
  id: string;
  locationId: string;
  name: string; // e.g. "Barista", "Cashier"
}

export interface Shift {
  id: string;
  locationId: string;
  assignedUserId?: string;
  roleId: string;
  startTime: string;  // ISO 8601
  endTime: string;    // ISO 8601
  status: ShiftStatus;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SwapRequest {
  id: string;
  initiatingUserId: string;
  targetUserId: string;
  initiatingShiftId: string;
  targetShiftId: string;
  status: RequestStatus;
  reason?: string;
  managerNote?: string;
  createdAt: string;
  expiresAt: string;
}

export interface TimeOffRequest {
  id: string;
  userId: string;
  locationId: string;
  type: TimeOffType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: RequestStatus;
  reason?: string;
  managerNote?: string;
  createdAt: string;
}
```

---

### 0.5 Naming Conventions

| Artefact | Convention | Example |
|----------|-----------|---------|
| Files (frontend) | kebab-case | `schedule-grid.tsx`, `use-shifts.ts` |
| Files (backend) | kebab-case | `shift.service.ts`, `shift.repository.ts` |
| React components | PascalCase | `ScheduleGrid`, `ShiftCard` |
| React hooks | camelCase prefixed `use` | `useShifts`, `useSwapRequest` |
| Backend classes | PascalCase | `ShiftService`, `ShiftRepository` |
| Database tables | snake_case | `shifts`, `swap_requests`, `user_locations` |
| Database columns | snake_case | `assigned_user_id`, `start_time` |
| API routes | kebab-case | `/api/time-off-requests`, `/api/open-shifts` |
| Environment variables | SCREAMING_SNAKE_CASE | `JWT_SECRET`, `STRIPE_SECRET_KEY` |
| Error codes | SCREAMING_SNAKE_CASE | `SHIFT_NOT_FOUND`, `SWAP_EXPIRED` |
| TypeScript enums | SCREAMING_SNAKE_CASE values | `'DRAFT'`, `'APPROVED'` |
| Zod schemas | camelCase with `Schema` suffix | `createShiftSchema`, `loginSchema` |

---

### 0.6 Module Import Rules

```
ALLOWED:
  frontend module  → shared/types
  frontend module  → shared/contracts (API client functions)
  frontend module  → core/ui (shared components, hooks, utils)
  backend module   → shared/types
  backend module   → core/ (db, logger, auth middleware, config)

FORBIDDEN:
  frontend moduleA → frontend moduleB (internals)
  backend moduleA  → backend moduleB (internals)
  Any module       → Another module's internal service/repository directly

Cross-module communication on the backend uses the module's exported
service interface only (defined in module/index.ts).
```

---

### 0.7 Code Generation Checklist

Every file generated by an AI assistant must be verified against this checklist before accepting:

- [ ] Uses TypeScript — no `any` types, all entities reference shared types
- [ ] Uses the API contract envelope for all response shapes
- [ ] File named in kebab-case (backend/frontend files); PascalCase for React components only
- [ ] Error codes use SCREAMING_SNAKE_CASE and are defined in the module's `errors.ts`
- [ ] No cross-module internal imports (only via `index.ts` exports)
- [ ] Environment variables accessed via `config` service — never `process.env` directly in business logic
- [ ] Database access only via the module's own repository — never raw Prisma client in controllers or services
- [ ] All user inputs validated with Zod before use
- [ ] Audit log entry written for all state-changing operations
- [ ] No `console.log` in production code — use the shared `logger` service

---

## Section 1 — UI & Frontend

### 1.1 Tech Stack & UI Theme

- **Framework:** React 18 + TypeScript 5 + Vite 5
- **Styling:** Tailwind CSS 3 + shadcn/ui (Radix UI primitives)
- **Theme:** Clean, utility-focused — no decorative elements. High-contrast status indicators (draft = amber, published = green, warning = red). Mobile-first responsive. Neutral base (`zinc` palette) with `indigo` as primary brand colour.
- **Icons:** Lucide React

### 1.2 Modular Monolith — Frontend Structure

```
apps/web/src/
├── core/                        # Shared infrastructure — no feature logic
│   ├── ui/                      # Reusable design system components (Button, Modal, Table)
│   ├── hooks/                   # Shared hooks (useAuth, useToast, useLocationContext)
│   ├── api/                     # Axios instance, request interceptors, auth token injection
│   ├── router/                  # Route definitions, role-based guards
│   ├── store/                   # Global Zustand stores (auth, location context)
│   └── utils/                   # Date utils, formatters, validators
│
├── modules/
│   ├── auth/                    # Login, invite acceptance, password reset
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/            # auth.service.ts — API calls
│   │   ├── types/               # Module-local types (form shapes, not entities)
│   │   └── index.ts             # Public exports only
│   │
│   ├── owner/                   # Owner layout + multi-location dashboard
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   ├── scheduling/              # Schedule grid, shift CRUD, open shifts, swaps
│   │   ├── components/
│   │   │   ├── ScheduleGrid.tsx
│   │   │   ├── ShiftCard.tsx
│   │   │   ├── OpenShiftsList.tsx
│   │   │   └── SwapRequestModal.tsx
│   │   ├── hooks/
│   │   │   ├── useSchedule.ts
│   │   │   ├── useOpenShifts.ts
│   │   │   └── useSwapRequest.ts
│   │   ├── services/
│   │   │   └── scheduling.service.ts
│   │   └── index.ts
│   │
│   ├── time-off/                # Time-off request submission + manager approval
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   ├── notifications/           # Notification bell, push permission prompt
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   ├── billing/                 # Trial banner, plan upgrade, invoice history
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   └── calendar-sync/           # Connect/disconnect Google & Apple Calendar
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── index.ts
│
└── app.tsx                      # Root: providers, router, global error boundary
```

**Module Contract Rule:** Modules never import from each other's internal paths. `scheduling` can import from `core/ui` and `core/hooks` but never from `time-off/components/`.

### 1.3 Design Patterns

- **Atomic Design:** `core/ui/` contains atoms (Button, Badge, Input) and molecules (FormField, DataTable). Module-level components are organisms and templates.
- **Container / Presentational split:** Hooks own data fetching and business logic. Components are presentational and receive data via props.
- **TanStack Query** handles all server state — no Redux or Zustand for API data. Zustand is for client-only global state (selected location, auth user).

### 1.4 State Management

| State Type | Solution |
|-----------|---------|
| Auth user + JWT | Zustand (`useAuthStore`) — persisted to localStorage |
| Selected location context | Zustand (`useLocationStore`) — persisted to localStorage |
| Server data (shifts, requests) | TanStack Query — cache + background refetch |
| Form state | React Hook Form + Zod |
| UI state (modals, drawers) | Local React state (`useState`) |

### 1.5 Accessibility (a11y)

- WCAG 2.1 Level AA target across all scheduling workflows
- shadcn/ui (Radix primitives) provides keyboard navigation and ARIA attributes out of the box
- All status indicators (draft/published/warning) must pass 4.5:1 contrast ratio — never colour-only indicators (add icon or label)
- Focus management on modal open/close via Radix Dialog
- Schedule grid navigable by keyboard (arrow keys between days)

---

## Section 2 — Backend & Architecture

### 2.1 Tech Stack & Pattern

- **Runtime:** Node.js 20 LTS
- **Framework:** Express 4
- **Language:** TypeScript 5
- **ORM:** Prisma 5
- **Database:** PostgreSQL 15
- **Pattern:** Modular Monolith — single deployable process, domain-separated modules

### 2.2 Modular Monolith — Backend Structure

```
apps/api/src/
├── core/                        # Shared infrastructure — no domain logic
│   ├── config/                  # Typed config service (reads process.env, validates with Zod)
│   ├── db/                      # Prisma client singleton
│   ├── logger/                  # Pino logger instance
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification, user injection into req
│   │   ├── rbac.middleware.ts   # Role + location-access guard factory
│   │   ├── validate.middleware.ts # Zod schema validation middleware
│   │   └── error.middleware.ts  # Global error handler → standard error envelope
│   └── audit/
│       └── audit.service.ts     # Central audit log writer
│
├── modules/
│   ├── auth/
│   │   ├── auth.router.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.schemas.ts      # Zod schemas for request validation
│   │   ├── auth.errors.ts       # Module error codes
│   │   └── index.ts             # Exports: router, service interface
│   │
│   ├── scheduling/              # Shifts, open-shifts, swap requests
│   │   ├── scheduling.router.ts
│   │   ├── scheduling.controller.ts
│   │   ├── scheduling.service.ts
│   │   ├── scheduling.repository.ts
│   │   ├── rules.service.ts     # Overtime, rest-period, predictive notice logic
│   │   ├── scheduling.schemas.ts
│   │   ├── scheduling.errors.ts
│   │   └── index.ts
│   │
│   ├── time-off/
│   │   ├── time-off.router.ts
│   │   ├── time-off.controller.ts
│   │   ├── time-off.service.ts
│   │   ├── time-off.repository.ts
│   │   ├── time-off.schemas.ts
│   │   ├── time-off.errors.ts
│   │   └── index.ts
│   │
│   ├── notifications/
│   │   ├── notifications.service.ts   # Dispatch logic (push + email)
│   │   ├── push.service.ts            # web-push integration
│   │   ├── email.service.ts           # SendGrid integration
│   │   ├── notifications.repository.ts
│   │   └── index.ts
│   │
│   ├── calendar-sync/
│   │   ├── calendar-sync.router.ts    # OAuth callback routes
│   │   ├── calendar-sync.service.ts
│   │   ├── google.service.ts
│   │   ├── apple.service.ts
│   │   ├── calendar-sync.repository.ts
│   │   └── index.ts
│   │
│   ├── billing/
│   │   ├── billing.router.ts          # Stripe webhook handler
│   │   ├── billing.controller.ts
│   │   ├── billing.service.ts
│   │   ├── billing.repository.ts
│   │   ├── billing.schemas.ts
│   │   └── index.ts
│   │
│   └── jobs/
│       ├── job.runner.ts              # Polling loop — checks background_jobs table
│       ├── job.handlers.ts            # Handler registry: jobType → handler function
│       └── index.ts
│
└── app.ts                             # Express app setup, module router mounting
```

### 2.3 Core Layer Responsibilities

| File | Responsibility |
|------|---------------|
| `core/config/index.ts` | Reads all env vars, validates with Zod at startup, exports typed `config` object. App fails fast if any required var is missing. |
| `core/db/index.ts` | Prisma client singleton with connection pooling. Exported as `db`. Never instantiated elsewhere. |
| `core/logger/index.ts` | Pino logger. JSON format in production, pretty-print in development. |
| `core/middleware/auth.middleware.ts` | Verifies JWT, decodes `{ userId, orgId, globalRole }`, attaches to `req.user`. Returns 401 if invalid. |
| `core/middleware/rbac.middleware.ts` | Factory: `requireRole(role, options)`. Validates user role against required role and, for location-scoped resources, validates `X-Location-Id` header access via `user_locations` lookup. |
| `core/middleware/validate.middleware.ts` | `validate(schema)` — runs Zod parse on `req.body`, `req.params`, or `req.query`. Returns 400 with field-level errors on failure. |
| `core/middleware/error.middleware.ts` | Global Express error handler. Maps known error classes to HTTP codes. Always returns standard error envelope. Never leaks stack traces in production. |
| `core/audit/audit.service.ts` | `logAudit({ actorId, action, entityType, entityId, before?, after? })` — writes to `audit_logs` table. Called by service layer, not controllers. |

### 2.4 Database Schemas (Prisma)

```prisma
// schema.prisma (abridged for blueprint — full file in repo)

model Organisation {
  id          String    @id @default(cuid())
  name        String
  ownerUserId String
  createdAt   DateTime  @default(now())
  locations   Location[]
  users       User[]
}

model Location {
  id                          String   @id @default(cuid())
  orgId                       String
  name                        String
  address                     String
  timezone                    String   @default("America/New_York")
  overtimeThresholdHours      Int      @default(40)
  minRestHours                Int      @default(8)
  predictiveNoticeWindowDays  Int      @default(14)
  createdAt                   DateTime @default(now())
  org                         Organisation @relation(fields: [orgId], references: [id])
  shifts                      Shift[]
  userLocations               UserLocation[]
  employeeRoles               EmployeeRole[]
  timeOffRequests             TimeOffRequest[]
}

model User {
  id           String    @id @default(cuid())
  orgId        String
  email        String    @unique
  name         String
  phone        String?
  passwordHash String
  globalRole   UserRole
  createdAt    DateTime  @default(now())
  org          Organisation @relation(fields: [orgId], references: [id])
  userLocations UserLocation[]
  assignedShifts Shift[]
  swapRequestsInitiated SwapRequest[] @relation("Initiator")
  swapRequestsTargeted  SwapRequest[] @relation("Target")
  timeOffRequests       TimeOffRequest[]
  calendarConnections   CalendarConnection[]
  pushSubscriptions     PushSubscription[]
}

model UserLocation {
  userId           String
  locationId       String
  roleAtLocation   UserRole
  employmentType   EmploymentType
  isActive         Boolean       @default(true)
  user             User          @relation(fields: [userId], references: [id])
  location         Location      @relation(fields: [locationId], references: [id])
  @@id([userId, locationId])
}

model EmployeeRole {
  id         String   @id @default(cuid())
  locationId String
  name       String
  location   Location @relation(fields: [locationId], references: [id])
  shifts     Shift[]
  @@unique([locationId, name])
}

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
  location       Location    @relation(fields: [locationId], references: [id])
  assignedUser   User?       @relation(fields: [assignedUserId], references: [id])
  role           EmployeeRole @relation(fields: [roleId], references: [id])
  @@index([locationId, startTime])
}

model SwapRequest {
  id                  String        @id @default(cuid())
  initiatingUserId    String
  targetUserId        String
  initiatingShiftId   String
  targetShiftId       String
  status              RequestStatus @default(PENDING)
  reason              String?
  managerNote         String?
  createdAt           DateTime      @default(now())
  expiresAt           DateTime
  initiatingUser      User          @relation("Initiator", fields: [initiatingUserId], references: [id])
  targetUser          User          @relation("Target", fields: [targetUserId], references: [id])
}

model TimeOffRequest {
  id          String        @id @default(cuid())
  userId      String
  locationId  String
  type        TimeOffType
  startDate   DateTime
  endDate     DateTime
  status      RequestStatus @default(PENDING)
  reason      String?
  managerNote String?
  createdAt   DateTime      @default(now())
  user        User          @relation(fields: [userId], references: [id])
  location    Location      @relation(fields: [locationId], references: [id])
}

model CalendarConnection {
  id                   String           @id @default(cuid())
  userId               String
  provider             CalendarProvider
  accessTokenEncrypted String
  refreshTokenEncrypted String?
  lastSyncedAt         DateTime?
  createdAt            DateTime         @default(now())
  user                 User             @relation(fields: [userId], references: [id])
  @@unique([userId, provider])
}

model BackgroundJob {
  id          String    @id @default(cuid())
  type        String    // e.g. "CALENDAR_SYNC", "NOTIFICATION_FANOUT"
  payload     Json
  status      JobStatus @default(PENDING)
  attempts    Int       @default(0)
  maxAttempts Int       @default(3)
  runAfter    DateTime  @default(now())
  completedAt DateTime?
  failedAt    DateTime?
  error       String?
  createdAt   DateTime  @default(now())
  @@index([status, runAfter])
}

model AuditLog {
  id          String   @id @default(cuid())
  actorUserId String
  action      String
  entityType  String
  entityId    String
  beforeState Json?
  afterState  Json?
  createdAt   DateTime @default(now())
  @@index([entityType, entityId])
  @@index([actorUserId])
}

enum UserRole        { OWNER MANAGER EMPLOYEE }
enum ShiftStatus     { DRAFT PUBLISHED CANCELLED }
enum RequestStatus   { PENDING APPROVED DENIED CANCELLED EXPIRED }
enum TimeOffType     { PAID UNPAID SICK }
enum JobStatus       { PENDING RUNNING COMPLETED FAILED }
enum CalendarProvider { GOOGLE APPLE }
enum EmploymentType  { FULL_TIME PART_TIME }
```

### 2.5 ER Diagram

```mermaid
erDiagram
    Organisation ||--o{ Location : "has"
    Organisation ||--o{ User : "has"
    Location ||--o{ UserLocation : "has"
    User ||--o{ UserLocation : "has"
    Location ||--o{ EmployeeRole : "defines"
    Location ||--o{ Shift : "has"
    EmployeeRole ||--o{ Shift : "required for"
    User ||--o{ Shift : "assigned to"
    User ||--o{ SwapRequest : "initiates"
    User ||--o{ SwapRequest : "targets"
    User ||--o{ TimeOffRequest : "submits"
    Location ||--o{ TimeOffRequest : "scoped to"
    User ||--o{ CalendarConnection : "has"
    User ||--o{ PushSubscription : "has"
    BackgroundJob }o--|| Location : "scoped to (payload)"
```

### 2.6 System Flow — Schedule Publish

```mermaid
sequenceDiagram
    participant M as Manager (Browser)
    participant API as API Server
    participant DB as PostgreSQL
    participant JQ as Job Runner
    participant N as Notification Service
    participant C as Calendar Sync Service

    M->>API: POST /api/scheduling/schedules/:weekId/publish
    API->>API: Verify JWT + RBAC (MANAGER role, location access)
    API->>DB: Update shifts status DRAFT → PUBLISHED
    API->>DB: Insert BackgroundJob {type: NOTIFICATION_FANOUT, payload: {locationId, weekId}}
    API->>DB: Insert BackgroundJob {type: CALENDAR_SYNC, payload: {locationId, weekId}}
    API-->>M: 200 { success: true, data: { published: true } }

    loop Every 10 seconds
        JQ->>DB: SELECT jobs WHERE status=PENDING AND runAfter <= NOW()
        JQ->>N: Handle NOTIFICATION_FANOUT job
        N->>DB: Fetch all employees for location
        N->>N: Send push + email per employee
        N->>DB: Update job status COMPLETED
        JQ->>C: Handle CALENDAR_SYNC job
        C->>DB: Fetch CalendarConnections for affected employees
        C->>C: Push events to Google / Apple APIs
        C->>DB: Update job status COMPLETED (or FAILED + schedule retry)
    end
```

---

## Section 3 — Integrations

### 3.1 Internal API Contracts (Key Endpoints)

All routes prefixed `/api`. All authenticated routes require `Authorization: Bearer <token>` and `X-Location-Id: <locationId>` (except owner-level routes that span locations).

| Method | Route | Auth | Body / Response |
|--------|-------|------|----------------|
| POST | `/auth/login` | None | `{ email, password }` → `{ accessToken, refreshToken, user }` |
| POST | `/auth/refresh` | None | `{ refreshToken }` → `{ accessToken }` |
| POST | `/auth/invite/accept` | None | `{ token, password, name }` → `{ accessToken, user }` |
| GET | `/locations` | OWNER | → `Location[]` |
| POST | `/locations` | OWNER | `{ name, address, timezone }` → `Location` |
| GET | `/scheduling/shifts` | MGR/EMP | `?weekStart=YYYY-MM-DD` → `Shift[]` |
| POST | `/scheduling/shifts` | MANAGER | `{ roleId, startTime, endTime, assignedUserId? }` → `Shift` |
| POST | `/scheduling/shifts/copy-last-week` | MANAGER | `{ targetWeekStart }` → `{ created: number }` |
| POST | `/scheduling/schedules/:weekId/publish` | MANAGER | — → `{ published: true }` |
| GET | `/scheduling/open-shifts` | EMPLOYEE | → `Shift[]` (role-filtered) |
| POST | `/scheduling/open-shifts/:shiftId/claim` | EMPLOYEE | — → `SwapRequest` |
| POST | `/scheduling/swap-requests` | EMPLOYEE | `{ targetUserId, initiatingShiftId, targetShiftId, reason? }` → `SwapRequest` |
| PATCH | `/scheduling/swap-requests/:id` | MGR/EMP | `{ action: 'ACCEPT'\|'DENY'\|'APPROVE', note? }` → `SwapRequest` |
| GET | `/time-off` | MGR/EMP | → `TimeOffRequest[]` |
| POST | `/time-off` | EMPLOYEE | `{ type, startDate, endDate, reason? }` → `TimeOffRequest` |
| PATCH | `/time-off/:id` | MANAGER | `{ action: 'APPROVE'\|'DENY', note? }` → `TimeOffRequest` |
| GET | `/billing/status` | OWNER | → `{ plan, status, trialEndsAt?, nextBillingDate? }` |
| POST | `/billing/subscribe` | OWNER | `{ priceId, paymentMethodId }` → `{ subscriptionId }` |
| POST | `/billing/webhooks/stripe` | None (sig) | Stripe event → `{ received: true }` |
| GET | `/calendar-sync/google/connect` | EMPLOYEE | → redirect to Google OAuth |
| GET | `/calendar-sync/google/callback` | None (OAuth) | → redirect to frontend |
| DELETE | `/calendar-sync/:provider` | EMPLOYEE | — → `{ disconnected: true }` |

### 3.2 External Integrations Summary

| Integration | Module | Auth method | Failure handling |
|-------------|--------|-------------|-----------------|
| Stripe | billing | Secret key (server-side) | Webhook retry via Stripe (3 days); idempotency key on all API calls |
| SendGrid | notifications | API key | 3 retries, exponential backoff; log permanent failures |
| web-push (FCM/VAPID) | notifications | VAPID keys | 1 retry; fallback to email on permanent push failure |
| Google Calendar API | calendar-sync | OAuth 2.0 per-user | 3 retries, 15-min interval via BackgroundJob; in-app re-auth prompt on token expiry |
| Apple CalDAV | calendar-sync | Per-user credentials | Same retry pattern as Google |

### 3.3 Webhook Architecture — Stripe

```
Stripe → POST /api/billing/webhooks/stripe
    → Validate signature (STRIPE_WEBHOOK_SECRET)
    → Return 200 immediately (before processing)
    → Process event idempotently (check stripe_event_id in subscription_events)
    → Update local subscription state
    → Log to audit_logs
```

Stripe's built-in retry (up to 3 days) covers transient failures. A daily reconciliation job queries Stripe's subscription list and compares it against local state, flagging mismatches for manual review.

### 3.4 Standard Retry Policy

All outbound API calls (SendGrid, Google, Apple, Stripe) follow:

```
Attempt 1: immediate
Attempt 2: +30 seconds
Attempt 3: +5 minutes
After 3 failures: mark job FAILED, log error, trigger in-app alert where applicable
```

Retry state for calendar sync and notification fan-out is stored in the `background_jobs` table.

---

## Section 4 — Security

### 4.1 OWASP Top 10 Mitigations

| Risk | Mitigation in ShiftSync |
|------|------------------------|
| A01 — Broken Access Control | RBAC enforced at API layer via `requireRole` middleware on every route. `X-Location-Id` validated against `user_locations` on every location-scoped request. Client-side role checks are UX-only, never trusted. |
| A02 — Cryptographic Failures | Passwords hashed with bcrypt (cost 12). OAuth tokens encrypted at rest (AES-256). All traffic TLS 1.2+. No PII in logs. |
| A03 — Injection | All DB access via Prisma ORM — no raw SQL in business logic. All inputs validated with Zod before reaching service layer. |
| A04 — Insecure Design | Modular design with explicit module boundaries prevents privilege escalation via internal API calls. Audit log is append-only. |
| A05 — Security Misconfiguration | Config validated at startup via Zod — app fails fast on missing secrets. No default credentials. Environment-specific configs (no production secrets in code). |
| A06 — Vulnerable Components | `npm audit` run in CI on every push. Dependabot enabled on GitHub repo. |
| A07 — Auth Failures | Short-lived JWTs (15 min) + refresh token rotation. Rate limiting on `/auth/login` and `/auth/invite/accept` (10 req/min per IP). Invite tokens are single-use, expire in 48 hours. |
| A08 — Software Integrity | Docker image signing in CI. Dependencies locked via `package-lock.json`. No unverified runtime code execution. |
| A09 — Logging Failures | Pino structured logging on all requests. Audit log captures all state changes. Errors logged with correlation IDs. Alerts on error rate spikes. |
| A10 — SSRF | No user-controlled URL fetching. Calendar sync targets are only the known Google/Apple API endpoints, never user-provided URLs. |

### 4.2 Authentication Flow

```mermaid
sequenceDiagram
    participant Browser
    participant API
    participant DB

    Browser->>API: POST /auth/login {email, password}
    API->>DB: SELECT user WHERE email = ?
    API->>API: bcrypt.compare(password, passwordHash)
    alt Invalid credentials
        API-->>Browser: 401 INVALID_CREDENTIALS
    else Valid
        API->>API: Sign JWT {userId, orgId, globalRole} exp=15m
        API->>API: Sign refreshToken exp=7d
        API->>DB: Store hashed refreshToken in user_sessions
        API-->>Browser: 200 {accessToken, refreshToken}
    end

    Browser->>API: Authenticated request + Authorization: Bearer <accessToken>
    API->>API: Verify JWT signature + expiry
    alt Expired
        Browser->>API: POST /auth/refresh {refreshToken}
        API->>DB: Validate refreshToken hash
        API->>API: Issue new accessToken + rotate refreshToken
        API-->>Browser: 200 {accessToken, refreshToken}
    end
```

### 4.3 RBAC Table

| Route pattern | OWNER | MANAGER | EMPLOYEE |
|--------------|-------|---------|----------|
| `GET /locations` | ✅ | ❌ | ❌ |
| `POST /locations` | ✅ | ❌ | ❌ |
| `GET /scheduling/shifts` | ✅ | ✅ | ✅ (own only) |
| `POST /scheduling/shifts` | ✅ | ✅ | ❌ |
| `POST /scheduling/schedules/:id/publish` | ✅ | ✅ | ❌ |
| `GET /scheduling/open-shifts` | ❌ | ❌ | ✅ |
| `POST /scheduling/open-shifts/:id/claim` | ❌ | ❌ | ✅ |
| `POST /scheduling/swap-requests` | ❌ | ❌ | ✅ |
| `PATCH /scheduling/swap-requests/:id` (co-worker accept/decline) | ❌ | ❌ | ✅ (target only) |
| `PATCH /scheduling/swap-requests/:id` (manager approve/deny) | ✅ | ✅ | ❌ |
| `POST /time-off` | ❌ | ❌ | ✅ |
| `PATCH /time-off/:id` | ✅ | ✅ | ❌ |
| `GET /billing/*` | ✅ | ❌ | ❌ |
| `POST /billing/subscribe` | ✅ | ❌ | ❌ |
| `DELETE /calendar-sync/:provider` | ❌ | ❌ | ✅ (own only) |

---

## Section 5 — Testing

### 5.1 Strategy

| Layer | Type | Framework | Target Coverage |
|-------|------|-----------|----------------|
| Shared types + utils | Unit | Vitest | 100% |
| Backend — service layer | Unit | Vitest + mocked repositories | ≥ 80% line coverage |
| Backend — repository layer | Integration | Vitest + test PostgreSQL instance (Docker) | Key queries covered |
| Backend — API routes | Integration | Supertest + Vitest | All routes, all RBAC combinations |
| Frontend — hooks | Unit | Vitest + React Testing Library | ≥ 70% |
| Frontend — components | Unit | Vitest + React Testing Library | Critical flows (schedule grid, modals) |
| Critical user flows | E2E | Playwright | 6 flows (see below) |

### 5.2 E2E Coverage Targets (Playwright)

1. Manager signup → create location → invite employee → publish first schedule
2. Employee accepts invite → views schedule → connects Google Calendar
3. Employee submits time-off request → manager approves → employee sees updated status
4. Employee initiates swap → co-worker accepts → manager approves → both schedules updated
5. Employee claims open shift → manager confirms → shift appears in employee schedule
6. Owner adds second location → manager billing upgrade flow (Stripe test mode)

### 5.3 Test Infrastructure

- Separate test database (Docker Compose PostgreSQL) for integration tests — reset between test runs via Prisma migrate reset
- Stripe test mode for billing E2E tests — use Stripe CLI to replay webhook events locally
- Google Calendar integration tests use a mock server (nock or MSW) — never hit live Google APIs in CI

---

## Section 6 — DevOps & Deployment

### 6.1 Infrastructure Overview

```
┌──────────────────────────────────────────────────────┐
│  AWS                                                 │
│                                                      │
│  CloudFront → S3 (React SPA)                         │
│                                                      │
│  ALB → ECS Fargate (API containers)                  │
│           ├── Task: api (Node.js Express)            │
│           └── Task: job-runner (same image, env flag)│
│                                                      │
│  RDS PostgreSQL 15 (Multi-AZ in production)          │
│  ElastiCache Redis (session store — future)          │
│  S3 (CSV exports — future)                           │
│  CloudWatch (logs + alarms)                          │
└──────────────────────────────────────────────────────┘
```

**Note:** The job runner is the same Docker image as the API, launched with `JOB_RUNNER=true` env flag. It runs the `job.runner.ts` polling loop instead of starting the HTTP server. No separate codebase to maintain.

### 6.2 CI/CD Pipeline

```mermaid
flowchart LR
    A[Push to branch] --> B[GitHub Actions: CI]
    B --> C[Type check\ntsc --noEmit]
    C --> D[Lint\nESLint]
    D --> E[Unit tests\nVitest]
    E --> F[Integration tests\nVitest + Docker PostgreSQL]
    F --> G{Branch?}
    G -->|main| H[Build Docker image]
    H --> I[Push to ECR]
    I --> J[Deploy to Staging\nECS rolling update]
    J --> K[Playwright E2E\nvs staging]
    K --> L{Pass?}
    L -->|Yes| M[Manual approval gate]
    M --> N[Deploy to Production\nECS rolling update]
    L -->|No| O[Fail + notify Slack]
    G -->|PR| P[Run CI only\nno deploy]
```

### 6.3 Environment Variable Management

| Environment | Source |
|-------------|--------|
| Local dev | `.env` file (never committed) |
| CI/CD | GitHub Actions Secrets |
| Staging | AWS Secrets Manager → ECS task definition env injection |
| Production | AWS Secrets Manager → ECS task definition env injection |

The `core/config/index.ts` service reads all env vars at startup, validates them with Zod, and exports a typed `config` object. Direct `process.env` access is forbidden outside this file (enforced via ESLint custom rule).

### 6.4 Monitoring & Alerting Baseline

| Signal | Tool | Alert Threshold |
|--------|------|----------------|
| API error rate | CloudWatch | > 1% 5xx in 5-min window |
| API p95 latency | CloudWatch | > 1000ms |
| Background job failure rate | CloudWatch (custom metric) | > 5 failures in 15 min |
| Calendar sync failure rate | CloudWatch (custom metric) | > 10% of sync jobs failing |
| Database connection pool exhaustion | CloudWatch RDS | > 80% connections used |
| Trial-to-paid conversion | Custom dashboard | Weekly review |

Sentry (optional at launch) for frontend and backend error tracking with stack traces and user context.

---

*End of ShiftSync Technical Blueprint v1.0*

*Next step: Drop this blueprint + the PRD into the Agent Workflow Master Prompt to begin development sessions.*

---

## How the SSOT Section Is Used in Practice

When starting a new code-generation session (with Claude, ChatGPT, Cursor, or any AI assistant), paste the following as the first message:

```
You are generating code for ShiftSync. Before writing any code, read and
strictly follow the Single Source of Truth section from ARCHITECTURE.md
pasted below. Every file you generate must pass the Code Generation Checklist
in Section 0.7.

[Paste Section 0 of ARCHITECTURE.md here]

Now, here is the task: [your task]
```

This ensures every generated file uses the correct types, follows naming conventions, uses the right error code format, and respects module boundaries — regardless of which AI assistant is used or which developer runs the session.