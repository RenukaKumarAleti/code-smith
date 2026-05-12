import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STEPS, getStep } from "@/lib/steps";
import { loadDoc, type DocFile } from "@/lib/docs";
import { CopyButton } from "@/components/copy-button";
import { CodeBlockEnhancer } from "@/components/code-block-enhancer";

export async function generateStaticParams() {
  return STEPS.map((s) => ({ step: s.key }));
}

type Props = {
  params: Promise<{ step: string }>;
  searchParams: Promise<{ view?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { step: key } = await params;
  const step = getStep(key);
  if (!step) return {};
  return {
    title: step.title,
    description: step.blurb,
  };
}

const VIEWS: { id: DocFile; label: string }[] = [
  { id: "howToUse", label: "How to use" },
  { id: "prompt", label: "Prompt" },
  { id: "example", label: "Example" },
];

export default async function StepPage({ params, searchParams }: Props) {
  const { step: key } = await params;
  const { view } = await searchParams;
  const step = getStep(key);
  if (!step) notFound();

  const available = VIEWS.filter((v) => Boolean(step.files[v.id]));
  const activeView = (available.find((v) => v.id === view) ?? available[0])?.id;
  if (!activeView) notFound();

  const doc = await loadDoc(step, activeView);
  if (!doc) notFound();

  return (
    <article>
      <header className="mb-10 border-b border-border pb-10">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            Step {step.number}
          </span>
          {step.optional ? (
            <span className="rounded-sm border border-border px-1.5 py-px font-mono text-[0.62rem] uppercase tracking-wider text-subtle">
              optional
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 font-display text-5xl tracking-tight">{step.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">{step.blurb}</p>
        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
              Input
            </dt>
            <dd className="mt-1 text-muted">{step.input}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
              Output
            </dt>
            <dd className="mt-1 text-muted">{step.output}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
              Time
            </dt>
            <dd className="mt-1 text-muted">{step.timeEstimate}</dd>
          </div>
        </dl>
      </header>

      <nav
        aria-label="Document views"
        className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"
      >
        <ul className="flex flex-wrap items-center gap-1">
          {available.map((v) => {
            const active = v.id === activeView;
            const href =
              v.id === available[0].id
                ? `/docs/${step.key}`
                : `/docs/${step.key}?view=${v.id}`;
            return (
              <li key={v.id}>
                <a
                  href={href}
                  className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-fg text-bg"
                      : "text-muted hover:bg-surface hover:text-fg"
                  }`}
                >
                  {v.label}
                </a>
              </li>
            );
          })}
        </ul>
        {activeView === "prompt" ? (
          <CopyButton text={doc.raw} label="Copy prompt" />
        ) : null}
      </nav>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />

      <CodeBlockEnhancer />
    </article>
  );
}
