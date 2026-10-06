-- SUBPLUG authentication hardening
-- Run once in the Supabase SQL Editor after the existing foundation schema.
-- This migration enforces unique usernames/phones, creates profiles for new
-- users, generates each user's own referral code, and records phone verification.

alter table public.profiles
  add column if not exists username text,
  add column if not exists referred_by_code text,
  add column if not exists phone_verified_at timestamptz;

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username))
  where username is not null;

create unique index if not exists profiles_phone_unique_idx
  on public.profiles (phone)
  where phone is not null;

create or replace function public.generate_subplug_referral_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate text;
begin
  loop
    candidate := 'SUB' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 7));
    exit when not exists (
      select 1 from public.profiles where referral_code = candidate
    );
  end loop;
  return candidate;
end;
$$;

revoke all on function public.generate_subplug_referral_code() from public;
revoke all on function public.generate_subplug_referral_code() from anon;
revoke all on function public.generate_subplug_referral_code() from authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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
    id,
    full_name,
    username,
    phone,
    referred_by_code,
    referral_code
  )
  values (
    new.id,
    requested_name,
    requested_username,
    requested_phone,
    referred_code,
    public.generate_subplug_referral_code()
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
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    phone = coalesce(new.phone, phone),
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

-- Keep existing profile rows usable. New accounts are validated by the trigger.
-- We intentionally do not make username/phone NOT NULL here because older
-- accounts may predate this authentication policy and require a guided upgrade.
