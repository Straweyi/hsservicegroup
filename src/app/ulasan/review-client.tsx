"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  Star,
  Quote,
  Sparkles,
  User,
  MapPin,
  CheckCircle2,
  Send,
  Loader2,
  ShieldCheck,
  HeartHandshake,
  LockKeyhole,
} from "lucide-react";

type CategoryTab = "kebersihan" | "teknisi" | "tennis";

type LinkInfo = {
  category: CategoryTab;
  serviceName: string;
  customerName: string;
};

const RATING_LABELS: Record<number, { title: string; subtitle: string }> = {
  5: { title: "Luar Biasa!", subtitle: "Sangat puas dengan pelayanan tim HS Support" },
  4: { title: "Sangat Baik", subtitle: "Pelayanan rapi dan memuaskan" },
  3: { title: "Cukup Baik", subtitle: "Pelayanan sesuai standar, masih bisa ditingkatkan" },
  2: { title: "Kurang Puas", subtitle: "Ada beberapa hal yang perlu diperbaiki" },
  1: { title: "Mengecewakan", subtitle: "Mohon maaf atas ketidaknyamanan Anda" },
};

const QUICK_TAGS: Record<CategoryTab, string[]> = {
  kebersihan: ["Datang tepat waktu", "Rumah bersih & wangi", "Petugas ramah & sopan", "Detail sampai ke sudut", "Peralatan lengkap", "Harga transparan"],
  teknisi: ["Teknisi ahli & cekatan", "Pengerjaan rapi & bersih", "Penjelasan jujur & jelas", "Tepat waktu", "Masalah teratasi", "Harga sesuai kesepakatan"],
  tennis: ["Coach sabar & komunikatif", "Materi mudah dipahami", "Latihan seru & terarah", "Teknik cepat berkembang", "Jadwal fleksibel", "Ramah untuk pemula"],
};

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-24 sm:pt-32 sm:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-emerald-50/80 via-teal-50/25 to-white" />
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function ReviewClient() {
  const [status, setStatus] = useState<"loading" | "invalid" | "ready">("loading");
  const [token, setToken] = useState("");
  const [info, setInfo] = useState<LinkInfo | null>(null);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ name: string; rating: number; text: string } | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("t") ?? "";
    // Buang token dari address bar agar tidak tersimpan/bocor lewat riwayat atau screenshot
    setToken(t);
    if (!t) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/reviews?t=${encodeURIComponent(t)}`, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.valid) {
          setStatus("invalid");
          return;
        }
        setInfo({ category: data.category, serviceName: data.serviceName, customerName: data.customerName });
        if (data.customerName) setName(data.customerName);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, []);

  const displayRating = hoverRating || rating;
  const ratingInfo = RATING_LABELS[displayRating] ?? RATING_LABELS[5];
  const previewRole = useMemo(
    () => [info?.serviceName, location.trim()].filter(Boolean).join(" · ") || "Pelanggan HS Support",
    [info, location]
  );

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Mohon isi nama Anda terlebih dahulu.");
    if (text.trim().length < 10) return toast.error("Mohon tuliskan pengalaman Anda minimal 10 karakter.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name: name.trim(), location: location.trim(), rating, text: text.trim(), tags: selectedTags, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Gagal mengirim ulasan.");
        if (res.status === 403) setStatus("invalid");
        return;
      }
      setDone({ name: name.trim(), rating, text: text.trim() });
    } catch {
      toast.error("Terjadi kendala koneksi. Mohon periksa jaringan Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <PageShell>
        <div className="flex items-center justify-center gap-2 py-32 text-sm text-slate-500">
          <Loader2 className="size-5 animate-spin text-brand-600" /> Memverifikasi link ulasan...
        </div>
      </PageShell>
    );
  }

  if (status === "invalid" || !info) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl rounded-[2.25rem] border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xl shadow-slate-900/5">
          <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-slate-100 text-slate-500">
            <LockKeyhole className="size-8" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Link Ulasan Tidak Tersedia
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
            Form ulasan hanya dapat dibuka melalui link pribadi yang diberikan teknisi atau coach kami setelah layanan selesai. Link ini mungkin sudah digunakan atau telah kedaluwarsa.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Butuh link baru? Silakan hubungi tim HS Support Group.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-2xl rounded-[2.25rem] border border-emerald-200/80 bg-white p-7 sm:p-12 text-center shadow-xl shadow-emerald-900/5"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="mx-auto grid size-20 place-items-center rounded-3xl bg-brand-gradient text-white shadow-lg ring-8 ring-emerald-50"
            >
              <CheckCircle2 className="size-10" />
            </motion.div>
            <h1 className="mt-7 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Terima Kasih, {done.name.split(" ")[0]}!
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
              Ulasan Anda telah kami terima dan sangat berarti bagi tim{" "}
              <strong className="text-slate-800">HS Support Group</strong>. Link ulasan ini sudah tidak aktif kembali.
            </p>
            <div className="relative mt-8 rounded-3xl border border-slate-200/90 bg-slate-50/60 p-6 text-left">
              <Quote className="absolute right-6 top-6 size-8 text-emerald-100" />
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: done.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-800 sm:text-base">“{done.text}”</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                <LockKeyhole className="size-3" /> Link Ulasan Pribadi
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
                Bagaimana Pengalaman <span className="text-brand-gradient">Anda?</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-lg">
                Layanan <strong className="text-slate-800">{info.serviceName}</strong> telah selesai. Mohon luangkan satu menit untuk berbagi penilaian Anda.
              </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-12">
              <div className="lg:order-2 lg:col-span-7">
                <form onSubmit={handleSubmit} className="space-y-7 rounded-[2rem] border border-slate-200/90 bg-white p-5 shadow-xl shadow-slate-900/[0.04] sm:rounded-[2.25rem] sm:p-9">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" />

                  <div className="rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50/80 to-white p-5 text-center sm:p-6">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Penilaian Kepuasan Anda</p>
                    <div className="mt-3.5 flex items-center justify-center gap-2 sm:gap-3" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <motion.button
                          key={v}
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.92 }}
                          onMouseEnter={() => setHoverRating(v)}
                          onClick={() => setRating(v)}
                          aria-label={`Beri ${v} bintang`}
                          className="p-1 focus:outline-none"
                        >
                          <Star className={`size-9 transition-colors duration-200 sm:size-11 ${v <= displayRating ? "fill-amber-400 text-amber-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.35)]" : "fill-slate-100 text-slate-200 hover:text-amber-200"}`} />
                        </motion.button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-full border border-amber-200/70 bg-amber-50 px-3.5 py-1 text-xs font-extrabold text-amber-800">
                        {displayRating}.0 / 5.0 — {ratingInfo.title}
                      </span>
                      <p className="mt-1.5 text-xs text-slate-500">{ratingInfo.subtitle}</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Apa yang Paling Anda Sukai?</label>
                      <span className="text-[11px] font-medium text-slate-400">Opsional</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TAGS[info.category].map((tag) => {
                        const on = selectedTags.includes(tag);
                        return (
                          <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${on ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                            {on && <Sparkles className="size-3 text-emerald-600" />}
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="rev-name" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">Nama Anda <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input id="rev-name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Rina Wulandari" className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="rev-location" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">Domisili / Kota</label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input id="rev-location" maxLength={50} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Contoh: Bekasi" className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="rev-text" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">Ceritakan Pengalaman Anda <span className="text-rose-500">*</span></label>
                      <span className="text-[11px] font-semibold text-slate-400">{text.length} / 500</span>
                    </div>
                    <textarea id="rev-text" required rows={4} maxLength={500} value={text} onChange={(e) => setText(e.target.value)} placeholder="Bagikan kesan Anda mengenai ketepatan waktu, kerapian hasil kerja, maupun keramahan tim kami..." className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
                  </div>

                  <div className="pt-1">
                    <button type="submit" disabled={submitting} className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-brand-gradient px-8 text-base font-extrabold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:pointer-events-none disabled:opacity-60">
                      {submitting ? (<><Loader2 className="size-5 animate-spin" /><span>Mengirim Ulasan...</span></>) : (<><Send className="size-4 transition group-hover:translate-x-0.5" /><span>Kirim Ulasan</span></>)}
                    </button>
                    <p className="mt-3 text-center text-[11px] text-slate-400">Link ini hanya dapat digunakan satu kali.</p>
                  </div>
                </form>
              </div>

              <div className="space-y-6 lg:sticky lg:top-28 lg:order-1 lg:col-span-5">
                <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
                  <div className="mb-5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-700"><Sparkles className="size-3.5" /> Pratinjau Ulasan</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">Live Preview</span>
                  </div>
                  <div className="relative rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/70 via-white to-emerald-50/30 p-6">
                    <Quote className="absolute right-5 top-5 size-8 text-brand-100" />
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: rating }).map((_, i) => (<Star key={i} className="size-4 fill-current" />))}
                    </div>
                    <p className={`mt-4 break-words text-sm leading-relaxed ${text.trim() ? "text-slate-800" : "italic text-slate-400"}`}>“{text.trim() || "Ulasan Anda akan tampil di sini saat Anda mengetik..."}”</p>
                    {selectedTags.length > 0 && (
                      <div className="mt-5 border-t border-dashed border-slate-200 pt-4">
                        <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Yang paling disukai</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/70 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                              <Sparkles className="size-3 text-emerald-600" />{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient font-bold text-white shadow-sm">{name.trim()[0]?.toUpperCase() || "A"}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{name.trim() || "Nama Anda"}</p>
                        <p className="truncate text-xs text-slate-500">{previewRole}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-[2rem] border border-slate-200/80 bg-slate-50/70 p-6">
                  <div className="flex items-start gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-brand-700"><HeartHandshake className="size-5" /></span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Apresiasi untuk Tim Lapangan</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">Setiap ulasan menjadi semangat bagi tim kami untuk terus memberikan standar terbaik.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 border-t border-slate-200/60 pt-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-brand-700"><ShieldCheck className="size-5" /></span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Ulasan Asli & Terverifikasi</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">Hanya pelanggan yang menerima link pribadi yang dapat menulis ulasan, dan setiap ulasan ditinjau Admin sebelum ditayangkan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
