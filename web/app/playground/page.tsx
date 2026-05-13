import Link from "next/link";
import { ProjectList } from "@/components/walkthrough/project-list";

export const metadata = {
  title: "Playground — Your projects",
  description:
    "Run the CODE-SMITH pipeline in the playground. Your projects live in your browser. Nothing leaves this device.",
};

export default function PlaygroundPage() {
  return (
    <div>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            Playground
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-tight">
            Your projects.
          </h1>
          <p className="mt-4 text-muted">
            Each project is a workspace for the six prompts. Fill in the inputs, copy
            the prompt into your AI, then move to the next step. State stays in your
            browser.
          </p>
        </div>
        <Link
          href="/playground/new"
          className="inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          New project →
        </Link>
      </header>
      <ProjectList />
    </div>
  );
}
