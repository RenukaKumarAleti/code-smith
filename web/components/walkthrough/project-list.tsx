"use client";

import Link from "next/link";
import { useProjects, projectProgress } from "@/lib/use-projects";
import { STEPS } from "@/lib/steps";

export function ProjectList() {
  const { projects, hydrated, remove } = useProjects();

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-border bg-surface/40 p-8 text-sm text-muted">
        Loading your projects…
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-strong bg-surface/30 p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
          No projects yet
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight">
          Start your first one.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          A project tracks your progress through all six prompts. Outputs live in your
          browser — nothing leaves this device.
        </p>
        <Link
          href="/start/new"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          New project →
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border md:grid-cols-2">
      {projects.map((p) => {
        const progress = projectProgress(p, STEPS.length);
        return (
          <li key={p.id} className="group relative bg-bg p-6 transition-colors hover:bg-surface/50">
            <Link href={`/start/${p.id}`} className="block">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl tracking-tight">{p.name}</h3>
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                  {progress.done}/{progress.total}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{p.idea}</p>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar percent={progress.percent} />
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                  {progress.percent}%
                </span>
              </div>
              <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                Updated {relativeTime(p.updatedAt)}
              </p>
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (confirm(`Delete "${p.name}"? This can't be undone.`)) remove(p.id);
              }}
              className="absolute right-4 top-4 rounded-sm border border-transparent px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-subtle opacity-0 transition-all hover:border-border hover:text-fg group-hover:opacity-100"
            >
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full bg-fg transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}
