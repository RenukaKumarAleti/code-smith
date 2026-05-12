import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-fg transition-transform duration-300 group-hover:scale-150"
          />
          <span className="font-display text-lg tracking-tight">code-smith</span>
        </Link>
        <nav className="flex items-center gap-7 text-sm">
          <Link
            href="/docs"
            className="text-muted transition-colors hover:text-fg"
          >
            Docs
          </Link>
          <Link
            href="/skills"
            className="text-muted transition-colors hover:text-fg"
          >
            Skills
          </Link>
          <a
            href="https://github.com/"
            className="text-muted transition-colors hover:text-fg"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
