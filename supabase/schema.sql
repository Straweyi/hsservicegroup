-- Jalankan di Supabase Dashboard > SQL Editor
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  address text not null,
  service_id text not null,
  service_name text not null,
  scheduled_date date not null,
  scheduled_time text not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','done','cancelled'))
);

alter table public.bookings enable row level security;

-- Pengunjung hanya boleh membuat pesanan (tidak bisa membaca data orang lain)
create policy "Public can create bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (status = 'pending');

-- Hanya user terautentikasi (admin) yang dapat melihat & mengubah
create policy "Authenticated can read bookings"
  on public.bookings for select to authenticated using (true);

create policy "Authenticated can update bookings"
  on public.bookings for update to authenticated using (true);
