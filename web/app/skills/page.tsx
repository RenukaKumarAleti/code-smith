import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Skills",
  description:
    "Curated third-party Claude skills that pair well with CODE-SMITH — design libraries, agent skills, and reference collections.",
};

type SkillEntry = {
  name: string;
  href: string;
  blurb: string;
  pairsWith: string;
};

const SKILLS: SkillEntry[] = [
  {
    name: "anthropics/skills",
    href: "https://github.com/anthropics/skills",
    blurb:
      "The official Anthropic agent skills repo. Foundation layer — load these first.",
    pairsWith: "Steps 2–5",
  },
  {
    name: "nexu-io/open-design",
    href: "https://github.com/nexu-io/open-design",
    blurb:
      "57 design skills + 71 brand-grade design systems. Runs across Claude Code, Codex, Cursor, Gemini, and more.",
    pairsWith: "Step 2.5 — Design Spec",
  },
  {
    name: "Claude Design (Anthropic Labs)",
    href: "https://www.anthropic.com/news/claude-design-anthropic-labs",
    blurb:
      "Anthropic Labs' Claude Design — turns Claude into an expert designer for HTML artifacts, decks, and landing pages.",
    pairsWith: "Step 2.5 — Design Spec",
  },
  {
    name: "Marie Claire Dean — 63 Design Skills",
    href: "https://marieclairedean.substack.com/p/i-built-63-design-skills-for-claude",
    blurb:
      "63 design skills + 27 commands organised across research, systems, UI, interaction, prototyping, and ops.",
    pairsWith: "Step 2.5 — Design Spec",
  },
  {
    name: "rohitg00/awesome-claude-design",
    href: "https://github.com/rohitg00/awesome-claude-design",
    blurb:
      "Curated DESIGN.md prompts by aesthetic family, plus remix recipes and video teardowns.",
    pairsWith: "Step 2.5 — Design Spec",
  },
  {
    name: "ComposioHQ/awesome-claude-skills",
    href: "https://github.com/ComposioHQ/awesome-claude-skills",
    blurb:
      "Catch-all curated list of Claude skills, resources, and tools for customising Claude workflows.",
    pairsWith: "Steps 2–5",
  },
];

export default function SkillsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-subtle">
            Skills
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-tight">
            Skills worth loading.
          </h1>
          <p className="mt-5 text-lg text-muted">
            CODE-SMITH is the system. These are the third-party skills that pair well
            with it. Load them in your AI assistant when you reach the matching step.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border">
          {SKILLS.map((s) => (
            <li key={s.name} className="bg-bg">
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-3 p-6 transition-colors hover:bg-surface md:flex-row md:items-start md:gap-8"
              >
                <div className="md:w-64 md:shrink-0">
                  <p className="font-display text-xl tracking-tight">{s.name}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-subtle">
                    Pairs with {s.pairsWith}
                  </p>
                </div>
                <p className="text-sm text-muted">{s.blurb}</p>
                <span
                  aria-hidden
                  className="hidden self-start font-mono text-xs text-subtle transition-transform group-hover:translate-x-1 md:inline"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-muted">
          Want your skill listed? Open an issue on the CODE-SMITH GitHub.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
