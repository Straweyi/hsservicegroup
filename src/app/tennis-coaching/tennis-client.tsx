"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Trophy,
  Users,
  User,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Award,
  Zap,
  ArrowRight,
  HelpCircle,
  Phone,
} from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/data";

const PROGRAMS = [
  {
    id: "private",
    title: "Private Coaching",
    subtitle: "1 Pelatih - 1 Peserta",
    badge: "Paling Populer",
    popular: true,
    desc: "Sesi intensif 1-on-1 yang didedikasikan penuh untuk perkembangan teknik, koreksi stroke, dan biomekanik pukulan Anda.",
    features: [
      "Fokus 100% pada perbaikan stroke & footwork",
      "Koreksi realtime setiap pukulan",
      "Disesuaikan dengan target & ritme belajar Anda",
      "Latihan drill intensif + mini match",
      "Cocok untuk pemula hingga pemain turnamen",
    ],
    defaultPriceNote: "Konsultasi jadwal & tarif via WhatsApp",
  },
  {
    id: "semi-private",
    title: "Semi-Private",
    subtitle: "1 Pelatih - 2 Peserta",
    badge: "Hemat & Seru",
    desc: "Latihan berdua bersama teman, pasangan, atau rekan kerja. Kombinasi ideal antara koreksi personal dan interaksi rally berpasangan.",
    features: [
      "Biaya lebih ekonomis dibagi 2 orang",
      "Latihan variasi drill bersama partner",
      "Simulasi rally dan strategi double play",
      "Sesi yang kompetitif sekaligus menyenangkan",
      "Jadwal fleksibel disepakati bersama",
    ],
    defaultPriceNote: "Konsultasi jadwal & tarif via WhatsApp",
  },
  {
    id: "group",
    title: "Group Clinic / Class",
    subtitle: "3 - 4 Peserta",
    desc: "Program latihan grup dengan modul kurikulum terstruktur. Sangat cocok bagi yang ingin berolahraga tenis rutin sambil networking.",
    features: [
      "Struktur materi sistematis setiap pertemuan",
      "Drill dinamis: serve, volley, rally, dan game play",
      "Suasana latihan interaktif dan seru",
      "Memperluas relasi komunitas penggemar tenis",
      "Sesi 1.5 - 2 jam per pertemuan",
    ],
    defaultPriceNote: "Konsultasi jadwal & tarif via WhatsApp",
  },
  {
    id: "junior",
    title: "Kids & Junior Development",
    subtitle: "Usia 5 - 14 Tahun",
    badge: "Fun & Berjenjang",
    desc: "Metode khusus anak-anak dengan pendekatan fun learning, koordinasi motorik mata-tangan, serta penanaman pondasi teknik yang aman dan benar.",
    features: [
      "Metode bola bertahap (Red, Orange, Green ball)",
      "Latihan kelincahan, refleks, dan koordinasi fisik",
      "Membangun kedisiplinan dan rasa percaya diri",
      "Pelatih sabar, ramah, dan berpengalaman dengan anak",
      "Jadwal weekend atau sore hari",
    ],
    defaultPriceNote: "Konsultasi jadwal & tarif via WhatsApp",
  },
  {
    id: "sparring",
    title: "Hitting & Sparring Partner",
    subtitle: "Level Intermediate / Advanced",
    desc: "Khusus bagi pemain yang membutuhkan partner latihan berbobot dengan bola konsisten, tempo cepat, dan simulasi pertandingan nyata.",
    features: [
      "Bola konsisten dan rally tempo tinggi",
      "Simulasi pola serangan, return, dan passing shot",
      "Kebugaran kardio dan ketahanan bertanding",
      "Evaluasi taktik strategi permainan poin",
      "Tersedia untuk single & double prep",
    ],
    defaultPriceNote: "Konsultasi jadwal & tarif via WhatsApp",
  },
];

const CURRICULUM = [
  {
    title: "Fundamental Groundstrokes",
    desc: "Biomekanika forehand & backhand (open/semi-open stance, unit turn, contact point, dan follow-through) agar pukulan bertenaga dan konsisten tanpa cedera.",
  },
  {
    title: "Serve & Return Power",
    desc: "Teknik servis akurat (flat, slice, kick/topspin), koordinasi lemparan bola (toss), ritme ayunan, serta penempatan posisi mengembalikan servis.",
  },
  {
    title: "Net Game & Volley",
    desc: "Split-step timing, punch volley yang stabil, reaction speed di depan net, serta teknik overhead smash yang mematikan.",
  },
  {
    title: "Footwork & Court Coverage",
    desc: "Langkah pemulihan (recovery step), crossover, sliding di lapangan, serta menjaga keseimbangan badan saat mengejar bola sudut sempit.",
  },
  {
    title: "Match Strategy & Mental",
    desc: "Membaca arah pukulan lawan, manajemen poin, ketenangan saat break point, serta taktik pemilihan pukulan berdasarkan posisi lawan.",
  },
];

