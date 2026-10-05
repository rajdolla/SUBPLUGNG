-- SUBPLUG production foundation
-- Run this in the Supabase SQL editor before enabling live dashboard data.
-- The React dashboard intentionally does not perform wallet mutations from the browser.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  referral_code text unique,
  reseller_tier text not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance numeric(14,2) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service text not null,
  reference text not null unique,
  amount numeric(14,2) not null,
  status text not null check (status in ('pending','successful','failed','reversed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_created_idx on public.transactions(user_id, created_at desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own" on public.wallets for select to authenticated using (auth.uid() = user_id);

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions for select to authenticated using (auth.uid() = user_id);

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications for select to authenticated using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- No browser insert/update/delete policies are intentionally created for wallets
-- or transactions. Create server-side/Edge Function operations that validate
-- the authenticated JWT, provider responses, idempotency and balance before
-- mutating financial records.
