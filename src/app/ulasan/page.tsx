import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReviewClient } from "./review-client";

export const metadata: Metadata = {
  title: "Ulasan Pelanggan | HS Support Group",
  robots: { index: false, follow: false, nocache: true },
};

export default function UlasanPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ReviewClient />
      </main>
      <Footer />
    </div>
  );
}
