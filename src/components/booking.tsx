"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getDiscountLabel, formatNormalPrice } from "@/lib/data";
import { useServices } from "@/lib/use-services";
import { useSiteSettings } from "@/lib/use-cms";

const times = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const selectCls =
  "h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function Booking() {
  const { services } = useServices();
  const settings = useSiteSettings();
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "home-cleaning");
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [today, setToday] = useState<string | undefined>(undefined);

  const selectedService = services.find((s) => s.id === serviceId) ?? services[0];
  const selectedTier = selectedService?.tiers[selectedTierIndex] ?? selectedService?.tiers[0];

  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setToday(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);

    const params = new URLSearchParams(window.location.search);
    const paramService = params.get("service");
    if (paramService) {
      setServiceId(paramService);
      setSelectedTierIndex(0);
    }
  }, []);

  useEffect(() => {
    const h = (e: Event) => {
      setServiceId((e as CustomEvent<string>).detail);
      setSelectedTierIndex(0);
    };
    window.addEventListener("select-service", h);
    return () => window.removeEventListener("select-service", h);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name")).trim();
    const phone = String(fd.get("phone")).trim();
    const address = String(fd.get("address")).trim();
    const date = String(fd.get("date"));
    const time = String(fd.get("time"));
    const notes = String(fd.get("notes") || "").trim();

    const discountBadge = selectedTier ? getDiscountLabel(selectedTier) : null;
    const tierInfo = selectedTier
      ? discountBadge && selectedTier.originalPrice
        ? `${selectedTier.label} — ${selectedTier.price} (Harga Promo dari ${selectedTier.originalPrice})`
        : `${selectedTier.label} (${selectedTier.price})`
      : "-";

    const text =
      `Halo Admin HS Support Group,\n\n` +
      `Saya ingin memesan layanan berikut:\n` +
      `• Layanan: *${selectedService?.name ?? serviceId}*\n` +
      `• Paket / Tarif: *${tierInfo}*\n` +
      `• Jadwal: ${date} pukul ${time} WIB\n` +
      `• Nama: ${name}\n` +
      `• No. WhatsApp: ${phone}\n` +
      `• Alamat: ${address}\n` +
      (notes ? `• Catatan: ${notes}\n` : "") +
      `\nMohon konfirmasi ketersediaan jadwal tim. Terima kasih!`;

    window.open(`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Membuka WhatsApp untuk mengirim detail pesanan Anda...");
  }

  return (
    <section id="pesan" className="relative scroll-mt-20 overflow-hidden bg-white py-20">
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Pesan Sekarang</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">Jadwalkan layanan Anda</h2>
          <p className="mt-4 text-muted-foreground">
            Pilih layanan dan paket harga di samping, formulir akan otomatis menyiapkan format pesanan lengkap ke WhatsApp Admin kami.
          </p>
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            <MessageCircle className="size-5" /> Chat Langsung via WhatsApp
          </a>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama lengkap</Label>
                <Input id="name" name="name" required placeholder="Nama Anda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. WhatsApp</Label>
                <Input id="phone" name="phone" type="tel" required pattern="[0-9+\- ]{8,16}" placeholder="08xxxxxxxxxx" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Pilih Layanan</Label>
              <select
                id="service"
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setSelectedTierIndex(0);
                }}
                className={selectCls}
              >
                <optgroup label="Jasa Kebersihan">
                  {services.filter((s) => s.category === "kebersihan").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Jasa Teknisi">
                  {services.filter((s) => s.category === "teknisi").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Sport">
                  {services.filter((s) => s.category === "tennis").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Pilihan Paket / Tier Harga */}
            {selectedService && selectedService.tiers.length > 0 && (
              <div className="space-y-2">
                <Label>Pilih Paket & Estimasi Tarif</Label>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {selectedService.tiers.map((tier, idx) => {
                    const active = idx === selectedTierIndex;
                    const discountBadge = getDiscountLabel(tier);
                    const spanFull =
                      /whatsapp/i.test(tier.price) ||
                      selectedService.tiers.length === 1 ||
                      (selectedService.tiers.length % 2 === 1 &&
                        idx === selectedService.tiers.length - 1);
                    return (
                      <button
                        key={tier.label}
                        type="button"
                        onClick={() => setSelectedTierIndex(idx)}
                        className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-xs transition ${
                          spanFull ? "sm:col-span-2" : ""
                        } ${
                          active
                            ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-500/20"
                            : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Check className={`size-3.5 shrink-0 ${active ? "text-teal-600 stroke-[3]" : "text-slate-400"}`} />
                            <span>{tier.label}</span>
                          </span>
                          {discountBadge && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-200 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 ml-5">
                              🔥 {discountBadge}
                            </span>
                          )}
                        </div>
                        <div className="ml-auto text-right shrink-0">
                          {discountBadge && tier.originalPrice && (
                            <span className="block text-[10px] font-medium text-slate-400">
                              {formatNormalPrice(tier.originalPrice)}
                            </span>
                          )}
                          <span className={`font-black text-sm ${discountBadge ? "text-emerald-700" : "text-slate-900"}`}>
                            {tier.price}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input id="date" name="date" type="date" min={today} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Jam</Label>
                <select id="time" name="time" required defaultValue="09:00" className={selectCls}>
                  {times.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat lengkap</Label>
              <Textarea id="address" name="address" required rows={2} placeholder="Jalan, nomor, kelurahan, kota" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan (opsional)</Label>
              <Textarea id="notes" name="notes" rows={2} placeholder="Luas ruangan, keluhan AC, kebutuhan khusus, dll." />
            </div>

            <Button id="submit-booking" type="submit" className="h-12 w-full rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-md">
              <MessageCircle className="size-5" />
              Pesan Sekarang via WhatsApp
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
