import type { StepKey } from "./steps";

export type StepStatus = "not-started" | "complete";

export type StepState = {
  status: StepStatus;
  completedAt?: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  architecture?: string;
  createdAt: number;
  updatedAt: number;
  steps: Partial<Record<StepKey, StepState>>;
};

export const STORAGE_KEY = "codesmith:projects:v2";
