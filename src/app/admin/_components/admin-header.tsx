"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";

type AdminHeaderProps = {
  adminId?: string | null;
  userEmail?: string | null;
  isSupabaseReady: boolean;
  onLogout: () => void;
};

export function AdminHeader({
  adminId,
  userEmail,
  isSupabaseReady,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-3.5 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Image
            src="/logo.png"
            alt="HS Support Group Logo"
            width={40}
            height={40}
            className="size-9 sm:size-10 rounded-xl object-contain shrink-0"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate">
                HS Support CMS
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase text-teal-700 shrink-0">
                <ShieldCheck className="size-3 shrink-0" />
                <span className="hidden xs:inline sm:inline">
                  {isSupabaseReady ? "Supabase Terhubung" : "Sesi Terproteksi"}
                </span>
                <span className="sm:hidden">{isSupabaseReady ? "Online" : "Aman"}</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">
              ID: <span className="font-bold text-slate-700">{adminId || "hspunyaadmin"}</span>
              <span className="hidden sm:inline"> • {userEmail || "admin@hssg.com"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <Link
            href="/"
            className="inline-flex h-9 sm:h-9.5 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 sm:px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <ExternalLink className="size-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline">Lihat Website</span>
            <span className="sm:hidden">Web</span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex h-9 sm:h-9.5 items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 sm:px-4 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
          >
            <LogOut className="size-3.5 shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
