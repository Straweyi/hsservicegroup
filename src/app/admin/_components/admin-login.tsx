"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminLoginProps = {
  identifier: string;
  password: string;
  loginLoading: boolean;
  errorMessage: string | null;
  onIdentifierChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function AdminLogin({
  identifier,
  password,
  loginLoading,
  errorMessage,
  onIdentifierChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 mb-5 sm:mb-6"
        >
          <ArrowLeft className="size-4 shrink-0" /> Kembali ke Website Utama
        </Link>

        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 sm:gap-3.5 mb-5 sm:mb-6">
            <Image
              src="/logo.png"
              alt="HS Support Group Logo"
              width={48}
              height={48}
              className="size-11 sm:size-12 rounded-2xl object-contain shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                Portal Login Admin
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500">
                CMS Layanan & Harga HS Support Group
              </p>
            </div>
          </div>

          <div className="mb-5 flex items-start sm:items-center gap-2 rounded-2xl border border-teal-200/80 bg-teal-50/70 px-3.5 py-2.5 text-[11px] font-semibold text-teal-900 leading-snug">
            <ShieldCheck className="size-4 text-teal-600 shrink-0 mt-0.5 sm:mt-0" />
            <span>Dilindungi Anti Brute-Force & Sesi Enkripsi HTTP-Only</span>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800">
              <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <Label htmlFor="admin-identifier" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <UserCheck className="size-3.5 text-slate-500 shrink-0" /> ID Admin atau Email
              </Label>
              <Input
                id="admin-identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => onIdentifierChange(e.target.value)}
                placeholder="Masukan Username"
                autoComplete="username"
                className="h-11 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <KeyRound className="size-3.5 text-slate-500 shrink-0" /> Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Masukan Password"
                  className="h-11 pr-11 text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-lg text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="mt-2 w-full h-11 sm:h-12 rounded-full bg-brand-gradient text-white text-sm font-bold shadow-md"
            >
              {loginLoading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              {loginLoading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard CMS"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
