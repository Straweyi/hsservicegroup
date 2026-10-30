"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Briefcase,
  MessageSquareQuote,
  HelpCircle,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { mapRowToService, type ServiceRow } from "@/lib/services-store";
import { invalidateServicesCache } from "@/lib/use-services";
import { getDefaultRows, slugify } from "./_components/admin-constants";
import { AdminLogin } from "./_components/admin-login";
import { AdminHeader } from "./_components/admin-header";
import { AdminStats } from "./_components/admin-stats";
import { AdminToolbar, type CategoryFilter } from "./_components/admin-toolbar";
import { AdminServiceCard } from "./_components/admin-service-card";
import { AdminServiceModal, type ServiceFormState } from "./_components/admin-service-modal";
import { AdminTestimonials } from "./_components/admin-testimonials";
import { AdminFaqs } from "./_components/admin-faqs";
import { AdminSettings } from "./_components/admin-settings";

const INITIAL_FORM_STATE: ServiceFormState = {
  id: "",
  idManual: false,
  category: "kebersihan",
  name: "",
  subtitle: "",
  badge: "",
  desc: "",
  icon: "Sparkles",
  image: "/services/home.jpg",
  sortOrder: 1,
  isActive: true,
  features: [],
  tiers: [{ label: "Paket Standar", price: "Rp 150.000", originalPrice: "", discountBadge: "", popular: true }],
};

type AdminSession = {
  authenticated: boolean;
  adminId?: string;
  email?: string;
};

type CmsSectionTab = "services" | "testimonials" | "faqs" | "settings";

const CMS_TABS: {
  id: CmsSectionTab;
  label: string;
  shortLabel: string;
  icon: typeof Briefcase;
}[] = [
  { id: "services", label: "Layanan & Harga", shortLabel: "Layanan", icon: Briefcase },
  { id: "testimonials", label: "Testimoni Pelanggan", shortLabel: "Testimoni", icon: MessageSquareQuote },
  { id: "faqs", label: "Tanya Jawab (FAQ)", shortLabel: "FAQ", icon: HelpCircle },
  { id: "settings", label: "Pengaturan & WhatsApp", shortLabel: "Kontak & WA", icon: Settings },
];

