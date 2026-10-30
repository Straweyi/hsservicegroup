import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteUrl, SERVICE_AREAS, SERVICE_AREA_TEXT } from "@/lib/seo";
import { WHATSAPP_NUMBER } from "@/lib/data";
import { TennisClient } from "./tennis-client";

export const metadata: Metadata = {
  title: "HS Tennis Coaching — Latihan Tennis & Kursus Tenis Profesional",
  description: `Program latihan tennis & tennis coaching profesional dari HS Support Group (HS Service Group). Tersedia Private Coaching, Group Class, dan Kids & Junior di ${SERVICE_AREA_TEXT}.`,
  keywords: [
    "tennis",
    "tennis coaching",
    "latihan tennis",
    "latihan tenis",
    "les tenis",
    "kursus tenis",
    "hs tennis coaching",
    "hs support group",
    "hs service group",
    "les tenis jakarta selatan",
    "les tenis jakarta barat",
    "les tenis tangerang",
    "les tenis kabupaten tangerang",
    "les tenis tangerang selatan",
    "latihan tennis jakarta selatan",
    "latihan tennis tangerang selatan",
  ],
  alternates: {
    canonical: "/tennis-coaching",
  },
  openGraph: {
    title: "HS Tennis Coaching — Latihan Tennis Profesional | HS Support Group",
    description: `Private Coaching, Group Class & Kids Development bersama pelatih berpengalaman di area ${SERVICE_AREA_TEXT}.`,
    url: "/tennis-coaching",
    images: ["/tennis.jpg"],
  },
};

export default function TennisCoachingPage() {
  const siteUrl = getSiteUrl();
  const tennisJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "HS Tennis Coaching — Latihan Tennis Profesional",
    serviceType: "Tennis Coaching & Latihan Tennis",
    description: `Kursus dan latihan tennis profesional (Private, Group Class, Kids & Junior) di ${SERVICE_AREA_TEXT}.`,
    url: `${siteUrl}/tennis-coaching`,
    image: `${siteUrl}/tennis.jpg`,
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tennisJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <TennisClient />
      </main>
      <Footer />
    </div>
  );
}
