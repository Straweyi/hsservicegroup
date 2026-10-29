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
import { getDiscountLabel, type PriceTier } from "@/lib/data";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {editingId ? `Edit Layanan: ${form.name}` : "Tambah Layanan Baru"}
            </h2>
            <p className="text-xs text-slate-500">
              Atur informasi layanan, foto, serta paket harga normal & diskon di bawah ini.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
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
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
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
                className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-xs font-bold transition ${
                  form.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {form.isActive ? <Check className="size-4" /> : <EyeOff className="size-4" />}
                {form.isActive ? "Aktif di Website" : "Disembunyikan"}
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
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((item) => {
                const IconComp = item.icon;
                const selected = form.icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onChange((prev) => ({ ...prev, icon: item.name }))}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <IconComp className="size-3.5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gambar Layanan */}
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <Label htmlFor="f-image">Gambar Layanan</Label>
            <div className="grid gap-4 sm:grid-cols-12 items-center">
              <div className="sm:col-span-4 h-28 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image || "/services/home.jpg"}
                  alt="Preview"
                  className="size-full object-cover object-top"
                />
              </div>
              <div className="sm:col-span-8 space-y-2.5">
                <Input
                  id="f-image"
                  value={form.image}
                  onChange={(e) => onChange((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="/services/home.jpg atau https://..."
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition">
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
                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
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
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold text-slate-900">
                  Daftar Paket, Harga Normal & Diskon *
                </Label>
                <p className="text-[11px] text-slate-500">
                  Isi <strong>Harga Normal (Coret)</strong> jika sedang diskon — persentase hemat dihitung otomatis!
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
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100"
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
                    className={`rounded-2xl border p-3.5 space-y-2.5 transition ${
                      autoBadge
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-200/80 bg-slate-50/50"
                    }`}
                  >
                    {/* Baris 1: Label Paket, Harga Berlaku/Diskon, Populer, Hapus */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <div className="flex-1 min-w-[160px]">
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

                      <div className="w-full sm:w-44">
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

                      <div className="pt-4 flex items-center gap-1.5 shrink-0">
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
                          className={`inline-flex h-9 items-center gap-1 rounded-lg border px-2.5 text-xs font-bold transition ${
                            tier.popular
                              ? "border-amber-300 bg-amber-50 text-amber-800"
                              : "border-slate-200 bg-white text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          <Star
                            className={`size-3.5 ${
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
                            className="grid size-9 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Baris 2: Pengaturan Diskon (Harga Normal Coret & Label Promo) */}
                    <div className="grid gap-2.5 sm:grid-cols-12 items-center pt-1 border-t border-slate-200/60">
                      <div className="sm:col-span-5">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-rose-600 mb-1">
                          <Tag className="size-3" /> Harga Normal / Coret (Opsional)
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
                          className="h-8 text-xs bg-white"
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
                          className="h-8 text-xs bg-white"
                        />
                      </div>

                      {/* Live Preview Tampilan Diskon */}
                      <div className="sm:col-span-3 text-right pt-2 sm:pt-3">
                        {autoBadge && tier.originalPrice ? (
                          <div className="inline-flex flex-col items-end rounded-xl border border-emerald-200 bg-white px-2.5 py-1 shadow-2xs">
                            <div className="flex items-center gap-1">
                              <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-600">
                                🔥 {autoBadge}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through decoration-rose-500">
                                {tier.originalPrice}
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

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full px-5"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand-gradient px-6 font-bold text-white"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambahkan Layanan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
