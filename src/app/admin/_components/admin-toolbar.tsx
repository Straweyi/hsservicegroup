"use client";

import { Search, RefreshCw, Plus } from "lucide-react";

export type CategoryFilter = "all" | "kebersihan" | "teknisi" | "tennis";

type AdminToolbarProps = {
  filterCategory: CategoryFilter;
  searchQuery: string;
  hasRows: boolean;
  seeding: boolean;
  onFilterChange: (cat: CategoryFilter) => void;
  onSearchChange: (q: string) => void;
  onSeed: () => void;
  onAdd: () => void;
};

const CATEGORY_TABS: { id: CategoryFilter; label: string; shortLabel: string }[] = [
  { id: "all", label: "Semua Kategori", shortLabel: "Semua" },
  { id: "kebersihan", label: "Jasa Kebersihan", shortLabel: "Kebersihan" },
  { id: "teknisi", label: "Jasa Teknisi", shortLabel: "Teknisi" },
  { id: "tennis", label: "Tennis", shortLabel: "Tennis" },
];

export function AdminToolbar({
  filterCategory,
  searchQuery,
  hasRows,
  seeding,
  onFilterChange,
  onSearchChange,
  onSeed,
  onAdd,
}: AdminToolbarProps) {
  return (
    <div className="flex flex-col gap-3.5 xl:flex-row xl:items-center xl:justify-between bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
      {/* Category Filter Pills: 2x2 on small phone, inline row on tablet/laptop/desktop */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`rounded-xl sm:rounded-full px-3 sm:px-4 py-2 text-xs font-bold transition text-center ${
              filterCategory === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1 xl:w-64 2xl:w-72">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama layanan..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs sm:text-sm outline-none focus:border-teal-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {hasRows && (
            <button
              type="button"
              onClick={onSeed}
              disabled={seeding}
              title="Reset / Sinkronkan ulang 20 layanan bawaan"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 sm:px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shrink-0"
            >
              <RefreshCw className={`size-3.5 shrink-0 ${seeding ? "animate-spin" : ""}`} />
              <span>Sinkron Default</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAdd}
            className="flex-1 sm:flex-initial inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 sm:px-5 text-xs font-bold text-white shadow-sm hover:brightness-105 transition shrink-0"
          >
            <Plus className="size-4 shrink-0" />
            <span>Tambah Layanan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
