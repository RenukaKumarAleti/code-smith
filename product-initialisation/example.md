# The Architect Master Prompt — Complete Flow Example

> **About this document:** This is a real-world walkthrough of the full architecture flow using a fictional but realistic project — a **Recipe Sharing & Meal Planning SaaS App called "Platemate"**. Follow the conversation from start to finish to understand exactly how the prompt works in practice.

---

## 🍽️ The Project: Platemate

**What it is:** A SaaS platform where users can discover, save, and share recipes, build weekly meal plans, and auto-generate a grocery shopping list from those plans. Think of it as a simplified Pinterest Recipes + Mealime hybrid.

**Who it's for:** Home cooks, fitness enthusiasts, and busy families who want to plan meals without the mental overhead.

---

## STEP 1 — Developer Submits the PRD

The developer pastes the following PRD into the chat:

---

> **Platemate PRD (v1.0)**
>
> **Overview:** Platemate is a web-based SaaS app for recipe discovery, saving, and meal planning with auto-generated grocery lists.
>
> **Features:**
> 1. Users can register and log in with email/password or Google OAuth.
> 2. Users can browse a public recipe feed with filters (cuisine, dietary tags, prep time).
> 3. Users can save recipes to personal collections (like "Favourites" or custom folders).
> 4. Users can create a weekly meal plan by dragging recipes onto a 7-day calendar.
> 5. The app auto-generates a consolidated grocery list from the weekly meal plan.
> 6. Users can share their meal plans or recipes publicly via a shareable link.
> 7. Premium users get access to AI-powered recipe suggestions based on ingredients they have.
> 8. Admins can manage reported recipes and ban users.
>
> **Out of Scope:** Mobile app, social following/feed, in-app chat, payment processing (handled externally via Stripe).

---

## STEP 2 — AI Response: Phase 0 Discovery & Reverse-Prompting

The AI reads the PRD and immediately begins asking clarifying questions **before generating any architecture.**

---

**🤖 AI:**

Thanks for sharing the Platemate PRD — this is a well-scoped product. Before I design the blueprint, I want to act as a senior technical interviewer and surface any gaps or ambiguities. Let's go in small batches.

**Batch 1 of 4 — Users, Roles & Premium:**

1. **Premium tier definition:** The PRD mentions "Premium users" for AI recipe suggestions, but there's no mention of how a user becomes Premium. Is there a subscription flow managed via Stripe webhooks that updates the user's plan in your database? Or is Premium manually assigned by an Admin? This affects the entire auth and billing integration design.

2. **Recipe ownership:** Can any registered user submit their own recipes to the public feed? Or is the public feed admin-curated, and users can only save recipes — not publish them? This is a fundamental content architecture decision.

3. **Collection structure:** The PRD says users can save recipes to "custom folders." Can a recipe exist in multiple collections simultaneously? And is there a hard limit on the number of collections or recipes per collection?

---

## STEP 3 — Developer Answers Batch 1

**👨‍💻 Developer:**

1. Stripe handles payment. When a user subscribes, Stripe sends a webhook to our backend, which flips a `is_premium` flag on the user record. Admins can also manually toggle it.
2. Any registered user can submit recipes. Submitted recipes go into a **pending** state and require Admin approval before appearing on the public feed.
3. Yes, a recipe can exist in multiple collections. No hard limits for now — we'll revisit if it becomes a performance issue.

---

## STEP 4 — AI Asks Batch 2

**🤖 AI:**

Great — that clarifies the content moderation and billing flow well. Next batch:

**Batch 2 of 4 — Meal Planning & Grocery List:**

4. **Meal plan slots:** The 7-day calendar — can a user assign multiple recipes per day (e.g., breakfast, lunch, dinner)? Or is it one recipe per day slot? This changes the data model significantly.

5. **Grocery list logic:** When the app consolidates ingredients from the meal plan, how should it handle duplicate ingredients across recipes? For example, if two recipes both need "onions," should the quantities be summed into one line item, or listed separately per recipe?

6. **Meal plan history:** Once a week passes, does the meal plan reset automatically? Or do users keep a history of past meal plans they can look back at or re-use?

---

## STEP 5 — Developer Answers Batch 2

**👨‍💻 Developer:**

4. Multiple recipes per day — three slots per day: **Breakfast, Lunch, and Dinner.** A slot can also be left empty.
5. Quantities should be **summed** into one line item. So "2 onions" + "1 onion" = "3 onions" on the grocery list.
6. Users keep a **history of all past meal plans.** They can view, clone, or delete old plans.

