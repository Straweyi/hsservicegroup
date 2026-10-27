"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles, MessageCircle, ChevronDown, ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { services, WHATSAPP_NUMBER } from "@/lib/data";

const navLinks = [
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#testimoni", label: "Testimoni" },
  { href: "/#keunggulan", label: "Keunggulan" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const kebersihanServices = services.filter((s) => s.category === "kebersihan");
  const teknisiServices = services.filter((s) => s.category === "teknisi");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "glass shadow-sm" : "bg-white/80 backdrop-blur-md"}`}
    >
      <nav className="mx-auto flex h-16 sm:h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-brand-800">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand-gradient text-white shadow-md shadow-brand-500/20">
            <Sparkles className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="text-base font-extrabold tracking-tight">Hs Support</span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Group</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-7 md:flex">
          {/* Dropdown Layanan */}
          <li
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 transition hover:text-brand-600 focus:outline-none"
              aria-expanded={dropdownOpen}
            >
              <span>LAYANAN</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-brand-600" : "text-slate-400"}`}
              />
            </button>

            {/* Dropdown Menu Card */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-[540px]"
                >
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl ring-1 ring-black/5">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Column 1: Jasa Kebersihan */}
                      <div>
                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-teal-700">
                            Jasa Kebersihan
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">9 Layanan</span>
                        </div>
                        <ul className="space-y-1">
                          {kebersihanServices.map((s) => (
                            <li key={s.id}>
                              <Link
                                href={`/layanan/${s.id}`}
                                onClick={() => setDropdownOpen(false)}
                                className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand-600"
                              >
                                <span className="truncate">{s.name}</span>
                                <ArrowRight className="size-3.5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 text-brand-600 shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2: Jasa Teknisi */}
                      <div>
                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-teal-700">
                            Jasa Teknisi
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">8 Layanan</span>
                        </div>
                        <ul className="space-y-1">
                          {teknisiServices.map((s) => (
                            <li key={s.id}>
                              <Link
                                href={`/layanan/${s.id}`}
                                onClick={() => setDropdownOpen(false)}
                                className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand-600"
                              >
                                <span className="truncate">{s.name}</span>
                                <ArrowRight className="size-3.5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 text-brand-600 shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Dropdown Footer */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <Link
                        href="/tennis-coaching"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
                      >
                        <span>🎾 Mau les tenis? HS Tennis Coaching</span>
                        <ArrowRight className="size-3" />
                      </Link>
                      <Link
                        href="/#layanan"
                        onClick={() => setDropdownOpen(false)}
                        className="font-bold text-brand-600 hover:underline"
                      >
                        Lihat Semua Layanan →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* HS Tennis Coaching Link */}
          <li>
            <Link
              href="/tennis-coaching"
              className="group flex items-center gap-1.5 text-sm font-semibold text-slate-800 transition hover:text-brand-600"
            >
              <span>Tennis Coaching</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-700 tracking-wide">
                Sport
              </span>
            </Link>
          </li>

          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-semibold text-slate-700 transition hover:text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-2.5 md:flex">
          <LinkButton
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            className="h-10 rounded-full border-slate-200 px-4 text-sm font-semibold shadow-sm hover:border-slate-300 hover:bg-slate-50 gap-1.5"
          >
            <MessageCircle className="size-4 text-emerald-600" /> WhatsApp
          </LinkButton>
          <LinkButton
            href="/#pesan"
            className="h-10 rounded-full bg-brand-gradient px-5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:brightness-105 hover:scale-[1.02]"
          >
            Pesan Sekarang
          </LinkButton>
        </div>

        {/* Mobile Toggle Button */}
        <button
          id="nav-toggle"
          aria-label="Toggle menu"
          className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-3 mb-3 max-h-[85vh] overflow-y-auto rounded-3xl p-5 shadow-xl border border-slate-200/80 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {/* Mobile Accordion for Layanan */}
            <li>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="flex w-full items-center justify-between py-2 text-sm font-bold text-slate-900"
              >
                <span>LAYANAN</span>
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180 text-brand-600" : "text-slate-400"}`}
                />
              </button>

              {mobileServicesOpen && (
                <div className="mt-2 space-y-4 pl-2 pr-1 pb-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-teal-700 mb-2">Jasa Kebersihan</p>
                    <ul className="space-y-1">
                      {kebersihanServices.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/layanan/${s.id}`}
                            onClick={() => {
                              setOpen(false);
                              setMobileServicesOpen(false);
                            }}
                            className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-teal-700 mb-2">Jasa Teknisi</p>
                    <ul className="space-y-1">
                      {teknisiServices.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/layanan/${s.id}`}
                            onClick={() => {
                              setOpen(false);
                              setMobileServicesOpen(false);
                            }}
                            className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>

            {/* HS Tennis Coaching Mobile Link */}
            <li>
              <Link
                href="/tennis-coaching"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-2 text-sm font-bold text-slate-900 hover:text-emerald-600"
              >
                <span>🎾 HS Tennis Coaching</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Sport
                </span>
              </Link>
            </li>

            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800"
                >
                  {l.label}
                </Link>
              </li>
            ))}

            <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-slate-100">
              <LinkButton
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                className="h-10.5 w-full justify-center rounded-full text-sm font-semibold border-slate-200 gap-2"
              >
                <MessageCircle className="size-4 text-emerald-600" /> WhatsApp
              </LinkButton>
              <LinkButton
                href="/#pesan"
                onClick={() => setOpen(false)}
                className="h-10.5 w-full justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-md shadow-brand-500/20"
              >
                Pesan Sekarang
              </LinkButton>
            </div>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
