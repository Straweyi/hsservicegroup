"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
  RefreshCw,
  Loader2,
  X,
  Check,
  Database,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getDefaultFaqRows, type FaqRow } from "@/lib/cms-store";
import { invalidateCmsCache } from "@/lib/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type AdminFaqsProps = {
  supabaseAuthed: boolean;
};

type FaqForm = {
  id: string;
  q: string;
  a: string;
  sortOrder: number;
  isActive: boolean;
};

const EMPTY_FAQ: FaqForm = {
  id: "",
  q: "",
  a: "",
  sortOrder: 1,
  isActive: true,
};

export function AdminFaqs({ supabaseAuthed }: AdminFaqsProps) {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FaqForm>(EMPTY_FAQ);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    if (!supabase) {
      setRows(getDefaultFaqRows());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        setRows(getDefaultFaqRows());
        return;
      }
      setRows((data as FaqRow[]) ?? []);
    } catch {
      setRows(getDefaultFaqRows());
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    const defaults = getDefaultFaqRows();
    if (!supabase || !supabaseAuthed) {
      setRows(defaults);
      toast.info("Data FAQ bawaan dimuat (jalankan schema.sql untuk menyimpan di Supabase).");
      return;
    }

    setSeeding(true);
    try {
      const { error } = await supabase.from("faqs").upsert(defaults, { onConflict: "id" });
      if (error) throw error;
      invalidateCmsCache();
      toast.success("Berhasil mengimpor daftar FAQ awal ke Supabase!");
      await loadFaqs();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengimpor FAQ.");
    } finally {
      setSeeding(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      ...EMPTY_FAQ,
      id: `faq-${Date.now()}`,
      sortOrder: rows.length + 1,
    });
    setModalOpen(true);
  }

  function openEdit(row: FaqRow) {
    setEditingId(row.id);
    setForm({
      id: row.id,
      q: row.q,
      a: row.a,
      sortOrder: row.sort_order ?? 1,
      isActive: row.is_active ?? true,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload: FaqRow = {
      id: editingId ?? form.id,
      q: form.q.trim(),
      a: form.a.trim(),
      sort_order: Number(form.sortOrder) || 1,
      is_active: form.isActive,
    };

    if (!supabase || !supabaseAuthed) {
      setRows((prev) =>
        editingId ? prev.map((r) => (r.id === editingId ? payload : r)) : [...prev, payload]
      );
      setModalOpen(false);
      toast.success("FAQ diperbarui di sesi lokal.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("faqs").upsert(payload, { onConflict: "id" });
      if (error) throw error;
      invalidateCmsCache();
      toast.success(editingId ? "FAQ diperbarui!" : "Pertanyaan FAQ ditambahkan!");
      setModalOpen(false);
      await loadFaqs();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan FAQ.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(row: FaqRow) {
    const next = !row.is_active;
    if (!supabase || !supabaseAuthed) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: next } : r)));
      return;
    }
    try {
      const { error } = await supabase
        .from("faqs")
        .update({ is_active: next })
        .eq("id", row.id);
      if (error) throw error;
      invalidateCmsCache();
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: next } : r)));
      toast.success(`Pertanyaan FAQ ${next ? "ditampilkan" : "disembunyikan"}.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status FAQ.");
    }
  }

  async function handleDelete(row: FaqRow) {
    if (!window.confirm(`Hapus pertanyaan "${row.q}"?`)) return;
    if (!supabase || !supabaseAuthed) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    try {
      const { error } = await supabase.from("faqs").delete().eq("id", row.id);
      if (error) throw error;
      invalidateCmsCache();
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast.success("Pertanyaan FAQ dihapus.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus FAQ.");
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">Kelola Tanya Jawab (FAQ)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pertanyaan umum yang tampil pada akordion halaman utama website.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 sm:px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shrink-0"
          >
            <RefreshCw className={`size-3.5 shrink-0 ${seeding ? "animate-spin" : ""}`} />
            <span>Impor Default</span>
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex-1 sm:flex-initial inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 sm:px-5 text-xs font-bold text-white shadow-sm hover:brightness-105 transition shrink-0"
          >
            <Plus className="size-4 shrink-0" />
            <span>Tambah Pertanyaan</span>
          </button>
        </div>
      </div>

      {rows.length === 0 && !loading && (
        <div className="rounded-2xl sm:rounded-3xl border border-teal-200 bg-teal-50/70 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm sm:text-base font-black text-teal-950 flex items-center gap-2">
              <Database className="size-5 text-teal-600 shrink-0" />
              <span>Tabel FAQ Masih Kosong</span>
            </p>
            <p className="text-xs text-teal-800">
              Klik tombol ini untuk mengimpor 5 pertanyaan FAQ awal ke Supabase.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="w-full sm:w-auto justify-center rounded-full bg-teal-700 text-white hover:bg-teal-800 font-bold shrink-0 h-10"
          >
            {seeding ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Impor FAQ Awal
          </Button>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2 text-sm">
          <Loader2 className="size-5 animate-spin text-teal-600" />
          <span>Memuat daftar FAQ...</span>
        </div>
      ) : (
        <div className="grid gap-3.5 xl:grid-cols-2 xl:gap-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-2xs transition flex flex-col sm:flex-row xl:flex-col 2xl:flex-row sm:items-center xl:items-stretch 2xl:items-center justify-between gap-3.5 sm:gap-4 ${
                row.is_active ? "border-slate-200/90" : "border-slate-200 bg-slate-50 opacity-70"
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 shrink-0">
                    <HelpCircle className="size-3" /> #{row.sort_order}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                      row.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {row.is_active ? "Aktif" : "Tersembunyi"}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 break-words leading-snug">
                  {row.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {row.a}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2.5 sm:pt-0 xl:pt-2.5 2xl:pt-0 border-t sm:border-t-0 xl:border-t 2xl:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="flex-1 sm:flex-initial xl:flex-1 2xl:flex-initial h-10 sm:h-9 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <Pencil className="size-3.5 shrink-0" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(row)}
                  className="grid size-10 sm:size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                >
                  {row.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row)}
                  className="grid size-10 sm:size-9 shrink-0 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs">
          <div className="flex flex-col w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-7 sm:py-5 shrink-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {editingId ? "Edit Pertanyaan FAQ" : "Tambah Pertanyaan FAQ"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-7 sm:py-5 space-y-4">
                <div className="space-y-1.5">
                  <Label>Pertanyaan (Q) *</Label>
                  <Input
                    required
                    value={form.q}
                    onChange={(e) => setForm((p) => ({ ...p, q: e.target.value }))}
                    placeholder="Mis: Apakah harga sudah termasuk alat dan cairan pembersih?"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Jawaban (A) *</Label>
                  <Textarea
                    required
                    rows={4}
                    value={form.a}
                    onChange={(e) => setForm((p) => ({ ...p, a: e.target.value }))}
                    placeholder="Tulis jawaban yang jelas dan informatif..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label>Urutan Tampil</Label>
                    <Input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                      className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border text-xs font-bold ${
                        form.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {form.isActive ? <Check className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      {form.isActive ? "Aktif" : "Sembunyi"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-slate-100 bg-white px-4 py-3.5 sm:px-7 sm:py-4 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full h-10 w-full sm:w-auto"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-full h-10 bg-brand-gradient text-white font-bold px-6 w-full sm:w-auto"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  Simpan FAQ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
