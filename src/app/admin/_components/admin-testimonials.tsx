"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Quote,
  RefreshCw,
  Loader2,
  X,
  Check,
  Database,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getDefaultTestimonialRows, type TestimonialRow } from "@/lib/cms-store";
import { invalidateCmsCache } from "@/lib/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type AdminTestimonialsProps = {
  supabaseAuthed: boolean;
};

type TestimonialForm = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  sortOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: TestimonialForm = {
  id: "",
  name: "",
  role: "",
  text: "",
  rating: 5,
  sortOrder: 1,
  isActive: true,
};

export function AdminTestimonials({ supabaseAuthed }: AdminTestimonialsProps) {
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TestimonialForm>(EMPTY_FORM);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    if (!supabase) {
      setRows(getDefaultTestimonialRows());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        setRows(getDefaultTestimonialRows());
        return;
      }
      setRows((data as TestimonialRow[]) ?? []);
    } catch {
      setRows(getDefaultTestimonialRows());
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    const defaults = getDefaultTestimonialRows();
    if (!supabase || !supabaseAuthed) {
      setRows(defaults);
      toast.info("Data testimoni bawaan dimuat (jalankan schema.sql untuk menyimpan di Supabase).");
      return;
    }

    setSeeding(true);
    try {
      const { error } = await supabase
        .from("testimonials")
        .upsert(defaults, { onConflict: "id" });
      if (error) throw error;
      invalidateCmsCache();
      toast.success("Berhasil mengimpor testimoni awal ke Supabase!");
      await loadTestimonials();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor testimoni.";
      toast.error(msg);
    } finally {
      setSeeding(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      id: `testi-${Date.now()}`,
      sortOrder: rows.length + 1,
    });
    setModalOpen(true);
  }

  function openEdit(row: TestimonialRow) {
    setEditingId(row.id);
    setForm({
      id: row.id,
      name: row.name,
      role: row.role,
      text: row.text,
      rating: row.rating ?? 5,
      sortOrder: row.sort_order ?? 1,
      isActive: row.is_active ?? true,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload: TestimonialRow = {
      id: editingId ?? form.id,
      name: form.name.trim(),
      role: form.role.trim(),
      text: form.text.trim(),
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      sort_order: Number(form.sortOrder) || 1,
      is_active: form.isActive,
    };

    if (!supabase || !supabaseAuthed) {
      setRows((prev) =>
        editingId ? prev.map((r) => (r.id === editingId ? payload : r)) : [...prev, payload]
      );
      setModalOpen(false);
      toast.success("Testimoni diperbarui di sesi lokal.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("testimonials")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      invalidateCmsCache();
      toast.success(editingId ? "Testimoni diperbarui!" : "Testimoni baru ditambahkan!");
      setModalOpen(false);
      await loadTestimonials();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan testimoni.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(row: TestimonialRow) {
    const next = !row.is_active;
    if (!supabase || !supabaseAuthed) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: next } : r)));
      return;
    }
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_active: next })
        .eq("id", row.id);
      if (error) throw error;
      invalidateCmsCache();
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: next } : r)));
      toast.success(`Testimoni ${row.name} ${next ? "ditampilkan" : "disembunyikan"}.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status.");
    }
  }

  async function handleDelete(row: TestimonialRow) {
    if (!window.confirm(`Hapus testimoni dari "${row.name}"?`)) return;
    if (!supabase || !supabaseAuthed) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", row.id);
      if (error) throw error;
      invalidateCmsCache();
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast.success("Testimoni dihapus.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus testimoni.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900">Kelola Testimoni Pelanggan</h2>
          <p className="text-xs text-slate-500">
            Tambahkan ulasan dari pelanggan Kebersihan, Teknisi, maupun peserta Tennis Coaching.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`size-3.5 ${seeding ? "animate-spin" : ""}`} />
            <span>Impor Default</span>
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-gradient px-5 text-xs font-bold text-white shadow-sm hover:brightness-105 transition"
          >
            <Plus className="size-4" /> Tambah Testimoni
          </button>
        </div>
      </div>

      {/* Empty Banner */}
      {rows.length === 0 && !loading && (
        <div className="rounded-3xl border border-teal-200 bg-teal-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-base font-black text-teal-950 flex items-center gap-2">
              <Database className="size-5 text-teal-600" />
              Tabel Testimoni Masih Kosong
            </p>
            <p className="text-xs text-teal-800">
              Klik tombol di samping untuk mengimpor testimoni awal ke Supabase.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="rounded-full bg-teal-700 text-white hover:bg-teal-800 font-bold shrink-0"
          >
            {seeding ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Impor Testimoni Awal
          </Button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-teal-600" />
          <span>Memuat testimoni...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition ${
                row.is_active ? "border-slate-200/90" : "border-slate-200 bg-slate-50 opacity-70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: row.rating || 5 }).map((_, k) => (
                      <Star key={k} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      row.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {row.is_active ? "Aktif" : "Tersembunyi"}
                  </span>
                </div>

                <Quote className="size-6 text-teal-100 mb-2" />
                <p className="text-sm text-slate-700 leading-relaxed">“{row.text}”</p>

                <div className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-gradient font-bold text-white">
                    {row.name[0]?.toUpperCase() || "P"}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{row.name}</p>
                    <p className="text-xs text-slate-500">{row.role}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(row)}
                  className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                >
                  {row.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row)}
                  className="grid size-9 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nama Pelanggan *</Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Mis: Rina Wulandari"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Peran / Domisili *</Label>
                  <Input
                    required
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    placeholder="Mis: Ibu rumah tangga, Bekasi"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Isi Ulasan / Testimoni *</Label>
                <Textarea
                  required
                  rows={3}
                  value={form.text}
                  onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                  placeholder="Tulis pengalaman pelanggan terhadap layanan HS Support..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Rating Bintang</Label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Bintang
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Urutan</Label>
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

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-brand-gradient text-white font-bold px-6"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  Simpan Testimoni
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

