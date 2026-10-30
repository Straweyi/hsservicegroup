export const WHATSAPP_NUMBER = "6282121437901";
export const WHATSAPP_DISPLAY = "0821-2143-7901";

export type PriceTierMeta = {
  subtitle?: string;
  badge?: string;
  features?: string[];
};

export type PriceTier = {
  label: string;
  price: string;
  originalPrice?: string;
  discountBadge?: string;
  popular?: boolean;
  _meta?: PriceTierMeta;
};

/**
 * Menghitung persentase diskon secara otomatis jika originalPrice & price berisi angka Rupiah,
 * atau mengembalikan discountBadge kustom bila diisi.
 */
export function getDiscountLabel(tier: PriceTier): string | null {
  if (!tier.originalPrice || !tier.originalPrice.trim()) return null;
  if (tier.discountBadge && tier.discountBadge.trim()) return tier.discountBadge.trim();

  const parseNum = (str: string) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : NaN;
  };

  const orig = parseNum(tier.originalPrice);
  const curr = parseNum(tier.price);

  if (!isNaN(orig) && !isNaN(curr) && orig > curr && orig > 0) {
    const pct = Math.round(((orig - curr) / orig) * 100);
    if (pct > 0 && pct < 100) {
      return `Hemat ${pct}%`;
    }
  }

  return "Promo";
}

export function formatNormalPrice(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^rp\.?\s*/i.test(trimmed)) {
    return trimmed.replace(/^rp\.?\s*/i, "Rp. ");
  }
  return `Rp. ${trimmed}`;
}

export type Service = {
  id: string;
  category: "kebersihan" | "teknisi" | "tennis";
  name: string;
  subtitle?: string;
  desc: string;
  icon: string; // lucide icon name
  tiers: PriceTier[];
  badge?: string;
  imageBadge?: string;
  image?: string;
  features?: string[];
  promo?: { label: string; text: string };
  banner?: string;
  hasPackageToggle?: boolean;
  isWide?: boolean;
};

