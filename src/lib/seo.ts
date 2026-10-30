import { WHATSAPP_NUMBER, type Service } from "@/lib/data";

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) {
    return `https://${vercelProd.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  }
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  }
  return "https://hsservicegroup.vercel.app";
}

export const SERVICE_AREAS = [
  "Jakarta Selatan",
  "Jakarta Barat",
  "Tangerang",
  "Kabupaten Tangerang",
  "Tangerang Selatan",
] as const;

export const SERVICE_AREA_TEXT =
  "Jakarta Selatan, Jakarta Barat, Tangerang, Kabupaten Tangerang, dan Tangerang Selatan";

export const SEO_KEYWORDS: string[] = [
  // Nama Brand & Variasi Pencarian
  "hs support group",
  "hs service group",
  "hs support",
  "hs tennis coaching",
  // Layanan AC & Teknisi
  "cuci ac",
  "pasang ac",
  "bongkar ac",
  "bongkar pasang ac",
  "service ac",
  "isi freon ac",
  "tambah freon ac",
  "jasa teknisi ac",
  "service kulkas",
  "service mesin cuci",
  "service pompa air",
  "instalasi listrik",
  "service water heater",
  "cuci tangki air",
  "cuci toren air",
  "service alat rumah tangga",
  // Layanan Kebersihan
  "home cleaning",
  "jasa kebersihan rumah",
  "cleaning service rumah",
  "cleaning kantor",
  "cleaning kos",
  "jasa bersih rumah",
  "jasa bersih apartemen",
  // Layanan Sport & Tennis
  "tennis",
  "tennis coaching",
  "latihan tennis",
  "latihan tenis",
  "les tenis",
  "kursus tenis",
  "private tennis coaching",
  "pelatih tenis",
  "les tenis anak",
  // Kata Kunci Lokal Area Layanan
  "cuci ac jakarta selatan",
  "cuci ac jakarta barat",
  "cuci ac tangerang",
  "cuci ac kabupaten tangerang",
  "cuci ac tangerang selatan",
  "pasang ac jakarta selatan",
  "pasang ac tangerang selatan",
  "bongkar pasang ac tangerang",
  "home cleaning jakarta selatan",
  "home cleaning jakarta barat",
  "home cleaning tangerang",
  "home cleaning tangerang selatan",
  "tennis coaching jakarta selatan",
  "tennis coaching jakarta barat",
  "tennis coaching tangerang",
  "tennis coaching tangerang selatan",
  "latihan tennis jakarta selatan",
  "latihan tennis tangerang selatan",
];

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#organization`,
        name: "HS Support Group",
        alternateName: ["HS Service Group", "HS Support", "HS Tennis Coaching"],
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        image: `${siteUrl}/logo.png`,
        description: `Penyedia jasa Cuci AC, Pasang & Bongkar AC, Home Cleaning, Teknisi Rumah Tangga, serta Tennis Coaching profesional untuk area ${SERVICE_AREA_TEXT}.`,
        telephone: `+${WHATSAPP_NUMBER}`,
        priceRange: "Rp 80.000 - Rp 600.000",
        areaServed: SERVICE_AREAS.map((area) => ({
          "@type": "AdministrativeArea",
          name: area,
        })),
        knowsAbout: [
          "Cuci AC",
          "Pasang AC",
          "Bongkar Pasang AC",
          "Service AC",
          "Home Cleaning",
          "Cleaning Kantor",
          "Jasa Teknisi Listrik & Rumah Tangga",
          "Tennis Coaching",
          "Latihan Tennis",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "HS Support Group",
        alternateName: "HS Service Group",
        inLanguage: "id-ID",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    ],
  };
}

export function buildServiceJsonLd(service: Service) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} — HS Support Group`,
    serviceType: service.name,
    description: `${service.desc} Melayani area ${SERVICE_AREA_TEXT}.`,
    url: `${siteUrl}/layanan/${service.id}`,
    image: service.image ? `${siteUrl}${service.image}` : `${siteUrl}/logo.png`,
    provider: {
      "@type": "LocalBusiness",
      name: "HS Support Group",
      alternateName: "HS Service Group",
      telephone: `+${WHATSAPP_NUMBER}`,
      url: siteUrl,
    },
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
  };
}

