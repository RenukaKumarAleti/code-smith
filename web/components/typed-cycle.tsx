"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Props = {
  words: string[];
  interval?: number;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function TypedCycle({ words, interval = 2400, className }: Props) {
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
    <motion.span
      layout
      transition={{ layout: { duration: 0.4, ease: EASE } }}
      className={`relative inline-flex items-baseline overflow-hidden align-baseline ${
        className ?? ""
      }`}
      aria-live="polite"
      style={{ verticalAlign: "baseline" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[idx]}
          initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          transition={{ duration: 0.32, ease: EASE }}
          className="whitespace-nowrap italic"
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
