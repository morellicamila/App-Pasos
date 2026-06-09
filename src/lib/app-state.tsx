import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AppState = {
  steps: number;
  tokens: number;
  streakDays: number;
  totalKm: number;
  totalCO2: number; // kg
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  addSteps: (n: number) => void;
  spendTokens: (n: number) => void;
};

const Ctx = createContext<AppState | null>(null);

const DAILY_GOAL = 5000;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [steps, setSteps] = useState(3120);
  const [tokens, setTokens] = useState(4280);
  const [streakDays] = useState(7);
  const [totalKm] = useState(42.6);
  const [totalCO2] = useState(8.4);
  const [onboarded, setOnboarded] = useState(false);

  // gentle live tick to simulate sensor
  useEffect(() => {
    const t = setInterval(() => {
      setSteps((s) => (s < DAILY_GOAL + 2000 ? s + Math.floor(Math.random() * 4) : s));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const value = useMemo<AppState>(() => ({
    steps, tokens, streakDays, totalKm, totalCO2, onboarded,
    setOnboarded,
    addSteps: (n) => setSteps((s) => s + n),
    spendTokens: (n) => setTokens((t) => Math.max(0, t - n)),
  }), [steps, tokens, streakDays, totalKm, totalCO2, onboarded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AppStateProvider missing");
  return v;
}

export const DAILY_STEP_GOAL = DAILY_GOAL;
