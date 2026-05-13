"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { TypedCycle } from "./typed-cycle";

const EASE = [0.22, 1, 0.36, 1] as const;

const IDEA_WORDS = ["idea", "sketch", "scribble", "Slack DM", "napkin sketch"];

export function HeroIntro() {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? { initial: false }
      : ({
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: EASE, delay },
      } as const);

  return (
    <>
      <motion.p
        {...fadeUp(0)}
        className="font-mono text-xs uppercase tracking-[0.22em] text-subtle"
      >
        A five-step system for shipping AI-built software
      </motion.p>

      <motion.h1
        {...fadeUp(0.12)}
        className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl"
      >
        <span className="block">Turn any <TypedCycle
          words={IDEA_WORDS}
          className="font-display italic text-fg"
        /></span>
        <span className="block">
          into{" "}
          <span className="relative inline-block">
            <span className="italic">production-ready</span>
            <motion.span
              aria-hidden
              initial={reduced ? false : { scaleX: 0 }}
              animate={reduced ? undefined : { scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
              className="absolute -bottom-1 left-0 right-0 h-[2px] origin-left bg-fg"
            />
          </span>{" "}
          software.
        </span>
      </motion.h1>

      <motion.p
        {...fadeUp(0.3)}
        className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
      >
        Five AI prompts that work together as a complete system. You start with a rough
        idea. You end with clean, production-grade code — with AI doing the heavy lifting
        at every step.
      </motion.p>

      <motion.div
        {...fadeUp(0.45)}
        className="mt-10 flex flex-wrap items-center gap-4"
      >
        <Link
          href="/playground/new"
          className="group inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
        >
          Start a project
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-border-strong"
        >
          Read the docs
        </Link>
      </motion.div>
    </>
  );
}
