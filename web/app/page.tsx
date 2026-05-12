import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StepCard } from "@/components/step-card";
import { STEPS } from "@/lib/steps";
import { Reveal } from "@/components/reveal";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { HeroIntro } from "@/components/hero-intro";

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
    <section className="relative overflow-hidden border-b border-border">
      <AmbientGrid />
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
        <HeroIntro />
      </div>
    </section>
  );
}

function Pipeline() {
  return (
    <section className="border-b border-border bg-surface/25">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <Reveal as="header" className="mb-16 max-w-2xl">
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
        </Reveal>
        <PipelineDiagram />
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal as="header" className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            The prompts
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">
            Six prompts. One for every stage.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.06} className="h-full">
              <StepCard step={s} />
            </Reveal>
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
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            The golden rule
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-display text-3xl italic leading-[1.2] tracking-tight md:text-4xl">
            “Working code is not enough.
            <br />
            Code that passes tests but is messy, insecure, or inconsistent is still a problem.”
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-8 text-muted">
            CODE-SMITH enforces production quality at every step. Every line reviewed.
            Every decision logged. Every session closed clean.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
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
        </Reveal>
      </div>
    </section>
  );
}

function AmbientGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
      }}
    />
  );
}

