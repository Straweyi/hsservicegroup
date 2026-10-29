import {
  Sparkles,
  Home,
  Building2,
  DoorOpen,
  Wind,
  Wrench,
  Fuel,
  Droplets,
  Flame,
  Refrigerator,
  Waves,
  Plug,
  Trophy,
  Users,
  Target,
  type LucideIcon,
} from "lucide-react";
import { services as defaultServices } from "@/lib/data";
import type { ServiceRow } from "@/lib/services-store";

export const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: "Home", icon: Home },
  { name: "Building2", icon: Building2 },
  { name: "DoorOpen", icon: DoorOpen },
  { name: "Wind", icon: Wind },
  { name: "Wrench", icon: Wrench },
  { name: "Fuel", icon: Fuel },
  { name: "Droplets", icon: Droplets },
  { name: "Flame", icon: Flame },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "Waves", icon: Waves },
  { name: "Plug", icon: Plug },
  { name: "Trophy", icon: Trophy },
  { name: "Users", icon: Users },
  { name: "Target", icon: Target },
  { name: "Sparkles", icon: Sparkles },
];

export const PRESET_IMAGES = [
  { label: "Home Cleaning", url: "/services/home.jpg" },
  { label: "Kantor", url: "/services/office.jpg" },
  { label: "Kos-kosan", url: "/services/kos.jpg" },
  { label: "Cuci AC", url: "/services/ac_clean.jpg" },
  { label: "Pasang AC", url: "/services/ac_install.jpg" },
  { label: "Freon AC", url: "/services/ac.jpg" },
  { label: "Tangki / Pompa Air", url: "/services/tank.jpg" },
  { label: "Toilet / Kamar Mandi", url: "/services/toilet.jpg" },
  { label: "Elektronik / Kulkas", url: "/services/appliance.jpg" },
  { label: "Listrik / Water Heater", url: "/services/electric.jpg" },
  { label: "Tennis Private", url: "/tennis.jpg" },
  { label: "Tennis Group", url: "/services/tennis_group.jpg" },
  { label: "Tennis Junior", url: "/services/tennis_junior.jpg" },
];

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getDefaultRows(): ServiceRow[] {
  return defaultServices.map((s, idx) => ({
    id: s.id,
    category: s.category,
    name: s.name,
    desc: s.desc,
    icon: s.icon,
    image: s.image || "/services/home.jpg",
    tiers: s.tiers,
    sort_order: idx + 1,
    is_active: true,
  }));
}

