"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Phone, MessageCircle, Clock, Check, Loader2, ExternalLink } from "lucide-react";
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
      <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-teal-600" />
        <span>Memuat pengaturan kontak...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h2 className="text-xl font-black text-slate-900">Pengaturan Nomor WhatsApp & Kontak</h2>
          <p className="text-xs text-slate-500 mt-1">
            Perubahan nomor WhatsApp di sini akan otomatis mengubah seluruh tombol pemesanan, tombol mengambang, dan kontak di website.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="wa-num" className="flex items-center gap-1.5">
                <MessageCircle className="size-3.5 text-emerald-600" /> Nomor Tujuan Link WhatsApp *
              </Label>
              <Input
                id="wa-num"
                required
                value={form.whatsapp_number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, whatsapp_number: e.target.value }))
                }
                placeholder="6282121437901"
              />
              <p className="text-[11px] text-slate-400">
                Gunakan kode negara <code>628...</code> (jika diketik <code>08...</code> akan otomatis dikonversi ke <code>628...</code> saat disimpan).
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wa-disp" className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-teal-600" /> Format Tampilan Nomor Telepon *
              </Label>
              <Input
                id="wa-disp"
                required
                value={form.whatsapp_display}
                onChange={(e) =>
                  setForm((p) => ({ ...p, whatsapp_display: e.target.value }))
                }
                placeholder="0821-2143-7901"
              />
              <p className="text-[11px] text-slate-400">
                Teks nomor yang ditampilkan di bagian Footer dan halaman Detail Layanan.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="op-hours" className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-teal-600" /> Jam Operasional Layanan Pelanggan
            </Label>
            <Input
              id="op-hours"
              value={form.operating_hours}
              onChange={(e) =>
                setForm((p) => ({ ...p, operating_hours: e.target.value }))
              }
              placeholder="Setiap Hari (08.00 - 20.00 WIB)"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tagline">Slogan / Tagline Footer</Label>
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
              placeholder="Karena rumah bersih dan hidup sehat dimulai dari pelayanan terpercaya."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <a
              href={`https://wa.me/${normalizeWaNumber(form.whatsapp_number)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
            >
              <ExternalLink className="size-3.5" /> Tes Buka Link WhatsApp ({normalizeWaNumber(form.whatsapp_number)})
            </a>

            <Button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand-gradient px-6 font-bold text-white shadow-sm"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

