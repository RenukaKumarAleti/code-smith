import { notFound } from "next/navigation";
import { getStep } from "@/lib/steps";
import { loadPromptText } from "@/lib/walkthrough";
import { StepRunner } from "@/components/walkthrough/step-runner";

type Props = { params: Promise<{ id: string; step: string }> };

export async function generateMetadata({ params }: Props) {
  const { step: key } = await params;
  const step = getStep(key);
  return { title: step ? `${step.title} — Walkthrough` : "Walkthrough" };
}

export default async function StepRunnerPage({ params }: Props) {
  const { id, step: key } = await params;
  const step = getStep(key);
  if (!step) notFound();

  const promptText = await loadPromptText(step);
  if (!promptText) notFound();

  return <StepRunner projectId={id} step={step} promptText={promptText} />;
}