---

## STEP 6 — AI Asks Batch 3

**🤖 AI:**

Clear — that's great detail for the meal plan schema. Moving on:

**Batch 3 of 4 — Sharing, Search & AI Feature:**

7. **Shareable links:** When a user shares a meal plan or recipe via a public link, does the viewer need to be logged in to see it? Or is it truly public — accessible to anyone with the link, including unauthenticated users?

8. **Recipe search & filters:** The PRD mentions filters for cuisine, dietary tags, and prep time. Is this a simple database filter query, or do you expect full-text search capabilities — e.g., searching "spicy chicken" and getting semantically relevant results?

9. **AI recipe suggestions:** The PRD says AI suggests recipes based on ingredients the user has. Does the user manually type in their available ingredients? And is the AI expected to call an external LLM API (like OpenAI), or do you have another approach in mind?

---

## STEP 7 — Developer Answers Batch 3

**👨‍💻 Developer:**

7. Truly public — no login required to view a shared link. The shared content is read-only.
8. Simple database filter for now. Full-text search is a stretch goal, not v1.
9. Yes, users type in their ingredients manually. We plan to call the **OpenAI API** (GPT-4o) to generate suggestions. The prompt will include the user's ingredient list and dietary preferences.

---

## STEP 8 — AI Asks Batch 4

**🤖 AI:**

Perfect — almost there. One final batch:

**Batch 4 of 4 — Admin, Scale & Infrastructure:**

10. **Admin moderation flow:** When a recipe is reported by users, does it get automatically hidden pending review, or does it stay visible until an Admin manually removes it? And is there a threshold — e.g., "hide after 5 reports"?

11. **Expected scale at launch:** Roughly how many users are you targeting at launch, and what does growth look like over the first 6 months? This helps me recommend the right infrastructure tier — we don't need to over-engineer for 100 users, but we should plan for 10,000.

12. **Hosting preference:** Do you have a preferred cloud provider (AWS, GCP, Azure), or are you open to recommendations? And do you have a preference between containerized deployment (Docker/Kubernetes) or a managed platform like Railway, Render, or Vercel?

---

## STEP 9 — Developer Answers Batch 4

**👨‍💻 Developer:**

10. A recipe gets **automatically hidden after 3 reports.** Admins then review and either restore or permanently remove it.
11. Targeting **500 users at launch**, expecting **5,000 within 6 months.** It's a bootstrapped product — no enterprise scale needed yet.
12. We prefer **AWS.** The team has existing AWS experience. We're comfortable with **Docker + ECS** for deployment. No Kubernetes — too complex for our team size.

---

## STEP 10 — Developer Triggers Blueprint Generation

**👨‍💻 Developer:**

> "Phase 0 is complete. Generate the blueprint."

---

## STEP 11 — AI Generates the Full Technical Blueprint

---

# Platemate — Technical Architecture Blueprint

**Prepared by:** Expert Software Architect & Lead Engineer
**Project:** Platemate v1.0
**Target Scale:** 500 → 5,000 users over 6 months
**Deployment Target:** AWS + Docker + ECS
**Date:** 2025-07-15

---

## 1. UI & Frontend

### Tech Stack

| Concern | Choice | Reason |
|--------|--------|--------|
| Framework | React 18 (with Vite) | Fast HMR, wide ecosystem, team familiarity |
| Language | TypeScript | Type safety across components and API contracts |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development with accessible primitives |
| Routing | React Router v6 | Client-side routing with nested layouts |
| Data Fetching | TanStack Query (React Query) | Server-state caching, background refetching, optimistic updates |
| Drag & Drop | dnd-kit | Lightweight, accessible drag-and-drop for the meal plan calendar |
| Forms | React Hook Form + Zod | Performant forms with schema-based validation |

### UI Theme

- **Design language:** Clean, warm, food-forward. Off-white backgrounds, earthy accent tones, generous whitespace.
- **Typography:** Inter for UI text, Playfair Display for recipe titles to add editorial warmth.
- **Responsive:** Mobile-first layout. Desktop optimized for the meal plan drag-and-drop view.

### Design Patterns

- **Atomic Design:** UI is organized as Atoms → Molecules → Organisms → Pages.
  - *Atom:* `<Button />`, `<Tag />`, `<Avatar />`
  - *Molecule:* `<RecipeCard />`, `<MealSlot />`, `<IngredientRow />`
  - *Organism:* `<RecipeFeed />`, `<WeeklyPlanGrid />`, `<GroceryList />`
  - *Page:* `<DiscoverPage />`, `<MealPlanPage />`, `<CollectionsPage />`

