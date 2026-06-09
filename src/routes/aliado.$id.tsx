import { createFileRoute, Link, useNavigate, useParams, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Building2, Star, AlertTriangle, Check, type LucideIcon } from "lucide-react";
import { PARTNERS, CATEGORY_MAP, generateCode } from "@/lib/data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/aliado/$id")({
  component: AliadoDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Aliado no encontrado.</div>
  ),
  loader: ({ params }) => {
    const p = PARTNERS.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { partner: p };
  },
});

type Stage = "detail" | "geo-error" | "code" | "confirm";

function AliadoDetail() {
  const { id } = useParams({ from: "/aliado/$id" });
  const partner = useMemo(() => PARTNERS.find((p) => p.id === id)!, [id]);
  const cat = CATEGORY_MAP[partner.category];
  const navigate = useNavigate();
  const { tokens, spendTokens } = useAppState();

  const [stage, setStage] = useState<Stage>("detail");
  const [code] = useState(generateCode());
  const [seconds, setSeconds] = useState(15 * 60);
  const canAfford = tokens >= partner.priceTokens;

  // Mock: within geofence if distance <= 100
  const inGeofence = partner.distanceM <= 100;

  useEffect(() => {
    if (stage !== "code") return;
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage, seconds]);

  const tryRedeem = () => {
    if (!canAfford) return;
    if (!inGeofence) {
      setStage("geo-error");
      return;
    }
    spendTokens(partner.priceTokens);
    setStage("code");
  };

  if (stage === "confirm") return <ConfirmScreen partner={partner} cat={cat} onDone={() => navigate({ to: "/home" })} />;
  if (stage === "code")    return <CodeScreen code={code} seconds={seconds} cat={cat} partner={partner} onDone={() => setStage("confirm")} />;

  return (
    <div className="min-h-[100dvh] bg-background pb-32">
      {/* hero */}
      <div
        className="relative h-[300px] overflow-hidden"
        style={{ background: `color-mix(in oklab, ${cat.color} 24%, white)` }}
      >
        <div className="blob w-80 h-80 -top-16 -right-20 opacity-70" style={{ background: cat.color }} />
        <div className="blob w-56 h-56 -bottom-10 -left-10 opacity-50" style={{ background: cat.color }} />
        <div className="absolute inset-0 grid place-items-center">
          <cat.Icon className="h-32 w-32 text-foreground" strokeWidth={1.6} />
        </div>

        <Link
          to="/explorar"
          className="absolute top-12 left-4 h-10 w-10 rounded-full bg-background grid place-items-center shadow-md"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
        </Link>
        <div
          className="absolute top-12 right-4 rounded-full px-3 py-1.5 text-xs font-mono tracking-wider text-foreground"
          style={{ background: cat.color }}
        >
          {cat.label.toUpperCase()}
        </div>
      </div>

      <div className="px-5 -mt-6 relative">
        <div className="rounded-[28px] bg-card border border-border p-6 shadow-sm">
          <h1 className="font-display font-black text-3xl tracking-tight">{partner.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{partner.address}</p>

          <div className="flex items-center gap-2 mt-4">
            <Pill><MapPin className="h-3 w-3" /> {partner.distanceM} m</Pill>
            <Pill><Building2 className="h-3 w-3" /> {partner.neighborhood}</Pill>
            <Pill><Star className="h-3 w-3" fill="currentColor" /> 4.8</Pill>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-foreground p-5">
            <div className="text-xs font-mono tracking-widest text-muted-foreground">RECOMPENSA</div>
            <div className="font-display font-bold text-xl mt-1">{partner.reward}</div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="font-display font-black text-4xl tracking-tighter">
                  {partner.priceTokens.toLocaleString()}
                </div>
                <div className="font-mono text-xs text-muted-foreground">TOKENS</div>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                Tienes: {tokens.toLocaleString()}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-5">
            Para canjear, debes estar a 100 m o menos del local. El código será válido por 15 minutos.
          </p>
        </div>

        {stage === "geo-error" && (
          <div className="mt-4 rounded-2xl border-2 border-foreground bg-surface p-4 flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center shrink-0"><AlertTriangle className="h-4 w-4" strokeWidth={2.4} /></div>
            <div className="text-sm">
              <div className="font-display font-bold text-foreground">Acércate un poco más</div>
              <div className="text-muted-foreground mt-0.5">
                Estás a {partner.distanceM} m del local. El canje requiere estar dentro de 100 m. Camina hacia {partner.name} e intenta de nuevo.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent">
        <button
          onClick={tryRedeem}
          disabled={!canAfford}
          className="w-full h-14 rounded-full bg-[var(--redeem)] text-white font-display font-bold text-base disabled:bg-muted disabled:text-muted-foreground active:scale-[0.98] transition shadow-[0_8px_24px_-8px_rgba(255,107,53,0.6)]"
        >
          {canAfford ? `Canjear · ${partner.priceTokens.toLocaleString()} TKN` : "No tienes suficientes tokens"}
        </button>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/80 inline-flex items-center gap-1">
      {children}
    </span>
  );
}

function CodeScreen({
  code, seconds, cat, partner, onDone,
}: { code: string; seconds: number; cat: { color: string; Icon: LucideIcon; label: string }; partner: typeof PARTNERS[number]; onDone: () => void }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = (seconds / (15 * 60)) * 100;
  const expired = seconds === 0;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col px-5 pt-12 pb-8">
      <div className="text-center">
        <div className="text-xs font-mono tracking-widest text-muted-foreground">CÓDIGO DE CANJE</div>
        <div className="font-display font-bold text-xl mt-1">{partner.name}</div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div
          className="relative rounded-[32px] p-8 border-2"
          style={{ borderColor: cat.color, background: `color-mix(in oklab, ${cat.color} 14%, white)` }}
        >
          <div className="blob w-48 h-48 -top-10 -right-10 opacity-60" style={{ background: cat.color }} />
          <div className="relative z-10 text-center">
            <div
              className="font-mono font-bold tracking-[0.15em] text-foreground"
              style={{ fontSize: "clamp(40px, 13vw, 64px)" }}
            >
              {code}
            </div>
            <div className="mt-6 text-xs font-mono tracking-widest text-muted-foreground">
              MUÉSTRALO EN CAJA
            </div>

            {/* countdown */}
            <div className="mt-6 mx-auto max-w-[220px]">
              <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: expired ? "var(--destructive)" : "var(--foreground)" }}
                />
              </div>
              <div className="font-mono text-sm tracking-widest mt-2 text-foreground">
                {expired ? "EXPIRADO" : `EXPIRA EN ${mm}:${ss}`}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground max-w-[36ch] mx-auto">
          Una vez confirmado por {partner.name}, marca el canje como realizado.
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full h-14 rounded-full bg-primary text-primary-foreground font-display font-bold text-base active:scale-[0.98] transition"
      >
        Canje realizado
      </button>
    </div>
  );
}

