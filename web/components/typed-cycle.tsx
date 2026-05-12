"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Props = {
  words: string[];
  interval?: number;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function TypedCycle({ words, interval = 2200, className }: Props) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [interval, words.length, reduced]);

  if (reduced) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span
      className={`relative inline-block align-baseline ${className ?? ""}`}
      aria-live="polite"
    >
      {/* Sizing ghost — keeps layout stable across the longest word */}
      <span aria-hidden className="invisible whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[idx]}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute left-0 right-0 whitespace-nowrap italic"
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
