"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project, StepState, StepStatus } from "./projects-types";
import { STORAGE_KEY } from "./projects-types";
import type { StepKey } from "./steps";

const V1_KEY = "codesmith:projects:v1";

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

type LegacyStepState = {
  status?: string;
  output?: string;
  completedAt?: number;
};

type LegacyProject = {
  id: string;
  name: string;
  idea?: string;
  description?: string;
  architecture?: string;
  createdAt: number;
  updatedAt: number;
  steps?: Record<string, LegacyStepState>;
};

function migrateV1(raw: LegacyProject[]): Project[] {
  return raw.map((p) => {
    const steps: Project["steps"] = {};
    for (const [k, v] of Object.entries(p.steps ?? {})) {
      const status: StepStatus = v?.status === "complete" ? "complete" : "not-started";
      steps[k as StepKey] = { status, completedAt: v?.completedAt };
    }
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? p.idea ?? "",
      architecture: p.architecture,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      steps,
    };
  });
}

function readStore(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Project[];
    // First-load migration: import legacy v1 projects if present.
    const v1 = localStorage.getItem(V1_KEY);
    if (v1) {
      const migrated = migrateV1(JSON.parse(v1) as LegacyProject[]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return [];
  } catch {
    return [];
  }
}

function writeStore(list: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("codesmith:projects-changed"));
  } catch {
    /* quota — silent */
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProjects(readStore());
    setHydrated(true);

    const sync = () => setProjects(readStore());
    window.addEventListener("storage", sync);
    window.addEventListener("codesmith:projects-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("codesmith:projects-changed", sync);
    };
  }, []);

  const create = useCallback((name: string, description: string): Project => {
    const now = Date.now();
    const p: Project = {
      id: genId(),
      name,
      description,
      createdAt: now,
      updatedAt: now,
      steps: {},
    };
    // Persist synchronously before returning so a follow-up navigation
    // can read the new project from localStorage immediately.
    const next = [p, ...readStore()];
    writeStore(next);
    setProjects(next);
    return p;
  }, []);

  const remove = useCallback((id: string) => {
    const next = readStore().filter((p) => p.id !== id);
    writeStore(next);
    setProjects(next);
  }, []);

  const update = useCallback(
    (id: string, patch: Partial<Pick<Project, "name" | "description" | "architecture">>) => {
      const next = readStore().map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p,
      );
      writeStore(next);
      setProjects(next);
    },
    [],
  );

  const setStep = useCallback(
    (projectId: string, stepKey: StepKey, patch: Partial<StepState>) => {
      const next = readStore().map((p) => {
        if (p.id !== projectId) return p;
        const current = p.steps[stepKey] ?? { status: "not-started" as const };
        return {
          ...p,
          updatedAt: Date.now(),
          steps: { ...p.steps, [stepKey]: { ...current, ...patch } },
        };
      });
      writeStore(next);
      setProjects(next);
    },
    [],
  );

  return {
    projects,
    hydrated,
    create,
    remove,
    update,
    setStep,
    get: (id: string) => projects.find((p) => p.id === id),
  };
}

export function projectProgress(p: Project, totalSteps: number) {
  const done = Object.values(p.steps).filter((s) => s?.status === "complete").length;
  return { done, total: totalSteps, percent: Math.round((done / totalSteps) * 100) };
}
