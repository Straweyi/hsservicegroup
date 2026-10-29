"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="HS Support Group Logo"
            width={40}
            height={40}
            className="size-10 rounded-xl object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900">HS Support CMS</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-teal-700">
                <ShieldCheck className="size-3" />
                {isSupabaseReady ? "Supabase Terhubung" : "Sesi Terproteksi"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ID: <span className="font-bold text-slate-700">{adminId || "hspunyaadmin"}</span> •{" "}
              {userEmail || "admin@hssg.com"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Lihat Website
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
          >
            <LogOut className="size-3.5" /> Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
