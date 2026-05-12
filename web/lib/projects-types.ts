import type { StepKey } from "./steps";

export type StepStatus = "not-started" | "in-progress" | "complete";

export type FeatureSpecArtifact = {
  id: string;
  name: string;
  output: string;
  completedAt: number;
};

export type StepState = {
  status: StepStatus;
  output?: string;
  notes?: string;
  completedAt?: number;
  features?: FeatureSpecArtifact[];
};

export type Project = {
  id: string;
  name: string;
  idea: string;
  createdAt: number;
  updatedAt: number;
  steps: Partial<Record<StepKey, StepState>>;
};

export const STORAGE_KEY = "codesmith:projects:v1";
