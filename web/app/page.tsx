import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StepCard } from "@/components/step-card";
import { STEPS } from "@/lib/steps";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Pipeline />
        <Steps />
        <ClosingCTA />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
          A five-step system for shipping AI-built software
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Turn any idea into
          <br />
          <span className="italic">production-ready</span> software.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          Five AI prompts that work together as a complete system. You start with a rough
          idea. You end with clean, production-grade code — with AI doing the heavy lifting
          at every step.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/docs"
            className="group inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
          >
            Read the docs
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/docs/prd-generator"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-border-strong"
          >
            Start at Step 1
          </Link>
        </div>
      </div>
    </section>
  );
}

function Pipeline() {
  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            How it connects
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">
            Idea in. Production code out.
          </h2>
          <p className="mt-4 text-muted">
            Each prompt handles one stage. The output of one feeds straight into the next.
            Nothing is standalone — three locked documents (SSOT, Feature Spec, Progress)
            carry state from idea to ship.
          </p>
        </header>
        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.key} className="bg-bg p-6">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
                  Step {s.number}
                </span>
                {s.optional ? (
                  <span className="rounded-sm border border-border px-1.5 py-px font-mono text-[0.62rem] uppercase tracking-wider text-subtle">
                    optional
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 font-display text-2xl tracking-tight">{s.title}</h3>
              <p className="mt-2 font-mono text-xs text-subtle">
                {s.input} → {s.output}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            The prompts
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">
            Six prompts. One for every stage.
          </h2>
        </header>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <StepCard key={s.key} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
          The golden rule
        </p>
        <p className="mt-6 font-display text-3xl italic leading-[1.2] tracking-tight md:text-4xl">
          “Working code is not enough.
          <br />
          Code that passes tests but is messy, insecure, or inconsistent is still a problem.”
        </p>
        <p className="mt-8 text-muted">
          CODE-SMITH enforces production quality at every step. Every line reviewed. Every
          decision logged. Every session closed clean.
        </p>
        <div className="mt-10">
          <Link
            href="/docs"
            className="group inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
          >
            Read the docs
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
