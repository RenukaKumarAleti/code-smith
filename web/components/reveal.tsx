"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type Tag = "div" | "section" | "header" | "article" | "li" | "ol" | "ul" | "p" | "span";

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: Tag;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 16,
  as = "div",
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (motion as any)[as];

  if (reduced) {
    return <Tag {...rest}>{children}</Tag>;
  }

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      viewport={{ once: true, margin: "-8% 0px" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
