"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { STEPS, type Step } from "@/lib/steps";

const EASE = [0.22, 1, 0.36, 1] as const;

type ArtifactPreview = {
  filename: string;
  subtitle: string;
  // Each line is a width % — varied to look like real content
  lines: number[];
  tag: string;
};

const PREVIEWS: Record<string, ArtifactPreview> = {
  "prd-generator": {
    filename: "PRD.md",
    subtitle: "Product Requirements · 16 sections",
    lines: [100, 62, 86, 72, 92, 56, 80],
    tag: "Idea → Plan",
  },
  architect: {
    filename: "ARCHITECTURE.md",
    subtitle: "Technical Blueprint with SSOT",
    lines: [82, 96, 60, 90, 50, 76, 88],
    tag: "Plan → Blueprint",
  },
  "design-spec": {
    filename: "DESIGN-SPEC.md",
    subtitle: "Tokens · Components · States",
    lines: [70, 92, 65, 86, 55, 82, 68],
    tag: "Visual contract",
  },
  "feature-spec": {
    filename: "FEATURE-SPEC-F-005.md",
    subtitle: "Per-feature contract · 15 criteria",
    lines: [90, 75, 100, 60, 80, 45, 88],
    tag: "Per feature",
  },
  "agent-workflows": {
    filename: "PROGRESS.md · CHANGELOG.md",
    subtitle: "Session memory, every day",
    lines: [85, 55, 95, 70, 60, 90, 65],
    tag: "Every coding session",
  },
  "code-evaluator": {
    filename: "AUDIT.md",
    subtitle: "Scored A–F across 7 dimensions",
    lines: [60, 100, 80, 50, 95, 65, 78],
    tag: "Before launch",
  },
};

export function PipelineDiagram() {
  return (
    <>
      {/* Desktop: scrollytelling */}
      <div className="hidden lg:block">
        <PipelineScrollytelling />
      </div>
      {/* Mobile + tablet: simple vertical map */}
      <div className="lg:hidden">
        <PipelineMobile />
      </div>
    </>
  );
}

