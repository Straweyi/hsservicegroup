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

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "Semua Kategori" },
  { id: "kebersihan", label: "Jasa Kebersihan" },
  { id: "teknisi", label: "Jasa Teknisi" },
  { id: "tennis", label: "Tennis" },
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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filterCategory === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 sm:w-64">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama layanan..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs outline-none focus:border-teal-500 focus:bg-white"
          />
        </div>

        {hasRows && (
          <button
            type="button"
            onClick={onSeed}
            disabled={seeding}
            title="Reset / Sinkronkan ulang 20 layanan bawaan"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`size-3.5 ${seeding ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sinkron Default</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-gradient px-5 text-xs font-bold text-white shadow-sm hover:brightness-105 transition"
        >
          <Plus className="size-4" /> Tambah Layanan
        </button>
      </div>
    </div>
  );
}

