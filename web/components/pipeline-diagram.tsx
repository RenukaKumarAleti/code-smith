"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { STEPS } from "@/lib/steps";

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_DURATION = 0.55;
const CARD_STAGGER = 0.09;

export function PipelineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const animate = inView && !reduced;

  return (
    <div ref={ref} className="relative">
      {/* Desktop / tablet: horizontal flow */}
      <div className="hidden md:block">
        <ol className="relative grid grid-cols-6 gap-3 lg:gap-4">
          {/* Connector line behind cards */}
          <ConnectorH animate={animate} reduced={!!reduced} />

          {STEPS.map((step, i) => (
            <motion.li
              key={step.key}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={animate ? { opacity: 1, y: 0 } : reduced ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: CARD_DURATION,
                ease: EASE,
                delay: i * CARD_STAGGER,
              }}
              className="relative z-10"
            >
              <Token step={STEPS[i]} index={i} />
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Mobile: vertical flow */}
      <div className="md:hidden">
        <ol className="relative space-y-3">
          <ConnectorV animate={animate} reduced={!!reduced} />
          {STEPS.map((step, i) => (
            <motion.li
              key={step.key}
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={animate ? { opacity: 1, x: 0 } : reduced ? { opacity: 1, x: 0 } : undefined}
              transition={{
                duration: CARD_DURATION,
                ease: EASE,
                delay: i * CARD_STAGGER,
              }}
              className="relative z-10 pl-8"
            >
              <Token step={step} index={i} compact />
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Token({
  step,
  index,
  compact = false,
}: {
  step: (typeof STEPS)[number];
  index: number;
  compact?: boolean;
}) {
  const isOptional = !!step.optional;
  return (
    <Link
      href={`/docs/${step.key}`}
      className={[
        "group relative block rounded-lg border bg-bg p-4 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_8px_24px_-12px_rgba(10,10,10,0.18)]",
        isOptional ? "border-dashed border-border-strong" : "border-border",
        compact ? "" : "",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-subtle">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[0.78rem] text-fg">
          {step.number}
        </span>
      </div>
      <p className="mt-2 font-display text-lg leading-tight tracking-tight">
        {step.shortTitle}
      </p>
      <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
        {step.input.split(" ").slice(0, 3).join(" ")}
        {step.input.split(" ").length > 3 ? "…" : ""}
      </p>
      {isOptional ? (
        <span className="absolute right-3 top-3 rounded-sm bg-bg px-1 font-mono text-[0.55rem] uppercase tracking-wider text-subtle">
          opt.
        </span>
      ) : null}
    </Link>
  );
}

function ConnectorH({ animate, reduced }: { animate: boolean; reduced: boolean }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-px -translate-y-1/2"
      preserveAspectRatio="none"
      viewBox="0 0 1000 2"
    >
      <motion.line
        x1="0"
        y1="1"
        x2="1000"
        y2="1"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 6"
        className="text-border-strong"
        initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
        animate={
          animate
            ? { pathLength: 1, opacity: 1 }
            : reduced
              ? { pathLength: 1, opacity: 1 }
              : undefined
        }
        transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
      />
    </svg>
  );
}

function ConnectorV({ animate, reduced }: { animate: boolean; reduced: boolean }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-3 top-0 z-0 w-px text-border-strong"
      preserveAspectRatio="none"
      viewBox="0 0 2 1000"
    >
      <motion.line
        x1="1"
        y1="0"
        x2="1"
        y2="1000"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 6"
        initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
        animate={
          animate
            ? { pathLength: 1, opacity: 1 }
            : reduced
              ? { pathLength: 1, opacity: 1 }
              : undefined
        }
        transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
      />
    </svg>
  );
}
