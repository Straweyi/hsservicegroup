import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TennisClient } from "./tennis-client";

export const metadata: Metadata = {
  title: "HS Tennis Coaching — Kursus & Pelatihan Tenis Profesional | HS Support Group",
  description:
    "Program pelatihan tenis profesional di bawah HS Support Group. Tersedia Private Coaching (1-on-1), Semi-Private, Group Clinic, Kids Academy, dan Sparring Partner. Pesan dan konsultasi via WhatsApp sekarang.",
};

export default function TennisCoachingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <TennisClient />
      </main>
      <Footer />
    </div>
  );
}