function ConfirmScreen({
  partner, cat, onDone,
}: { partner: typeof PARTNERS[number]; cat: { color: string; Icon: LucideIcon; label: string }; onDone: () => void }) {
  const co2Saved = 0.18; // kg per visit (mock)
  return (
    <div className="relative min-h-[100dvh] bg-background overflow-hidden flex flex-col px-5 pt-16 pb-8">
      {/* celebration blobs */}
      <div className="blob bg-primary w-[420px] h-[420px] -top-40 -left-20 opacity-80" />
      <div className="blob w-72 h-72 -bottom-20 -right-16 opacity-60" style={{ background: cat.color }} />
      <div className="blob bg-[var(--streak)]/60 w-56 h-56 top-40 -right-20" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-full bg-foreground text-primary grid place-items-center mb-6 count-pop">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <div className="text-xs font-mono tracking-widest text-foreground/70">CANJE CONFIRMADO</div>
        <h1 className="font-display font-black text-4xl tracking-tight mt-2 leading-tight">
          ¡A disfrutar<br /> tu {partner.reward.toLowerCase()}!
        </h1>
        <p className="text-sm text-muted-foreground mt-3">en {partner.name}</p>

        <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-sm">
          <div className="rounded-2xl bg-background border border-border p-4 text-left">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">CO₂ AHORRADO</div>
            <div className="font-display font-black text-2xl tracking-tighter mt-1">
              {co2Saved.toFixed(2)}<span className="text-xs font-mono text-muted-foreground ml-1">kg</span>
            </div>
          </div>
          <div className="rounded-2xl bg-background border border-border p-4 text-left">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">PASOS DE HOY</div>
            <div className="font-display font-black text-2xl tracking-tighter mt-1">
              3,124
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onDone}
        className="relative z-10 w-full h-14 rounded-full bg-foreground text-background font-display font-bold text-base active:scale-[0.98] transition"
      >
        Seguir caminando
      </button>
    </div>
  );
}
