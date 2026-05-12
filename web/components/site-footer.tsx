export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          Built for solo founders, small teams, and anyone who wants to ship the right way from day one.
        </p>
        <p className="text-subtle">
          <span className="font-mono text-xs uppercase tracking-wider">code-smith</span>
          {" · a "}
          <a
            href="https://spotmies.ai"
            className="underline decoration-border-strong underline-offset-4 transition-colors hover:text-fg"
          >
            Spotmies
          </a>
          {" project"}
        </p>
      </div>
    </footer>
  );
}
