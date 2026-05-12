import Link from "next/link";
import { NewProjectForm } from "@/components/walkthrough/new-project-form";

export const metadata = {
  title: "New project — Walkthrough",
};

export default function NewProjectPage() {
  return (
    <div>
      <nav className="mb-8 font-mono text-xs uppercase tracking-wider text-subtle">
        <Link href="/start" className="transition-colors hover:text-fg">
          Walkthrough
        </Link>
        <span className="mx-2 text-border-strong">/</span>
        <span className="text-fg">New project</span>
      </nav>
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
          Walkthrough · Step 0
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">
          What are you building?
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          One sentence is enough. The PRD Generator will ask the rest of the questions.
        </p>
      </header>
      <NewProjectForm />
    </div>
  );
}