const FAQS = [
  {
    q: "Apakah saya harus membawa raket sendiri?",
    a: "Untuk pemula yang baru pertama kali mencoba dan belum memiliki raket, pelatih dapat meminjamkan raket untuk sesi awal. Keranjang bola latihan selalu disediakan lengkap oleh pelatih.",
  },
  {
    q: "Di mana lokasi latihan diadakan?",
    a: "Lokasi sangat fleksibel. Pelatihan bisa diadakan di lapangan perumahan/apartemen Anda, atau pelatih kami dapat merekomendasikan dan membookingkan lapangan terdekat di area Anda (biaya sewa lapangan ditanggung peserta).",
  },
  {
    q: "Bagaimana jika cuaca hujan pada lapangan outdoor?",
    a: "Jika sesi terpaksa ditunda akibat hujan atau cuaca ekstrem pada lapangan outdoor, sesi akan dijadwalkan ulang (reschedule) tanpa hangus.",
  },
  {
    q: "Apakah benar-benar cocok untuk yang belum pernah bermain tenis sama sekali?",
    a: "Sangat cocok! Lebih dari 60% murid kami memulai dari nol. Kami mengajarkan dasar pegangan (grip), cara melihat bola, dan ayunan sederhana yang ramah pemula.",
  },
];

export function TennisClient() {
  // Booking Form State for direct WhatsApp redirection
  const [selectedProgram, setSelectedProgram] = useState("Private Coaching");
  const [level, setLevel] = useState("Pemula (Mulai dari Nol)");
  const [preferredTime, setPreferredTime] = useState("Weekend Pagi (06.00 - 10.00)");
  const [locationPreference, setLocationPreference] = useState("");
  const [notes, setNotes] = useState("");

  const generateWhatsAppUrl = () => {
    const text =
      `Halo Admin HS Tennis Coaching,\n\n` +
      `Saya ingin bertanya & memesan sesi latihan tenis:\n` +
      `• Program: ${selectedProgram}\n` +
      `• Level Kemampuan: ${level}\n` +
      `• Preferensi Waktu: ${preferredTime}\n` +
      (locationPreference ? `• Lokasi/Area Lapangan: ${locationPreference}\n` : "") +
      (notes ? `• Catatan/Target: ${notes}\n` : "") +
      `\nMohon info ketersediaan pelatih, jadwal, dan tarifnya. Terima kasih!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const getQuickProgramWa = (progName: string) => {
    const text = `Halo Admin HS Tennis Coaching, saya tertarik untuk mengikuti program *${progName}*. Mohon info ketersediaan pelatih dan jadwal terdekat.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                HS Tennis Coaching — HS Support Group
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                Tingkatkan Permainan Tenis Anda Bersama{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                  Pelatih Profesional
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Pelatihan tenis modern dan terarah untuk semua level — mulai dari pengenalan teknik dasar bagi pemula, program usia dini (kids), hingga latihan taktik dan sparring partner. Jadwal dan lokasi lapangan fleksibel!
              </p>

              {/* Highlights List */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Pelatih Berpengalaman & Sabar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Lapangan & Jadwal Fleksibel</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Kurikulum Terstruktur</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Bola & Perlengkapan Disediakan</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <LinkButton
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="h-14 rounded-full bg-[#25D366] px-8 text-base font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-[#20bd5a] hover:scale-[1.02] transition gap-2.5"
                >
                  <MessageCircle className="size-5" /> Hubungi WhatsApp
                </LinkButton>
                <a
                  href="#paket-program"
                  className="h-14 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-base font-bold text-slate-800 transition hover:bg-slate-50 hover:border-slate-400"
                >
                  Pilihan Program
                </a>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-emerald-600" /> Respon Cepat Setiap Hari
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-emerald-600" /> {WHATSAPP_DISPLAY}
                </span>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-50 group">
                <Image
                  src="/tennis.jpg"
                  alt="HS Tennis Coaching"
                  width={640}
                  height={480}
                  priority
                  className="w-full h-[420px] sm:h-[480px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold mb-2 backdrop-blur-sm">
                    <Trophy className="size-3.5" /> Fun, Focused & Result-Driven
                  </div>
                  <p className="text-xl font-bold">HS Tennis Coaching</p>
                  <p className="text-xs text-white/80 mt-1">
                    Bimbingan step-by-step dari dasar pegangan raket hingga rally mandiri.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Latihan Section */}
      <section id="paket-program" className="py-20 scroll-mt-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
              Pilihan Program Pelatihan
            </span>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
              Pilih Program Sesuai Kebutuhan Anda
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Setiap program dirancang dengan fokus yang jelas untuk memberikan kemajuan nyata dalam setiap sesi latihan.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-8 bg-white transition hover:shadow-xl ${
                  prog.popular
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg"
                    : "border-slate-200/90 shadow-sm hover:border-slate-300"
                }`}
              >
                {prog.badge && (
                  <span
                    className={`absolute -top-3.5 right-6 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider ${
                      prog.popular
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    {prog.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                      {prog.id === "private" && <User className="size-6" />}
                      {prog.id === "semi-private" && <Users className="size-6" />}
                      {prog.id === "group" && <Target className="size-6" />}
                      {prog.id === "junior" && <Sparkles className="size-6" />}
                      {prog.id === "sparring" && <Zap className="size-6" />}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{prog.title}</h3>
                      <p className="text-xs font-semibold text-emerald-700">{prog.subtitle}</p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-slate-600 leading-relaxed">{prog.desc}</p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Fasilitas & Keunggulan
                    </p>
                    <ul className="space-y-2.5">
                      {prog.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3">{prog.defaultPriceNote}</p>
                  <LinkButton
                    href={getQuickProgramWa(prog.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-11 justify-center rounded-full bg-slate-900 text-white font-bold text-sm transition hover:bg-emerald-600 gap-2 shadow-sm"
                  >
                    <MessageCircle className="size-4 text-emerald-400" /> Tanya Program Ini
                  </LinkButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Booking Configurator Section */}
      <section id="booking-form" className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Calendar className="size-3.5" /> Booking Sesi Latihan
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                Format Pesanan Langsung ke WhatsApp
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Pilih opsi latihan Anda di bawah ini, tombol akan secara otomatis menyiapkan draf pesan WhatsApp lengkap agar tim HS Tennis segera memverifikasi ketersediaan pelatih & court.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.open(generateWhatsAppUrl(), "_blank");
              }}
              className="space-y-6"
            >
              {/* Program Picker */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  1. Pilih Program Latihan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    "Private Coaching (1-on-1)",
                    "Semi-Private (2 Peserta)",
                    "Group Clinic (3-4 Orang)",
                    "Kids & Junior Academy",
                    "Sparring / Hitting Partner",
                    "Konsultasi Program",
                  ].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSelectedProgram(item)}
                      className={`text-left px-4 py-3 rounded-2xl border text-xs font-semibold transition ${
                        selectedProgram === item
                          ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Picker */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  2. Tingkat Kemampuan / Pengalaman
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    "Pemula (Mulai dari Nol)",
                    "Intermediate (Bisa Rally Dasar)",
                    "Advance / Pengalaman Turnamen",
                  ].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`text-left px-4 py-3 rounded-2xl border text-xs font-semibold transition ${
                        level === lvl
                          ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Waktu & Jadwal */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  3. Pilihan Waktu Latihan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    "Weekday Pagi (06.00 - 09.00)",
                    "Weekday Sore / Malam (16.00 - 21.00)",
                    "Weekend Pagi (06.00 - 10.00)",
                    "Weekend Sore (16.00 - 20.00)",
                    "Jadwal Fleksibel (Bisa Menyesuaikan)",
                  ].map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setPreferredTime(time)}
                      className={`text-left px-4 py-3 rounded-2xl border text-xs font-semibold transition ${
                        preferredTime === time
                          ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lokasi / Court */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  4. Lokasi atau Rekomendasi Lapangan (Opsional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={locationPreference}
                    onChange={(e) => setLocationPreference(e.target.value)}
                    placeholder="Contoh: Lapangan Tenis Apartemen X / Butuh rekomendasi area terdekat"
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Catatan / Goals */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  5. Target Latihan atau Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Ingin fokus memperbaiki teknik servis dan konsistensi backhand..."
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* WhatsApp Redirect Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-14 rounded-full bg-[#25D366] text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/25 hover:bg-[#20bd5a] hover:scale-[1.01] transition"
                >
                  <MessageCircle className="size-6" />
                  Kirim Pesanan Langsung ke WhatsApp
                </button>
                <p className="text-center text-xs text-slate-500 mt-2.5">
                  Klik untuk membuka chat WhatsApp dengan format pesan otomatis terisi.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Kurikulum & Fokus Materi Section */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                Kurikulum Latihan
              </span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
                Metode Latihan Terstruktur & Ilmiah
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Kami tidak sekadar melempar bola (feed ball), melainkan menganalisis gerakan secara biomekanis agar Anda memukul dengan rileks, minim risiko cedera sendi/siku, dan menghasilkan bola yang berat dan terarah.
              </p>
              <div className="pt-4">
                <LinkButton
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  className="rounded-full border-slate-300 text-slate-800 font-bold hover:bg-slate-50 gap-2"
                >
                  Konsultasi dengan Coach <ArrowRight className="size-4" />
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {CURRICULUM.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 p-5 bg-white shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">FAQ</span>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Pertanyaan yang Sering Diajukan</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200/90 p-6 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{faq.q}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA Box */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-lg">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-4">
              <Award className="size-6" />
            </span>
            <h3 className="text-2xl font-black text-slate-900">Siap Mulai Latihan Tenis Hari Ini?</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
              Hubungi kami sekarang untuk mencocokkan jadwal pelatih dan lapangan tenis terdekat dari lokasi Anda.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <LinkButton
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="h-12 rounded-full bg-[#25D366] px-8 text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-[#20bd5a] gap-2"
              >
                <MessageCircle className="size-4" /> Pesan via WhatsApp Sekarang
              </LinkButton>
              <Link
                href="/"
                className="h-12 inline-flex items-center justify-center rounded-full border border-slate-200 px-6 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
