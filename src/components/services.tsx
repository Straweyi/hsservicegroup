"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  MessageCircle,
  Sparkles,
  Tag,
  type LucideIcon,
  Home,
  Building2,
  DoorOpen,
  Wind,
  Wrench,
  Fuel,
  Droplets,
  Flame,
  Refrigerator,
  Waves,
  Plug,
  Trophy,
  User,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getDiscountLabel, formatNormalPrice, type Service } from "@/lib/data";
import { useServices } from "@/lib/use-services";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "kebersihan", label: "Jasa Kebersihan", sub: "Rumah · Kantor · Apartemen · Kos" },
  { id: "teknisi", label: "Jasa Teknisi", sub: "AC · Listrik · Plumbing · Elektronik" },
  { id: "tennis", label: "Sport", sub: "Private Coaching · Group Class · Kids & Junior" },
] as const;

const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  DoorOpen,
  Wind,
  Wrench,
  Fuel,
  Droplets,
  Flame,
  Refrigerator,
  Waves,
  Plug,
  Trophy,
  User,
  Users,
  Target,
  Zap,
  Sparkles,
};

function getCategoryLabel(category: Service["category"]) {
  if (category === "kebersihan") return "Jasa Kebersihan";
  if (category === "teknisi") return "Jasa Teknisi";
  return "Tennis Coaching";
}

