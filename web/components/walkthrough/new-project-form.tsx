"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/use-projects";

export function NewProjectForm() {
  const router = useRouter();
  const { create } = useProjects();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    startTransition(() => {
      const project = create(name.trim(), description.trim());
      router.push(`/playground/${project.id}`);
    });
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-8">
      <div>
        <label htmlFor="name" className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-subtle">
          Project name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
          placeholder="Shift Swaps"
          className="mt-2 block w-full rounded-md border border-border bg-bg px-4 py-3 text-base text-fg outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-fg/10"
        />
      </div>

      <div>
        <label htmlFor="description" className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-subtle">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          maxLength={1000}
          placeholder="An app where restaurant managers post open shifts and staff pick them up."
          className="mt-2 block w-full resize-none rounded-md border border-border bg-bg px-4 py-3 text-base text-fg outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-fg/10"
        />
        <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
          {description.length} / 1000
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <button
          type="submit"
          disabled={submitting || !name.trim() || !description.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {submitting ? "Creating…" : "Create & start →"}
        </button>
        <p className="text-xs text-subtle">
          Stays in this browser. Nothing uploaded.
        </p>
      </div>
    </form>
  );
}
