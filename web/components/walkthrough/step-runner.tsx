"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProjects } from "@/lib/use-projects";
import { hasApiKey, useSettings } from "@/lib/use-settings";
import { SettingsModal } from "@/components/settings-modal";
import { STEPS, getStep, type Step, type StepKey } from "@/lib/steps";

const STEP_OUTPUT_LABEL: Record<StepKey, string> = {
  "prd-generator": "PRD",
  architect: "ARCHITECTURE",
  "design-spec": "DESIGN-SPEC",
  "feature-spec": "FEATURE-SPEC",
  "agent-workflows": "SESSION",
  "code-evaluator": "AUDIT",
};

const STEP_DEPENDENCIES: Record<StepKey, StepKey[]> = {
  "prd-generator": [],
  architect: ["prd-generator"],
  "design-spec": ["prd-generator", "architect"],
  "feature-spec": ["prd-generator", "architect"],
  "agent-workflows": ["architect"],
  "code-evaluator": ["prd-generator", "architect", "feature-spec"],
};

// Steps for which a single-shot AI generation makes sense.
// 3 (feature spec), 4 (workflows), 5 (evaluator) stay copy-paste.
const AI_ELIGIBLE: StepKey[] = ["prd-generator", "architect", "design-spec"];

// Appended to the user message so Claude generates the artifact in one
// shot rather than starting the prompt's interactive Phase 0 Q&A.
const SINGLE_SHOT_DIRECTIVE = `

---

# Single-shot mode

This run is a single-shot generation, not an interactive session. Generate the final artifact directly using the context above. If critical information is missing, make reasonable assumptions, mark them clearly with "Assumed:" prefixes inside an "Open Questions / Assumptions" section, and proceed. Skip Phase 0 questions.`;

type Props = {
  projectId: string;
  step: Step;
  promptText: string;
};

