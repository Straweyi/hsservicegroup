"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, Clock, ThumbsUp, Star } from "lucide-react";
import { LinkButton } from "@/components/link-button";

const badges = [
  { icon: BadgeCheck, text: "Tenaga Profesional" },
  { icon: Clock, text: "Respon Cepat" },
  { icon: ThumbsUp, text: "Harga Transparan" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-20 sm:pt-36">

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700"
          >
            <span className="size-2 animate-pulse rounded-full bg-brand-500" />
            Cleaning · Technician · Home Service · Sport
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-5 text-4xl font-bold leading-[1.1] sm:text-6xl"
          >
            Rumah Bersih,
            <br />
            <span className="text-brand-gradient">Hidup Lebih Sehat.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-5 max-w-lg text-lg text-muted-foreground"
          >
            Jasa kebersihan rumah, kantor, apartemen & kos, plus teknisi AC, listrik, dan plumbing.
            Profesional, terpercaya, berkualitas — mulai dari <b className="text-foreground">Rp 150.000</b>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <LinkButton href="#pesan" className="group h-12 rounded-full bg-brand-gradient px-7 text-base shadow-lg shadow-brand-500/30">
              Pesan Sekarang
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </LinkButton>
            <LinkButton href="#layanan" variant="outline" className="h-12 rounded-full px-7 text-base">
              Lihat Harga
            </LinkButton>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {badges.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm font-medium text-brand-800">
                <Icon className="size-5 text-brand-500" /> {text}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-brand-gradient opacity-20" />
          <Image
            src="/hero.jpg"
            alt="Petugas cleaning service Hs Support membersihkan ruang tamu"
            width={1200}
            height={896}
            priority
            className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl"
          />
          <div className="glass animate-float absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl sm:-left-8">
            <div className="grid size-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
              <Star className="size-5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold">4.9 / 5.0</p>
              <p className="text-xs text-muted-foreground">Kepuasan pelanggan</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
