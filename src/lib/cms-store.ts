import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
} from "@/lib/data";

export type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  tags?: string[] | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FaqRow = {
  id: string;
  q: string;
  a: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SiteSettingsRow = {
  id: string;
  whatsapp_number: string;
  whatsapp_display: string;
  operating_hours: string;
  tagline: string;
  updated_at?: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsRow = {
  id: "main",
  whatsapp_number: WHATSAPP_NUMBER,
  whatsapp_display: WHATSAPP_DISPLAY,
  operating_hours: "Setiap Hari (08.00 - 20.00 WIB)",
  tagline: "Karena rumah bersih dan hidup sehat dimulai dari pelayanan terpercaya.",
};

export function getDefaultTestimonialRows(): TestimonialRow[] {
  return defaultTestimonials.map((t, idx) => ({
    id: `testi-${idx + 1}`,
    name: t.name,
    role: t.role,
    text: t.text,
    rating: 5,
    sort_order: idx + 1,
    is_active: true,
  }));
}

export function getDefaultFaqRows(): FaqRow[] {
  return defaultFaqs.map((f, idx) => ({
    id: `faq-${idx + 1}`,
    q: f.q,
    a: f.a,
    sort_order: idx + 1,
    is_active: true,
  }));
}

export async function fetchActiveTestimonialsClient(): Promise<TestimonialRow[]> {
  if (!supabase) return getDefaultTestimonialRows();
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return getDefaultTestimonialRows();
    return data as TestimonialRow[];
  } catch {
    return getDefaultTestimonialRows();
  }
}

export async function fetchActiveFaqsClient(): Promise<FaqRow[]> {
  if (!supabase) return getDefaultFaqRows();
  try {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return getDefaultFaqRows();
    return data as FaqRow[];
  } catch {
    return getDefaultFaqRows();
  }
}

export async function fetchSiteSettingsClient(): Promise<SiteSettingsRow> {
  if (!supabase) return DEFAULT_SITE_SETTINGS;
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "main")
      .maybeSingle();

    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return data as SiteSettingsRow;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function fetchSiteSettingsServer(): Promise<SiteSettingsRow> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const client = createClient(url, key);
      const { data, error } = await client
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();
      if (!error && data) return data as SiteSettingsRow;
    } catch {
      // Fallback ke default
    }
  }
  return DEFAULT_SITE_SETTINGS;
}


/**
 * Memisahkan isi ulasan dari "kesan singkat" (pilihan "Apa yang paling Anda sukai?")
 * yang disimpan di akhir teks dengan penanda "✓". Kompatibel dengan ulasan lama.
 */
export function splitReviewText(raw: string): { body: string; tags: string[] } {
  const m = raw.match(/[✓✔☑]/);
  if (!m || m.index === undefined) return { body: raw.trim(), tags: [] };
  const body = raw.slice(0, m.index).trim();
  const tags = raw
    .slice(m.index)
    .split(/[✓✔☑]/)
    .map((t) => t.trim())
    .filter(Boolean);
  return body ? { body, tags } : { body: raw.replace(/[✓✔☑]/g, "").trim(), tags: [] };
}

/** Isi ulasan + kesan singkat: memakai kolom `tags` bila ada, jika tidak, urai dari ulasan lama. */
export function getReviewParts(row: { text: string; tags?: string[] | null }): {
  body: string;
  tags: string[];
} {
  if (Array.isArray(row.tags) && row.tags.length > 0) {
    return { body: row.text.trim(), tags: row.tags };
  }
  return splitReviewText(row.text);
}
