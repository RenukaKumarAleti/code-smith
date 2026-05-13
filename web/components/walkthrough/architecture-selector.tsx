"use client";

export type ArchitectureKey =
  | "modular-monolith"
  | "microservices"
  | "mvc"
  | "layered"
  | "event-driven"
  | "hexagonal";

export type ArchitectureOption = {
  key: ArchitectureKey;
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  tradeoff: string;
};

export const ARCHITECTURES: ArchitectureOption[] = [
  {
    key: "modular-monolith",
    name: "Modular Monolith",
    tagline: "One deployable, clear module boundaries.",
    description:
      "A single application split into well-defined modules that communicate through internal interfaces. Ships as one process, but each module owns its data and contracts.",
    bestFor: "New products, small teams, or any team that wants service-level discipline without service-level ops.",
    tradeoff: "Scales as one unit. Can drift toward a tangled mess without strict module enforcement.",
  },
  {
    key: "microservices",
    name: "Microservices",
    tagline: "Independent services, independent deploys.",
    description:
      "Each capability is its own service with its own database, deployed and scaled independently. Services communicate over the network through an API gateway or message bus.",
    bestFor: "Multiple teams, high-scale systems, or domains that need independent release cycles.",
    tradeoff: "Operational complexity: distributed tracing, network failures, eventual consistency.",
  },
  {
    key: "mvc",
    name: "MVC",
    tagline: "Model, View, Controller — the classic.",
    description:
      "Three roles: Model holds data and business rules, View renders state, Controller handles user input and orchestrates the two.",
    bestFor: "CRUD-heavy web apps, admin panels, server-rendered UIs.",
    tradeoff: "Controllers can grow into god-objects. Business logic tends to leak across layers.",
  },
  {
    key: "layered",
    name: "Layered (N-tier)",
    tagline: "Top-down: UI → API → Domain → Data.",
    description:
      "Code is organised in horizontal layers. Each layer only talks to the one directly below it. Familiar, predictable, easy to reason about.",
    bestFor: "Enterprise apps, teams new to the domain, anything where predictability beats flexibility.",
    tradeoff: "Cross-cutting features touch every layer. Can become a stack of thin pass-through wrappers.",
  },
  {
    key: "event-driven",
    name: "Event-Driven",
    tagline: "Producers publish, consumers react.",
    description:
      "Components don't call each other directly. They publish events to a bus; other components subscribe to the events they care about. Loosely coupled by design.",
    bestFor: "Async workflows, integrations, anything where you want to add a new consumer without touching producers.",
    tradeoff: "Hard to trace a single flow. Eventual consistency, ordering, and replay become real problems.",
  },
  {
    key: "hexagonal",
    name: "Hexagonal (Ports & Adapters)",
    tagline: "A clean core, swappable edges.",
    description:
      "The business logic sits in the center, completely unaware of frameworks or I/O. Adapters at the edges translate between the core and the outside world (DB, HTTP, queues).",
    bestFor: "Long-lived products, domains where business rules outlive technology choices.",
    tradeoff: "More files, more indirection. Overkill for simple CRUD.",
  },
];

export function getArchitecture(key: string | undefined): ArchitectureOption {
  return ARCHITECTURES.find((a) => a.key === key) ?? ARCHITECTURES[0];
}

type Props = {
  value: ArchitectureKey;
  onChange: (key: ArchitectureKey) => void;
};

