"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useProjects } from "@/lib/use-projects";
import { STEPS, type Step, type StepKey } from "@/lib/steps";
import {
  ArchitectureSelector,
  getArchitecture,
  type ArchitectureKey,
} from "./architecture-selector";

type Props = {
  projectId: string;
  step: Step;
  promptText: string;
};

export function StepRunner({ projectId, step, promptText }: Props) {
  const router = useRouter();
  const { projects, hydrated, update, setStep } = useProjects();

  const project = projects.find((p) => p.id === projectId);

  // Local draft for PRD step (editable name/description)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [arch, setArch] = useState<ArchitectureKey>("modular-monolith");

  useEffect(() => {
    if (!hydrated || !project) return;
    setName(project.name);
    setDescription(project.description);
    setArch(((project.architecture as ArchitectureKey | undefined) ?? "modular-monolith"));
  }, [hydrated, project]);

  const stepIndex = STEPS.findIndex((s) => s.key === step.key);
  const nextStep = STEPS[stepIndex + 1];
  const prevStep = STEPS[stepIndex - 1];

  const fullPrompt = useMemo(() => {
    const parts: string[] = [promptText.trim()];
    const ctx: string[] = [];
    ctx.push(`## Project name\n\n${name || "(not set)"}`);
    ctx.push(`## Project description\n\n${description || "(not set)"}`);
    if (step.key === "architect" || step.key === "design-spec" || step.key === "feature-spec" || step.key === "agent-workflows" || step.key === "code-evaluator") {
      const a = getArchitecture(arch);
      ctx.push(
        `## Chosen architecture\n\n**${a.name}** — ${a.tagline}\n\n${a.description}`,
      );
    }
    parts.push("---");
    parts.push(...ctx);
    return parts.join("\n\n");
  }, [promptText, name, description, arch, step.key]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullPrompt);
    } catch {
      /* ignore */
    }
  }

  async function openIn(url: string) {
    await copy();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function saveProjectField(field: "name" | "description") {
    if (!project) return;
    const value = field === "name" ? name.trim() : description.trim();
    if (!value) return;
    update(project.id, { [field]: value });
  }

  function saveArchitecture(next: ArchitectureKey) {
    setArch(next);
    if (project) update(project.id, { architecture: next });
  }

  function markComplete() {
    if (!project) return;
    setStep(project.id, step.key, { status: "complete", completedAt: Date.now() });
    if (nextStep) router.push(`/playground/${project.id}/${nextStep.key}`);
    else router.push(`/playground/${project.id}`);
  }

  function markNotDone() {
    if (!project) return;
    setStep(project.id, step.key, { status: "not-started", completedAt: undefined });
  }

  function skipDesigner() {
    if (!project) return;
    // From architect: mark architect complete, jump past design-spec to feature-spec.
    // From design-spec: just navigate to feature-spec (leave design-spec not-started).
    if (step.key === "architect") {
      setStep(project.id, "architect", { status: "complete", completedAt: Date.now() });
    }
    router.push(`/playground/${project.id}/feature-spec`);
  }

  if (!hydrated) return <p className="text-sm text-muted">Loading…</p>;
  if (!project) {
    return (
      <div className="rounded-lg border border-dashed border-border-strong p-10 text-center">
        <p className="text-muted">Project not found in this browser.</p>
        <Link
          href="/playground"
          className="mt-6 inline-flex rounded-md border border-border px-5 py-3 text-sm hover:border-border-strong"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  const stepStatus = project.steps[step.key]?.status ?? "not-started";
  const isComplete = stepStatus === "complete";
  const showSkipDesigner = step.key === "architect" || step.key === "design-spec";

  return (
    <div>
      <nav className="mb-8 font-mono text-xs uppercase tracking-wider text-subtle">
        <Link href="/playground" className="transition-colors hover:text-fg">
          Playground
        </Link>
        <span className="mx-2 text-border-strong">/</span>
        <Link
          href={`/playground/${project.id}`}
          className="transition-colors hover:text-fg"
        >
          {project.name}
        </Link>
        <span className="mx-2 text-border-strong">/</span>
        <span className="text-fg">Step {step.number}</span>
      </nav>

      <header
        className={[
          "relative mb-10 rounded-lg border pb-8 pl-6 pr-6 pt-7",
          step.optional
            ? "border-border-strong bg-fg/[0.04]"
            : "border-border bg-bg",
        ].join(" ")}
      >
        {step.optional ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-6 h-12 w-[3px] rounded-r-sm bg-fg"
          />
        ) : null}
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            Step {step.number}
          </span>
          {step.optional ? (
            <span className="rounded-sm bg-fg px-2 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-bg">
              Optional
            </span>
          ) : null}
          <span
            className={`font-mono text-[0.65rem] uppercase tracking-wider ${
              isComplete ? "text-fg" : "text-subtle"
            }`}
          >
            · {isComplete ? "complete" : "not started"}
          </span>
        </div>
        <h1 className="mt-2 font-display text-5xl tracking-tight">{step.title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{step.blurb}</p>
        {step.optional ? (
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Skip this step if it doesn’t apply — the pipeline continues without it.
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-10">
        {/* Step-specific inputs */}
        {step.key === "prd-generator" ? (
          <PrdInputs
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onNameBlur={() => saveProjectField("name")}
            onDescriptionBlur={() => saveProjectField("description")}
          />
        ) : null}

        {step.key === "architect" ? (
          <section className="space-y-4">
            <header>
              <h2 className="font-display text-2xl tracking-tight">
                1. Pick an architecture
              </h2>
              <p className="mt-2 text-sm text-muted">
                The Architect prompt designs your blueprint around the style you choose.
                Modular Monolith is the default for new products.
              </p>
            </header>
            <ArchitectureSelector value={arch} onChange={saveArchitecture} />
          </section>
        ) : null}

        {/* Copy prompt section — preview always expanded, GitHub-like copy button on top */}
        <section className="space-y-4">
          <header>
            <h2 className="font-display text-2xl tracking-tight">
              {step.key === "prd-generator" || step.key === "architect" ? "2. " : ""}
              Copy the prompt
            </h2>
            <p className="mt-2 text-sm text-muted">
              The master prompt below already has your project name
              {step.key === "architect" ||
              step.key === "design-spec" ||
              step.key === "feature-spec" ||
              step.key === "agent-workflows" ||
              step.key === "code-evaluator"
                ? ", description, and chosen architecture"
                : " and description"}{" "}
              appended at the end. Copy it from the box below.
            </p>
          </header>

          <PromptPreview text={fullPrompt} />
        </section>

        {/* How to use */}
        <section className="space-y-4">
          <header>
            <h2 className="font-display text-2xl tracking-tight">
              {step.key === "prd-generator" || step.key === "architect" ? "3. " : ""}
              How to use
            </h2>
            <p className="mt-2 text-sm text-muted">
              Walk through these in order. Tick them off as you go.
            </p>
          </header>
          <HowToUseChecklist
            stepKey={step.key}
            onOpenClaude={() => openIn("https://claude.ai/new")}
            onOpenChatGPT={() => openIn("https://chatgpt.com/")}
            onCopy={copy}
          />
        </section>

        {/* Mark complete / Skip designer */}
        <section className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          {isComplete ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-fg" />
                Marked complete
              </span>
              <button
                type="button"
                onClick={markNotDone}
                className="text-sm text-muted underline-offset-4 hover:underline"
              >
                Mark as not done
              </button>
              {nextStep ? (
                <Link
                  href={`/playground/${project.id}/${nextStep.key}`}
                  className="ml-auto inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
                >
                  Continue to Step {nextStep.number} →
                </Link>
              ) : (
                <Link
                  href={`/playground/${project.id}`}
                  className="ml-auto inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
                >
                  Back to project ✓
                </Link>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={markComplete}
                className="inline-flex items-center gap-2 rounded-md border border-fg px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-fg hover:text-bg"
              >
                {nextStep ? "Mark complete & continue →" : "Mark complete ✓"}
              </button>
              {showSkipDesigner ? (
                <button
                  type="button"
                  onClick={skipDesigner}
                  className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  Skip designer step →
                </button>
              ) : null}
            </>
          )}
        </section>
      </div>

      <nav className="mt-16 flex items-center justify-between border-t border-border pt-6 text-sm">
        {prevStep ? (
          <Link
            href={`/playground/${project.id}/${prevStep.key}`}
            className="text-muted transition-colors hover:text-fg"
          >
            ← Step {prevStep.number} {prevStep.title}
          </Link>
        ) : (
          <Link
            href={`/playground/${project.id}`}
            className="text-muted transition-colors hover:text-fg"
          >
            ← Project dashboard
          </Link>
        )}
        {nextStep ? (
          <Link
            href={`/playground/${project.id}/${nextStep.key}`}
            className="text-muted transition-colors hover:text-fg"
          >
            Step {nextStep.number} {nextStep.title} →
          </Link>
        ) : (
          <Link
            href={`/playground/${project.id}`}
            className="text-muted transition-colors hover:text-fg"
          >
            Project dashboard →
          </Link>
        )}
      </nav>
    </div>
  );
}

function PrdInputs({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onNameBlur,
  onDescriptionBlur,
}: {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onNameBlur: () => void;
  onDescriptionBlur: () => void;
}) {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-2xl tracking-tight">
          1. Confirm your project details
        </h2>
        <p className="mt-2 text-sm text-muted">
          The PRD prompt uses these as its starting context. Edit them here and they’ll
          save back to your project.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
        <label className="block">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-subtle">
            Project name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onNameBlur}
            maxLength={80}
            className="mt-2 block w-full rounded-md border border-border bg-bg px-4 py-3 text-base text-fg outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-fg/10"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-subtle">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onBlur={onDescriptionBlur}
            rows={4}
            maxLength={1000}
            className="mt-2 block w-full resize-y rounded-md border border-border bg-bg px-4 py-3 text-base text-fg outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-fg/10"
          />
          <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-wider text-subtle">
            {description.length} / 1000
          </span>
        </label>
      </div>
    </section>
  );
}

/* -------------------- Prompt preview (always expanded, GH-style copy) -------------------- */

function PromptPreview({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/60 px-4 py-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-subtle">
          Prompt · {text.length.toLocaleString()} chars
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy prompt"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          <CopyIcon />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[0.78rem] leading-relaxed text-fg">
        {text}
      </pre>
    </div>
  );
}

/* -------------------- How to use checklist -------------------- */

type HowToAction =
  | { kind: "open-claude" }
  | { kind: "open-chatgpt" }
  | { kind: "copy" };

type HowToItem = {
  title: string;
  description: string;
  action?: HowToAction;
};

const HOW_TO_BY_STEP: Record<StepKey, HowToItem[]> = {
  "prd-generator": [
    {
      title: "Open a fresh Claude.ai or ChatGPT chat",
      description:
        "Start a new conversation so the prompt sets the system context cleanly. Either Claude or ChatGPT works — use whichever you have access to.",
      action: { kind: "open-claude" },
    },
    {
      title: "Paste the full prompt as your first message",
      description:
        "Paste it verbatim. The prompt already includes your project name and description at the bottom, so the AI knows what to ask about.",
      action: { kind: "copy" },
    },
    {
      title: "Answer the batched Q&A across 7 areas",
      description:
        "The AI will ask grouped questions — vision, users, scope, success metrics, constraints, risks, MVP cut. Take the full 20–40 minutes; this is the single biggest leverage point in the whole pipeline.",
    },
    {
      title: "Save the final output as PRD.md in your repo",
      description:
        "When the AI emits the 16-section PRD, save it to /docs/PRD.md (or your repo root). Every later step reads this file first.",
    },
  ],
  architect: [
    {
      title: "Open a fresh Claude.ai or ChatGPT chat",
      description:
        "Use a new conversation so the Architect prompt isn't biased by earlier context.",
      action: { kind: "open-claude" },
    },
    {
      title: "Paste the full prompt as your first message",
      description:
        "It already includes your project name, description, and the architecture style you picked above.",
      action: { kind: "copy" },
    },
    {
      title: "Attach or paste your PRD.md when asked",
      description:
        "The Architect needs the PRD to design the blueprint. Either attach it as a file or paste its contents when prompted.",
    },
    {
      title: "Answer the architecture Q&A (15–30 min)",
      description:
        "Tech stack choices, data model, module boundaries, deployment, security. Be opinionated — the SSOT this produces is what every later prompt reads.",
    },
    {
      title: "Save the output as ARCHITECTURE.md (with the SSOT block)",
      description:
        "Save to /docs/ARCHITECTURE.md. The SSOT block at the top is the source-of-truth every later session pastes in.",
    },
  ],
  "design-spec": [
    {
      title: "Open a fresh Claude.ai or ChatGPT chat",
      description:
        "Designers tend to work better in Claude; use whichever you prefer.",
      action: { kind: "open-claude" },
    },
    {
      title: "Paste the full prompt as your first message",
      description:
        "The prompt picks up the architecture and description automatically.",
      action: { kind: "copy" },
    },
    {
      title: "Attach Figma links or screenshots if you have them",
      description:
        "Optional. If you already have visual references — Figma frames, mood boards, competitor screenshots — paste them when asked and the prompt will reverse-engineer tokens and components.",
    },
    {
      title: "Save the output as DESIGN-SPEC.md",
      description:
        "Save to /docs/DESIGN-SPEC.md. Includes tokens, components, wireframes, motion, and a11y rules.",
    },
  ],
  "feature-spec": [
    {
      title: "Open your IDE alongside your AI coding assistant",
      description:
        "Cursor, Claude Code, Windsurf, or Copilot Chat all work. You'll be running this prompt inside the IDE so the assistant sees your repo.",
    },
    {
      title: "Paste the full prompt and provide the feature ID",
      description:
        "Tell the AI which feature you're scoping (e.g. F-12 from your PRD). It'll ask for the slice of PRD + SSOT it needs.",
      action: { kind: "copy" },
    },
    {
      title: "Walk through every endpoint, state, and edge case",
      description:
        "The prompt drives this — don't skip the edge-case section. Binary acceptance criteria are what make this spec useful for testing later.",
    },
    {
      title: "Save under /docs/specs/FEATURE-SPEC-[F-ID].md",
      description:
        "One file per complex feature. Re-run this step for each one — don't try to spec everything at once.",
    },
  ],
  "agent-workflows": [
    {
      title: "Open your IDE and load the workflow as your session prompt",
      description:
        "This is a daily-driver prompt — load it once at the start of each coding session in your AI coding tool.",
    },
    {
      title: "Paste the full prompt so the 8 specialists are primed",
      description:
        "PM, Architect, Dev, QA, Code Enforcer, Tech Debt, Security, Docs. The prompt rotates between them based on what you're working on.",
      action: { kind: "copy" },
    },
    {
      title: "Hand it your active spec + last session's PROGRESS.md",
      description:
        "It needs the SSOT, the feature spec you're implementing, and the running PROGRESS.md so it can pick up where you left off.",
    },
    {
      title: "Commit updated PROGRESS.md and CHANGELOG.md each session",
      description:
        "The workflow writes both files. Treat them like build artifacts — commit them so the next session has the latest memory.",
    },
  ],
  "code-evaluator": [
    {
      title: "Open your IDE on the branch you want to audit",
      description:
        "Run this before launch, before a major release, or any time you want a third-party read on the codebase.",
    },
    {
      title: "Paste the full prompt and feed it the inputs",
      description:
        "The evaluator needs your PRD, feature specs, and the relevant code. Point your AI tool at the repo and let it crawl.",
      action: { kind: "copy" },
    },
    {
      title: "Review the scored audit across 7 dimensions",
      description:
        "Correctness, architecture, security, performance, tests, docs, maintainability. Each gets a grade A–F with evidence.",
    },
    {
      title: "Work the prioritised fix list",
      description:
        "Fixes come ranked by severity × effort. Start at the top and re-run the evaluator when you've cleared the high-priority items.",
    },
  ],
};

function HowToUseChecklist({
  stepKey,
  onOpenClaude,
  onOpenChatGPT,
  onCopy,
}: {
  stepKey: StepKey;
  onOpenClaude: () => void;
  onOpenChatGPT: () => void;
  onCopy: () => void;
}) {
  const items = HOW_TO_BY_STEP[stepKey];
  const [openInfo, setOpenInfo] = useState<number | null>(null);

  function toggleInfo(i: number) {
    setOpenInfo((prev) => (prev === i ? null : i));
  }

  function runAction(action: HowToAction) {
    if (action.kind === "open-claude") onOpenClaude();
    else if (action.kind === "open-chatgpt") onOpenChatGPT();
    else if (action.kind === "copy") onCopy();
  }

  return (
    <ol className="space-y-2">
      {items.map((item, i) => {
        const isOpen = openInfo === i;
        return (
          <li
            key={i}
            className="rounded-md border border-border bg-bg transition-colors hover:border-border-strong"
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <span
                aria-hidden
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-border-strong bg-bg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-fg">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => toggleInfo(i)}
                    aria-label={isOpen ? "Hide details" : "Show details"}
                    aria-expanded={isOpen}
                    className={[
                      "inline-grid h-4 w-4 place-items-center rounded-full border text-[0.55rem] font-semibold transition-colors",
                      isOpen
                        ? "border-fg bg-fg text-bg"
                        : "border-border-strong text-muted hover:border-fg hover:text-fg",
                    ].join(" ")}
                  >
                    i
                  </button>
                </div>
              </div>
              {item.action ? (
                <button
                  type="button"
                  onClick={() => runAction(item.action!)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                  {actionLabel(item.action)}
                </button>
              ) : null}
            </div>
            {isOpen ? (
              <div className="border-t border-dashed border-border px-4 py-3 pl-12 text-sm text-muted">
                {item.description}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function actionLabel(action: HowToAction) {
  switch (action.kind) {
    case "open-claude":
      return "Open Claude ↗";
    case "open-chatgpt":
      return "Open ChatGPT ↗";
    case "copy":
      return "Copy prompt";
  }
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
      <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
    </svg>
  );
}

