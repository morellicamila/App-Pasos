import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame, ArrowRight } from "lucide-react";
import { useAppState, DAILY_STEP_GOAL } from "@/lib/app-state";
import { CATEGORIES, PARTNERS, type Category, CATEGORY_MAP } from "@/lib/data";

export const Route = createFileRoute("/_app/home")({
  component: Home,
});

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function Home() {
  const { steps, tokens, streakDays } = useAppState();
  const [filter, setFilter] = useState<Category | "all">("all");

  const pct = Math.min(100, (steps / DAILY_STEP_GOAL) * 100);
  const milestone1 = 2500;
  const milestone2 = 5000;

  const nearby = useMemo(() => {
    const list = filter === "all" ? PARTNERS : PARTNERS.filter((p) => p.category === filter);
    return list.slice(0, 6);
  }, [filter]);

  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{greet()},</div>
          <div className="font-display font-bold text-2xl tracking-tight">Camina hoy</div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-xs tracking-wider">{tokens.toLocaleString()} TKN</span>
        </div>
      </div>

      <section className="relative mt-7 rounded-[32px] bg-surface border border-border p-6 overflow-hidden">
        <div className="blob bg-primary/60 w-72 h-72 -top-20 -right-16" />
        <div className="relative z-10">
          <div className="text-xs font-mono tracking-widest text-muted-foreground">PASOS HOY</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="font-display font-black text-[88px] leading-[0.85] tracking-tighter count-pop">
              {steps.toLocaleString()}
            </div>
            <div className="font-mono text-xs text-muted-foreground pb-3">/ {DAILY_STEP_GOAL.toLocaleString()}</div>
          </div>

          <div className="mt-6 relative">
            <div className="h-3 rounded-full bg-foreground/10 overflow-hidden">
              <div className="h-full bg-foreground transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <Milestone pct={(milestone1 / DAILY_STEP_GOAL) * 100} label="2.5K" reached={steps >= milestone1} />
            <Milestone pct={(milestone2 / DAILY_STEP_GOAL) * 100} label="5K"   reached={steps >= milestone2} />
          </div>

          <Link
            to="/explorar"
            className="mt-7 flex items-center justify-center w-full h-14 rounded-full bg-primary text-primary-foreground font-display font-bold text-base active:scale-[0.98] transition shadow-[0_8px_24px_-8px_rgba(200,240,77,0.7)]"
          >
            Validar mis pasos
          </Link>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border-2 border-[var(--streak)] bg-[var(--streak)]/10 p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[var(--streak)] grid place-items-center">
          <Flame className="h-6 w-6 text-foreground" strokeWidth={2.2} />
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-foreground">Racha de {streakDays} días</div>
          <div className="text-xs text-muted-foreground">¡No la rompas! Camina mínimo 1.5K hoy.</div>
        </div>
        <span className="font-mono text-xs text-foreground">+15%</span>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display font-bold text-xl tracking-tight">Cerca de ti</h2>
          <Link to="/explorar" className="text-xs font-mono tracking-wider text-muted-foreground inline-flex items-center gap-1">
            VER TODO <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
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

        <div className="grid grid-cols-2 gap-3 mt-3">
          {nearby.map((p) => {
            const c = CATEGORY_MAP[p.category];
            const Icon = c.Icon;
            return (
              <Link
                key={p.id}
                to="/aliado/$id"
                params={{ id: p.id }}
                className="block rounded-2xl bg-card border-2 hover:-translate-y-0.5 transition active:scale-[0.98]"
                style={{ borderColor: c.color }}
              >
                <div
                  className="aspect-[4/3] rounded-t-[14px] relative overflow-hidden"
                  style={{ backgroundColor: `color-mix(in oklab, ${c.color} 18%, white)` }}
                >
                  <div className="blob w-32 h-32 -top-8 -right-8 opacity-50" style={{ background: c.color }} />
                  <div className="absolute bottom-2 left-2 h-9 w-9 rounded-full bg-background grid place-items-center shadow-sm">
                    <Icon className="h-5 w-5 text-foreground" strokeWidth={2.2} />
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 font-mono text-[10px] tracking-wider">
                    {p.distanceM}m
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-display font-bold text-sm leading-tight truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{p.neighborhood}</div>
                  <div className="mt-2 font-mono text-xs">
                    <span className="text-foreground font-bold">{p.priceTokens}</span>
                    <span className="text-muted-foreground"> TKN</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Milestone({ pct, label, reached }: { pct: number; label: string; reached: boolean }) {
  return (
    <div className="absolute -top-1.5" style={{ left: `calc(${pct}% - 14px)` }}>
      <div
        className={`h-6 px-2 rounded-full font-mono text-[10px] grid place-items-center border-2 transition ${
          reached ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-foreground/20"
        }`}
      >
        {label}
      </div>
    </div>
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
