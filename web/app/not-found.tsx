import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col items-start justify-center px-6 py-32">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
          404 — Not Found
        </p>
        <h1 className="mt-4 font-display text-6xl tracking-tight">
          That page hasn’t been written yet.
        </h1>
        <p className="mt-5 max-w-xl text-muted">
          Either it moved, never existed, or it’s waiting for its own Feature Spec.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          Back home →
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