export function Services() {
  const { services } = useServices();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("kebersihan");

  const list = services.filter((s) => s.category === tab);

  const handleBooking = (serviceId: string) => {
    window.dispatchEvent(new CustomEvent("select-service", { detail: serviceId }));
  };

  return (
    <section id="layanan" className="mx-auto max-w-7xl scroll-mt-20 bg-white px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Layanan & Harga</p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl text-slate-900 tracking-tight">Pilih layanan sesuai kebutuhan</h2>
        <p className="mt-4 text-muted-foreground text-lg">Harga jelas di depan, tanpa biaya tersembunyi.</p>
      </Reveal>

      {/* Segmented Tab Filter */}
      <div role="tablist" className="mx-auto mt-10 flex flex-wrap justify-center w-fit gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors sm:px-8",
              tab === t.id ? "text-white" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {tab === t.id && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-brand-gradient shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">{tabs.find((t) => t.id === tab)!.sub}</p>

      {/* Services Grid with Photos on Every Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-6"
        >
          {list.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Sparkles;
            const isHorizontal = i % 4 === 0;
            const detailHref = s.category === "tennis" ? "/tennis-coaching" : `/layanan/${s.id}`;
            const groupStart = Math.floor(i / 4) * 4;
            const remainingVerticalsInGroup = Math.min(3, list.length - (groupStart + 1));
            const verticalColSpan = remainingVerticalsInGroup === 2 ? "lg:col-span-3" : "lg:col-span-2";
            const hasPromo = s.tiers.some((t) => Boolean(getDiscountLabel(t)));

            if (isHorizontal) {
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="col-span-full overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl grid lg:grid-cols-12 gap-6"
                >
                  {/* Left Image Column */}
                  <div className="relative min-h-[260px] sm:min-h-[300px] lg:col-span-5 overflow-hidden rounded-[1.5rem] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image || "/services/home.jpg"}
                      alt={s.name}
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <Icon className="size-3.5 text-teal-400" />
                      {getCategoryLabel(s.category)}
                    </span>
                    {hasPromo && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                        <Tag className="size-3" /> Promo Spesial
                      </span>
                    )}
                  </div>

                  {/* Right Content Column */}
                  <div className="flex flex-col justify-between p-3 sm:p-5 lg:col-span-7">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-teal-200/60 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                          ✦ LAYANAN UTAMA
                        </span>
                        <Link
                          href={detailHref}
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
                        >
                          Detail →
                        </Link>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-snug">{s.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>

                      {/* Price Tiers List */}
                      <div className="mt-5 grid sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                        {s.tiers.map((t, idx) => {
                          const discountBadge = getDiscountLabel(t);
                          const isWhatsAppPrice = /whatsapp/i.test(t.price);
                          const isSingleOrOddLast =
                            s.tiers.length === 1 ||
                            (s.tiers.length % 2 === 1 && idx === s.tiers.length - 1);
                          const spanFull = isWhatsAppPrice || isSingleOrOddLast;
                          return (
                            <div
                              key={t.label}
                              className={cn(
                                "flex w-full items-center justify-between gap-2 text-sm py-2.5 px-3.5 rounded-2xl border transition-all",
                                spanFull && "sm:col-span-2",
                                discountBadge
                                  ? "border-emerald-200/90 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/40 shadow-2xs"
                                  : "bg-slate-50/70 border-slate-100"
                              )}
                            >
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5 font-semibold text-slate-800">
                                  <Check className="size-4 shrink-0 text-teal-600 stroke-[2.5]" />
                                  <span>{t.label}</span>
                                </div>
                                {(t.popular || discountBadge) && (
                                  <div className="flex flex-wrap items-center gap-1.5 pl-5">
                                    {discountBadge && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-200 px-2 py-0.5 text-[10px] font-extrabold text-rose-600">
                                        🔥 {discountBadge}
                                      </span>
                                    )}
                                    {t.popular && (
                                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                                        ⭐ Populer
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="ml-auto text-right shrink-0">
                                {discountBadge && t.originalPrice && (
                                  <span className="block text-[11px] font-medium text-slate-400">
                                    {formatNormalPrice(t.originalPrice)}
                                  </span>
                                )}
                                <span
                                  className={cn(
                                    "font-black tracking-tight",
                                    discountBadge
                                      ? "text-base text-emerald-700"
                                      : "text-sm sm:text-base text-slate-900"
                                  )}
                                >
                                  {t.price}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100 pt-5">
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-teal-500" />
                        {s.category === "tennis"
                          ? "Pelatih profesional, jadwal & lapangan fleksibel"
                          : "Layanan bergaransi, tenaga kerja terlatih & ramah"}
                      </p>
                      <a
                        href="#pesan"
                        onClick={() => handleBooking(s.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 shrink-0"
                      >
                        <MessageCircle className="size-4" /> Booking Sekarang
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Vertical Card
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300",
                  verticalColSpan
                )}
              >
                <div>
                  {/* Image banner with category badge */}
                  <div className="relative mb-5 h-52 w-full overflow-hidden rounded-2xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image || "/services/home.jpg"}
                      alt={s.name}
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                      <Icon className="size-3.5 text-teal-400" />
                      {getCategoryLabel(s.category)}
                    </span>
                    {hasPromo && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                        <Tag className="size-3" /> Promo
                      </span>
                    )}
                  </div>

                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-black tracking-tight text-slate-900 leading-snug">{s.name}</h3>
                    <Link
                      href={detailHref}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline shrink-0 pt-0.5"
                    >
                      Detail →
                    </Link>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500 line-clamp-2">{s.desc}</p>

                  {/* Price Tiers List */}
                  <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
                    {s.tiers.map((t) => {
                      const discountBadge = getDiscountLabel(t);
                      return (
                        <div
                          key={t.label}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-xl transition-all",
                            discountBadge
                              ? "border border-emerald-200/90 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/40 px-3 py-2"
                              : "py-1"
                          )}
                        >
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2 font-medium text-slate-700 text-sm">
                              <Check className="size-4 shrink-0 text-teal-500 stroke-[2.5]" />
                              <span>{t.label}</span>
                            </div>
                            {(t.popular || discountBadge) && (
                              <div className="flex flex-wrap items-center gap-1.5 pl-6">
                                {discountBadge && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-200 px-2 py-0.5 text-[10px] font-extrabold text-rose-600">
                                    🔥 {discountBadge}
                                  </span>
                                )}
                                {t.popular && (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                    ⭐ Populer
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="ml-auto text-right shrink-0">
                            {discountBadge && t.originalPrice && (
                              <span className="block text-[11px] font-medium text-slate-400">
                                {formatNormalPrice(t.originalPrice)}
                              </span>
                            )}
                            <span
                              className={cn(
                                "font-black tracking-tight",
                                discountBadge
                                  ? "text-base text-emerald-700"
                                  : "text-sm sm:text-base text-slate-900"
                              )}
                            >
                              {t.price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-6 pt-2">
                  <a
                    href="#pesan"
                    onClick={() => handleBooking(s.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <MessageCircle className="size-4" /> Booking Sekarang
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
