import { Coffee, Flower2, Wine, ShoppingBag, type LucideIcon } from "lucide-react";

export type Category = "cafe" | "yoga" | "bar" | "boutique";

export const CATEGORIES: { id: Category; label: string; color: string; Icon: LucideIcon }[] = [
  { id: "cafe",     label: "Cafetería", color: "var(--cat-cafe)",     Icon: Coffee },
  { id: "yoga",     label: "Yoga",      color: "var(--cat-yoga)",     Icon: Flower2 },
  { id: "bar",      label: "Vino",      color: "var(--cat-bar)",      Icon: Wine },
  { id: "boutique", label: "Boutique",  color: "var(--cat-boutique)", Icon: ShoppingBag },
];

export const CATEGORY_MAP: Record<Category, { label: string; color: string; Icon: LucideIcon }> = {
  cafe:     { label: "Cafetería", color: "var(--cat-cafe)",     Icon: Coffee },
  yoga:     { label: "Yoga",      color: "var(--cat-yoga)",     Icon: Flower2 },
  bar:      { label: "Vino",      color: "var(--cat-bar)",      Icon: Wine },
  boutique: { label: "Boutique",  color: "var(--cat-boutique)", Icon: ShoppingBag },
};

export type Partner = {
  id: string;
  name: string;
  category: Category;
  neighborhood: "Roma" | "Condesa" | "Juárez";
  distanceM: number;
  reward: string;
  priceTokens: number;
  address: string;
  pin: { x: number; y: number };
};

export const PARTNERS: Partner[] = [
  { id: "buna",      name: "Buna 42",          category: "cafe",     neighborhood: "Roma",    distanceM: 240, reward: "Espresso doble",       priceTokens: 1200, address: "Orizaba 42, Roma Nte.",      pin: { x: 32, y: 38 } },
  { id: "qubica",    name: "Qūbica Yoga",      category: "yoga",     neighborhood: "Condesa", distanceM: 410, reward: "1 clase open",          priceTokens: 2800, address: "Amsterdam 88, Condesa",      pin: { x: 18, y: 62 } },
  { id: "loup",      name: "Loup Bar",         category: "bar",      neighborhood: "Juárez",  distanceM: 680, reward: "Copa de vino natural",  priceTokens: 2400, address: "Marsella 61, Juárez",        pin: { x: 64, y: 24 } },
  { id: "void",      name: "Void Boutique",    category: "boutique", neighborhood: "Roma",    distanceM: 320, reward: "10% en colección",      priceTokens: 1800, address: "Colima 159, Roma Nte.",      pin: { x: 48, y: 50 } },
  { id: "cardinal",  name: "Cardinal Casa",    category: "cafe",     neighborhood: "Juárez",  distanceM: 520, reward: "Filtrado del día",      priceTokens: 1000, address: "Córdoba 132, Roma Nte.",     pin: { x: 72, y: 70 } },
  { id: "balmori",   name: "Balmori Rooftop",  category: "bar",      neighborhood: "Roma",    distanceM: 540, reward: "Cóctel de la casa",     priceTokens: 3200, address: "Orizaba 100, Roma Nte.",     pin: { x: 40, y: 78 } },
  { id: "modo",      name: "Modo Pilates",     category: "yoga",     neighborhood: "Roma",    distanceM: 290, reward: "Reformer drop-in",      priceTokens: 3400, address: "Sinaloa 200, Roma Nte.",     pin: { x: 58, y: 30 } },
  { id: "carla",     name: "Carla Fernández",  category: "boutique", neighborhood: "Condesa", distanceM: 460, reward: "Tote edición limitada", priceTokens: 2600, address: "Mazatlán 73, Condesa",       pin: { x: 24, y: 18 } },
];

export const REDEMPTION_HISTORY = [
  { id: "h1", partner: "Buna 42",        category: "cafe" as Category,     date: "Hoy, 09:14",   tokens: 1200 },
  { id: "h2", partner: "Qūbica Yoga",    category: "yoga" as Category,     date: "Ayer, 19:30",  tokens: 2800 },
  { id: "h3", partner: "Loup Bar",       category: "bar" as Category,      date: "Sáb, 22:10",   tokens: 2400 },
  { id: "h4", partner: "Void Boutique",  category: "boutique" as Category, date: "Jue, 13:02",   tokens: 1800 },
];

export function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out.slice(0, 3) + "-" + out.slice(3);
}
