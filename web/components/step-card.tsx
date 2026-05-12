import Link from "next/link";
import { Step } from "@/lib/steps";

export function StepCard({ step }: { step: Step }) {
  return (
    <Link
      href={`/docs/${step.key}`}
      className="group block rounded-lg border border-border bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
          Step {step.number}
        </span>
        {step.optional ? (
          <span className="rounded-sm border border-border px-1.5 py-px font-mono text-[0.62rem] uppercase tracking-wider text-subtle">
            optional
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 font-display text-2xl tracking-tight">
        {step.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{step.blurb}</p>
      <dl className="mt-5 grid grid-cols-1 gap-2 border-t border-border pt-4 text-xs">
        <div className="flex items-baseline gap-2">
          <dt className="w-12 shrink-0 font-mono uppercase tracking-wider text-subtle">
            In
          </dt>
          <dd className="text-muted">{step.input}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="w-12 shrink-0 font-mono uppercase tracking-wider text-subtle">
            Out
          </dt>
          <dd className="text-muted">{step.output}</dd>
        </div>
      </dl>
      <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg">
        Read
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </p>
    </Link>
  );
}
