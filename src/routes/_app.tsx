import type { ReactElement } from "react";
import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-5 pt-2 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-md rounded-full bg-foreground text-background flex items-center justify-between px-2 py-2 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)]">
          <TabLink to="/home"      active={pathname.startsWith("/home")}      label="Inicio"    icon={IconHome} />
          <TabLink to="/explorar"  active={pathname.startsWith("/explorar")}  label="Explorar"  icon={IconMap} />
          <TabLink to="/actividad" active={pathname.startsWith("/actividad")} label="Actividad" icon={IconActivity} />
          <TabLink to="/perfil"    active={pathname.startsWith("/perfil")}    label="Perfil"    icon={IconUser} />
        </div>
      </nav>
    </div>
  );
}

function TabLink({
  to, active, label, icon: Icon,
}: { to: string; active: boolean; label: string; icon: (p: { className?: string }) => ReactElement }) {
  return (
    <Link
      to={to}
      className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-full text-sm font-medium transition-all ${
        active ? "bg-primary text-primary-foreground" : "text-background/70"
      }`}
    >
      <Icon className="h-5 w-5" />
      {active && <span className="font-display font-bold">{label}</span>}
    </Link>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9h14v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" strokeLinejoin="round"/>
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}
function IconUser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function IconActivity({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M3 12h4l2.5-7 5 14L17 12h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
