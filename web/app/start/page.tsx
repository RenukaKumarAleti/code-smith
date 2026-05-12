import Link from "next/link";
import { ProjectList } from "@/components/walkthrough/project-list";

export const metadata = {
  title: "Walkthrough — Your projects",
  description:
    "Run the CODE-SMITH pipeline as a guided walkthrough. Your projects live in your browser. Nothing leaves this device.",
};

export default function StartPage() {
  return (
    <div>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            Walkthrough
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-tight">
            Your projects.
          </h1>
          <p className="mt-4 text-muted">
            Every project tracks its own progress through the six prompts. All state lives
            in your browser — outputs you paste back here never leave this device.
          </p>
        </div>
        <Link
          href="/start/new"
          className="inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          New project →
        </Link>
      </header>
      <ProjectList />
    </div>
  );
}