function PipelineScrollytelling() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Clamp [0, 1) so the last step holds at end-of-section.
    const idx = Math.min(STEPS.length - 1, Math.floor(latest * STEPS.length));
    if (idx !== activeIndex) setActiveIndex(idx);
  });

  if (reduced) {
    return <ReducedMotionFallback />;
  }

  const activeStep = STEPS[activeIndex];
  const preview = PREVIEWS[activeStep.key];

  return (
    <div ref={ref} className="relative" style={{ height: "240vh" }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="grid w-full grid-cols-[1fr_1.5fr] gap-12 xl:gap-20">
          {/* Left: stepper */}
          <nav aria-label="Pipeline progress">
            <ol>
              {STEPS.map((step, i) => (
                <StepperRow
                  key={step.key}
                  step={step}
                  index={i}
                  isLast={i === STEPS.length - 1}
                  active={i === activeIndex}
                  past={i < activeIndex}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </ol>
          </nav>

          {/* Right: artifact stage */}
          <div className="relative flex h-[24rem] items-center">
            <AnimatePresence mode="wait">
              <ArtifactCard
                key={activeStep.key}
                step={activeStep}
                preview={preview}
                index={activeIndex}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepperRow({
  step,
  index,
  isLast,
  active,
  past,
  scrollYProgress,
}: {
  step: Step;
  index: number;
  isLast: boolean;
  active: boolean;
  past: boolean;
  scrollYProgress: import("motion/react").MotionValue<number>;
}) {
  // This segment fills while the user is dwelling on this step.
  const segmentStart = index / STEPS.length;
  const segmentEnd = (index + 1) / STEPS.length;
  const fillHeight = useTransform(
    scrollYProgress,
    [segmentStart, segmentEnd],
    ["0%", "100%"],
    { clamp: true },
  );

  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-5">
      <div className="flex flex-col items-center">
        <Dot active={active} past={past} optional={!!step.optional} />
        {!isLast ? (
          <div className="relative my-2 w-[2px] flex-1 bg-border">
            <motion.div
              style={{ height: fillHeight }}
              className="absolute inset-x-0 top-0 origin-top bg-fg"
            />
          </div>
        ) : null}
      </div>
      <Link
        href={`/docs/${step.key}`}
        className={`group block min-w-0 ${isLast ? "" : "pb-7"}`}
      >
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-subtle">
          Step {step.number}
          {step.optional ? " · optional" : ""}
        </div>
        <div
          className={`mt-1 font-display text-xl leading-tight tracking-tight transition-colors duration-300 ${
            active
              ? "text-fg"
              : past
                ? "text-muted"
                : "text-subtle group-hover:text-fg"
          }`}
        >
          {step.title}
        </div>
      </Link>
    </li>
  );
}

function Dot({
  active,
  past,
  optional,
}: {
  active: boolean;
  past: boolean;
  optional: boolean;
}) {
  const base = "mt-1 h-3 w-3 shrink-0 rounded-full transition-all duration-500";
  if (optional && !active && !past) {
    return (
      <span aria-hidden className={`${base} border-2 border-dashed border-subtle bg-bg`} />
    );
  }
  if (active) {
    return (
      <span aria-hidden className={`${base} bg-fg ring-4 ring-fg/15`} />
    );
  }
  if (past) {
    return <span aria-hidden className={`${base} bg-fg`} />;
  }
  return (
    <span aria-hidden className={`${base} bg-bg ring-1 ring-border-strong`} />
  );
}

function ArtifactCard({
  step,
  preview,
  index,
}: {
  step: Step;
  preview: ArtifactPreview;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
      transition={{ duration: 0.32, ease: EASE }}
      className="w-full overflow-hidden rounded-xl border border-border bg-bg shadow-[0_24px_80px_-32px_rgba(10,10,10,0.18)]"
    >
      {/* Title bar — like a file viewer chrome */}
      <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-1.5 w-1.5 rounded-full bg-fg/70"
          />
          <span className="font-mono text-xs text-muted">{preview.filename}</span>
        </div>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-subtle">
          Step {step.number} · {index + 1} of {STEPS.length}
        </span>
      </header>

      {/* Document content */}
      <div className="px-6 py-7">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-subtle">
          {preview.tag}
        </p>
        <h3 className="mt-2 font-display text-3xl leading-tight tracking-tight">
          {step.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{preview.subtitle}</p>

        <div className="mt-6 space-y-2.5">
          {preview.lines.map((width, i) => (
            <motion.div
              key={`${step.key}-line-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 0.9, x: 0 }}
              transition={{
                duration: 0.35,
                ease: EASE,
                delay: 0.1 + i * 0.04,
              }}
              className="h-2 rounded-sm bg-border"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-dashed border-border bg-surface/40 px-5 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-subtle">
        <span>
          {index === 0
            ? "Generated from your idea"
            : `Generated from Step ${STEPS[index - 1].number} output`}
        </span>
        <Link
          href={`/docs/${step.key}`}
          className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
        >
          Read the prompt
          <span aria-hidden>→</span>
        </Link>
      </footer>
    </motion.article>
  );
}

function PipelineMobile() {
  return (
    <ol className="space-y-0">
      {STEPS.map((step, i) => (
        <Fragment key={step.key}>
          <MobileNode step={step} index={i} isLast={i === STEPS.length - 1} />
        </Fragment>
      ))}
    </ol>
  );
}

function MobileNode({
  step,
  isLast,
}: {
  step: Step;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <span
            aria-hidden
            className={
              step.optional
                ? "h-3 w-3 rounded-full border-2 border-dashed border-fg bg-bg"
                : "h-3 w-3 rounded-full bg-fg"
            }
          />
          {!isLast ? (
            <motion.div
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.2 }}
              className="mt-2 h-14 w-[2px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-border-strong) 1px, transparent 1.5px)",
                backgroundSize: "2px 10px",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "center top",
              }}
            />
          ) : null}
        </div>
        <Link href={`/docs/${step.key}`} className="group min-w-0 flex-1 pb-10 pt-px">
          <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-subtle">
            Step {step.number}
            {step.optional ? " · optional" : ""}
          </div>
          <div className="mt-1 font-display text-xl leading-tight tracking-tight transition-colors group-hover:text-fg">
            {step.title}
          </div>
          <p className="mt-1 font-mono text-xs text-subtle">
            {PREVIEWS[step.key].filename}
          </p>
        </Link>
      </div>
    </motion.li>
  );
}

function ReducedMotionFallback() {
  return (
    <ol className="space-y-6">
      {STEPS.map((step) => (
        <li key={step.key} className="flex items-start gap-5">
          <span
            aria-hidden
            className={
              step.optional
                ? "mt-2 h-3 w-3 shrink-0 rounded-full border-2 border-dashed border-fg bg-bg"
                : "mt-2 h-3 w-3 shrink-0 rounded-full bg-fg"
            }
          />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-subtle">
              Step {step.number}
              {step.optional ? " · optional" : ""}
            </div>
            <Link
              href={`/docs/${step.key}`}
              className="mt-1 inline-block font-display text-xl leading-tight tracking-tight hover:text-fg"
            >
              {step.title}
            </Link>
            <p className="mt-1 font-mono text-xs text-subtle">
              {PREVIEWS[step.key].filename}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