export function AdminClient() {
  // Active CMS Module Tab
  const [cmsTab, setCmsTab] = useState<CmsSectionTab>("services");

  // Auth state
  const [session, setSession] = useState<AdminSession>({ authenticated: false });
  const [supabaseAuthed, setSupabaseAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // CMS Services state
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState<ServiceFormState>(INITIAL_FORM_STATE);

  // Check active server session & Supabase session on mount
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const data: AdminSession = await res.json();
        setSession(data);

        if (data.authenticated && supabase) {
          const { data: sbSession } = await supabase.auth.getSession();
          setSupabaseAuthed(Boolean(sbSession.session));
        }
      } catch {
        setSession({ authenticated: false });
      } finally {
        setAuthLoading(false);
      }
    }
    verifySession();
  }, []);

  // Load services once authenticated
  useEffect(() => {
    if (session.authenticated) {
      loadServices();
    }
  }, [session.authenticated]);

  async function loadServices() {
    if (!supabase) {
      setRows(getDefaultRows());
      return;
    }
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        setRows(getDefaultRows());
        toast.warning(
          "Tabel services belum ditemukan di Supabase. Jalankan supabase/schema.sql di SQL Editor Supabase."
        );
        return;
      }
      setRows((data as ServiceRow[]) ?? []);
    } catch {
      setRows(getDefaultRows());
    } finally {
      setDataLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        setLoginError(data.error || "Gagal masuk. Periksa kembali ID/Email dan Password Anda.");
        toast.error(data.error || "Kredensial tidak valid.");
        return;
      }

      if (supabase && data.email) {
        const { error: sbError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password,
        });
        setSupabaseAuthed(!sbError);
      }

      setSession({
        authenticated: true,
        adminId: data.adminId,
        email: data.email,
      });
      setPassword("");
      toast.success("Login berhasil! Selamat datang di Dashboard CMS Admin.");
    } catch {
      setLoginError("Terjadi gangguan jaringan saat menghubungi server.");
      toast.error("Gagal menghubungi server autentikasi.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession({ authenticated: false });
    setSupabaseAuthed(false);
    setIdentifier("");
    setPassword("");
    toast.info("Anda telah keluar dari sesi Admin.");
  }

  async function handleSeedInitialData() {
    const initialRows = getDefaultRows();
    if (!supabase || !supabaseAuthed) {
      setRows(initialRows);
      toast.info(
        "Jalankan supabase/schema.sql di SQL Editor Supabase agar perubahan tersimpan permanen di database."
      );
      return;
    }

    setSeeding(true);
    try {
      const { error } = await supabase.from("services").upsert(initialRows, { onConflict: "id" });
      if (error) {
        // Fallback jika kolom subtitle/badge/features belum dimigrasikan di Supabase
        const legacyRows = initialRows.map(({ subtitle, badge, features, tiers, ...rest }) => ({
          ...rest,
          tiers:
            tiers.length > 0 && (subtitle || badge || (features && features.length > 0))
              ? tiers.map((t, i) =>
                  i === 0
                    ? {
                        ...t,
                        _meta: {
                          subtitle: subtitle ?? "",
                          badge: badge ?? "",
                          features: features ?? [],
                        },
                      }
                    : t
                )
              : tiers,
        }));
        const { error: retryErr } = await supabase
          .from("services")
          .upsert(legacyRows, { onConflict: "id" });
        if (retryErr) throw retryErr;
      }
      invalidateServicesCache();
      toast.success("Berhasil mengimpor 20 layanan awal ke database Supabase!");
      await loadServices();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal melakukan seed data.";
      toast.error(`Gagal impor data: ${msg}`);
    } finally {
      setSeeding(false);
    }
  }

  function openCreateModal() {
    const targetCategory = filterCategory === "all" ? "kebersihan" : filterCategory;
    setEditingId(null);
    setForm({
      ...INITIAL_FORM_STATE,
      category: targetCategory,
      icon: targetCategory === "tennis" ? "Trophy" : "Sparkles",
      image: targetCategory === "tennis" ? "/tennis.jpg" : "/services/home.jpg",
      features: targetCategory === "tennis" ? [""] : [],
      tiers:
        targetCategory === "tennis"
          ? [{ label: "Personal / Paket Utama", price: "Via WhatsApp", originalPrice: "", discountBadge: "", popular: true }]
          : INITIAL_FORM_STATE.tiers,
      sortOrder: rows.length + 1,
    });
    setModalOpen(true);
  }

  function openEditModal(row: ServiceRow) {
    const mapped = mapRowToService(row);
    setEditingId(row.id);
    setForm({
      id: row.id,
      idManual: true,
      category: row.category,
      name: row.name,
      subtitle: mapped.subtitle ?? "",
      badge: mapped.badge ?? "",
      desc: row.desc,
      icon: row.icon || "Sparkles",
      image: row.image || "/services/home.jpg",
      sortOrder: row.sort_order ?? 1,
      isActive: row.is_active ?? true,
      features: mapped.features ? [...mapped.features] : [],
      tiers:
        Array.isArray(row.tiers) && row.tiers.length > 0
          ? row.tiers.map((t) => ({
              label: t.label,
              price: t.price,
              originalPrice: t.originalPrice ?? "",
              discountBadge: t.discountBadge ?? "",
              popular: Boolean(t.popular),
            }))
          : [{ label: "Mulai", price: "Rp 100.000", originalPrice: "", discountBadge: "", popular: true }],
    });
    setModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase || !supabaseAuthed) {
      const localUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, image: localUrl }));
      toast.info("Gambar ditampilkan secara lokal (jalankan schema.sql untuk upload ke Supabase Storage).");
      return;
    }

    setUploadingImage(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${slugify(file.name.replace(/\.[^/.]+$/, ""))}.${ext}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("service-images").getPublicUrl(filePath);
      setForm((prev) => ({ ...prev, image: data.publicUrl }));
      toast.success("Gambar berhasil diunggah ke Supabase Storage!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah gambar.";
      toast.error(`Upload gagal: ${msg}`);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    const cleanId = slugify(form.id || form.name);
    if (!cleanId) {
      toast.error("ID/Slug layanan tidak boleh kosong.");
      return;
    }

    const validTiers = form.tiers
      .map((t) => ({
        label: t.label.trim(),
        price: t.price.trim(),
        ...(t.originalPrice && t.originalPrice.trim()
          ? { originalPrice: t.originalPrice.trim() }
          : {}),
        ...(t.discountBadge && t.discountBadge.trim()
          ? { discountBadge: t.discountBadge.trim() }
          : {}),
        ...(t.popular ? { popular: true } : {}),
      }))
      .filter((t) => t.label && t.price);

    if (validTiers.length === 0) {
      toast.error("Tambahkan minimal 1 paket harga (label & tarif).");
      return;
    }

    const cleanSubtitle = form.subtitle.trim();
    const cleanBadge = form.badge.trim();
    const validFeatures = form.features.map((f) => f.trim()).filter(Boolean);

    const payload: ServiceRow = {
      id: editingId ?? cleanId,
      category: form.category,
      name: form.name.trim(),
      subtitle: cleanSubtitle,
      badge: cleanBadge,
      desc: form.desc.trim(),
      icon: form.icon,
      image: form.image.trim() || "/services/home.jpg",
      features: validFeatures,
      tiers: validTiers,
      sort_order: Number(form.sortOrder) || 1,
      is_active: form.isActive,
    };

    if (!supabase || !supabaseAuthed) {
      setRows((prev) => {
        if (editingId) {
          return prev.map((r) => (r.id === editingId ? payload : r));
        }
        return [...prev, payload];
      });
      setModalOpen(false);
      toast.success("Perubahan diterapkan! (Pastikan schema.sql sudah dijalankan di Supabase agar tersimpan di cloud).");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("services").upsert(payload, { onConflict: "id" });
      if (error) {
        // Fallback otomatis ke metadata JSONB di dalam tiers[0] jika kolom baru belum dijalankan di SQL Editor
        const legacyPayload = {
          id: payload.id,
          category: payload.category,
          name: payload.name,
          desc: payload.desc,
          icon: payload.icon,
          image: payload.image,
          tiers: validTiers.map((t, idx) =>
            idx === 0
              ? {
                  ...t,
                  _meta: {
                    subtitle: cleanSubtitle,
                    badge: cleanBadge,
                    features: validFeatures,
                  },
                }
              : t
          ),
          sort_order: payload.sort_order,
          is_active: payload.is_active,
        };
        const { error: retryErr } = await supabase
          .from("services")
          .upsert(legacyPayload, { onConflict: "id" });
        if (retryErr) throw retryErr;
      }

      invalidateServicesCache();
      toast.success(editingId ? "Layanan berhasil diperbarui!" : "Layanan baru berhasil ditambahkan!");
      setModalOpen(false);
      await loadServices();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan layanan.";
      toast.error(`Gagal menyimpan: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(row: ServiceRow) {
    const nextState = !row.is_active;
    if (!supabase || !supabaseAuthed) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: nextState } : r)));
      toast.success(`Layanan "${row.name}" ${nextState ? "diaktifkan" : "dinonaktifkan"}.`);
      return;
    }

    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: nextState })
        .eq("id", row.id);
      if (error) throw error;
      invalidateServicesCache();
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: nextState } : r)));
      toast.success(`Layanan "${row.name}" ${nextState ? "diaktifkan" : "disembunyikan"}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengubah status.";
      toast.error(msg);
    }
  }

  async function handleDeleteService(row: ServiceRow) {
    if (!window.confirm(`Hapus layanan "${row.name}" secara permanen?`)) return;

    if (!supabase || !supabaseAuthed) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast.success(`Layanan "${row.name}" dihapus.`);
      return;
    }

    try {
      const { error } = await supabase.from("services").delete().eq("id", row.id);
      if (error) throw error;
      invalidateServicesCache();
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast.success(`Layanan "${row.name}" berhasil dihapus.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus layanan.";
      toast.error(msg);
    }
  }

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchCat = filterCategory === "all" || r.category === filterCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [rows, filterCategory, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      active: rows.filter((r) => r.is_active).length,
      kebersihan: rows.filter((r) => r.category === "kebersihan").length,
      teknisi: rows.filter((r) => r.category === "teknisi").length,
      tennis: rows.filter((r) => r.category === "tennis").length,
    };
  }, [rows]);

  if (authLoading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 text-slate-600 text-sm font-semibold">
          <Loader2 className="size-5 animate-spin text-teal-600 shrink-0" />
          <span>Memverifikasi keamanan sesi Admin...</span>
        </div>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <AdminLogin
        identifier={identifier}
        password={password}
        loginLoading={loginLoading}
        errorMessage={loginError}
        onIdentifierChange={setIdentifier}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 pb-16 sm:pb-20">
      <AdminHeader
        adminId={session.adminId}
        userEmail={session.email}
        isSupabaseReady={supabaseAuthed}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-[1440px] px-3.5 pt-5 sm:px-6 sm:pt-7 lg:px-8 space-y-6 sm:space-y-8">
        {/* Modul Navigasi Utama CMS: 2x2 pada HP, 4 kolom rata pada Tablet/Laptop/Komputer */}
        <nav
          aria-label="Modul CMS"
          className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-1.5 sm:p-2 shadow-sm"
        >
          {CMS_TABS.map((t) => {
            const Icon = t.icon;
            const active = cmsTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setCmsTab(t.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition ${
                  active
                    ? "bg-brand-gradient text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="lg:hidden truncate">{t.shortLabel}</span>
                <span className="hidden lg:inline truncate">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab 1: Layanan & Harga */}
        {cmsTab === "services" && (
          <div className="space-y-5 sm:space-y-7">
            <AdminStats
              stats={stats}
              isEmpty={rows.length === 0 && !dataLoading}
              seeding={seeding}
              onSeed={handleSeedInitialData}
            />

            <AdminToolbar
              filterCategory={filterCategory}
              searchQuery={searchQuery}
              hasRows={rows.length > 0}
              seeding={seeding}
              onFilterChange={setFilterCategory}
              onSearchChange={setSearchQuery}
              onSeed={handleSeedInitialData}
              onAdd={openCreateModal}
            />

            {dataLoading ? (
              <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2 text-sm">
                <Loader2 className="size-5 animate-spin text-teal-600" />
                <span>Memuat data layanan...</span>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 bg-white py-14 sm:py-16 px-4 text-center space-y-2.5">
                <p className="text-sm sm:text-base font-bold text-slate-700">
                  Tidak ada layanan yang cocok
                </p>
                <p className="text-xs text-slate-500">
                  Coba ubah kata kunci pencarian atau tambahkan layanan baru.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {filteredRows.map((row) => (
                  <AdminServiceCard
                    key={row.id}
                    row={row}
                    onEdit={openEditModal}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteService}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Testimoni Pelanggan */}
        {cmsTab === "testimonials" && <AdminTestimonials supabaseAuthed={supabaseAuthed} />}

        {/* Tab 3: Tanya Jawab (FAQ) */}
        {cmsTab === "faqs" && <AdminFaqs supabaseAuthed={supabaseAuthed} />}

        {/* Tab 4: Pengaturan Kontak & WhatsApp */}
        {cmsTab === "settings" && <AdminSettings supabaseAuthed={supabaseAuthed} />}
      </main>

      {modalOpen && (
        <AdminServiceModal
          editingId={editingId}
          form={form}
          saving={saving}
          uploadingImage={uploadingImage}
          onChange={setForm}
          onImageUpload={handleImageUpload}
          onSubmit={handleSaveService}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
