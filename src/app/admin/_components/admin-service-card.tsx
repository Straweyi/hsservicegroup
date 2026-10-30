"use client";

import { Pencil, Eye, EyeOff, Trash2, Tag } from "lucide-react";
import { getDiscountLabel, formatNormalPrice } from "@/lib/data";
import type { ServiceRow } from "@/lib/services-store";

type AdminServiceCardProps = {
  row: ServiceRow;
  onEdit: (row: ServiceRow) => void;
  onToggleActive: (row: ServiceRow) => void;
  onDelete: (row: ServiceRow) => void;
};

export function AdminServiceCard({
  row,
  onEdit,
  onToggleActive,
  onDelete,
}: AdminServiceCardProps) {
  const hasPromo = row.tiers.some((t) => Boolean(getDiscountLabel(t)));

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl sm:rounded-3xl border bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md ${
        row.is_active ? "border-slate-200/90" : "border-slate-200 bg-slate-50/70 opacity-75"
      }`}
    >
      <div>
        {/* Image & Category Status */}
        <div className="relative mb-3.5 sm:mb-4 h-40 sm:h-44 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.image || "/services/home.jpg"}
            alt={row.name}
            className="size-full object-cover object-top"
          />
          <div className="absolute inset-x-2.5 sm:inset-x-3 top-2.5 sm:top-3 flex items-center justify-between gap-1.5">
            <span className="rounded-full bg-slate-900/80 px-2.5 sm:px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              {row.category === "kebersihan"
                ? "Kebersihan"
                : row.category === "teknisi"
                ? "Teknisi"
                : "Sport"}
            </span>
            <div className="flex items-center gap-1">
              {hasPromo && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2 sm:px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
                  <Tag className="size-2.5" /> Diskon
                </span>
              )}
              <span
                className={`rounded-full px-2 sm:px-2.5 py-1 text-[10px] font-bold ${
                  row.is_active
                    ? "bg-emerald-500/90 text-white"
                    : "bg-slate-700/90 text-slate-200"
                }`}
              >
                {row.is_active ? "Aktif" : "Sembunyi"}
              </span>
            </div>
          </div>
        </div>

        {/* Title & Slug */}
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
            {row.name}
          </h3>
          <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
            ID: {row.id} • Urutan #{row.sort_order}
          </p>
        </div>
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">{row.desc}</p>

        {/* Tiers Preview */}
        <div className="mt-3.5 sm:mt-4 space-y-1.5 border-t border-slate-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Paket & Tarif ({row.tiers.length}):
          </p>
          {row.tiers.map((t, idx) => {
            const discountBadge = getDiscountLabel(t);
            return (
              <div
                key={idx}
                className={`flex items-center justify-between gap-2 text-xs py-1.5 px-2.5 rounded-xl border ${
                  discountBadge
                    ? "border-emerald-200/80 bg-emerald-50/50"
                    : "border-transparent bg-slate-50"
                }`}
              >
                <div className="min-w-0 font-medium text-slate-700 flex flex-wrap items-center gap-1">
                  <span className="break-words">{t.label}</span>
                  {discountBadge && (
                    <span className="rounded-full bg-rose-500/10 border border-rose-200 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-600 shrink-0">
                      🔥 {discountBadge}
                    </span>
                  )}
                  {t.popular && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 shrink-0">
                      ⭐ Populer
                    </span>
                  )}
                </div>
                <div className="ml-auto text-right shrink-0">
                  {discountBadge && t.originalPrice && (
                    <span className="block sm:inline sm:mr-1.5 text-[10px] font-medium text-slate-400">
                      {formatNormalPrice(t.originalPrice)}
                      <span className="hidden sm:inline"> ·</span>
                    </span>
                  )}
                  <span
                    className={`font-extrabold ${
                      discountBadge ? "text-emerald-700" : "text-slate-900"
                    }`}
                  >
                    {t.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onEdit(row)}
          className="flex-1 h-10 sm:h-9 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 transition"
        >
          <Pencil className="size-3.5 shrink-0" />
          <span className="truncate">Edit Layanan & Harga</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleActive(row)}
          title={row.is_active ? "Sembunyikan layanan" : "Tampilkan layanan"}
          className="grid size-10 sm:size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition"
        >
          {row.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => onDelete(row)}
          title="Hapus layanan"
          className="grid size-10 sm:size-9 shrink-0 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
