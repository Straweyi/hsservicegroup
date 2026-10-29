import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { services as defaultServices, type Service, type PriceTier } from "@/lib/data";

export type ServiceRow = {
  id: string;
  category: "kebersihan" | "teknisi" | "tennis";
  name: string;
  desc: string;
  icon: string;
  image: string;
  tiers: PriceTier[];
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export function mapRowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    desc: row.desc,
    icon: row.icon || "Sparkles",
    image: row.image || "/services/home.jpg",
    tiers: Array.isArray(row.tiers) ? row.tiers : [],
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