### State Management

| State Type | Approach |
|------------|----------|
| Server state (recipes, plans, user data) | TanStack Query — cache + invalidate on mutation |
| UI state (modals, filters, drag state) | React `useState` / `useReducer` — local to component |
| Auth state (current user, premium flag) | React Context + localStorage for persistence |
| Meal plan drag state | dnd-kit internal context |

### Accessibility (a11y)

- All interactive elements meet WCAG 2.1 AA standards.
- `shadcn/ui` components ship with ARIA attributes and keyboard navigation built in.
- Drag-and-drop meal plan has a keyboard-accessible fallback (dropdown slot assignment).
- Color contrast ratios enforced via Tailwind config and audited with `axe-core` in CI.
- All images (recipe photos) require non-empty `alt` text enforced at the component level.

---

## 2. Backend & Architecture

### Tech Stack

| Concern | Choice | Reason |
|--------|--------|--------|
| Runtime | Node.js 20 (LTS) | Async I/O suits recipe feed and AI streaming responses |
| Framework | Express.js | Lightweight, team-familiar, sufficient for this scale |
| Language | TypeScript | Shared types with frontend via a shared `types/` package |
| ORM | Prisma | Type-safe DB queries, clean migration workflow |
| Database | PostgreSQL 15 (AWS RDS) | Relational data fits recipe/plan/collection model |
| Cache | Redis (AWS ElastiCache) | Session store, rate limiting, grocery list aggregation cache |
| File Storage | AWS S3 + CloudFront | Recipe image uploads and CDN delivery |
| Job Queue | BullMQ (backed by Redis) | Async jobs: email sending, AI suggestion requests |
| Auth | Passport.js (Local + Google OAuth 2.0) | Handles both login strategies cleanly |

### Architectural Pattern

**Modular Monolith** — a single deployable Node.js application organized into feature modules, each owning its routes, services, and data access logic. This is appropriate for the 500–5,000 user range and the team size. Microservices would introduce unnecessary operational overhead at this stage.

```
src/
├── modules/
│   ├── auth/
│   ├── recipes/
│   ├── collections/
│   ├── mealplans/
│   ├── grocerylist/
│   ├── ai/
│   └── admin/
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── types/
├── config/
└── app.ts
```

### Database Schemas

```typescript
// Users
interface User {
  id: string;               // UUID
  email: string;            // unique
  password_hash: string | null;  // null for OAuth users
  google_id: string | null;
  display_name: string;
  avatar_url: string | null;
  is_premium: boolean;      // toggled by Stripe webhook or Admin
  is_banned: boolean;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

// Recipes
interface Recipe {
  id: string;               // UUID
  author_id: string;        // FK → User
  title: string;
  description: string;
  cuisine_tag: string;      // e.g. 'italian', 'mexican'
  dietary_tags: string[];   // e.g. ['vegan', 'gluten-free']
  prep_time_minutes: number;
  ingredients: Ingredient[];
  steps: string[];
  image_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  report_count: number;     // auto-hidden at 3
  share_token: string;      // unique token for public link
  created_at: Date;
  updated_at: Date;
}

// Ingredients (embedded in Recipe, but also normalized for grocery aggregation)
interface Ingredient {
  name: string;             // e.g. 'onion'
  quantity: number;         // e.g. 2
  unit: string;             // e.g. 'whole', 'grams', 'cups'
}

// Collections
interface Collection {
  id: string;               // UUID
  owner_id: string;         // FK → User
  name: string;             // e.g. 'Favourites', 'Date Night'
  created_at: Date;
}

// CollectionRecipes (many-to-many join table)
interface CollectionRecipe {
  collection_id: string;    // FK → Collection
  recipe_id: string;        // FK → Recipe
  added_at: Date;
}

// MealPlans
interface MealPlan {
  id: string;               // UUID
  owner_id: string;         // FK → User
  week_start_date: Date;    // always a Monday (ISO week)
  name: string | null;      // optional user label e.g. "Bulk Week"
  share_token: string;      // unique token for public link
  is_active: boolean;       // current week's plan
  created_at: Date;
}

// MealPlanSlots
interface MealPlanSlot {
  id: string;               // UUID
  meal_plan_id: string;     // FK → MealPlan
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Monday
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  recipe_id: string | null; // FK → Recipe — null means empty slot
}

// RecipeReports
interface RecipeReport {
  id: string;               // UUID
  reporter_id: string;      // FK → User
  recipe_id: string;        // FK → Recipe
  reason: string;
  created_at: Date;
}
```

