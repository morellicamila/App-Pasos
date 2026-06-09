import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, ArrowRight } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { REDEMPTION_HISTORY, CATEGORY_MAP } from "@/lib/data";

export const Route = createFileRoute("/_app/actividad")({
  component: Actividad,
});

function Actividad() {
  const { tokens, streakDays, totalKm, totalCO2 } = useAppState();
  const totalSteps = 86420;

  return (
    <div className="px-5 pt-12">
      <div className="text-xs font-mono tracking-widest text-muted-foreground">ACTIVIDAD</div>
      <h1 className="font-display font-black text-3xl tracking-tighter mt-1">Tu progreso</h1>

      {/* tokens card */}
      <div className="mt-6 relative rounded-[28px] bg-foreground text-background p-6 overflow-hidden">
        <div className="blob bg-primary/40 w-56 h-56 -top-12 -right-10" />
        <div className="relative z-10">
          <div className="text-xs font-mono tracking-widest text-background/60">BALANCE</div>
          <div className="font-display font-black text-5xl tracking-tighter mt-1">
            {tokens.toLocaleString()} <span className="text-primary">TKN</span>
          </div>
          <div className="text-sm text-background/70 mt-1">Disponibles para canjear</div>
          <Link
            to="/explorar"
            className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm"
          >
            Canjear tokens
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </div>
      </div>

      {/* impact */}
      <h2 className="font-display font-bold text-xl tracking-tight mt-8">Impacto acumulado</h2>
      <div className="grid grid-cols-3 gap-3 mt-3">
        <Metric label="Pasos" value={totalSteps.toLocaleString()} unit="" color="var(--earn)" />
        <Metric label="Km" value={totalKm.toFixed(1)} unit="km" color="var(--cat-yoga)" />
        <Metric label="CO₂" value={totalCO2.toFixed(1)} unit="kg" color="var(--cat-bar)" />
      </div>

      <div className="mt-3 rounded-2xl border-2 border-[var(--streak)] bg-[var(--streak)]/10 p-4 flex items-center gap-4">
        <Flame className="h-7 w-7 text-[var(--streak)]" strokeWidth={2.2} />
        <div className="flex-1">
          <div className="font-display font-bold">Racha actual: {streakDays} días</div>
          <div className="text-xs text-muted-foreground">Tu mejor racha: 14 días</div>
        </div>
      </div>

      {/* history */}
      <h2 className="font-display font-bold text-xl tracking-tight mt-8">Historial de canjes</h2>
      <ul className="mt-3 mb-4 rounded-2xl border border-border overflow-hidden divide-y divide-border">
        {REDEMPTION_HISTORY.map((h) => {
          const c = CATEGORY_MAP[h.category];
          const Icon = c.Icon;
          return (
            <li key={h.id} className="flex items-center gap-3 p-4 bg-card">
              <div
                className="h-10 w-10 rounded-xl grid place-items-center"
                style={{ background: `color-mix(in oklab, ${c.color} 22%, white)` }}
              >
                <Icon className="h-5 w-5 text-foreground" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{h.partner}</div>
                <div className="text-xs text-muted-foreground font-mono">{h.date}</div>
              </div>
              <div className="font-mono text-sm text-[var(--redeem)]">−{h.tokens}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Metric({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="h-1.5 w-8 rounded-full mb-3" style={{ background: color }} />
      <div className="font-display font-black text-2xl tracking-tighter leading-none">
        {value}<span className="text-xs font-mono text-muted-foreground ml-1">{unit}</span>
      </div>
      <div className="text-[11px] text-muted-foreground font-mono tracking-wider mt-1 uppercase">{label}</div>
    </div>
  );
}