export function ArchitectureSelector({ value, onChange }: Props) {
  const selected = getArchitecture(value);
  return (
    <div className="space-y-6">
      <ArchKeyframes />
      <div className="flex flex-wrap gap-2">
        {ARCHITECTURES.map((arch) => {
          const active = arch.key === value;
          return (
            <button
              key={arch.key}
              type="button"
              onClick={() => onChange(arch.key)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition-all",
                active
                  ? "border-fg bg-fg text-bg"
                  : "border-border text-muted hover:border-border-strong hover:text-fg",
              ].join(" ")}
            >
              {arch.name}
              {arch.key === "modular-monolith" ? (
                <span
                  className={[
                    "ml-2 rounded-sm px-1.5 py-px font-mono text-[0.55rem] uppercase tracking-wider",
                    active ? "bg-bg/15 text-bg" : "bg-fg/10 text-fg",
                  ].join(" ")}
                >
                  default
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-surface/30 p-6 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-md border border-border bg-bg p-4 min-h-[260px]">
          <ArchVisualization key={selected.key} kind={selected.key} />
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-subtle">
              Selected
            </p>
            <h3 className="mt-1 font-display text-2xl tracking-tight">{selected.name}</h3>
            <p className="mt-1 text-sm italic text-muted">{selected.tagline}</p>
          </div>
          <p className="text-sm leading-relaxed text-muted">{selected.description}</p>
          <dl className="space-y-2 border-t border-dashed border-border pt-4 text-sm">
            <Row label="Best for" value={selected.bestFor} />
            <Row label="Tradeoff" value={selected.tradeoff} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-subtle">
        {label}
      </dt>
      <dd className="mt-1 text-muted">{value}</dd>
    </div>
  );
}

function ArchVisualization({ kind }: { kind: ArchitectureKey }) {
  switch (kind) {
    case "modular-monolith":
      return <VizModularMonolith />;
    case "microservices":
      return <VizMicroservices />;
    case "mvc":
      return <VizMVC />;
    case "layered":
      return <VizLayered />;
    case "event-driven":
      return <VizEventDriven />;
    case "hexagonal":
      return <VizHexagonal />;
  }
}

/* ---------------- Visualizations ---------------- */

function VizModularMonolith() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full max-w-[360px]" aria-label="Modular Monolith">
      <rect
        x="14"
        y="14"
        width="292"
        height="192"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <text x="160" y="36" textAnchor="middle" className="arch-label-strong">
        Single deployable
      </text>
      {[
        { x: 40, y: 70, label: "Users" },
        { x: 180, y: 70, label: "Billing" },
        { x: 40, y: 140, label: "Catalog" },
        { x: 180, y: 140, label: "Orders" },
      ].map((m) => (
        <g key={m.label}>
          <rect
            x={m.x}
            y={m.y}
            width="100"
            height="48"
            rx="8"
            fill="currentColor"
            fillOpacity="0.04"
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          <text x={m.x + 50} y={m.y + 29} textAnchor="middle" className="arch-label">
            {m.label}
          </text>
        </g>
      ))}
      {/* in-process connectors */}
      <line x1="140" y1="94" x2="180" y2="94" className="arch-flow" />
      <line x1="140" y1="164" x2="180" y2="164" className="arch-flow" />
      <line x1="90" y1="118" x2="90" y2="140" className="arch-flow" />
      <line x1="230" y1="118" x2="230" y2="140" className="arch-flow" />
    </svg>
  );
}

function VizMicroservices() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full max-w-[360px]" aria-label="Microservices">
      {/* gateway */}
      <rect
        x="120"
        y="14"
        width="80"
        height="36"
        rx="8"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeOpacity="0.7"
      />
      <text x="160" y="37" textAnchor="middle" className="arch-label-strong">
        API Gateway
      </text>

      {[
        { x: 20, y: 110, label: "Users", db: "U" },
        { x: 120, y: 110, label: "Billing", db: "B" },
        { x: 220, y: 110, label: "Catalog", db: "C" },
      ].map((s) => (
        <g key={s.label}>
          <rect
            x={s.x}
            y={s.y}
            width="80"
            height="40"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
          />
          <text x={s.x + 40} y={s.y + 25} textAnchor="middle" className="arch-label">
            {s.label}
          </text>
          {/* db */}
          <ellipse
            cx={s.x + 40}
            cy={s.y + 80}
            rx="22"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          <line
            x1={s.x + 18}
            y1={s.y + 80}
            x2={s.x + 18}
            y2={s.y + 90}
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          <line
            x1={s.x + 62}
            y1={s.y + 80}
            x2={s.x + 62}
            y2={s.y + 90}
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          <ellipse
            cx={s.x + 40}
            cy={s.y + 90}
            rx="22"
            ry="6"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          {/* connector */}
          <line
            x1={s.x + 40}
            y1="50"
            x2={s.x + 40}
            y2={s.y}
            className="arch-flow"
          />
        </g>
      ))}
    </svg>
  );
}

function VizMVC() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full max-w-[360px]" aria-label="MVC">
      {[
        { cx: 160, cy: 40, label: "View" },
        { cx: 60, cy: 170, label: "Model" },
        { cx: 260, cy: 170, label: "Controller" },
      ].map((n) => (
        <g key={n.label}>
          <circle
            cx={n.cx}
            cy={n.cy}
            r="34"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeOpacity="0.6"
          />
          <text x={n.cx} y={n.cy + 5} textAnchor="middle" className="arch-label-strong">
            {n.label}
          </text>
        </g>
      ))}
      {/* arrows around triangle */}
      <path
        d="M 88 152 Q 160 110 232 152"
        className="arch-flow"
        fill="none"
      />
      <path
        d="M 236 138 Q 220 90 178 56"
        className="arch-flow"
        fill="none"
      />
      <path
        d="M 142 56 Q 100 90 84 138"
        className="arch-flow"
        fill="none"
      />
    </svg>
  );
}

function VizLayered() {
  const layers = [
    { y: 22, label: "Presentation" },
    { y: 70, label: "Application / API" },
    { y: 118, label: "Domain" },
    { y: 166, label: "Data" },
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full max-w-[360px]" aria-label="Layered">
      {layers.map((l, i) => (
        <g key={l.label}>
          <rect
            x="40"
            y={l.y}
            width="240"
            height="36"
            rx="6"
            fill="currentColor"
            fillOpacity={0.04 + i * 0.025}
            stroke="currentColor"
            strokeOpacity="0.5"
          />
          <text x="160" y={l.y + 22} textAnchor="middle" className="arch-label">
            {l.label}
          </text>
        </g>
      ))}
      {/* flow arrow down through layers */}
      <line x1="160" y1="58" x2="160" y2="70" className="arch-flow" />
      <line x1="160" y1="106" x2="160" y2="118" className="arch-flow" />
      <line x1="160" y1="154" x2="160" y2="166" className="arch-flow" />
    </svg>
  );
}

