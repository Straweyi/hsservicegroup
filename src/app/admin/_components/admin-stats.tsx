"use client";

import { Database, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminStatsData = {
  total: number;
  active: number;
  kebersihan: number;
  teknisi: number;
  tennis: number;
};

type AdminStatsProps = {
  stats: AdminStatsData;
  isEmpty: boolean;
  seeding: boolean;
  onSeed: () => void;
};

export function AdminStats({ stats, isEmpty, seeding, onSeed }: AdminStatsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Layanan</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Status Aktif</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Jasa Kebersihan</p>
          <p className="mt-1 text-2xl font-black text-teal-700">{stats.kebersihan}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Jasa Teknisi</p>
          <p className="mt-1 text-2xl font-black text-sky-700">{stats.teknisi}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Tennis Coaching</p>
          <p className="mt-1 text-2xl font-black text-amber-600">{stats.tennis}</p>
        </div>
      </div>

      {isEmpty && (
        <div className="rounded-3xl border border-teal-200 bg-teal-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-base font-black text-teal-950 flex items-center gap-2">
              <Database className="size-5 text-teal-600" />
              Tabel Layanan di Supabase Masih Kosong
            </p>
            <p className="text-xs text-teal-800">
              Klik tombol di samping untuk mengimpor otomatis ke-20 layanan awal (Kebersihan, Teknisi, dan Tennis) ke tabel Supabase Anda.
            </p>
          </div>
          <Button
            type="button"
            onClick={onSeed}
            disabled={seeding}
            className="rounded-full bg-teal-700 text-white hover:bg-teal-800 font-bold shrink-0"
          >
            {seeding ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            {seeding ? "Mengimpor..." : "Impor 20 Layanan Awal"}
          </Button>
        </div>
      )}
    </div>
  );
}

