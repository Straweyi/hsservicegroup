import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, MessageCircle, ArrowLeft, ShieldCheck, Clock, Award, Phone } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { services, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/data";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return services.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) return { title: "Layanan Tidak Ditemukan - Hs Support" };
  return {
    title: `${service.name} - Hs Support Group`,
    description: service.desc,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = services.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  const otherServices = services.filter((s) => s.id !== service.id && s.category === service.category).slice(0, 3);
  const waMessage = encodeURIComponent(`Halo Hs Support, saya tertarik dan ingin memesan layanan *${service.name}*. Mohon info ketersediaan jadwalnya.`);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Breadcrumb & Navigation */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition hover:text-brand-600">Beranda</Link>
            <span>/</span>
            <Link href="/#layanan" className="transition hover:text-brand-600">Layanan</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">{service.name}</span>
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-12 items-start">
            {/* Left Column: Image & Highlights */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/90 shadow-sm bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image || "/services/home.jpg"}
                  alt={service.name}
                  className="w-full h-[380px] sm:h-[460px] object-cover"
                />
                <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-slate-900/85 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  {service.category === "kebersihan" ? "Jasa Kebersihan" : "Jasa Teknisi"}
                </span>
              </div>

              {/* Service Overview & Benefits */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tentang Layanan Ini</h2>
                <p className="text-base text-slate-600 leading-relaxed">{service.desc}</p>

                <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                      <ShieldCheck className="size-5" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Peralatan Lengkap</p>
                      <p className="text-xs text-slate-500">Tim membawa perlengkapan & cairan pembersih standar.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                      <Clock className="size-5" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Tepat Waktu</p>
                      <p className="text-xs text-slate-500">Petugas hadir sesuai kesepakatan jadwal.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                      <Award className="size-5" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Tenaga Terlatih</p>
                      <p className="text-xs text-slate-500">Berpengalaman, sopan, dan bekerja secara higienis.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                      <Phone className="size-5" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Konsultasi Gratis</p>
                      <p className="text-xs text-slate-500">Hubungi kami kapan saja via WhatsApp.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Booking Action */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="rounded-[2.5rem] border border-slate-200/90 bg-white p-8 shadow-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-700">
                  ✦ TARIF TRANSPARAN
                </span>

                <h1 className="mt-4 text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {service.name}
                </h1>
                <p className="mt-2 text-sm text-slate-500">{service.desc}</p>

                {/* Price Tiers */}
                <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilihan Paket & Tarif:</p>
                  {service.tiers.map((t) => (
                    <div
                      key={t.label}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50"
                    >
                      <span className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
                        <Check className="size-4 text-teal-500 stroke-[2.5]" />
                        {t.label}
                        {t.popular && (
                          <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            ⭐ Populer
                          </span>
                        )}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">{t.price}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 space-y-3">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-slate-800"
                  >
                    <MessageCircle className="size-5 text-emerald-400" /> Pesan via WhatsApp
                  </a>

                  <Link
                    href={`/#pesan`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Isi Formulir Pemesanan
                  </Link>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Phone className="size-3.5" /> CS WhatsApp: {WHATSAPP_DISPLAY}
                </div>
              </div>

              {/* Back Link */}
              <Link
                href="/#layanan"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition px-2"
              >
                <ArrowLeft className="size-4" /> Kembali ke Semua Layanan
              </Link>
            </div>
          </div>

          {/* Related Services */}
          {otherServices.length > 0 && (
            <div className="mt-24 pt-12 border-t border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Layanan {service.category === "kebersihan" ? "Kebersihan" : "Teknisi"} Lainnya</h3>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherServices.map((s) => (
                  <Link
                    key={s.id}
                    href={`/layanan/${s.id}`}
                    className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-lg hover:border-slate-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.image || "/services/home.jpg"}
                          alt={s.name}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition">{s.name}</h4>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{s.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Mulai dari</span>
                      <span className="font-bold text-slate-900">{s.tiers[0]?.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
