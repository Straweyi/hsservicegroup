"use client";

import {
  X,
  Check,
  EyeOff,
  Upload,
  Loader2,
  Plus,
  Star,
  Trash2,
  Tag,
} from "lucide-react";
import { getDiscountLabel, formatNormalPrice, type PriceTier } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ICON_OPTIONS, PRESET_IMAGES, slugify } from "./admin-constants";

export type ServiceFormState = {
  id: string;
  idManual: boolean;
  category: "kebersihan" | "teknisi" | "tennis";
  name: string;
  desc: string;
  icon: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  tiers: PriceTier[];
};

type AdminServiceModalProps = {
  editingId: string | null;
  form: ServiceFormState;
  saving: boolean;
  uploadingImage: boolean;
  onChange: (updater: (prev: ServiceFormState) => ServiceFormState) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
};

export function AdminServiceModal({
  editingId,
  form,
  saving,
  uploadingImage,
  onChange,
  onImageUpload,
  onSubmit,
  onClose,
}: AdminServiceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 lg:p-6 backdrop-blur-xs">
      <div className="relative flex flex-col w-full max-w-2xl lg:max-w-3xl max-h-[94dvh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Sticky Modal Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-7 sm:py-5 bg-white shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-black text-slate-900 truncate">
              {editingId ? `Edit Layanan: ${form.name}` : "Tambah Layanan Baru"}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Atur informasi layanan, foto, serta paket harga normal & diskon.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-7 sm:py-6 space-y-5">
            {/* Row 1: Nama & Kategori */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="f-name">Nama Layanan *</Label>
                <Input
                  id="f-name"
                  required
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange((prev) => ({
                      ...prev,
                      name: val,
                      id: !editingId && !prev.idManual ? slugify(val) : prev.id,
                    }));
                  }}
                  placeholder="Contoh: Cuci Sofa & Kasur"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-cat">Kategori *</Label>
                <select
                  id="f-cat"
                  value={form.category}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      category: e.target.value as "kebersihan" | "teknisi" | "tennis",
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none"
                >
                  <option value="kebersihan">Jasa Kebersihan</option>
                  <option value="teknisi">Jasa Teknisi</option>
                  <option value="tennis">Tennis Coaching</option>
                </select>
              </div>
            </div>

            {/* Row 2: Slug ID, Urutan, Status */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4">
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label htmlFor="f-id">Slug ID (URL) *</Label>
                <Input
                  id="f-id"
                  required
                  disabled={Boolean(editingId)}
                  value={form.id}
                  onChange={(e) => {
                    const val = slugify(e.target.value);
                    onChange((prev) => ({ ...prev, idManual: true, id: val }));
                  }}
                  placeholder="cuci-sofa"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-order">Urutan Tampil</Label>
                <Input
                  id="f-order"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Status Tampil</Label>
                <button
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-bold transition ${
                    form.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {form.isActive ? <Check className="size-4 shrink-0" /> : <EyeOff className="size-4 shrink-0" />}
                  <span className="truncate">{form.isActive ? "Aktif" : "Sembunyi"}</span>
                </button>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="f-desc">Deskripsi Layanan *</Label>
              <Textarea
                id="f-desc"
                required
                rows={2}
                value={form.desc}
                onChange={(e) => onChange((prev) => ({ ...prev, desc: e.target.value }))}
                placeholder="Jelaskan cakupan pekerjaan layanan ini secara singkat dan jelas..."
              />
            </div>

            {/* Pilih Ikon */}
            <div className="space-y-2">
              <Label>Pilih Ikon Layanan</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {ICON_OPTIONS.map((item) => {
                  const IconComp = item.icon;
                  const selected = form.icon === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => onChange((prev) => ({ ...prev, icon: item.name }))}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <IconComp className="size-3.5 shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gambar Layanan */}
            <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 sm:p-4">
              <Label htmlFor="f-image">Gambar Layanan</Label>
              <div className="grid gap-3.5 sm:grid-cols-12 items-center">
                <div className="sm:col-span-4 h-36 sm:h-28 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image || "/services/home.jpg"}
                    alt="Preview"
                    className="size-full object-cover object-top"
                  />
                </div>
                <div className="sm:col-span-8 space-y-2.5 min-w-0">
                  <Input
                    id="f-image"
                    value={form.image}
                    onChange={(e) => onChange((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="/services/home.jpg atau https://..."
                  />
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="cursor-pointer inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition shrink-0">
                      {uploadingImage ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Upload className="size-3.5" />
                      )}
                      <span>{uploadingImage ? "Mengunggah..." : "Upload Foto Baru"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="hidden"
                      />
                    </label>

                    <select
                      value={PRESET_IMAGES.some((p) => p.url === form.image) ? form.image : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) onChange((prev) => ({ ...prev, image: val }));
                      }}
                      className="h-9 w-full sm:flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                    >
                      <option value="">-- Pilih Gambar Bawaan --</option>
                      {PRESET_IMAGES.map((p) => (
                        <option key={p.url} value={p.url}>
                          {p.label} ({p.url})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Editor Paket, Harga Normal & Diskon (Tiers) */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <Label className="text-sm font-bold text-slate-900">
                    Daftar Paket, Harga Normal & Diskon *
                  </Label>
                  <p className="text-[11px] text-slate-500">
                    Isi <strong>Harga Normal</strong> jika sedang diskon — persentase hemat dihitung otomatis!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      tiers: [
                        ...prev.tiers,
                        { label: "", price: "", originalPrice: "", discountBadge: "", popular: false },
                      ],
                    }))
                  }
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-3.5 text-xs font-bold text-teal-800 hover:bg-teal-100 shrink-0"
                >
                  <Plus className="size-3.5" /> Tambah Paket
                </button>
              </div>

              <div className="space-y-3">
                {form.tiers.map((tier, idx) => {
                  const autoBadge = getDiscountLabel(tier);
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-3 sm:p-3.5 space-y-3 transition ${
                        autoBadge
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-slate-200/80 bg-slate-50/50"
                      }`}
                    >
                      {/* Baris 1: Label Paket, Harga Berlaku/Diskon, Populer, Hapus */}
                      <div className="grid gap-2.5 sm:grid-cols-12 items-end">
                        <div className="sm:col-span-5">
                          <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Nama Paket *
                          </span>
                          <Input
                            placeholder="Mis: Minimum 3 Jam / 1 AC"
                            value={tier.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange((prev) => ({
                                ...prev,
                                tiers: prev.tiers.map((item, i) =>
                                  i === idx ? { ...item, label: val } : item
                                ),
                              }));
                            }}
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <span className="block text-[10px] font-bold uppercase text-emerald-700 mb-1">
                            Harga Berlaku / Diskon *
                          </span>
                          <Input
                            placeholder="Mis: Rp 150.000"
                            value={tier.price}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange((prev) => ({
                                ...prev,
                                tiers: prev.tiers.map((item, i) =>
                                  i === idx ? { ...item, price: val } : item
                                ),
                              }));
                            }}
                          />
                        </div>

                        <div className="sm:col-span-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              onChange((prev) => ({
                                ...prev,
                                tiers: prev.tiers.map((item, i) =>
                                  i === idx ? { ...item, popular: !item.popular } : item
                                ),
                              }))
                            }
                            title="Tandai sebagai Paket Populer"
                            className={`flex-1 inline-flex h-10 items-center justify-center gap-1 rounded-lg border px-2.5 text-xs font-bold transition ${
                              tier.popular
                                ? "border-amber-300 bg-amber-50 text-amber-800"
                                : "border-slate-200 bg-white text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <Star
                              className={`size-3.5 shrink-0 ${
                                tier.popular ? "fill-amber-400 text-amber-500" : ""
                              }`}
                            />
                            <span>Populer</span>
                          </button>

                          {form.tiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                onChange((prev) => ({
                                  ...prev,
                                  tiers: prev.tiers.filter((_, i) => i !== idx),
                                }))
                              }
                              className="grid size-10 shrink-0 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Baris 2: Pengaturan Diskon (Harga Normal & Label Promo) */}
                      <div className="grid gap-2.5 sm:grid-cols-12 items-center pt-2 border-t border-slate-200/60">
                        <div className="sm:col-span-5">
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-rose-600 mb-1">
                            <Tag className="size-3" /> Harga Normal (Opsional)
                          </span>
                          <Input
                            placeholder="Kosongkan jika tidak diskon (mis: Rp 200.000)"
                            value={tier.originalPrice ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange((prev) => ({
                                ...prev,
                                tiers: prev.tiers.map((item, i) =>
                                  i === idx ? { ...item, originalPrice: val } : item
                                ),
                              }));
                            }}
                            className="h-9 text-xs bg-white"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Label Promo Kustom (Opsional)
                          </span>
                          <Input
                            placeholder="Otomatis (mis: Hemat 25%)"
                            value={tier.discountBadge ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange((prev) => ({
                                ...prev,
                                tiers: prev.tiers.map((item, i) =>
                                  i === idx ? { ...item, discountBadge: val } : item
                                ),
                              }));
                            }}
                            className="h-9 text-xs bg-white"
                          />
                        </div>

                        {/* Live Preview Tampilan Diskon */}
                        <div className="sm:col-span-3 flex sm:justify-end pt-1 sm:pt-3">
                          {autoBadge && tier.originalPrice ? (
                            <div className="w-full sm:w-auto flex sm:inline-flex flex-row sm:flex-col items-center sm:items-end justify-between rounded-xl border border-emerald-200 bg-white px-3 py-1.5 sm:px-2.5 sm:py-1 shadow-2xs">
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-600">
                                  🔥 {autoBadge}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">
                                  {formatNormalPrice(tier.originalPrice)}
                                </span>
                              </div>
                              <span className="text-xs font-black text-emerald-700">
                                {tier.price || "Rp -"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Harga Normal</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Submit Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-slate-100 bg-white px-4 py-3.5 sm:px-7 sm:py-4 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full h-10 px-5 w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full h-10 bg-brand-gradient px-7 font-bold text-white shadow-md w-full sm:w-auto"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambahkan Layanan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
