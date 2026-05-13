"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProjects, projectProgress } from "@/lib/use-projects";
import { STEPS } from "@/lib/steps";
import type { StepKey } from "@/lib/steps";

export function ProjectDashboard({ projectId }: { projectId: string }) {
  const { projects, hydrated, update, remove } = useProjects();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");

  if (!hydrated) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <div className="rounded-lg border border-dashed border-border-strong bg-surface/30 p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
          Project not found
        </p>
        <p className="mt-3 text-muted">
          It may have been deleted, or this browser doesn’t have it stored.
        </p>
        <Link
          href="/playground"
          className="mt-7 inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm hover:border-border-strong"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  const progress = projectProgress(project, STEPS.length);

  return (
    <div>
      <nav className="mb-8 font-mono text-xs uppercase tracking-wider text-subtle">
        <Link href="/playground" className="transition-colors hover:text-fg">
          Playground
        </Link>
        <span className="mx-2 text-border-strong">/</span>
        <span className="text-fg">{project.name}</span>
      </nav>

      <header className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-10">
        <div className="max-w-2xl">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (draftName.trim()) {
                  update(project.id, { name: draftName.trim() });
                  setEditing(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => setEditing(false)}
                className="border-b border-border-strong bg-transparent font-display text-5xl tracking-tight outline-none"
              />
            </form>
          ) : (
            <h1
              className="cursor-text font-display text-5xl tracking-tight"
              onClick={() => {
                setDraftName(project.name);
                setEditing(true);
              }}
              title="Click to rename"
            >
              {project.name}
            </h1>
          )}
          <p className="mt-3 text-muted">{project.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
              Progress
            </p>
            <p className="font-display text-3xl tracking-tight">
              {progress.percent}<span className="text-subtle">%</span>
            </p>
          </div>
        </div>
      </header>

      <ol className="space-y-3">
        {STEPS.map((step, i) => {
          const state = project.steps[step.key];
          const status = state?.status ?? "not-started";
          return (
            <li key={step.key}>
              <StepRow
                index={i}
                stepKey={step.key}
                number={step.number}
                title={step.title}
                blurb={step.blurb}
                optional={!!step.optional}
                status={status}
                projectId={project.id}
              />
            </li>
          );
        })}
      </ol>

      <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
        <p className="text-xs text-subtle">
          Created {new Date(project.createdAt).toLocaleDateString()} · Updated{" "}
          {new Date(project.updatedAt).toLocaleString()}
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete "${project.name}"? This can't be undone.`)) {
              remove(project.id);
              router.push("/playground");
            }
          }}
          className="rounded-md border border-transparent px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-subtle transition-colors hover:border-border hover:text-fg"
        >
          Delete project
        </button>
      </div>
    </div>
  );
}

function StepRow({
  index,
  stepKey,
  number,
  title,
  blurb,
  optional,
  status,
  projectId,
}: {
  index: number;
  stepKey: StepKey;
  number: string;
  title: string;
  blurb: string;
  optional: boolean;
  status: "not-started" | "complete";
  projectId: string;
}) {
  const href = `/playground/${projectId}/${stepKey}` as const;
  return (
    <Link href={href}>
      <div
        className={[
          "group relative flex items-center gap-5 rounded-lg border px-5 py-5 transition-all hover:-translate-y-px hover:border-border-strong",
          optional
            ? "border-border-strong bg-fg/[0.035]"
            : "border-border bg-bg",
        ].join(" ")}
      >
        {optional ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-10 w-[3px] -translate-y-1/2 rounded-r-sm bg-fg"
          />
        ) : null}
        <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-subtle md:inline">
          {String(index + 1).padStart(2, "0")}
        </span>
        <StatusDot status={status} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
              Step {number}
            </span>
            <h2 className="font-display text-2xl tracking-tight">{title}</h2>
            {optional ? (
              <span className="rounded-sm bg-fg px-2 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-bg">
                Optional
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-muted">{blurb}</p>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-subtle">
          {status === "complete" ? "Done" : "Open"}
        </span>
        <span
          aria-hidden
          className="inline-block text-muted transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}

function StatusDot({ status }: { status: "not-started" | "complete" }) {
  const cls =
    status === "complete"
      ? "bg-fg"
      : "bg-transparent ring-1 ring-border-strong";
  return <span aria-hidden className={`inline-block h-2.5 w-2.5 rounded-full ${cls}`} />;
}
