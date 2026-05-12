export type StepKey =
  | "prd-generator"
  | "architect"
  | "design-spec"
  | "feature-spec"
  | "agent-workflows"
  | "code-evaluator";

export type Step = {
  key: StepKey;
  number: string;
  title: string;
  shortTitle: string;
  blurb: string;
  optional?: boolean;
  folder: string;
  files: {
    prompt?: string;
    howToUse?: string;
    example?: string;
  };
  input: string;
  output: string;
  timeEstimate: string;
};

export const STEPS: Step[] = [
  {
    key: "prd-generator",
    number: "1",
    title: "PRD Generator",
    shortTitle: "PRD",
    blurb:
      "Turn a rough idea into an enterprise-grade Product Requirements Document through batched Q&A across 7 areas.",
    folder: "prd-generator",
    files: {
      prompt: "prd-generator-prompt.md",
      howToUse: "how-to-use.md",
      example: "example.md",
    },
    input: "Vague idea (one sentence)",
    output: "PRD.md (16 sections)",
    timeEstimate: "20–40 min Q&A",
  },
  {
    key: "architect",
    number: "2",
    title: "Architect",
    shortTitle: "Architect",
    blurb:
      "Reads the PRD and designs the full technical blueprint — tech stack, modules, database, security, deployment. Locks the SSOT every later session reads first.",
    folder: "product-initialisation",
    files: {
      prompt: "master-prompt-architect.md",
      howToUse: "how-to-use.md",
      example: "example.md",
    },
    input: "PRD.md",
    output: "ARCHITECTURE.md (with SSOT)",
    timeEstimate: "15–30 min Q&A",
  },
  {
    key: "design-spec",
    number: "2.5",
    title: "Design Spec",
    shortTitle: "Design",
    optional: true,
    blurb:
      "Optional. For user-facing or design-led products. Locks the visual & UX contract — tokens, components, wireframes, motion, a11y. Accepts Figma references.",
    folder: "design-spec",
    files: {
      prompt: "design-spec-master-prompt.md",
      howToUse: "how-to-use.md",
    },
    input: "PRD.md + ARCHITECTURE.md (+ optional Figma)",
    output: "DESIGN-SPEC.md (with Design SSOT)",
    timeEstimate: "20–40 min Q&A",
  },
  {
    key: "feature-spec",
    number: "3",
    title: "Feature Spec",
    shortTitle: "Feature",
    blurb:
      "A precise contract per complex feature — every endpoint, every state, every edge case, pre-written test descriptions, binary acceptance criteria.",
    folder: "feature-spec",
    files: {
      prompt: "feature-spec-master-prompt.md",
      howToUse: "how-to-use.md",
      example: "example.md",
    },
    input: "PRD.md + SSOT",
    output: "specs/FEATURE-SPEC-[F-ID].md",
    timeEstimate: "15–25 min per feature",
  },
  {
    key: "agent-workflows",
    number: "4",
    title: "Agent Workflows",
    shortTitle: "Workflows",
    blurb:
      "The daily coding-session prompt. Your AI plays 8 specialists — PM, Architect, Dev, QA, Code Enforcer, Tech Debt, Security, Docs. Updates PROGRESS.md and CHANGELOG.md every session.",
    folder: "agent-workflows",
    files: {
      prompt: "work-flows-generator.md",
      howToUse: "how-to-use.md",
    },
    input: "SSOT + active spec + last session memory",
    output: "Updated PROGRESS.md + CHANGELOG.md",
    timeEstimate: "5 min to open, runs alongside coding",
  },
  {
    key: "code-evaluator",
    number: "5",
    title: "Code Evaluator",
    shortTitle: "Evaluator",
    blurb:
      "Audits your code against the PRD and Feature Specs before launch. Scores 7 dimensions, gives a grade A–F, and emits a prioritised fix list.",
    folder: "code-evaluator",
    files: {
      prompt: "code-evaluator-master-prompt.md",
      example: "example.md",
    },
    input: "Code + PRD + Feature Specs",
    output: "Audit Report (scored A–F, fix list)",
    timeEstimate: "15–30 min per audit",
  },
];

export function getStep(key: string): Step | undefined {
  return STEPS.find((s) => s.key === key);
}
