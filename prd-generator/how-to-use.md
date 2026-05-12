# HOW TO USE THIS PROMPT

**Start a session:**
Paste this prompt into any AI assistant — Claude, ChatGPT, Gemini, Cursor, anything.
Then write your project idea immediately after. One sentence is enough to begin.

**Example inputs that work:**
```
"I want to build an app where freelancers can invoice clients,
track payments, and send automatic reminders for overdue invoices."

"Internal HR tool for our company to manage leave requests,
approvals, and show each employee their remaining leave balance."

"B2B SaaS platform for logistics companies to track shipments in
real time, get delay alerts, and generate compliance reports."

"A marketplace where independent tutors can list their services,
students can book and pay, and both sides can review each other."
```

**During discovery:**
Answer each batch fully. If you don't know something, say so —
it becomes an Open Question in the PRD. Partial answers are fine.
Vague answers will trigger a follow-up.

**When discovery is done:**
Type: `generate PRD`

The full enterprise-standard PRD outputs as a single Markdown document.
Save it as `PRD.md` in your project repository.

---

## THIS PROMPT IS STEP 1 OF 5

| Step | Prompt | Input → Output |
|------|--------|----------------|
| **1 — This prompt** | PRD Generator | Vague idea → Enterprise PRD |
| **2** | Architect Master Prompt | PRD → Full technical blueprint |
| **3** | Feature Spec Prompt | PRD + SSOT → Per-feature contract |
| **4** | Agent Workflow Master Prompt | PRD + Blueprint + Spec → Every dev session |
| **5** | Validator & Audit Prompt | Code + PRD + Spec → Production readiness score |

The PRD this generates is specifically structured to give the Architect Master Prompt
everything it needs: data entities, integrations with failure behaviour, NFRs precise
enough to drive infrastructure decisions, and compliance requirements that become
security architecture decisions.

---

*Paste this prompt. Write your idea. Answer the questions. Type "generate PRD".*
*Everything else is handled.*