export const services: Service[] = [
  // JASA KEBERSIHAN (Rumah · Kantor · Apartemen · Kos & Lainnya)
  {
    id: "home-cleaning",
    category: "kebersihan",
    name: "Home Cleaning",
    icon: "Home",
    image: "/services/home.jpg",
    desc: "Membersihkan rumah secara menyeluruh (ruang tamu, kamar, dapur, kamar mandi, dll).",
    tiers: [
      { label: "Minimum 3 Jam", price: "Rp 150.000", originalPrice: "Rp 185.000" },
      { label: "Tambah Jam", price: "Rp 50.000/jam", originalPrice: "Rp 65.000/jam", popular: true },
    ],
  },
  {
    id: "cleaning-kantor",
    category: "kebersihan",
    name: "Cleaning Kantor",
    icon: "Building2",
    image: "/services/office.jpg",
    desc: "Kebersihan ruang kerja, lobi, ruang meeting, toilet, dll.",
    tiers: [
      { label: "Minimum 3 Jam", price: "Rp 200.000" },
      { label: "Tambah Jam", price: "Rp 60.000/jam", popular: true },
    ],
  },
  {
    id: "cleaning-kos",
    category: "kebersihan",
    name: "Cleaning Kos-kosan",
    icon: "DoorOpen",
    image: "/services/kos.jpg",
    desc: "Kebersihan kamar, kamar mandi, area umum, dll.",
    tiers: [
      { label: "Minimum 3 Jam", price: "Rp 150.000" },
      { label: "Tambah Jam", price: "Rp 50.000/jam" },
    ],
  },
  {
    id: "cuci-ac",
    category: "kebersihan",
    name: "Cuci AC",
    icon: "Wind",
    image: "/services/ac_clean.jpg",
    desc: "Filter, evaporator, dan bagian dalam AC lebih bersih dan sehat.",
    tiers: [
      { label: "1 AC", price: "Rp 100.000" },
      { label: "> 1 AC", price: "Rp 80.000/AC", originalPrice: "Rp 100.000/AC", popular: true },
    ],
  },
  {
    id: "bongkar-pasang-ac",
    category: "kebersihan",
    name: "Bongkar Pasang AC",
    icon: "Wrench",
    image: "/services/ac_install.jpg",
    desc: "Pembongkaran dan pemasangan unit AC dengan tenaga ahli.",
    tiers: [
      { label: "1/2 PK - 1 PK", price: "Rp 350.000", popular: true },
      { label: "2 PK", price: "Rp 500.000" },
    ],
  },
  {
    id: "isi-freon-tambah",
    category: "kebersihan",
    name: "Isi Freon (Tambah)",
    icon: "Fuel",
    image: "/services/ac.jpg",
    desc: "Menambah freon agar kinerja AC kembali optimal.",
    tiers: [
      { label: "1/2 - 1 PK", price: "Rp 300.000" },
      { label: "2 PK", price: "Rp 450.000", popular: true },
    ],
  },
  {
    id: "isi-freon-awal",
    category: "kebersihan",
    name: "Isi Freon (Dari Awal)",
    icon: "Fuel",
    image: "/services/ac.jpg",
    desc: "Pengisian freon untuk AC baru atau belum pernah diisi.",
    tiers: [
      { label: "1/2 - 1 PK", price: "Rp 350.000" },
      { label: "2 PK", price: "Rp 500.000", popular: true },
    ],
  },
  {
    id: "cuci-tangki",
    category: "kebersihan",
    name: "Cuci Tangki Air",
    icon: "Droplets",
    image: "/services/tank.jpg",
    desc: "Membersihkan tangki air agar air tetap bersih dan sehat.",
    tiers: [
      { label: "Tangki Bawah", price: "Rp 250.000" },
      { label: "Tangki Atas", price: "Rp 350.000", popular: true },
    ],
  },
  {
    id: "cleaning-service-rumah",
    category: "kebersihan",
    name: "Cleaning Service Rumah",
    icon: "Home",
    image: "/services/toilet.jpg",
    desc: "Pembersihan menyeluruh untuk rumah lebih bersih dan nyaman.",
    tiers: [
      { label: "Minimum 3 Jam", price: "Rp 150.000" },
      { label: "Tambah Jam", price: "Rp 50.000/jam", popular: true },
    ],
  },

  // JASA TEKNISI (AC · Listrik · Plumbing · Peralatan Rumah Tangga)
  {
    id: "service-ac",
    category: "teknisi",
    name: "Service AC",
    icon: "Wind",
    image: "/services/ac_clean.jpg",
    desc: "Cuci, perawatan, dan perbaikan AC (split & standing).",
    tiers: [
      { label: "1/2 PK - 1 PK", price: "Rp 150.000", originalPrice: "Rp 180.000" },
      { label: "2 PK", price: "Rp 200.000", popular: true },
    ],
  },
  {
    id: "pasang-ac",
    category: "teknisi",
    name: "Pasang AC",
    icon: "Wrench",
    image: "/services/ac_install.jpg",
    desc: "Instalasi unit AC baru.",
    tiers: [
      { label: "1/2 PK - 1 PK", price: "Rp 350.000", popular: true },
      { label: "2 PK", price: "Rp 500.000" },
    ],
  },
  {
    id: "service-kulkas",
    category: "teknisi",
    name: "Service Kulkas",
    icon: "Refrigerator",
    image: "/services/appliance.jpg",
    desc: "Perbaikan kulkas tidak dingin, berisik, dll.",
    tiers: [
      { label: "Service", price: "Rp 150.000" },
      { label: "Isi Freon", price: "Rp 250.000", popular: true },
    ],
  },
  {
    id: "service-mesin-cuci",
    category: "teknisi",
    name: "Service Mesin Cuci",
    icon: "Waves",
    image: "/services/appliance.jpg",
    desc: "Perbaikan mesin cuci (top loading & front loading).",
    tiers: [
      { label: "Service", price: "Rp 150.000" },
      { label: "Ganti Sparepart", price: "Mulai Rp 100.000", popular: true },
    ],
  },
  {
    id: "service-pompa-air",
    category: "teknisi",
    name: "Service Pompa Air",
    icon: "Droplets",
    image: "/services/tank.jpg",
    desc: "Perbaikan & perawatan pompa air rumah tangga.",
    tiers: [
      { label: "Service", price: "Rp 150.000" },
      { label: "Ganti Sparepart", price: "Mulai Rp 100.000", popular: true },
    ],
  },
  {
    id: "instalasi-listrik",
    category: "teknisi",
    name: "Instalasi Listrik",
    icon: "Plug",
    image: "/services/electric.jpg",
    desc: "Pemasangan baru, perbaikan arus, ganti MCB, dll.",
    tiers: [
      { label: "Mulai", price: "Rp 100.000", popular: true },
    ],
  },
  {
    id: "service-water-heater",
    category: "teknisi",
    name: "Service Water Heater",
    icon: "Flame",
    image: "/services/electric.jpg",
    desc: "Perbaikan pemanas air tidak panas, bermasalah, dll.",
    tiers: [
      { label: "Service", price: "Rp 150.000" },
      { label: "Ganti Sparepart", price: "Mulai Rp 100.000", popular: true },
    ],
  },
  {
    id: "service-alat-rumah-tangga",
    category: "teknisi",
    name: "Service Alat Rumah Tangga",
    icon: "Wrench",
    image: "/services/appliance.jpg",
    desc: "Kipas angin, TV, dll.",
    tiers: [
      { label: "Mulai", price: "Rp 100.000", popular: true },
    ],
  },

  // SPORT / TENNIS COACHING (Private · Group · Kids & Junior)
  {
    id: "tennis-private",
    category: "tennis",
    name: "Private Tennis Coaching",
    subtitle: "Personal, Group, Corporate",
    badge: "Paling Populer",
    icon: "User",
    image: "/tennis.jpg",
    desc: "Sesi intensif 1-on-1 yang didedikasikan penuh untuk perkembangan teknik, koreksi stroke, dan biomekanik pukulan Anda.",
    features: [
      "Fokus 100% pada perbaikan stroke & footwork",
      "Koreksi realtime setiap pukulan",
      "Disesuaikan dengan target & ritme belajar Anda",
      "Latihan drill intensif + mini match",
      "Cocok untuk pemula hingga pemain turnamen",
    ],
    tiers: [
      { label: "Personal (1-on-1)", price: "Via WhatsApp", popular: true },
      { label: "Semi-Private (2 Orang)", price: "Via WhatsApp" },
    ],
  },
  {
    id: "tennis-group",
    category: "tennis",
    name: "Group Class Tennis",
    subtitle: "3 - 4 Peserta",
    icon: "Target",
    image: "/services/tennis_group.jpg",
    desc: "Program latihan grup dengan modul kurikulum terstruktur. Sangat cocok bagi yang ingin berolahraga tenis rutin sambil networking.",
    features: [
      "Struktur materi sistematis setiap pertemuan",
      "Drill dinamis: serve, volley, rally, dan game play",
      "Suasana latihan interaktif dan seru",
      "Memperluas relasi komunitas penggemar tenis",
      "Sesi 1.5 - 2 jam per pertemuan",
    ],
    tiers: [
      { label: "Grup 3 - 4 Peserta", price: "Via WhatsApp", popular: true },
      { label: "Corporate / Komunitas", price: "Via WhatsApp" },
    ],
  },
  {
    id: "tennis-junior",
    category: "tennis",
    name: "Kids & Junior Development",
    subtitle: "Usia 5 - 14 Tahun",
    badge: "Fun & Berjenjang",
    icon: "Sparkles",
    image: "/services/tennis_junior.jpg",
    desc: "Metode khusus anak-anak dengan pendekatan fun learning, koordinasi motorik mata-tangan, serta penanaman pondasi teknik yang aman dan benar.",
    features: [
      "Metode bola bertahap (Red, Orange, Green ball)",
      "Latihan kelincahan, refleks, dan koordinasi fisik",
      "Membangun kedisiplinan dan rasa percaya diri",
      "Pelatih sabar, ramah, dan berpengalaman dengan anak",
      "Jadwal weekend atau sore hari",
    ],
    tiers: [
      { label: "Usia 5 - 14 Tahun", price: "Via WhatsApp", popular: true },
      { label: "Bola & Raket Pemula", price: "Disediakan" },
    ],
  },
];

