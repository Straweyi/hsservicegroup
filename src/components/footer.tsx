"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Phone, MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/data";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
        id="wa-float"
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"
      >
        <MessageCircle className="size-7" />
      </a>
      <footer className="border-t border-slate-200/80 bg-white pt-14 pb-10 text-slate-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-slate-100">
            {/* Col 1: Brand & Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-sm">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="font-extrabold text-slate-900 tracking-tight leading-tight">Hs Support Group</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cleaning • Technician • Sports</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Solusi terpadu kebersihan, perawatan peralatan rumah tangga, dan pelatihan olahraga tenis profesional dengan standar prima.
              </p>
            </div>

            {/* Col 2: HS Services */}
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Layanan Utama</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/layanan/home-cleaning" className="hover:text-brand-600 transition">
                    Home Cleaning & Kos
                  </Link>
                </li>
                <li>
                  <Link href="/layanan/cleaning-kantor" className="hover:text-brand-600 transition">
                    Cleaning Kantor & Gedung
                  </Link>
                </li>
                <li>
                  <Link href="/layanan/cuci-ac" className="hover:text-brand-600 transition">
                    Cuci & Pasang AC
                  </Link>
                </li>
                <li>
                  <Link href="/#layanan" className="font-semibold text-brand-600 hover:underline">
                    Semua 17 Layanan Service →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: HS Tennis Coaching */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-900">HS Sports</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Coaching
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/tennis-coaching" className="font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                    <span>🎾 HS Tennis Coaching</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tennis-coaching#paket-program" className="hover:text-emerald-700 transition">
                    Private & Semi-Private
                  </Link>
                </li>
                <li>
                  <Link href="/tennis-coaching#paket-program" className="hover:text-emerald-700 transition">
                    Kids & Junior Academy
                  </Link>
                </li>
                <li>
                  <Link href="/tennis-coaching#booking-form" className="hover:text-emerald-700 transition">
                    Pesan Latihan via WhatsApp
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & WhatsApp */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Kontak & Pemesanan</p>
              <p className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Phone className="size-4 text-brand-600 shrink-0" /> {WHATSAPP_DISPLAY}
              </p>
              <p className="text-[11px] text-slate-500">
                Layanan Pelanggan: Setiap Hari (08.00 - 20.00 WIB)
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                <MessageCircle className="size-3.5 text-emerald-600" /> Chat Admin WhatsApp
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {year ?? ""} Hs Support Group. All rights reserved.</p>
            <p>Karena rumah bersih dan hidup sehat dimulai dari pelayanan terpercaya.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
