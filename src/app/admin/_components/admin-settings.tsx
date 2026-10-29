"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Phone, MessageCircle, Clock, Check, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_SITE_SETTINGS,
  fetchSiteSettingsClient,
  type SiteSettingsRow,
} from "@/lib/cms-store";
import { invalidateCmsCache } from "@/lib/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminSettingsProps = {
  supabaseAuthed: boolean;
};

function normalizeWaNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    return "62" + digits.slice(1);
  }
  return digits;
}

export function AdminSettings({ supabaseAuthed }: AdminSettingsProps) {
  const [form, setForm] = useState<SiteSettingsRow>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteSettingsClient()
      .then((res) => setForm(res))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const cleanWa = normalizeWaNumber(form.whatsapp_number);
    if (cleanWa.length < 9) {
      toast.error("Nomor WhatsApp tidak valid.");
      return;
    }

    const payload: SiteSettingsRow = {
      id: "main",
      whatsapp_number: cleanWa,
      whatsapp_display: form.whatsapp_display.trim() || cleanWa,
      operating_hours: form.operating_hours.trim(),
      tagline: form.tagline.trim(),
    };

    if (!supabase || !supabaseAuthed) {
      setForm(payload);
      toast.success("Pengaturan diperbarui di sesi lokal (jalankan schema.sql untuk menyimpan ke Supabase).");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      invalidateCmsCache();
      setForm(payload);
      toast.success("Pengaturan kontak & WhatsApp berhasil disimpan ke Supabase!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2 text-sm">
        <Loader2 className="size-5 animate-spin text-teal-600" />
        <span>Memuat pengaturan kontak...</span>
      </div>
    );
  }

  const normalizedWa = normalizeWaNumber(form.whatsapp_number);

  return (
    <div className="grid gap-5 lg:grid-cols-12 items-start">
      {/* Form Utama */}
      <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-sm">
        <div className="border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
          <h2 className="text-base sm:text-xl font-black text-slate-900">
            Pengaturan Nomor WhatsApp & Kontak
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Perubahan nomor WhatsApp di sini akan otomatis mengubah seluruh tombol pemesanan, tombol mengambang, dan kontak di website.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="wa-num" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <MessageCircle className="size-3.5 text-emerald-600 shrink-0" />
                <span>Nomor Tujuan Link WhatsApp *</span>
              </Label>
              <Input
                id="wa-num"
                required
                value={form.whatsapp_number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, whatsapp_number: e.target.value }))
                }
                placeholder="6282121437901"
                className="h-10 sm:h-11"
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Gunakan kode negara <code>628...</code> (jika diketik <code>08...</code> akan otomatis dikonversi ke <code>628...</code> saat disimpan).
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wa-disp" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Phone className="size-3.5 text-teal-600 shrink-0" />
                <span>Format Tampilan Nomor Telepon *</span>
              </Label>
              <Input
                id="wa-disp"
                required
                value={form.whatsapp_display}
                onChange={(e) =>
                  setForm((p) => ({ ...p, whatsapp_display: e.target.value }))
                }
                placeholder="0821-2143-7901"
                className="h-10 sm:h-11"
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Teks nomor yang ditampilkan di bagian Footer dan halaman Detail Layanan.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="op-hours" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Clock className="size-3.5 text-teal-600 shrink-0" />
              <span>Jam Operasional Layanan Pelanggan</span>
            </Label>
            <Input
              id="op-hours"
              value={form.operating_hours}
              onChange={(e) =>
                setForm((p) => ({ ...p, operating_hours: e.target.value }))
              }
              placeholder="Setiap Hari (08.00 - 20.00 WIB)"
              className="h-10 sm:h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tagline" className="text-xs sm:text-sm">
              Slogan / Tagline Footer
            </Label>
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
              placeholder="Karena rumah bersih dan hidup sehat dimulai dari pelayanan terpercaya."
              className="h-10 sm:h-11"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <a
              href={`https://wa.me/${normalizedWa}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center sm:justify-start gap-1.5 rounded-full border border-emerald-200 sm:border-0 bg-emerald-50/60 sm:bg-transparent px-4 sm:px-0 text-xs font-bold text-emerald-700 hover:underline"
            >
              <ExternalLink className="size-3.5 shrink-0" />
              <span className="truncate">Tes Buka Link WA ({normalizedWa})</span>
            </a>

            <Button
              type="submit"
              disabled={saving}
              className="h-11 sm:h-10 w-full sm:w-auto rounded-full bg-brand-gradient px-6 font-bold text-white shadow-sm"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </form>
      </div>

      {/* Live Preview Panel (Tampil di Bawah pada HP/Tab, di Kanan pada Laptop/Komputer) */}
      <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-700">
          <Sparkles className="size-4 text-teal-600 shrink-0" />
          <span>Pratinjau Tampilan Kontak</span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3 text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Link Tujuan Tombol WA</p>
            <p className="font-mono font-bold text-emerald-700 break-all mt-0.5">
              https://wa.me/{normalizedWa || "-"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Nomor Telepon Tampil</p>
            <p className="font-bold text-slate-900 mt-0.5">{form.whatsapp_display || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Jam Operasional</p>
            <p className="text-slate-700 mt-0.5">{form.operating_hours || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Tagline Footer</p>
            <p className="text-slate-600 italic mt-0.5 leading-relaxed">
              “{form.tagline || "-"}”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