### Entity-Relationship Diagram

```mermaid
erDiagram
    USER {
        uuid id PK
        string email
        string password_hash
        string google_id
        string display_name
        boolean is_premium
        boolean is_banned
        enum role
    }

    RECIPE {
        uuid id PK
        uuid author_id FK
        string title
        string cuisine_tag
        string[] dietary_tags
        int prep_time_minutes
        json ingredients
        json steps
        enum status
        int report_count
        string share_token
    }

    COLLECTION {
        uuid id PK
        uuid owner_id FK
        string name
    }

    COLLECTION_RECIPE {
        uuid collection_id FK
        uuid recipe_id FK
        timestamp added_at
    }

    MEAL_PLAN {
        uuid id PK
        uuid owner_id FK
        date week_start_date
        string share_token
        boolean is_active
    }

    MEAL_PLAN_SLOT {
        uuid id PK
        uuid meal_plan_id FK
        int day_of_week
        enum meal_type
        uuid recipe_id FK
    }

    RECIPE_REPORT {
        uuid id PK
        uuid reporter_id FK
        uuid recipe_id FK
        string reason
    }

    USER ||--o{ RECIPE : "authors"
    USER ||--o{ COLLECTION : "owns"
    USER ||--o{ MEAL_PLAN : "owns"
    USER ||--o{ RECIPE_REPORT : "files"
    RECIPE ||--o{ COLLECTION_RECIPE : "saved in"
    COLLECTION ||--o{ COLLECTION_RECIPE : "contains"
    MEAL_PLAN ||--o{ MEAL_PLAN_SLOT : "has"
    RECIPE ||--o{ MEAL_PLAN_SLOT : "placed in"
    RECIPE ||--o{ RECIPE_REPORT : "receives"
```

### System Flow Diagram

```mermaid
flowchart TD
    Client["React Frontend (Vite)"]
    CDN["CloudFront CDN"]
    ALB["AWS ALB (Load Balancer)"]
    API["Express API (ECS)"]
    DB["PostgreSQL (RDS)"]
    Cache["Redis (ElastiCache)"]
    S3["AWS S3 (Images)"]
    Queue["BullMQ Job Queue"]
    Worker["Background Worker (ECS)"]
    OpenAI["OpenAI API (GPT-4o)"]
    Stripe["Stripe Webhooks"]
    SendGrid["SendGrid (Email)"]

    Client --> CDN
    CDN --> ALB
    ALB --> API
    API --> DB
    API --> Cache
    API --> S3
    API --> Queue
    Queue --> Worker
    Worker --> OpenAI
    Worker --> SendGrid
    Stripe --> API
```

---

## 3. Integrations

### Internal API Contract (Frontend ↔ Backend)

All API responses follow a consistent envelope:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: { code: string, message: string } }
```

**Core endpoint groups:**

| Module | Key Endpoints |
|--------|---------------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/google`, `POST /auth/logout` |
| Recipes | `GET /recipes` (feed + filters), `POST /recipes`, `GET /recipes/:id`, `GET /r/:shareToken` (public) |
| Collections | `GET /collections`, `POST /collections`, `POST /collections/:id/recipes` |
| Meal Plans | `GET /mealplans`, `POST /mealplans`, `PUT /mealplans/:id/slots`, `GET /mp/:shareToken` (public) |
| Grocery List | `GET /mealplans/:id/grocery-list` |
| AI | `POST /ai/suggest` (Premium only) |
| Admin | `GET /admin/recipes/pending`, `PATCH /admin/recipes/:id/status`, `PATCH /admin/users/:id/ban` |

### External Integrations

**Stripe Webhooks:**

```
POST /webhooks/stripe
  ↳ customer.subscription.created  → set user.is_premium = true
  ↳ customer.subscription.deleted  → set user.is_premium = false
  ↳ Validate: stripe-signature header verified with STRIPE_WEBHOOK_SECRET
```

**OpenAI API (AI Suggestions):**
- Triggered via BullMQ job to avoid blocking the request thread.
- Prompt structure: system role defines a recipe chef persona; user message includes ingredient list + dietary preferences.
- Response is streamed back to the client via Server-Sent Events (SSE) for a real-time feel.
- Premium gate enforced at the middleware level before the job is enqueued.

