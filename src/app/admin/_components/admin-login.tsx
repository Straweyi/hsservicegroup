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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="size-4" /> Kembali ke Website Utama
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3.5 mb-6">
            <Image
              src="/logo.png"
              alt="HS Support Group Logo"
              width={48}
              height={48}
              className="size-12 rounded-2xl object-contain"
            />
            <div>
              <h1 className="text-xl font-black text-slate-900">Portal Login Admin</h1>
              <p className="text-xs text-slate-500">CMS Layanan & Harga HS Support Group</p>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-teal-200/80 bg-teal-50/70 px-3.5 py-2.5 text-[11px] font-semibold text-teal-900">
            <ShieldCheck className="size-4 text-teal-600 shrink-0" />
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
              <Label htmlFor="admin-identifier" className="flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-slate-500" /> ID Admin atau Email
              </Label>
              <Input
                id="admin-identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => onIdentifierChange(e.target.value)}
                placeholder="hspunyaadmin atau admin@hssg.com"
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-slate-500" /> Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="••••••••••••"
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="mt-2 w-full h-11 rounded-full bg-brand-gradient text-white font-bold shadow-md"
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
