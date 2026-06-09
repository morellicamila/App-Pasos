import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, PARTNERS, type Category, CATEGORY_MAP } from "@/lib/data";

export const Route = createFileRoute("/_app/explorar")({
  component: Explorar,
});

function Explorar() {
  const [view, setView] = useState<"map" | "list">("map");
  const [filter, setFilter] = useState<Category | "all">("all");

  const filtered = filter === "all" ? PARTNERS : PARTNERS.filter((p) => p.category === filter);

  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Explorar</div>
          <h1 className="font-display font-bold text-3xl tracking-tight">Roma · Condesa · Juárez</h1>
        </div>
        <div className="rounded-full bg-foreground/5 p-1 flex">
          <SegBtn active={view === "map"}  onClick={() => setView("map")}  label="Mapa" />
          <SegBtn active={view === "list"} onClick={() => setView("list")} label="Lista" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto py-4 -mx-5 px-5 no-scrollbar">
        <Chip active={filter === "all"} onClick={() => setFilter("all")} label="Todos" />
        {CATEGORIES.map((c) => {
          const Icon = c.Icon;
          return (
            <Chip
              key={c.id}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
              label={c.label}
              color={c.color}
              icon={<Icon className="h-4 w-4" strokeWidth={2.2} />}
            />
          );
        })}
      </div>

      {view === "map" ? <MapView partners={filtered} /> : <ListView partners={filtered} />}
    </div>
  );
}

function MapView({ partners }: { partners: typeof PARTNERS }) {
  return (
    <div className="relative rounded-[28px] overflow-hidden border border-border h-[460px] bg-surface">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 460" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#ECECEC" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="460" fill="url(#grid)" />
        <path d="M0 120 L400 100" stroke="#E0E0E0" strokeWidth="14" />
        <path d="M0 280 L400 300" stroke="#E0E0E0" strokeWidth="14" />
        <path d="M120 0 L130 460" stroke="#E0E0E0" strokeWidth="14" />
        <path d="M280 0 L260 460" stroke="#E0E0E0" strokeWidth="14" />
        <circle cx="200" cy="230" r="80" fill="#B8F5A0" opacity="0.25" />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 rounded-full bg-primary pulse-ring" />
        <span className="relative block h-4 w-4 rounded-full bg-foreground ring-4 ring-primary" />
      </div>

      {partners.map((p) => {
        const c = CATEGORY_MAP[p.category];
        const Icon = c.Icon;
        return (
          <Link
            key={p.id}
            to="/aliado/$id"
            params={{ id: p.id }}
            className="absolute -translate-x-1/2 -translate-y-full active:scale-95 transition"
            style={{ left: `${p.pin.x}%`, top: `${p.pin.y}%` }}
          >
            <div
              className="h-10 w-10 rounded-full grid place-items-center shadow-md border-2 border-background"
              style={{ background: c.color }}
            >
              <Icon className="h-5 w-5 text-foreground" strokeWidth={2.2} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-2 w-2 rotate-45" style={{ background: c.color }} />
          </Link>
        );
      })}

      <div className="absolute top-4 left-4 rounded-full bg-background/95 backdrop-blur px-3 py-1.5 font-mono text-[11px] tracking-wider border border-border">
        {partners.length} ALIADOS
      </div>
    </div>
  );
}

function ListView({ partners }: { partners: typeof PARTNERS }) {
  return (
    <ul className="space-y-3">
      {partners.map((p) => {
        const c = CATEGORY_MAP[p.category];
        const Icon = c.Icon;
        return (
          <li key={p.id}>
            <Link
              to="/aliado/$id"
              params={{ id: p.id }}
              className="flex items-center gap-4 rounded-2xl bg-card border-2 p-3 active:scale-[0.99] transition"
              style={{ borderColor: c.color }}
            >
              <div
                className="h-16 w-16 rounded-xl grid place-items-center shrink-0"
                style={{ background: `color-mix(in oklab, ${c.color} 22%, white)` }}
              >
                <Icon className="h-7 w-7 text-foreground" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate">{p.neighborhood} · {p.distanceM}m</div>
                <div className="text-xs text-foreground mt-1 truncate">{p.reward}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold">{p.priceTokens}</div>
                <div className="font-mono text-[10px] text-muted-foreground">TKN</div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SegBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-4 rounded-full text-sm font-medium transition ${
        active ? "bg-foreground text-background" : "text-foreground/70"
      }`}
    >
      {label}
    </button>
  );
}

function Chip({
  active, onClick, label, color, icon,
}: { active: boolean; onClick: () => void; label: string; color?: string; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 h-10 px-4 rounded-full text-sm font-medium border-2 transition inline-flex items-center gap-1.5 ${
        active ? "text-foreground" : "bg-background text-foreground/70 border-border"
      }`}
      style={active ? { backgroundColor: color ?? "var(--primary)", borderColor: color ?? "var(--primary)" } : undefined}
    >
      {icon}
      {label}
    </button>
  );
}