**SendGrid (Email):**
- Transactional emails: welcome email, recipe approved/rejected notification.
- All email sends are enqueued as BullMQ jobs — never called synchronously in a request cycle.

**Google OAuth 2.0:**
- Handled via Passport.js `passport-google-oauth20` strategy.
- On first login: create user record, store `google_id`.
- On subsequent logins: look up by `google_id`, issue session/JWT.

### Error Handling & Retry Logic

```typescript
// BullMQ job retry config (applied to all workers)
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000     // 2s, 4s, 8s
  },
  removeOnComplete: true,
  removeOnFail: false   // Keep failed jobs for inspection
}
```

- **OpenAI rate limits (429):** Job is retried with exponential backoff. After 3 failures, job is moved to a dead-letter queue and user receives a "Try again later" response.
- **SendGrid failures:** Retried 3 times. After failure, error is logged to CloudWatch — email is not re-attempted beyond that to avoid spam.
- **Stripe webhook failures:** Stripe retries automatically for up to 3 days. Idempotency key on each event prevents duplicate processing.

---

## 4. Security

### OWASP Top 10 Mitigations

| Threat | Mitigation |
|--------|-----------|
| A01 Broken Access Control | Row-level ownership checks on all recipe/collection/plan mutations. Admin routes protected by `requireAdmin` middleware. Public share tokens are UUIDs — not sequential IDs. |
| A02 Cryptographic Failures | Passwords hashed with bcrypt (cost factor 12). HTTPS enforced at ALB. S3 bucket is private — images served via CloudFront signed URLs. |
| A03 Injection | Prisma ORM parameterizes all queries. No raw SQL. User input sanitized with `zod` schemas before touching the DB. |
| A04 Insecure Design | Recipe auto-hide at 3 reports before Admin review. Premium feature gate at middleware — not just frontend. Stripe webhook signature validated on every call. |
| A05 Security Misconfiguration | `helmet.js` middleware sets all security headers. CORS locked to frontend origin. No stack traces in production error responses. |
| A06 Vulnerable Components | `npm audit` runs in CI pipeline. Dependabot enabled on the repo for automated PR alerts. |
| A07 Auth Failures | Rate limiting on `/auth/login` — 5 attempts per 15 minutes per IP. Account lockout after 10 failed attempts. Google OAuth as a passwordless alternative. |
| A08 Data Integrity Failures | Stripe webhook secret verified via `stripe.webhooks.constructEvent()`. BullMQ jobs use idempotency keys. |
| A09 Logging Failures | All requests logged via `pino`. Auth failures, admin actions, and report events logged with user ID + timestamp. Logs shipped to AWS CloudWatch. |
| A10 SSRF | OpenAI and SendGrid called only from the backend worker — never from URLs supplied by users. No user-controlled URL fetch in the system. |

### Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    participant Redis

    Client->>API: POST /auth/login { email, password }
    API->>DB: SELECT user WHERE email = ?
    DB-->>API: User record
    API->>API: bcrypt.compare(password, hash)
    API->>API: Sign JWT (15min) + Refresh Token (7 days)
    API->>Redis: Store refresh token (key: userId)
    API-->>Client: { accessToken, refreshToken }

    Client->>API: GET /mealplans (Bearer accessToken)
    API->>API: Verify JWT signature + expiry
    API->>DB: Fetch meal plans WHERE owner_id = userId
    DB-->>API: Plans
    API-->>Client: { success: true, data: plans }

    Client->>API: POST /auth/refresh { refreshToken }
    API->>Redis: Validate refresh token exists for userId
    API->>API: Rotate — issue new access + refresh token
    API->>Redis: Replace old refresh token
    API-->>Client: { accessToken, refreshToken }
