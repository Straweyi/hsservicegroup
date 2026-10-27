"use client";

import {
  ClipboardList, CalendarCheck, SprayCan, SmilePlus, Star, Quote,
  UserCheck, PackageCheck, BadgeDollarSign, AlarmClockCheck, CalendarClock, Camera, MessageCircle, ArrowRight, ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { testimonials, WHATSAPP_NUMBER } from "@/lib/data";

const steps = [
  { icon: ClipboardList, title: "Pilih Layanan", desc: "Tentukan layanan kebersihan atau teknisi yang dibutuhkan." },
  { icon: CalendarCheck, title: "Atur Jadwal", desc: "Isi form pemesanan dan pilih tanggal serta jam." },
  { icon: SprayCan, title: "Tim Datang", desc: "Tenaga profesional kami tiba tepat waktu dengan peralatan lengkap." },
  { icon: SmilePlus, title: "Rumah Bersih", desc: "Nikmati hasil bersih, rapi, dan nyaman. Bayar setelah selesai." },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative isolate scroll-mt-20 overflow-hidden bg-white py-28 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-semibold tracking-wide text-brand-700 shadow-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-brand-500" /> Cara Kerja
          </span>
          <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">
            Pesan dalam{" "}
            <span className="text-brand-gradient">4 langkah</span>{" "}
            mudah
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">Proses singkat, transparan, dan tanpa ribet dari pesan sampai beres.</p>
        </Reveal>

        <ol className="relative mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Garis penghubung (desktop) */}
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-slate-200 lg:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} className="group relative">
              {/* Node bernomor */}
              <div className="relative z-10 mx-auto grid size-16 place-items-center rounded-full border-2 border-brand-500 bg-white text-xl font-bold text-brand-700 shadow-md transition duration-300 group-hover:scale-110 group-hover:bg-brand-gradient group-hover:text-white">
                {i + 1}
              </div>

              <div className="relative -mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white px-7 pb-8 pt-14 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-slate-200 bg-white text-brand-600 shadow-sm transition group-hover:border-brand-300 group-hover:bg-brand-50">
                  <s.icon className="size-7" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="testimoni" className="mx-auto max-w-6xl scroll-mt-20 bg-white px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Testimoni</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-5xl">Dipercaya pelanggan kami</h2>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1} className="relative rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:shadow-md">
            <Quote className="absolute right-6 top-6 size-8 text-brand-100" />
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-4 fill-current" />)}
            </div>
            <p className="mt-4 text-foreground/80">“{t.text}”</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-brand-gradient font-bold text-white">{t.name[0]}</span>
              <div>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const reasons = [
  { icon: UserCheck, title: "Tim Terlatih & Berpengalaman", desc: "Petugas terseleksi dan terlatih, bekerja rapi sampai ke sudut terkecil.", tone: "from-sky-400 to-blue-500" },
  { icon: PackageCheck, title: "Peralatan Lengkap Dibawa Sendiri", desc: "Alat dan cairan pembersih sudah disiapkan, Anda tinggal duduk manis.", tone: "from-teal-400 to-emerald-500" },
  { icon: BadgeDollarSign, title: "Tarif Jelas, Tanpa Kejutan", desc: "Harga disepakati di awal. Tidak ada biaya tersembunyi di akhir.", tone: "from-amber-400 to-orange-500" },
  { icon: AlarmClockCheck, title: "Selalu Tiba Tepat Waktu", desc: "Kami menghargai waktu Anda dan datang sesuai jadwal yang dijanjikan.", tone: "from-violet-400 to-fuchsia-500" },
  { icon: CalendarClock, title: "Jadwal Fleksibel", desc: "Pilih hari dan jam yang paling cocok, termasuk akhir pekan.", tone: "from-cyan-400 to-sky-500" },
  { icon: Camera, title: "Bukti Foto Sebelum & Sesudah", desc: "Setiap pekerjaan didokumentasikan agar hasilnya bisa Anda lihat langsung.", tone: "from-rose-400 to-pink-500" },
];

export function WhyUs() {
  return (
    <section id="keunggulan" className="relative isolate scroll-mt-20 overflow-hidden bg-white py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-brand-700 shadow-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-brand-500" /> Keunggulan Kami
          </span>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
            Alasan Pelanggan{" "}
            <span className="text-brand-gradient">Setia Kembali</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">Layanan yang konsisten membuat orang memesan lagi dan lagi.</p>
        </Reveal>

        {/* Emblem tengah */}
        <Reveal className="relative mx-auto mt-12 grid size-32 place-items-center">
          <span aria-hidden className="absolute -inset-4 rounded-full border border-dashed border-brand-200" />
          <span className="relative grid size-24 place-items-center rounded-full bg-brand-gradient text-white shadow-xl ring-8 ring-white">
            <ShieldCheck className="size-11" />
          </span>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10">
                <span aria-hidden className="absolute right-6 top-4 text-6xl font-black text-slate-100 transition group-hover:text-slate-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative grid size-16 place-items-center rounded-2xl border border-slate-200 bg-white text-brand-700 shadow-sm transition duration-300 group-hover:border-brand-300 group-hover:bg-brand-50 group-hover:scale-110">
                  <r.icon className="size-8" />
                </span>
                <h3 className="relative mt-6 text-2xl font-bold leading-snug">{r.title}</h3>
                <p className="relative mt-3 text-base leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-brand-gradient px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:brightness-110"
          >
            <MessageCircle className="size-5" /> Ngobrol Dulu via WhatsApp
            <ArrowRight className="size-5 transition group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
