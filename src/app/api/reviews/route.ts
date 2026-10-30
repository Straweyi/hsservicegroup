import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const limiter = new Map<string, { count: number; firstAt: number }>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const rec = limiter.get(ip);
  if (!rec || now - rec.firstAt > RATE_WINDOW_MS) {
    limiter.set(ip, { count: 1, firstAt: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_REQUESTS_PER_WINDOW;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local-ip";
}

/** Klien server terotorisasi (service role, atau login admin via env) — tidak pernah dipakai di browser. */
async function getServerClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !(serviceRoleKey || anonKey)) return null;

  const client = createClient(url, serviceRoleKey || anonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (!serviceRoleKey) {
    const { error } = await client.auth.signInWithPassword({
      email: (process.env.ADMIN_EMAIL || "admin@hssg.com").toLowerCase(),
      password: process.env.ADMIN_PASSWORD || "hssgpassword",
    });
    if (error) return null;
  }
  return client;
}

const INVALID = {
  valid: false,
  error: "Link ulasan tidak valid, sudah digunakan, atau telah kedaluwarsa.",
};

function validToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{20,64}$/.test(token);
}

/** Validasi token (tanpa menghabiskannya) — dipakai form untuk menampilkan layanan terkait. */
export async function GET(req: NextRequest) {
  if (tooMany(getClientIp(req))) {
    return NextResponse.json({ valid: false, error: "Terlalu banyak permintaan." }, { status: 429 });
  }
  const token = req.nextUrl.searchParams.get("t") ?? "";
  if (!validToken(token)) return NextResponse.json(INVALID, { status: 404 });

  const client = await getServerClient();
  if (!client) return NextResponse.json(INVALID, { status: 404 });

  const { data } = await client
    .from("review_links")
    .select("category, service_name, customer_name, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (!data || data.used_at || new Date(data.expires_at).getTime() < Date.now()) {
    return NextResponse.json(INVALID, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    category: data.category,
    serviceName: data.service_name,
    customerName: data.customer_name ?? "",
  });
}

export async function POST(req: NextRequest) {
  if (tooMany(getClientIp(req))) {
    return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 });
  }

  let body: {
    token?: string;
    name?: string;
    location?: string;
    rating?: number;
    text?: string;
    tags?: string[];
    website?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  if (body.website && body.website.trim()) return NextResponse.json({ ok: true }); // honeypot

  const token = String(body.token ?? "");
  if (!validToken(token)) return NextResponse.json({ error: INVALID.error }, { status: 403 });

  const name = String(body.name ?? "").trim();
  const location = String(body.location ?? "").trim().slice(0, 50);
  const text = String(body.text ?? "").trim();
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Nama mohon diisi 2–80 karakter." }, { status: 400 });
  }
  if (text.length < 10 || text.length > 600) {
    return NextResponse.json({ error: "Ulasan mohon diisi 10–600 karakter." }, { status: 400 });
  }

  const client = await getServerClient();
  if (!client) {
    return NextResponse.json({ error: "Layanan ulasan sedang tidak tersedia." }, { status: 503 });
  }

  // Habiskan token secara atomik: hanya berhasil jika belum terpakai & belum kedaluwarsa
  const { data: consumed } = await client
    .from("review_links")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("service_name")
    .maybeSingle();

  if (!consumed) return NextResponse.json({ error: INVALID.error }, { status: 403 });

  const role = [consumed.service_name, location].filter(Boolean).join(" · ").slice(0, 100);

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim().slice(0, 60)).filter(Boolean).slice(0, 6)
    : [];

  const row = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    role: role || "Pelanggan HS Support",
    text,
    rating,
    sort_order: 100,
    is_active: false, // tetap menunggu persetujuan Admin
  };

  let { error } = await client.from("testimonials").insert({ ...row, tags });

  if (error && tags.length > 0) {
    // Kolom `tags` belum dimigrasikan: simpan kesan singkat di akhir teks (tetap terpisah saat ditampilkan)
    ({ error } = await client
      .from("testimonials")
      .insert({ ...row, text: `${text}\n\n${tags.map((t) => `✓ ${t}`).join("  ")}` }));
  }

  if (error) {
    // Kembalikan token agar pelanggan bisa mencoba lagi
    await client.from("review_links").update({ used_at: null }).eq("token", token);
    return NextResponse.json({ error: "Gagal menyimpan ulasan. Silakan coba lagi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