```

**RBAC summary:**

| Role | Can do |
|------|--------|
| Unauthenticated | View public recipe feed, view shared links |
| Member | All above + manage own recipes/collections/plans, AI suggestions (if Premium) |
| Admin | All above + approve/reject recipes, ban users, view reports |

---

## 5. Testing

### Testing Strategy

| Layer | Framework | Coverage Target |
|-------|-----------|----------------|
| Unit Tests | Vitest | Service functions, grocery aggregation logic, utility helpers |
| Integration Tests | Supertest + Vitest | All API endpoints with a real test DB (PostgreSQL in Docker) |
| E2E Tests | Playwright | Critical user journeys (see below) |
| Component Tests | React Testing Library | RecipeCard, MealPlanGrid, GroceryList components |

### Critical E2E Test Journeys

1. **Happy path — Free user:** Register → Browse feed → Save recipe to collection → Build meal plan → View grocery list.
2. **Happy path — Premium user:** Log in → Enter ingredients → Receive AI suggestions → Add suggestion to meal plan.
3. **Sharing flow:** Create meal plan → Generate share link → Open link in incognito (unauthenticated) → Verify read-only view.
4. **Admin moderation:** Log in as Admin → View pending recipes → Approve one → Reject one → Verify feed reflects changes.
5. **Report & auto-hide:** Submit 3 reports on a recipe as 3 different users → Verify recipe is hidden from feed.

### Key Unit Test Cases

```
groceryList.service.test.ts
  ✓ sums identical ingredients across multiple recipes
  ✓ handles unit mismatches gracefully (e.g. '2 cups' + '500ml')
  ✓ returns empty list for meal plan with no assigned recipes
  ✓ excludes empty meal slots from aggregation

recipeReport.service.test.ts
  ✓ increments report_count on each unique report
  ✓ sets status to 'hidden' when report_count reaches 3
  ✓ does not allow the same user to report the same recipe twice
```

---

## 6. DevOps & Deployment

### Hosting Environment

| Service | AWS Resource |
|---------|-------------|
| API Server | ECS Fargate (2 tasks, auto-scale to 5) |
| Background Worker | ECS Fargate (1 task, separate service) |
| Database | RDS PostgreSQL (db.t3.medium, Multi-AZ for production) |
| Cache / Queue | ElastiCache Redis (cache.t3.micro) |
| File Storage | S3 + CloudFront |
| Load Balancer | Application Load Balancer (ALB) |
| Container Registry | AWS ECR |
| Secrets | AWS Secrets Manager |
| Logs | AWS CloudWatch Logs |

### Directory Structure

```
platemate/
├── apps/
│   ├── web/                  # React frontend (Vite)
│   └── api/                  # Express backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── recipes/
│       │   │   ├── collections/
│       │   │   ├── mealplans/
│       │   │   ├── grocerylist/
│       │   │   ├── ai/
│       │   │   └── admin/
│       │   ├── shared/
│       │   ├── config/
│       │   └── app.ts
│       └── Dockerfile
├── packages/
│   └── types/                # Shared TypeScript interfaces
├── infra/
│   └── ecs/                  # ECS task definitions
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml        # Local development
└── .env.example
```

### CI/CD Pipeline

```mermaid
flowchart LR
    PR["Pull Request"] --> Lint["Lint + Type Check"]
    Lint --> UnitTest["Unit Tests (Vitest)"]
    UnitTest --> IntTest["Integration Tests (Supertest + Docker DB)"]
    IntTest --> E2E["E2E Tests (Playwright)"]
    E2E --> Build["Docker Build + Push to ECR"]
    Build --> DeployStaging["Deploy to Staging (ECS)"]
    DeployStaging --> SmokeTest["Smoke Test (Playwright)"]
    SmokeTest --> Approve["Manual Approval Gate"]
    Approve --> DeployProd["Deploy to Production (ECS)"]
    DeployProd --> Notify["Notify Slack #deployments"]
```

**Branch strategy:**
- `main` → production
- `staging` → staging environment (auto-deployed on merge)
- Feature branches → PR → `staging` first, then `main`

### Environment Variable Management

All secrets are stored in **AWS Secrets Manager** and injected into ECS task definitions at runtime. No secrets in `.env` files in the repository.

```bash
# .env.example — committed to repo (values are placeholders only)
DATABASE_URL=postgresql://user:password@localhost:5432/platemate
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
SENDGRID_API_KEY=your-sendgrid-key
AWS_S3_BUCKET=platemate-uploads
CLOUDFRONT_URL=https://cdn.platemate.com
NODE_ENV=development
```

**Environment tiers:**

| Variable | Local | Staging | Production |
|----------|-------|---------|------------|
| `DATABASE_URL` | Docker Compose Postgres | RDS (staging) | RDS (prod, Multi-AZ) |
| `NODE_ENV` | `development` | `staging` | `production` |
| `OPENAI_API_KEY` | Real key (rate-limited) | Real key | Real key |
| `STRIPE_*` | Stripe test mode keys | Stripe test mode keys | Stripe live keys |

---

*Blueprint complete. This document is the authoritative technical reference for Platemate v1.0. All implementation decisions should trace back to the decisions captured here.*