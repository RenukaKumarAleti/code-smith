import Link from "next/link";
import { Step } from "@/lib/steps";

export function StepCard({ step }: { step: Step }) {
  return (
    <Link
      href={`/docs/${step.key}`}
      className={[
        "group relative flex h-full flex-col rounded-lg border p-6 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-border-strong",
        step.optional
          ? "border-border-strong bg-fg/[0.035] hover:bg-fg/[0.06]"
          : "border-border bg-surface/30 hover:bg-surface",
      ].join(" ")}
    >
      {step.optional ? (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-6 h-8 w-[3px] rounded-r-sm bg-fg"
        />
      ) : null}

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
          Step {step.number}
        </span>
        {step.optional ? (
          <span className="rounded-sm bg-fg px-2 py-0.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-bg">
            Optional
          </span>
        ) : null}
      </div>

      <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight">
        {step.title}
      </h3>

      <p className="mt-3 line-clamp-3 min-h-[4.875em] text-sm leading-relaxed text-muted">
        {step.blurb}
      </p>

      <dl className="mt-auto grid grid-cols-1 gap-2 border-t border-dashed border-border pt-4 text-xs">
        <Row label="In" value={step.input} />
        <Row label="Out" value={step.output} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="w-10 shrink-0 font-mono uppercase tracking-wider text-subtle">
        {label}
      </dt>
      <dd className="truncate text-muted" title={value}>
        {value}
      </dd>
    </div>
  );
}
