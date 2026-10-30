import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { services as defaultServices, type Service, type PriceTier } from "@/lib/data";

export type ServiceRow = {
  id: string;
  category: "kebersihan" | "teknisi" | "tennis";
  name: string;
  subtitle?: string | null;
  badge?: string | null;
  desc: string;
  icon: string;
  image: string;
  features?: string[] | null;
  tiers: PriceTier[];
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export function mapRowToService(row: ServiceRow): Service {
  const defaultMatch = defaultServices.find((d) => d.id === row.id);
  const tiers = Array.isArray(row.tiers) ? row.tiers : [];
  const tierMeta = tiers[0]?._meta;

  const resolvedSubtitle =
    row.subtitle !== undefined && row.subtitle !== null
      ? row.subtitle
      : tierMeta?.subtitle !== undefined
        ? tierMeta.subtitle
        : defaultMatch?.subtitle;

  const resolvedBadge =
    row.badge !== undefined && row.badge !== null
      ? row.badge
      : tierMeta?.badge !== undefined
        ? tierMeta.badge
        : defaultMatch?.badge;

  const resolvedFeatures =
    Array.isArray(row.features)
      ? row.features
      : Array.isArray(tierMeta?.features)
        ? tierMeta.features
        : defaultMatch?.features;

  return {
    id: row.id,
    category: row.category,
    name: row.name,
    subtitle: resolvedSubtitle,
    badge: resolvedBadge,
    desc: row.desc,
    icon: row.icon || "Sparkles",
    image: row.image || "/services/home.jpg",
    features: resolvedFeatures,
    tiers,
  };
}

export async function fetchActiveServicesClient(): Promise<Service[]> {
  if (!supabase) {
    return defaultServices;
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultServices;
    }

    return (data as ServiceRow[]).map(mapRowToService);
  } catch {
    return defaultServices;
  }
}

export async function fetchAllServicesServer(): Promise<Service[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const client = createClient(url, key);
      const { data, error } = await client
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return (data as ServiceRow[]).map(mapRowToService);
      }
    } catch {
      // Fallback ke defaultServices
    }
  }

  return defaultServices;
}

export async function fetchServiceByIdServer(id: string): Promise<Service | undefined> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const client = createClient(url, key);
      const { data, error } = await client
        .from("services")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        return mapRowToService(data as ServiceRow);
      }
    } catch {
      // Fallback ke defaultServices
    }
  }

  return defaultServices.find((s) => s.id === id);
}
