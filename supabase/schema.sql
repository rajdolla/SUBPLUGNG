-- SUBPLUG production foundation
-- Fresh-project schema. For an existing project, run:
-- supabase/migrations/20261006_complete_authentication.sql
--
-- Financial mutations stay server-side/Edge Function only.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text,
  phone text,
  phone_verified_at timestamptz,
  referral_code text unique,
  referred_by_code text,
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

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username))
  where username is not null;

create unique index if not exists profiles_phone_unique_idx
  on public.profiles (phone)
  where phone is not null;

create index if not exists transactions_user_created_idx on public.transactions(user_id, created_at desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own" on public.wallets
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.generate_subplug_referral_code()
returns text language plpgsql security definer set search_path = '' as $$
declare
  candidate text;
begin
  loop
    candidate := 'SUB' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 7));
    exit when not exists (select 1 from public.profiles where referral_code = candidate);
  end loop;
  return candidate;
end;
$$;

revoke all on function public.generate_subplug_referral_code() from public;
revoke all on function public.generate_subplug_referral_code() from anon;
revoke all on function public.generate_subplug_referral_code() from authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  requested_username text;
  requested_phone text;
  requested_name text;
  referred_code text;
begin
  requested_username := lower(trim(coalesce(new.raw_user_meta_data ->> 'username', '')));
  requested_phone := trim(coalesce(new.raw_user_meta_data ->> 'phone', ''));
  requested_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');
  referred_code := nullif(upper(trim(coalesce(new.raw_user_meta_data ->> 'referred_by_code', ''))), '');

  if requested_username !~ '^[a-z0-9_]{4,20}$' then
    raise exception 'Invalid username';
  end if;

  if requested_phone !~ '^\+234[789][01][0-9]{8}$' then
    raise exception 'Invalid Nigerian phone number';
  end if;

  insert into public.profiles (
    id, full_name, username, phone, referred_by_code, referral_code
  )
  values (
    new.id, requested_name, requested_username, requested_phone,
    referred_code, public.generate_subplug_referral_code()
  );

  insert into public.wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.handle_auth_user_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles
  set phone = coalesce(new.phone, phone),
      phone_verified_at = new.phone_confirmed_at,
      updated_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of phone, phone_confirmed_at on auth.users
for each row execute function public.handle_auth_user_update();

-- No browser insert/update/delete policies are intentionally created for wallets
-- or transactions. Financial operations belong in trusted server code with
-- authenticated JWT validation, provider validation, idempotency and balance checks.
