import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl, SEO_KEYWORDS, SERVICE_AREA_TEXT } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "HS Support Group (HS Service Group) — Jasa Cuci AC, Pasang AC, Home Cleaning & Tennis Coaching",
    template: "%s | HS Support Group",
  },
  description: `HS Support Group (HS Service Group) melayani Jasa Cuci AC, Pasang & Bongkar AC, Service AC, Home Cleaning, Teknisi Rumah Tangga, serta Latihan Tennis & Tennis Coaching profesional di area ${SERVICE_AREA_TEXT}.`,
  keywords: SEO_KEYWORDS,
  applicationName: "HS Support Group",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "HS Support Group",
    title:
      "HS Support Group (HS Service Group) — Cuci AC, Home Cleaning, Teknisi & Tennis Coaching",
    description: `Layanan kebersihan rumah & kantor, cuci/pasang/bongkar AC, teknisi rumah tangga, dan latihan tennis profesional untuk wilayah ${SERVICE_AREA_TEXT}.`,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "HS Support Group Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HS Support Group — Cuci AC, Home Cleaning, Teknisi & Tennis Coaching",
    description: `Jasa Kebersihan, Teknisi AC & Rumah Tangga, serta Latihan Tennis di ${SERVICE_AREA_TEXT}.`,
    images: ["/logo.png"],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
