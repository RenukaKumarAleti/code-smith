"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { STEPS, type Step } from "@/lib/steps";

const EASE = [0.22, 1, 0.36, 1] as const;
const STAGGER = 0.11;

export function PipelineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const animate = inView && !reduced;

  return (
    <div ref={ref}>
      {/* Horizontal map — md and up */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between">
          {STEPS.map((step, i) => (
            <Fragment key={step.key}>
              <Node
                step={step}
                index={i}
                animate={animate}
                reduced={!!reduced}
              />
              {i < STEPS.length - 1 ? (
                <Connector
                  animate={animate}
                  reduced={!!reduced}
                  delay={i * STAGGER + 0.2}
                />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Vertical map — mobile */}
      <ol className="space-y-0 md:hidden">
        {STEPS.map((step, i) => (
          <NodeMobile
            key={step.key}
            step={step}
            index={i}
            animate={animate}
            reduced={!!reduced}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}

function Node({
  step,
  index,
  animate,
  reduced,
}: {
  step: Step;
  index: number;
  animate: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={
        animate
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 1, y: 0 }
            : undefined
      }
      transition={{ duration: 0.55, ease: EASE, delay: index * STAGGER }}
      className="flex w-[6.5rem] shrink-0 flex-col items-center text-center lg:w-32"
    >
      <Link
        href={`/docs/${step.key}`}
        className="group block w-full"
      >
        <Dot optional={step.optional} />
        <div className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-subtle">
          Step {step.number}
        </div>
        <div className="mt-1 font-display text-base leading-tight tracking-tight transition-colors group-hover:text-fg lg:text-lg">
          {step.shortTitle}
        </div>
        {step.optional ? (
          <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-subtle">
            optional
          </div>
        ) : null}
      </Link>
    </motion.div>
  );
}

function Connector({
  animate,
  reduced,
  delay,
}: {
  animate: boolean;
  reduced: boolean;
  delay: number;
}) {
  return (
    <div className="relative mt-[5px] h-[2px] flex-1">
      <motion.div
        initial={reduced ? undefined : { clipPath: "inset(0 100% 0 0)" }}
        animate={
          animate
            ? { clipPath: "inset(0 0% 0 0)" }
            : reduced
              ? { clipPath: "inset(0 0% 0 0)" }
              : undefined
        }
        transition={{ duration: 0.6, ease: EASE, delay }}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border-strong) 1px, transparent 1.5px)",
          backgroundSize: "10px 2px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "left center",
        }}
      />
    </div>
  );
}

function NodeMobile({
  step,
  index,
  animate,
  reduced,
  isLast,
}: {
  step: Step;
  index: number;
  animate: boolean;
  reduced: boolean;
  isLast: boolean;
}) {
  return (
    <li className="relative">
      <motion.div
        initial={reduced ? false : { opacity: 0, x: -10 }}
        animate={
          animate
            ? { opacity: 1, x: 0 }
            : reduced
              ? { opacity: 1, x: 0 }
              : undefined
        }
        transition={{ duration: 0.5, ease: EASE, delay: index * STAGGER }}
        className="flex items-start gap-4"
      >
        <div className="relative flex flex-col items-center">
          <Dot optional={step.optional} />
          {!isLast ? (
            <motion.div
              initial={reduced ? undefined : { clipPath: "inset(0 0 100% 0)" }}
              animate={
                animate
                  ? { clipPath: "inset(0 0 0% 0)" }
                  : reduced
                    ? { clipPath: "inset(0 0 0% 0)" }
                    : undefined
              }
              transition={{
                duration: 0.45,
                ease: EASE,
                delay: 0.2 + index * STAGGER,
              }}
              className="mt-2 h-12 w-[2px]"
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
        <Link
          href={`/docs/${step.key}`}
          className="group min-w-0 flex-1 pb-8 pt-px"
        >
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-subtle">
            Step {step.number}
            {step.optional ? " · optional" : ""}
          </div>
          <div className="mt-1 font-display text-xl leading-tight tracking-tight transition-colors group-hover:text-fg">
            {step.title}
          </div>
        </Link>
      </motion.div>
    </li>
  );
}

function Dot({ optional }: { optional?: boolean }) {
  if (optional) {
    return (
      <div
        aria-hidden
        className="mx-auto h-3 w-3 rounded-full border-2 border-dashed border-fg bg-bg"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="mx-auto h-3 w-3 rounded-full bg-fg ring-4 ring-fg/[0.06]"
    />
  );
}
