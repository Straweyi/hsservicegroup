'use client'

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { services, WHATSAPP_NUMBER } from "@/lib/data";

const times = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const selectCls =
  "h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function Booking() {
  const [loading, setLoading] = useState(false);
  const [serviceId, setServiceId] = useState(services[0].id);

  const [today, setToday] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Dihitung di client setelah mount agar tidak dibekukan saat prerender.
    // Gunakan tanggal lokal (bukan UTC) supaya tidak mundur sehari di zona WIB.
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setToday(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);

  useEffect(() => {
    const h = (e: Event) => setServiceId((e as CustomEvent<string>).detail);
    window.addEventListener("select-service", h);
    return () => window.removeEventListener("select-service", h);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const service = services.find((s) => s.id === serviceId)!;
    const payload = {
      name: String(fd.get("name")).trim(),
      phone: String(fd.get("phone")).trim(),
      address: String(fd.get("address")).trim(),
      service_id: service.id,
      service_name: service.name,
      scheduled_date: String(fd.get("date")),
      scheduled_time: String(fd.get("time")),
      notes: String(fd.get("notes") || "").trim() || null,
    };

    setLoading(true);
    try {
      if (supabase) {
        const { error } = await supabase.from("bookings").insert(payload);
        if (error) throw error;
        toast.success("Pesanan terkirim! Tim kami akan segera menghubungi Anda.");
        form.reset();
      } else {
        // Fallback saat Supabase belum dikonfigurasi: kirim via WhatsApp
        const msg = `Halo Hs Support, saya ingin pesan *${payload.service_name}*%0A` +
          `Nama: ${payload.name}%0AAlamat: ${payload.address}%0A` +
          `Jadwal: ${payload.scheduled_date} ${payload.scheduled_time}%0ACatatan: ${payload.notes ?? "-"}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
        toast.info("Supabase belum dikonfigurasi — dialihkan ke WhatsApp.");
      }
    } catch {
      toast.error("Gagal mengirim pesanan. Silakan coba lagi atau hubungi via WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="pesan" className="relative scroll-mt-20 overflow-hidden bg-white py-20">
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Pesan Sekarang</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">Jadwalkan layanan Anda</h2>
          <p className="mt-4 text-muted-foreground">
            Isi formulir, tim kami akan mengonfirmasi jadwal dalam waktu singkat. Lebih suka chat langsung?
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            <MessageCircle className="size-5" /> Chat WhatsApp
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
              <Label htmlFor="service">Layanan</Label>
              <select id="service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={selectCls}>
                <optgroup label="Jasa Kebersihan">
                  {services.filter((s) => s.category === "kebersihan").map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </optgroup>
                <optgroup label="Jasa Teknisi">
                  {services.filter((s) => s.category === "teknisi").map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </optgroup>
              </select>
            </div>
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
              <Textarea id="notes" name="notes" rows={2} placeholder="Luas ruangan, kebutuhan khusus, dll." />
            </div>
            <Button id="submit-booking" type="submit" disabled={loading} className="h-12 w-full rounded-full bg-brand-gradient text-base">
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
              {loading ? "Mengirim..." : "Kirim Pesanan"}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
