import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Heart } from "lucide-react";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  component: Onboarding,
});

type Step = 0 | 1 | 2;

function Onboarding() {
  const navigate = useNavigate();
  const { setOnboarded } = useAppState();
  const [step, setStep] = useState<Step>(0);
  const [consent, setConsent] = useState(false);
  const [healthLinked, setHealthLinked] = useState(false);

  const finish = () => {
    setOnboarded(true);
    navigate({ to: "/home" });
  };

  return (
    <div className="relative min-h-[100dvh] bg-background overflow-hidden flex flex-col">
      {/* organic blobs */}
      <div className="blob bg-primary/70 w-[420px] h-[420px] -top-32 -right-24" />
      <div className="blob bg-[var(--cat-bar)]/30 w-[260px] h-[260px] -bottom-20 -left-16" />

      {/* progress dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-14">
        {[0,1,2].map((i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-foreground" : "w-1.5 bg-foreground/20"}`}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-10 pb-8">
        {step === 0 && <Welcome onNext={() => setStep(1)} />}
        {step === 1 && (
          <Consent
            checked={consent}
            onCheck={setConsent}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <HealthLink
            linked={healthLinked}
            onLink={() => setHealthLinked(true)}
            onSkip={finish}
            onFinish={finish}
          />
        )}
      </div>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-mono tracking-wider">
          ANDALA · CDMX
        </div>
        <h1 className="font-display font-black text-[56px] leading-[0.95] tracking-tight mt-6">
          Camina.<br />
          Descubre.<br />
          <span className="relative inline-block">
            <span className="absolute inset-x-[-6px] bottom-1 h-5 bg-primary -z-10 rounded-sm" />
            Gana.
          </span>
        </h1>
        <p className="text-base text-muted-foreground mt-6 max-w-[28ch]">
          Cada paso por Roma, Condesa y Juárez se convierte en tokens para canjear con aliados locales.
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full h-14 rounded-full bg-primary text-primary-foreground font-display font-bold text-base shadow-[0_8px_24px_-8px_rgba(200,240,77,0.7)] active:scale-[0.98] transition"
      >
        Empezar
      </button>
    </>
  );
}

function Consent({
  checked, onCheck, onBack, onNext,
}: { checked: boolean; onCheck: (v: boolean) => void; onBack: () => void; onNext: () => void; }) {
  return (
    <>
      <button onClick={onBack} className="self-start -ml-2 mb-4 p-2 text-foreground/70" aria-label="Volver"><ArrowLeft className="h-5 w-5" /></button>
      <h2 className="font-display font-bold text-3xl tracking-tight">Tu privacidad, primero</h2>
      <p className="text-muted-foreground mt-3">
        Para cumplir con la <span className="font-medium text-foreground">Ley Federal de Protección de Datos Personales (INAI)</span>, necesitamos tu consentimiento explícito.
      </p>

      <div className="mt-6 rounded-3xl border border-border p-5 space-y-4 text-sm">
        <Row label="Pasos y distancia" detail="Solo agregados diarios" />
        <Row label="Ubicación aproximada" detail="Solo al canjear (geofencing)" />
        <Row label="Historial de canjes" detail="Para tus métricas de impacto" />
      </div>

      <label className="mt-6 flex items-start gap-3 cursor-pointer select-none">
        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onCheck(!checked)}
          className={`mt-0.5 h-6 w-6 rounded-md border-2 flex items-center justify-center transition ${
            checked ? "bg-foreground border-foreground" : "bg-background border-foreground/40"
          }`}
        >
          {checked && (
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="text-sm text-foreground leading-relaxed">
          Acepto el <span className="underline">Aviso de Privacidad</span> y autorizo el tratamiento de mis datos para uso de la app.
        </span>
      </label>

      <div className="flex-1" />
      <button
        disabled={!checked}
        onClick={onNext}
        className="w-full h-14 rounded-full bg-primary text-primary-foreground font-display font-bold text-base disabled:bg-muted disabled:text-muted-foreground transition active:scale-[0.98]"
      >
        {checked ? "Continuar" : "Marca la casilla para continuar"}
      </button>
    </>
  );
}

function Row({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-muted-foreground text-xs mt-0.5">{detail}</div>
      </div>
      <span className="font-mono text-[10px] tracking-wider text-foreground/60 mt-1">INAI</span>
    </div>
  );
}

function HealthLink({
  linked, onLink, onSkip, onFinish,
}: { linked: boolean; onLink: () => void; onSkip: () => void; onFinish: () => void; }) {
  return (
    <>
      <h2 className="font-display font-bold text-3xl tracking-tight">Conecta tus pasos</h2>
      <p className="text-muted-foreground mt-3">
        Sincroniza con <span className="font-medium text-foreground">HealthKit</span> o <span className="font-medium text-foreground">Health Connect</span> para validar tus pasos diarios.
      </p>

      <div className="mt-8 rounded-[28px] bg-surface border border-border p-6 relative overflow-hidden">
        <div className="blob bg-primary/50 w-40 h-40 -top-10 -right-10" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-background border border-border grid place-items-center">
            {linked ? <Check className="h-6 w-6 text-foreground" strokeWidth={2.6} /> : <Heart className="h-6 w-6 text-foreground" fill="currentColor" />}
          </div>
          <div>
            <div className="font-display font-bold text-lg">{linked ? "Conectado" : "Health Kit / Connect"}</div>
            <div className="text-xs text-muted-foreground font-mono">{linked ? "Sincronizando…" : "Permiso de lectura"}</div>
          </div>
        </div>
        {!linked && (
          <button
            onClick={onLink}
            className="mt-5 w-full h-12 rounded-full bg-foreground text-background font-display font-semibold text-sm active:scale-[0.98]"
          >
            Conectar ahora
          </button>
        )}
      </div>

      <div className="flex-1" />
      <button
        onClick={linked ? onFinish : onSkip}
        className="w-full h-14 rounded-full bg-primary text-primary-foreground font-display font-bold text-base active:scale-[0.98]"
      >
        {linked ? "Entrar a Andala" : "Ahora no"}
      </button>
    </>
  );
}
