import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STEPS, getStep } from "@/lib/steps";
import { loadDoc, type DocFile } from "@/lib/docs";
import { CopyButton } from "@/components/copy-button";
import { CodeBlockEnhancer } from "@/components/code-block-enhancer";

export const dynamicParams = false;

const VIEWS: { id: DocFile; slug: string; label: string }[] = [
  { id: "howToUse", slug: "how-to-use", label: "How to use" },
  { id: "prompt", slug: "prompt", label: "Prompt" },
  { id: "example", slug: "example", label: "Example" },
];

const SLUG_TO_VIEW: Record<string, DocFile> = Object.fromEntries(
  VIEWS.map((v) => [v.slug, v.id])
);

export async function generateStaticParams() {
  const params: { step: string; view?: string[] }[] = [];
  for (const step of STEPS) {
    const available = VIEWS.filter((v) => Boolean(step.files[v.id]));
    if (available.length === 0) continue;
    params.push({ step: step.key });
    for (const v of available) {
      params.push({ step: step.key, view: [v.slug] });
    }
  }
  return params;
}

type Props = {
  params: Promise<{ step: string; view?: string[] }>;
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

export default async function StepPage({ params }: Props) {
  const { step: key, view } = await params;
  const step = getStep(key);
  if (!step) notFound();

  const available = VIEWS.filter((v) => Boolean(step.files[v.id]));
  if (available.length === 0) notFound();

  const viewSlug = view?.[0];
  let activeView: DocFile;
  if (viewSlug) {
    const mapped = SLUG_TO_VIEW[viewSlug];
    if (!mapped || !step.files[mapped]) notFound();
    activeView = mapped;
  } else {
    activeView = available[0].id;
  }

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
          {available.map((v, i) => {
            const active = v.id === activeView;
            const href =
              i === 0 ? `/docs/${step.key}` : `/docs/${step.key}/${v.slug}`;
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
