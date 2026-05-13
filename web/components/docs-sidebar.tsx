"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STEPS } from "@/lib/steps";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Steps" className="text-sm">
      <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-subtle">
        Pipeline
      </p>
      <ul className="space-y-px">
        <li>
          <Link
            href="/docs"
            className={navItemClass(pathname === "/docs")}
          >
            <span className="font-mono text-xs text-subtle">00</span>
            <span>Overview</span>
          </Link>
        </li>
        {STEPS.map((step) => {
          const href = `/docs/${step.key}` as const;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={step.key}>
              <Link href={href} className={navItemClass(active)}>
                <span className="font-mono text-xs text-subtle">
                  {step.number.padStart(2, "0").replace(".", ".")}
                </span>
                <span>{step.title}</span>
                {step.optional ? (
                  <span className="ml-auto rounded-sm border border-border px-1.5 py-px font-mono text-[0.62rem] uppercase tracking-wider text-subtle">
                    optional
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function navItemClass(active: boolean) {
  return [
    "group flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors",
    active
      ? "bg-surface text-fg"
      : "text-muted hover:bg-surface hover:text-fg",
  ].join(" ");
}