export const testimonials = [
  { name: "Rina Wulandari", role: "Ibu rumah tangga, Bekasi", text: "Timnya datang tepat waktu dan rumah jadi kinclong. Dapur dan kamar mandi bersih sampai sudut-sudutnya!" },
  { name: "Budi Santoso", role: "Pemilik kantor, Jakarta", text: "Harga transparan, tidak ada biaya tambahan. Kami langganan cleaning kantor tiap minggu." },
  { name: "Dewi Anggraini", role: "Pemilik kos, Depok", text: "Cuci AC dan cleaning kos beres dalam sehari. Tenaganya sopan dan profesional." },
];

export const faqs = [
  { q: "Berapa lama durasi minimum layanan kebersihan?", a: "Minimum pemesanan layanan kebersihan adalah 3 jam. Kelebihan waktu dihitung per jam sesuai tarif masing-masing layanan." },
  { q: "Apakah harga sudah termasuk alat dan bahan?", a: "Tim kami membawa peralatan standar. Kebutuhan khusus dapat didiskusikan terlebih dahulu melalui WhatsApp." },
  { q: "Bagaimana cara memesan layanan?", a: "Isi formulir pemesanan di website ini atau hubungi kami via WhatsApp. Tim kami akan mengonfirmasi jadwal dalam waktu singkat." },
  { q: "Apakah tenaga kerja sudah berpengalaman?", a: "Ya, seluruh tenaga kebersihan dan teknisi kami profesional, berpengalaman, dan terlatih." },
  { q: "Bisakah menjadwalkan di akhir pekan?", a: "Bisa. Pilih tanggal dan jam yang diinginkan pada formulir, kami akan menyesuaikan ketersediaan tim." },
];
