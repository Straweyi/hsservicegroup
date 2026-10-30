"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link2, Copy, MessageCircle, Loader2, X, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useServices } from "@/lib/use-services";

type LinkRow = {
  token: string;
  category: "kebersihan" | "teknisi" | "tennis";
  service_name: string;
  customer_name: string | null;
  expires_at: string;
  used_at: string | null;
  created_at: string;
};

const EXPIRY_OPTIONS = [
  { days: 3, label: "3 hari" },
  { days: 7, label: "7 hari" },
  { days: 14, label: "14 hari" },
  { days: 30, label: "30 hari" },
];

function newToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildUrl(token: string) {
  return `${window.location.origin}/ulasan?t=${token}`;
}

function statusOf(r: LinkRow) {
  if (r.used_at) return { label: "Sudah Diisi", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (new Date(r.expires_at).getTime() < Date.now()) return { label: "Kedaluwarsa", cls: "bg-slate-100 text-slate-500 border-slate-200" };
  return { label: "Menunggu Diisi", cls: "bg-amber-50 text-amber-800 border-amber-200" };
}

export function AdminReviewLinks({ supabaseAuthed, onClose }: { supabaseAuthed: boolean; onClose: () => void }) {
  const { services } = useServices();
  const [serviceId, setServiceId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [days, setDays] = useState(7);
  const [creating, setCreating] = useState(false);
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  const service = services.find((s) => s.id === serviceId) ?? services[0];

  async function load() {
    if (!supabase || !supabaseAuthed) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("review_links").select("*").order("created_at", { ascending: false }).limit(30);
    setRows((data as LinkRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseAuthed]);

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("Link ulasan disalin!");
  }

  function waShare(url: string, name: string | null, serviceName: string) {
    const msg =
      `Halo${name ? ` Kak ${name}` : ""}, terima kasih telah menggunakan layanan *${serviceName}* dari HS Support Group 🙏\n\n` +
      `Mohon luangkan satu menit untuk memberi ulasan melalui link pribadi berikut (hanya berlaku satu kali):\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  async function create() {
    if (!service) return;
    if (!supabase || !supabaseAuthed) {
      toast.error("Login Supabase admin diperlukan untuk membuat link ulasan (jalankan schema.sql terbaru).");
      return;
    }
    setCreating(true);
    const token = newToken();
    const { error } = await supabase.from("review_links").insert({
      token,
      category: service.category,
      service_name: service.name,
      customer_name: customerName.trim() || null,
      expires_at: new Date(Date.now() + days * 86400000).toISOString(),
    });
    setCreating(false);
    if (error) {
      toast.error("Gagal membuat link. Pastikan schema.sql terbaru sudah dijalankan di Supabase.");
      return;
    }
    const url = buildUrl(token);
    await navigator.clipboard.writeText(url).catch(() => {});
    toast.success("Link dibuat & disalin! Kirimkan ke pelanggan setelah layanan selesai.");
    setCustomerName("");
    load();
  }

  async function remove(token: string) {
    if (!supabase) return;
    await supabase.from("review_links").delete().eq("token", token);
    setRows((p) => p.filter((r) => r.token !== token));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      <div className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-7 sm:py-5">
          <div>
            <h3 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg"><Link2 className="size-4 text-emerald-600" /> Link Ulasan Pelanggan</h3>
            <p className="mt-0.5 text-xs text-slate-500">Satu link untuk satu pelanggan. Hanya berlaku sekali & ada masa berlaku.</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X className="size-4" /></button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-7">
          <div className="space-y-3.5 rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Layanan yang diselesaikan</label>
                <select value={service?.id ?? ""} onChange={(e) => setServiceId(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
                  {services.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama pelanggan (opsional)</label>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} maxLength={80} placeholder="Terisi otomatis di form" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Masa berlaku</label>
                <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
                  {EXPIRY_OPTIONS.map((o) => (<option key={o.days} value={o.days}>{o.label}</option>))}
                </select>
              </div>
            </div>
            <button type="button" onClick={create} disabled={creating} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient text-xs font-bold text-white shadow-sm hover:brightness-105 disabled:opacity-60">
              {creating ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />} Buat & Salin Link Ulasan
            </button>
          </div>

          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Riwayat Link</p>
              <button type="button" onClick={load} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"><RefreshCw className="size-3" /> Muat ulang</button>
            </div>
            {loading ? (
              <p className="py-6 text-center text-sm text-slate-400">Memuat...</p>
            ) : rows.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">Belum ada link yang dibuat.</p>
            ) : (
              <ul className="space-y-2">
                {rows.map((r) => {
                  const st = statusOf(r);
                  const active = st.label === "Menunggu Diisi";
                  return (
                    <li key={r.token} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{r.service_name}{r.customer_name ? ` — ${r.customer_name}` : ""}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className={`rounded-full border px-2 py-0.5 font-bold ${st.cls}`}>{st.label}</span>
                          <span>s/d {new Date(r.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                        </div>
                      </div>
                      {active && (
                        <>
                          <button type="button" title="Salin link" onClick={() => copy(buildUrl(r.token))} className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"><Copy className="size-4" /></button>
                          <button type="button" title="Kirim via WhatsApp" onClick={() => waShare(buildUrl(r.token), r.customer_name, r.service_name)} className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white hover:brightness-95"><MessageCircle className="size-4" /></button>
                        </>
                      )}
                      <button type="button" title="Hapus / cabut link" onClick={() => remove(r.token)} className="grid size-9 shrink-0 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"><Trash2 className="size-4" /></button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

