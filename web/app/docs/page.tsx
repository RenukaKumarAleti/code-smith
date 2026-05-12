import { StepCard } from "@/components/step-card";
import { STEPS } from "@/lib/steps";

export const metadata = {
  title: "Docs",
  description:
    "The six prompts that make up the CODE-SMITH system. Read each step, copy the prompt, follow the how-to-use guide.",
};

export default function DocsIndexPage() {
  return (
    <article>
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
          The pipeline
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">
          Six prompts. One system.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Each prompt handles one stage of building software. Use them in order, pass the
          output of one into the next, and your AI assistant becomes a full development
          team.
        </p>
      </header>
      <ol className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {STEPS.map((step) => (
          <li key={step.key}>
            <StepCard step={step} />
          </li>
        ))}
      </ol>
    </article>
  );
}
