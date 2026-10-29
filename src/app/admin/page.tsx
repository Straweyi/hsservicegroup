import type { Metadata } from "next";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin CMS — Kelola Layanan & Harga | HS Support Group",
  description: "Dashboard CMS Admin HS Support Group untuk mengelola layanan, paket harga, foto, dan status layanan dengan Supabase.",
};

export default function AdminPage() {
  return <AdminClient />;
}

