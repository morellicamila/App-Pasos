import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Settings,
  ChevronRight,
  UserPlus,
  Bell,
  Shield,
  HeartPulse,
  MapPin,
  HelpCircle,
  FileText,
  LogOut,
  Trash2,
  Mail,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_app/perfil")({
  component: Perfil,
});

function Perfil() {
  return (
    <div className="px-5 pt-12 pb-6">
      {/* header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-primary grid place-items-center font-display font-black text-2xl">
          MA
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-xl">María A.</div>
          <div className="text-xs text-muted-foreground font-mono">EXPLORADOR · NIVEL 4</div>
        </div>
        <button
          className="h-10 w-10 rounded-full border border-border grid place-items-center text-foreground/70"
          aria-label="Ajustes"
        >
          <Settings className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {/* Account info */}
      <Section title="Información de cuenta">
        <Row icon={Mail} label="Correo" hint="maria.a@correo.com" />
        <Row icon={Settings} label="Editar perfil" />
      </Section>

      {/* Invite */}
      <Section title="Comunidad">
        <Row icon={UserPlus} label="Invitar amigos" hint="Gana 500 TKN por cada uno" />
      </Section>

      {/* Permissions */}
      <Section title="Permisos">
        <Row icon={Bell} label="Notificaciones" />
        <Row icon={Shield} label="Aviso de privacidad (INAI)" />
        <Row icon={HeartPulse} label="Salud" />
        <Row icon={MapPin} label="Ubicación" />
      </Section>

      {/* Help & Legal */}
      <Section title="Ayuda y legales">
        <Row icon={HelpCircle} label="Cómo funciona" />
        <Row icon={FileText} label="Términos y condiciones" />
      </Section>

      {/* Session */}
      <Section title="Sesión">
        <Row icon={LogOut} label="Cerrar sesión" as={Link} to="/" />
        <Row icon={Trash2} label="Eliminar cuenta" danger />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-2 px-1">
        {title}
      </h2>
      <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  hint,
  danger,
  as: As = "button",
  ...rest
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  danger?: boolean;
  as?: any;
  [k: string]: any;
}) {
  return (
    <As
      className={`w-full flex items-center gap-3 px-4 h-14 text-left ${
        danger ? "text-[var(--redeem)]" : ""
      }`}
      {...rest}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        {hint && <div className="text-xs text-muted-foreground truncate">{hint}</div>}
      </div>
      <ChevronRight className="h-4 w-4 text-foreground/40" />
    </As>
  );
}