export function StepRunner({ projectId, step, promptText }: Props) {
  const router = useRouter();
  const { projects, hydrated, setStep } = useProjects();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const [output, setOutput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState<"prompt" | "context" | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const project = projects.find((p) => p.id === projectId);
  const aiEligible = AI_ELIGIBLE.includes(step.key);
  const aiReady = settingsHydrated && hasApiKey(settings);

  // Hydrate output from store
  useEffect(() => {
    if (!hydrated || !project) return;
    const existing = project.steps[step.key]?.output ?? "";
    setOutput(existing);
  }, [hydrated, project, step.key]);

  const stepIndex = STEPS.findIndex((s) => s.key === step.key);
  const nextStep = STEPS[stepIndex + 1];

  const dependencies = STEP_DEPENDENCIES[step.key];

  const contextBlock = useMemo(() => {
    if (!project) return "";
    const sections: string[] = [];
    if (step.key === "prd-generator") {
      sections.push(`## My idea\n\n${project.idea}`);
    } else {
      sections.push(`## My idea\n\n${project.idea}`);
      for (const dep of dependencies) {
        const depOutput = project.steps[dep]?.output?.trim();
        const depStep = getStep(dep);
        if (depOutput && depStep) {
          sections.push(
            `## ${STEP_OUTPUT_LABEL[dep]} (from Step ${depStep.number})\n\n${depOutput}`,
          );
        }
      }
    }
    return sections.join("\n\n---\n\n");
  }, [project, step.key, dependencies]);

  const fullPrompt = useMemo(() => {
    if (!project) return promptText;
    return `${promptText}\n\n---\n\n${contextBlock}`;
  }, [promptText, contextBlock, project]);

  function save({ markComplete }: { markComplete: boolean } = { markComplete: false }) {
    if (!project) return;
    setStep(project.id, step.key, {
      status: markComplete ? "complete" : output.trim() ? "in-progress" : "not-started",
      output: output,
      completedAt: markComplete ? Date.now() : undefined,
    });
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2200);
  }

  async function copy(kind: "prompt" | "context", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  }

  function downloadMd() {
    if (!output.trim()) return;
    const filename = `${STEP_OUTPUT_LABEL[step.key]}.md`;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openClaude() {
    // Claude.ai URL-seeded conversations have a small payload limit.
    // We open a blank new conversation and rely on the user pasting from clipboard.
    copy("prompt", fullPrompt);
    window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
  }

  function openChatGPT() {
    copy("prompt", fullPrompt);
    window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
  }

  async function generateWithAI() {
    if (!aiEligible) return;
    if (!aiReady) {
      setSettingsOpen(true);
      return;
    }
    const confirmReplace =
      output.trim().length === 0 ||
      confirm(
        "This will replace the current output for this step with the AI-generated result. Continue?",
      );
    if (!confirmReplace) return;

    setAiError(null);
    setGenerating(true);
    setOutput("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": settings.apiKey,
        },
        body: JSON.stringify({
          model: settings.model,
          system: promptText,
          messages: [
            { role: "user", content: contextBlock + SINGLE_SHOT_DIRECTIVE },
          ],
          max_tokens: 16000,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        let detail = text;
        try {
          const parsed = JSON.parse(text);
          detail = parsed.error?.message || parsed.error || text;
        } catch {
          /* leave detail as raw text */
        }
        throw new Error(detail || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + chunk);
      }
    } catch (err) {
      const e = err as Error;
      if (e.name === "AbortError") return;
      setAiError(e.message);
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  }

  function stopGeneration() {
    abortRef.current?.abort();
  }

  if (!hydrated) return <p className="text-sm text-muted">Loading…</p>;
  if (!project) {
    return (
      <div className="rounded-lg border border-dashed border-border-strong p-10 text-center">
        <p className="text-muted">Project not found in this browser.</p>
        <Link
          href="/start"
          className="mt-6 inline-flex rounded-md border border-border px-5 py-3 text-sm hover:border-border-strong"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  const stepStatus = project.steps[step.key]?.status ?? "not-started";

  return (
    <div>
      <nav className="mb-8 font-mono text-xs uppercase tracking-wider text-subtle">
        <Link href="/start" className="transition-colors hover:text-fg">
          Walkthrough
        </Link>
        <span className="mx-2 text-border-strong">/</span>
        <Link href={`/start/${project.id}`} className="transition-colors hover:text-fg">
          {project.name}
        </Link>
        <span className="mx-2 text-border-strong">/</span>
        <span className="text-fg">Step {step.number}</span>
      </nav>

      <header className="mb-10 border-b border-border pb-10">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            Step {step.number}
          </span>
          {step.optional ? (
            <span className="rounded-sm border border-border px-1.5 py-px font-mono text-[0.6rem] uppercase tracking-wider text-subtle">
              optional
            </span>
          ) : null}
          <span
            className={`font-mono text-[0.65rem] uppercase tracking-wider ${
              stepStatus === "complete"
                ? "text-fg"
                : stepStatus === "in-progress"
                  ? "text-muted"
                  : "text-subtle"
            }`}
          >
            · {stepStatus.replace("-", " ")}
          </span>
        </div>
        <h1 className="mt-2 font-display text-5xl tracking-tight">{step.title}</h1>
        <p className="mt-5 max-w-2xl text-muted">{step.blurb}</p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: prompt prep */}
        <section className="space-y-6">
          <header>
            <h2 className="font-display text-2xl tracking-tight">
              {aiEligible
                ? "1. Generate or send to your AI"
                : "1. Send this to your AI"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {aiEligible
                ? "Generate the artifact in-browser with your Anthropic key, or copy the prompt into another tool."
                : "The full master prompt below already includes your idea and any earlier outputs from this project as context."}
            </p>
          </header>

          {aiEligible ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {generating ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="inline-flex items-center gap-2 rounded-md border border-fg bg-bg px-4 py-2.5 text-sm font-medium text-fg transition-transform hover:-translate-y-0.5"
                  >
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-fg"
                    />
                    Stop generating
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={generateWithAI}
                    className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
                  >
                    <span aria-hidden>✦</span>
                    {aiReady
                      ? `Generate ${STEP_OUTPUT_LABEL[step.key]} with AI`
                      : "Add API key to generate"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => copy("prompt", fullPrompt)}
                  disabled={generating}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied === "prompt" ? "Copied" : "Copy prompt"}
                </button>
                <button
                  type="button"
                  onClick={openClaude}
                  disabled={generating}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Open Claude.ai
                </button>
                <button
                  type="button"
                  onClick={openChatGPT}
                  disabled={generating}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Open ChatGPT
                </button>
              </div>
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                {generating
                  ? `Streaming with ${settings.model}…`
                  : aiReady
                    ? `Will run as a single-shot with ${settings.model}.`
                    : "AI generation requires an Anthropic API key."}
              </p>
              {aiError ? (
                <p className="rounded-md border border-border-strong bg-surface px-3 py-2 font-mono text-xs text-fg">
                  Error: {aiError}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copy("prompt", fullPrompt)}
                className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                <span
                  aria-hidden
                  className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
                    copied === "prompt" ? "bg-bg" : "bg-bg/60"
                  }`}
                />
                {copied === "prompt" ? "Copied" : "Copy full prompt"}
              </button>
              <button
                type="button"
                onClick={openClaude}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong"
              >
                Copy & open Claude.ai
              </button>
              <button
                type="button"
                onClick={openChatGPT}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong"
              >
                Copy & open ChatGPT
              </button>
            </div>
          )}

          <details
            className="rounded-lg border border-border bg-surface/40"
            open={showPrompt}
            onToggle={(e) => setShowPrompt((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted hover:text-fg">
              {showPrompt ? "Hide" : "Preview"} full prompt ({fullPrompt.length.toLocaleString()} chars)
            </summary>
            <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap break-words border-t border-border bg-bg p-4 font-mono text-[0.78rem] leading-relaxed text-fg">
              {fullPrompt}
            </pre>
          </details>

          {contextBlock && step.key !== "prd-generator" ? (
            <div className="rounded-lg border border-dashed border-border-strong p-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                Context auto-attached
              </p>
              <ul className="mt-2 text-sm text-muted">
                <li>· Your one-line idea</li>
                {dependencies.map((dep) => {
                  const has = project.steps[dep]?.output?.trim();
                  return (
                    <li key={dep} className={has ? "" : "text-subtle"}>
                      · {STEP_OUTPUT_LABEL[dep]} from Step {getStep(dep)?.number}{" "}
                      {has ? "✓" : "(not yet completed)"}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>

        {/* Right: paste output */}
        <section className="space-y-6">
          <header>
            <h2 className="font-display text-2xl tracking-tight">
              {aiEligible
                ? "2. Edit, then save"
                : "2. Paste the result here"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {aiEligible
                ? "AI output streams in below. Edit before saving if anything needs adjusting, or paste your own output if you ran it elsewhere."
                : "When the AI finishes, paste its final output below. We save it locally so the next step can use it as context."}
            </p>
          </header>

          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={18}
            placeholder={
              generating
                ? "Streaming…"
                : `Paste your ${STEP_OUTPUT_LABEL[step.key]} output here…`
            }
            className={`block w-full resize-y rounded-md border bg-bg px-4 py-3 font-mono text-sm leading-relaxed text-fg outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-fg/10 ${
              generating ? "border-fg/40" : "border-border"
            }`}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => save({ markComplete: false })}
              disabled={!output.trim()}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={() => {
                save({ markComplete: true });
                if (nextStep) router.push(`/start/${project.id}/${nextStep.key}`);
                else router.push(`/start/${project.id}`);
              }}
              disabled={!output.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              Mark complete{nextStep ? " & continue →" : " ✓"}
            </button>
            <button
              type="button"
              onClick={downloadMd}
              disabled={!output.trim()}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
            >
              Download .md
            </button>
            {savedAt ? (
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                Saved
              </span>
            ) : null}
          </div>
        </section>
      </div>

      <nav className="mt-16 flex items-center justify-between border-t border-border pt-6 text-sm">
        {stepIndex > 0 ? (
          <Link
            href={`/start/${project.id}/${STEPS[stepIndex - 1].key}`}
            className="text-muted transition-colors hover:text-fg"
          >
            ← Step {STEPS[stepIndex - 1].number} {STEPS[stepIndex - 1].title}
          </Link>
        ) : (
          <Link
            href={`/start/${project.id}`}
            className="text-muted transition-colors hover:text-fg"
          >
            ← Project dashboard
          </Link>
        )}
        {nextStep ? (
          <Link
            href={`/start/${project.id}/${nextStep.key}`}
            className="text-muted transition-colors hover:text-fg"
          >
            Step {nextStep.number} {nextStep.title} →
          </Link>
        ) : (
          <Link
            href={`/start/${project.id}`}
            className="text-muted transition-colors hover:text-fg"
          >
            Project dashboard →
          </Link>
        )}
      </nav>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
