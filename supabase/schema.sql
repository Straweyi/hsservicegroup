-- ============================================================================
-- HS SUPPORT GROUP — SUPABASE CMS SCHEMA & ADMIN SECURITY SETUP
-- Jalankan script ini di Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. Buat Akun Admin Resmi di Supabase Auth (ID: hspunyaadmin | Email: admin@hssg.com)
do $$
declare
  v_user_id uuid := '00000000-0000-0000-0000-000000000001';
begin
  if not exists (select 1 from auth.users where email = 'admin@hssg.com') then
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'admin@hssg.com',
      crypt('hssgpassword', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"admin_id":"hspunyaadmin","role":"admin"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      format('{"sub":"%s","email":"admin@hssg.com"}', v_user_id)::jsonb,
      'email',
      v_user_id::text,
      now(),
      now(),
      now()
    );
  else
    update auth.users
    set encrypted_password = crypt('hssgpassword', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_user_meta_data = '{"admin_id":"hspunyaadmin","role":"admin"}'::jsonb,
        updated_at = now()
    where email = 'admin@hssg.com';
  end if;
end $$;

-- 2. Trigger fungsi otomatis update kolom updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. Tabel Layanan & Harga (services)
create table if not exists public.services (
  id text primary key,
  category text not null check (category in ('kebersihan', 'teknisi', 'tennis')),
  name text not null,
  "desc" text not null,
  icon text not null default 'Sparkles',
  image text not null default '/services/home.jpg',
  tiers jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

alter table public.services enable row level security;

drop policy if exists "Public can read services" on public.services;
create policy "Public can read services"
  on public.services for select to anon, authenticated using (true);

drop policy if exists "Authenticated admin can insert services" on public.services;
create policy "Authenticated admin can insert services"
  on public.services for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can update services" on public.services;
create policy "Authenticated admin can update services"
  on public.services for update to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@hssg.com')
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can delete services" on public.services;
create policy "Authenticated admin can delete services"
  on public.services for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@hssg.com');

-- 4. Tabel Testimoni Pelanggan (testimonials)
create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  role text not null,
  text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_testimonials_updated_at on public.testimonials;
create trigger trg_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials"
  on public.testimonials for select to anon, authenticated using (true);

drop policy if exists "Authenticated admin can insert testimonials" on public.testimonials;
create policy "Authenticated admin can insert testimonials"
  on public.testimonials for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can update testimonials" on public.testimonials;
create policy "Authenticated admin can update testimonials"
  on public.testimonials for update to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@hssg.com')
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can delete testimonials" on public.testimonials;
create policy "Authenticated admin can delete testimonials"
  on public.testimonials for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@hssg.com');

-- 5. Tabel Tanya Jawab / FAQ (faqs)
create table if not exists public.faqs (
  id text primary key,
  q text not null,
  a text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_faqs_updated_at on public.faqs;
create trigger trg_faqs_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

alter table public.faqs enable row level security;

drop policy if exists "Public can read faqs" on public.faqs;
create policy "Public can read faqs"
  on public.faqs for select to anon, authenticated using (true);

drop policy if exists "Authenticated admin can insert faqs" on public.faqs;
create policy "Authenticated admin can insert faqs"
  on public.faqs for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can update faqs" on public.faqs;
create policy "Authenticated admin can update faqs"
  on public.faqs for update to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@hssg.com')
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can delete faqs" on public.faqs;
create policy "Authenticated admin can delete faqs"
  on public.faqs for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@hssg.com');

-- 6. Tabel Pengaturan Kontak & Website (site_settings)
create table if not exists public.site_settings (
  id text primary key default 'main',
  whatsapp_number text not null default '6282121437901',
  whatsapp_display text not null default '0821-2143-7901',
  operating_hours text not null default 'Setiap Hari (08.00 - 20.00 WIB)',
  tagline text not null default 'Karena rumah bersih dan hidup sehat dimulai dari pelayanan terpercaya.',
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site_settings" on public.site_settings;
create policy "Public can read site_settings"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "Authenticated admin can insert site_settings" on public.site_settings;
create policy "Authenticated admin can insert site_settings"
  on public.site_settings for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can update site_settings" on public.site_settings;
create policy "Authenticated admin can update site_settings"
  on public.site_settings for update to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@hssg.com')
  with check ((auth.jwt() ->> 'email') = 'admin@hssg.com');

-- 7. Buat Storage Bucket untuk upload gambar layanan (service-images)
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view service images" on storage.objects;
create policy "Public can view service images"
  on storage.objects for select to public
  using (bucket_id = 'service-images');

drop policy if exists "Authenticated admin can upload service images" on storage.objects;
create policy "Authenticated admin can upload service images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'service-images' and (auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can update service images" on storage.objects;
create policy "Authenticated admin can update service images"
  on storage.objects for update to authenticated
  using (bucket_id = 'service-images' and (auth.jwt() ->> 'email') = 'admin@hssg.com');

drop policy if exists "Authenticated admin can delete service images" on storage.objects;
create policy "Authenticated admin can delete service images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'service-images' and (auth.jwt() ->> 'email') = 'admin@hssg.com');
