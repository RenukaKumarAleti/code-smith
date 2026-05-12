"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project, StepState } from "./projects-types";
import { STORAGE_KEY } from "./projects-types";
import type { StepKey } from "./steps";

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function readStore(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

function writeStore(list: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Notify other tabs / hooks
    window.dispatchEvent(new CustomEvent("codesmith:projects-changed"));
  } catch {
    // quota exceeded — silent
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

  const create = useCallback((name: string, idea: string): Project => {
    const now = Date.now();
    const p: Project = {
      id: genId(),
      name,
      idea,
      createdAt: now,
      updatedAt: now,
      steps: {},
    };
    setProjects((prev) => {
      const next = [p, ...prev];
      writeStore(next);
      return next;
    });
    return p;
  }, []);

  const remove = useCallback((id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeStore(next);
      return next;
    });
  }, []);

  const rename = useCallback((id: string, name: string) => {
    setProjects((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
      );
      writeStore(next);
      return next;
    });
  }, []);

  const setStep = useCallback(
    (projectId: string, stepKey: StepKey, patch: Partial<StepState>) => {
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id !== projectId) return p;
          const current = p.steps[stepKey] ?? { status: "not-started" as const };
          return {
            ...p,
            updatedAt: Date.now(),
            steps: { ...p.steps, [stepKey]: { ...current, ...patch } },
          };
        });
        writeStore(next);
        return next;
      });
    },
    [],
  );

  return {
    projects,
    hydrated,
    create,
    remove,
    rename,
    setStep,
    get: (id: string) => projects.find((p) => p.id === id),
  };
}

export function projectProgress(p: Project, totalSteps: number) {
  const done = Object.values(p.steps).filter((s) => s?.status === "complete").length;
  return { done, total: totalSteps, percent: Math.round((done / totalSteps) * 100) };
}