function VizEventDriven() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full max-w-[360px]" aria-label="Event Driven">
      {/* producers top */}
      {[
        { x: 30, label: "Order" },
        { x: 130, label: "Payment" },
        { x: 230, label: "Inventory" },
      ].map((p) => (
        <g key={p.label}>
          <rect
            x={p.x}
            y="14"
            width="60"
            height="32"
            rx="6"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeOpacity="0.55"
          />
          <text x={p.x + 30} y="34" textAnchor="middle" className="arch-label-sm">
            {p.label}
          </text>
          <line x1={p.x + 30} y1="46" x2={p.x + 30} y2="100" className="arch-flow" />
        </g>
      ))}
      {/* event bus pill */}
      <rect
        x="20"
        y="100"
        width="280"
        height="38"
        rx="19"
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
        strokeOpacity="0.7"
      />
      <text x="160" y="124" textAnchor="middle" className="arch-label-strong">
        Event bus
      </text>
      {/* moving dots inside bus */}
      <circle r="3" fill="currentColor" className="arch-bus-dot bus-1">
        <animateMotion dur="3s" repeatCount="indefinite" path="M 30 119 L 290 119" />
      </circle>
      <circle r="3" fill="currentColor" className="arch-bus-dot bus-2">
        <animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M 30 119 L 290 119" />
      </circle>
      <circle r="3" fill="currentColor" className="arch-bus-dot bus-3">
        <animateMotion dur="3s" begin="2s" repeatCount="indefinite" path="M 30 119 L 290 119" />
      </circle>
      {/* consumers bottom */}
      {[
        { x: 30, label: "Email" },
        { x: 130, label: "Analytics" },
        { x: 230, label: "Audit" },
      ].map((c) => (
        <g key={c.label}>
          <line x1={c.x + 30} y1="138" x2={c.x + 30} y2="190" className="arch-flow" />
          <rect
            x={c.x}
            y="190"
            width="60"
            height="32"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
          />
          <text x={c.x + 30} y="210" textAnchor="middle" className="arch-label-sm">
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function VizHexagonal() {
  // hex centered at 160, 120, side ~ 70
  const cx = 160;
  const cy = 120;
  const s = 60;
  const pts = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + s * Math.cos(a)},${cy + s * Math.sin(a)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full max-w-[360px]" aria-label="Hexagonal">
      <polygon
        points={pts}
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.75"
      />
      <text x={cx} y={cy - 4} textAnchor="middle" className="arch-label-strong">
        Domain
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="arch-label-sm">
        (pure)
      </text>

      {/* adapters around */}
      {[
        { x: 18, y: 18, label: "HTTP" },
        { x: 240, y: 18, label: "CLI" },
        { x: 240, y: 190, label: "Queue" },
        { x: 18, y: 190, label: "DB" },
      ].map((a) => (
        <g key={a.label}>
          <rect
            x={a.x}
            y={a.y}
            width="62"
            height="30"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
          />
          <text x={a.x + 31} y={a.y + 19} textAnchor="middle" className="arch-label-sm">
            {a.label}
          </text>
        </g>
      ))}

      {/* ports (small circles on hex edge) + flow lines */}
      <line x1="80" y1="33" x2="118" y2="80" className="arch-flow" />
      <line x1="240" y1="33" x2="202" y2="80" className="arch-flow" />
      <line x1="240" y1="205" x2="202" y2="160" className="arch-flow" />
      <line x1="80" y1="205" x2="118" y2="160" className="arch-flow" />

      <circle cx="118" cy="80" r="4" fill="var(--color-bg)" stroke="currentColor" strokeOpacity="0.7" />
      <circle cx="202" cy="80" r="4" fill="var(--color-bg)" stroke="currentColor" strokeOpacity="0.7" />
      <circle cx="202" cy="160" r="4" fill="var(--color-bg)" stroke="currentColor" strokeOpacity="0.7" />
      <circle cx="118" cy="160" r="4" fill="var(--color-bg)" stroke="currentColor" strokeOpacity="0.7" />
    </svg>
  );
}

/* keyframes + classes for animated lines & labels */
function ArchKeyframes() {
  return (
    <style>{`
      .arch-label, .arch-label-strong, .arch-label-sm {
        font-family: var(--font-mono);
        fill: var(--color-fg);
      }
      .arch-label { font-size: 11px; }
      .arch-label-sm { font-size: 10px; }
      .arch-label-strong { font-size: 12px; font-weight: 600; }

      .arch-flow {
        stroke: var(--color-fg);
        stroke-opacity: 0.55;
        stroke-width: 1.5;
        stroke-dasharray: 4 4;
        animation: arch-dash 1.6s linear infinite;
      }
      @keyframes arch-dash {
        to { stroke-dashoffset: -16; }
      }
      .arch-bus-dot { opacity: 0.85; }
      @media (prefers-reduced-motion: reduce) {
        .arch-flow { animation: none; }
        .arch-bus-dot { display: none; }
      }
    `}</style>
  );
}
