-- ==============================================================================
-- SUBPLUG ADDITIVE SECURITY REMEDIATION MIGRATION (FINAL HARDENED REVISION)
-- Migration Name: 20261009_harden_security_and_rbac.sql
-- Status: PREPARED FOR REVIEW ONLY (DO NOT EXECUTE UNTIL EXPLICITLY APPROVED)
-- Target: Apply cleanly on top of existing foundation without data loss
-- ==============================================================================

BEGIN;

-- 1. Ensure required cryptographic and UUID extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Ensure user_role enum exists before table creation
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('customer', 'merchant', 'agent', 'admin', 'super_admin');
  end if;
end;
$$;

-- ==============================================================================
-- 2. FOUNDATIONAL TABLES AND SCHEMA PREREQUISITES
-- ==============================================================================

-- Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  transaction_pin_hash text,
  transaction_pin_set boolean not null default false,
  pin_failed_attempts integer not null default 0,
  pin_locked_until timestamptz,
  kyc_status text not null default 'unverified',
  kyc_level integer not null default 0,
  bvn_hash text,
  nin_hash text,
  referral_code text,
  referred_by uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Granular Admin Permissions Table
create table if not exists public.admin_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  permission text not null check (permission in ('user.manage', 'finance.manage', 'kyc.verify', 'voucher.create', 'cms.edit', 'system.admin')),
  granted_by uuid references public.profiles(id),
  granted_at timestamptz not null default now(),
  unique (user_id, permission)
);

create index if not exists idx_admin_perm_user on public.admin_permissions(user_id);

-- Main Wallets Table
create table if not exists public.main_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  balance numeric(14,2) not null default 0.00 check (balance >= 0.00),
  daily_limit numeric(14,2) not null default 50000.00,
  spent_today numeric(14,2) not null default 0.00,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Main Wallet Ledger (Immutable)
create table if not exists public.main_wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null unique,
  entry_type text not null check (entry_type in ('credit', 'debit')),
  source text not null,
  amount numeric(14,2) not null check (amount > 0.00),
  balance_before numeric(14,2) not null check (balance_before >= 0.00),
  balance_after numeric(14,2) not null check (balance_after >= 0.00),
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Bonus Wallets Table
create table if not exists public.bonus_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  balance numeric(14,2) not null default 0.00 check (balance >= 0.00),
  total_earned numeric(14,2) not null default 0.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bonus Wallet Ledger (Immutable)
create table if not exists public.bonus_wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null unique,
  entry_type text not null check (entry_type in ('credit', 'debit')),
  source text not null,
  amount numeric(14,2) not null check (amount > 0.00),
  balance_before numeric(14,2) not null check (balance_before >= 0.00),
  balance_after numeric(14,2) not null check (balance_after >= 0.00),
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Admin Audit Logs Table (Immutable Audit Trail)
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_resource text not null,
  resource_id text,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_admin_user on public.admin_audit_logs(admin_user_id, created_at desc);

-- Vouchers Table
create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text,
  code_prefix text not null default 'SUB-VCH-****',
  code_hash text,
  value numeric(14,2) not null check (value > 0.00),
  status text not null default 'unused' check (status in ('unused', 'redeemed', 'expired', 'cancelled')),
  destination_wallet text not null default 'main' check (destination_wallet in ('main', 'bonus')),
  expiry_date timestamptz not null,
  created_by uuid references public.profiles(id),
  batch_id text,
  source text not null default 'admin_generation',
  redeemer_user_id uuid references public.profiles(id),
  redemption_reference text,
  redeemed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Points Accounts Table
create table if not exists public.points_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  available_points integer not null default 0 check (available_points >= 0),
  lifetime_earned integer not null default 0 check (lifetime_earned >= 0),
  lifetime_redeemed integer not null default 0 check (lifetime_redeemed >= 0),
  tier text not null default 'bronze' check (tier in ('bronze', 'silver', 'gold', 'platinum')),
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Points Ledger Table (Immutable)
create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null unique,
  entry_type text not null check (entry_type in ('credit', 'debit')),
  source text not null check (source in ('task_completion', 'transaction_reward', 'admin_grant', 'cash_redemption', 'airtime_redemption', 'data_redemption', 'points_expiry', 'dispute_reversal', 'points_refund')),
  points integer not null check (points > 0),
  balance_before integer not null check (balance_before >= 0),
  balance_after integer not null check (balance_after >= 0),
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Points Tasks Table
create table if not exists public.points_tasks (
  id uuid primary key default gen_random_uuid(),
  task_code text not null unique,
  title text not null,
  description text not null,
  category text not null check (category in ('onboarding', 'transaction', 'social', 'loyalty')),
  points_reward integer not null check (points_reward > 0),
  recurrence text not null default 'once' check (recurrence in ('once', 'daily', 'weekly', 'monthly', 'unlimited')),
  max_completions_per_user integer not null default 1,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Points Redemption Catalogue Table
create table if not exists public.points_redemption_catalogue (
  id uuid primary key default gen_random_uuid(),
  reward_type text not null check (reward_type in ('wallet_cash', 'airtime', 'data')),
  title text not null,
  description text not null,
  points_required integer not null check (points_required > 0),
  cash_credit_amount numeric(14,2) not null default 0.00 check (cash_credit_amount >= 0.00),
  airtime_amount numeric(14,2) not null default 0.00 check (airtime_amount >= 0.00),
  network text,
  data_plan_name text,
  data_amount_mb integer default 0 check (data_amount_mb >= 0),
  per_user_monthly_limit integer not null default 3 check (per_user_monthly_limit >= 1),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint chk_catalogue_wallet_cash_positive check (reward_type <> 'wallet_cash' or (cash_credit_amount is not null and cash_credit_amount > 0.00))
);

-- Points Redemptions Table
create table if not exists public.points_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  catalogue_item_id uuid not null references public.points_redemption_catalogue(id),
  reward_type text not null,
  points_deducted integer not null check (points_deducted > 0),
  status text not null check (status in ('pending', 'processing', 'completed', 'reversed', 'failed')),
  reference text not null unique,
  idempotency_key text,
  reward_reference text,
  recipient_phone text,
  provider_reference text,
  provider_response jsonb default '{}'::jsonb,
  failure_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint uq_points_redemptions_user_idempotency unique (user_id, idempotency_key)
);

create index if not exists idx_points_redemptions_user on public.points_redemptions(user_id, created_at desc);
create index if not exists idx_points_redemptions_ref on public.points_redemptions(reference);
create index if not exists idx_points_redemptions_status on public.points_redemptions(status);

-- ==============================================================================
-- 3. COLUMN RECONCILIATION FOR PRE-EXISTING TABLES
-- ==============================================================================
-- Profiles columns
alter table public.profiles add column if not exists transaction_pin_hash text;
alter table public.profiles add column if not exists transaction_pin_set boolean default false;
alter table public.profiles add column if not exists pin_failed_attempts integer default 0;
alter table public.profiles add column if not exists pin_locked_until timestamptz;
alter table public.profiles add column if not exists kyc_status text default 'unverified';
alter table public.profiles add column if not exists kyc_level integer default 0;
alter table public.profiles add column if not exists bvn_hash text;
alter table public.profiles add column if not exists nin_hash text;
alter table public.profiles add column if not exists referral_code text;
alter table public.profiles add column if not exists referred_by uuid;
alter table public.profiles add column if not exists is_active boolean default true;

-- Wallets columns
alter table public.main_wallets add column if not exists daily_limit numeric(14,2) default 50000.00;
alter table public.main_wallets add column if not exists spent_today numeric(14,2) default 0.00;
alter table public.main_wallets add column if not exists last_activity_at timestamptz;

-- Points Accounts columns
alter table public.points_accounts add column if not exists available_points integer default 0;
alter table public.points_accounts add column if not exists lifetime_earned integer default 0;
alter table public.points_accounts add column if not exists lifetime_redeemed integer default 0;
alter table public.points_accounts add column if not exists last_activity_at timestamptz;

-- Vouchers columns
alter table public.vouchers add column if not exists code_prefix text;
alter table public.vouchers add column if not exists code_hash text;
alter table public.vouchers add column if not exists destination_wallet text default 'main';
alter table public.vouchers add column if not exists created_by uuid;
alter table public.vouchers add column if not exists batch_id text;
alter table public.vouchers add column if not exists source text default 'admin_generation';
alter table public.vouchers add column if not exists redeemer_user_id uuid;
alter table public.vouchers add column if not exists redemption_reference text;
alter table public.vouchers add column if not exists redeemed_at timestamptz;

-- Points Redemptions columns
alter table public.points_redemptions add column if not exists recipient_phone text;
alter table public.points_redemptions add column if not exists provider_reference text;
alter table public.points_redemptions add column if not exists provider_response jsonb default '{}'::jsonb;
alter table public.points_redemptions add column if not exists idempotency_key text;
alter table public.points_redemptions add column if not exists reward_reference text;
alter table public.points_redemptions add column if not exists failure_reason text;
alter table public.points_redemptions add column if not exists metadata jsonb default '{}'::jsonb;

-- ==============================================================================
-- 4. CONSTRAINTS & INDEXES RECONCILIATION
-- ==============================================================================

-- 4.1 Points Catalogue validation constraint (strict null-safety)
alter table public.points_redemption_catalogue drop constraint if exists chk_catalogue_wallet_cash_positive;
alter table public.points_redemption_catalogue add constraint chk_catalogue_wallet_cash_positive 
  check (reward_type <> 'wallet_cash' or (cash_credit_amount is not null and cash_credit_amount > 0.00));

-- 4.2 Points Ledger source constraint reconciliation (includes 'points_refund')
do $$
declare
  v_chk text;
begin
  for v_chk in (
    select conname
    from pg_constraint
    where conrelid = 'public.points_ledger'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%source%'
  ) loop
    execute 'alter table public.points_ledger drop constraint ' || quote_ident(v_chk);
  end loop;
end;
$$;

alter table public.points_ledger
  add constraint points_ledger_source_check
  check (source in (
    'task_completion', 'transaction_reward', 'admin_grant',
    'cash_redemption', 'airtime_redemption', 'data_redemption',
    'points_expiry', 'dispute_reversal', 'points_refund'
  ));

-- 4.3 Admin audit logs reconciliation (allow system recovery & retain audit history on profile deletion)
alter table public.admin_audit_logs alter column admin_user_id drop not null;

do $$
declare
  v_con text;
begin
  for v_con in (
    select tc.constraint_name
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name
    where tc.table_schema = 'public' and tc.table_name = 'admin_audit_logs'
      and tc.constraint_type = 'FOREIGN KEY' and kcu.column_name = 'admin_user_id'
  ) loop
    execute 'alter table public.admin_audit_logs drop constraint ' || quote_ident(v_con);
  end loop;
end;
$$;

alter table public.admin_audit_logs
  add constraint fk_admin_audit_logs_profile
  foreign key (admin_user_id) references public.profiles(id) on delete set null;

-- 4.4 Referral Code uniqueness reconciliation
do $$
declare
  v_dup_ref integer;
begin
  select count(*) into v_dup_ref
  from (
    select referral_code
    from public.profiles
    where referral_code is not null
    group by referral_code
    having count(*) > 1
  ) dups;

  if v_dup_ref > 0 then
    raise exception 'Migration Precondition Failed: Found % duplicate referral codes in profiles. Manual resolution required before adding uniqueness constraint.', v_dup_ref;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'u'
      and conname = 'uq_profiles_referral_code'
  ) and not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and tablename = 'profiles' and indexname = 'uq_profiles_referral_code'
  ) then
    create unique index uq_profiles_referral_code on public.profiles(referral_code) where referral_code is not null;
  end if;
end;
$$;

-- 4.5 Vouchers code_hash uniqueness reconciliation
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'uq_vouchers_code_hash' and conrelid = 'public.vouchers'::regclass
  ) then
    if not exists (
      select 1 from pg_indexes 
      where schemaname = 'public' and tablename = 'vouchers' and indexname = 'idx_vouchers_code_hash_unique'
    ) then
      create unique index idx_vouchers_code_hash_unique on public.vouchers(code_hash) where code_hash is not null;
    end if;
  end if;
end;
$$;

-- 4.6 Points redemptions idempotency constraint & index reconciliation
do $$
declare
  v_dup_count integer;
  v_dup_samples text;
  r record;
begin
  -- Dynamic discovery: Drop any obsolete global unique constraints on idempotency_key
  for r in (
    select conname
    from pg_constraint
    where conrelid = 'public.points_redemptions'::regclass
      and contype = 'u'
      and conname <> 'uq_points_redemptions_user_idempotency'
      and pg_get_constraintdef(oid) ilike '%(idempotency_key)%'
  ) loop
    execute format('alter table public.points_redemptions drop constraint %I', r.conname);
  end loop;

  -- Dynamic discovery: Drop any obsolete global unique indexes on idempotency_key
  for r in (
    select c.relname as idxname
    from pg_index i
    join pg_class c on c.oid = i.indexrelid
    where i.indrelid = 'public.points_redemptions'::regclass
      and i.indisunique
      and not i.indisprimary
      and c.relname <> 'uq_points_redemptions_user_idempotency'
      and pg_get_indexdef(i.indexrelid) ilike '%(idempotency_key)%'
  ) loop
    execute format('drop index if exists public.%I', r.idxname);
  end loop;

  -- Check for existing duplicate non-null (user_id, idempotency_key) pairs
  select count(*),
         coalesce((
           select string_agg(dup_sample, ', ')
           from (
             select user_id::text || ':' || idempotency_key as dup_sample
             from public.points_redemptions
             where idempotency_key is not null
             group by user_id, idempotency_key
             having count(*) > 1
             limit 5
           ) s
         ), 'none')
  into v_dup_count, v_dup_samples
  from (
    select user_id, idempotency_key
    from public.points_redemptions
    where idempotency_key is not null
    group by user_id, idempotency_key
    having count(*) > 1
  ) dups;

  if v_dup_count > 0 then
    -- Fail-closed with diagnostic: Never delete or rewrite financial records!
    raise exception 'Migration Precondition Failed: Found % duplicate (user_id, idempotency_key) groups in points_redemptions (samples: %). Resolve duplicate keys manually before applying uniqueness constraint.', v_dup_count, v_dup_samples;
  end if;

  -- Safely add user-scoped unique constraint if not already present
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.points_redemptions'::regclass
      and conname = 'uq_points_redemptions_user_idempotency'
  ) then
    alter table public.points_redemptions
      add constraint uq_points_redemptions_user_idempotency unique (user_id, idempotency_key);
  end if;
end;
$$;

-- 4.7 Non-negative balance check constraints reconciliation
alter table public.main_wallets drop constraint if exists chk_main_wallets_balance_non_negative;
alter table public.main_wallets add constraint chk_main_wallets_balance_non_negative check (balance >= 0.00);

alter table public.bonus_wallets drop constraint if exists chk_bonus_wallets_balance_non_negative;
alter table public.bonus_wallets add constraint chk_bonus_wallets_balance_non_negative check (balance >= 0.00);

alter table public.points_accounts drop constraint if exists chk_points_accounts_points_non_negative;
alter table public.points_accounts add constraint chk_points_accounts_points_non_negative check (available_points >= 0);

-- ==============================================================================
-- 5. DYNAMIC PURGE OF ALL LEGACY POLICIES ON SENSITIVE TABLES
-- ==============================================================================
do $$
declare
  r record;
begin
  for r in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles', 'admin_permissions', 'main_wallets', 'main_wallet_ledger',
        'bonus_wallets', 'bonus_wallet_ledger', 'points_accounts', 'points_ledger',
        'points_tasks', 'points_redemption_catalogue', 'points_redemptions',
        'vouchers', 'admin_audit_logs'
      )
  ) loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end;
$$;

-- ==============================================================================
-- 6. REVOKE INAPPROPRIATE MUTATION & TRUNCATION PRIVILEGES
-- ==============================================================================
revoke insert, update, delete, truncate, references, trigger on public.main_wallets from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.main_wallet_ledger from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.bonus_wallets from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.bonus_wallet_ledger from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_accounts from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_ledger from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_tasks from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_redemption_catalogue from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_redemptions from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.vouchers from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.admin_audit_logs from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.admin_permissions from public, anon, authenticated;

-- ==============================================================================
-- 7. PREREQUISITE RBAC HELPER FUNCTIONS
-- ==============================================================================

-- Stable helper to check if caller is an admin (admin or super_admin)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
      and is_active = true
  );
2131;

-- Stable helper to check if caller is a super_admin
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
      and is_active = true
  );
2131;

-- Permission verification helper (requires active administrative account)
create or replace function public.has_admin_permission(
  p_user_id uuid,
  p_permission text
)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_user_id
      and p.is_active = true
      and p.role in ('admin', 'super_admin')
      and (
        p.role = 'super_admin'
        or exists (
          select 1 from public.admin_permissions ap
          where ap.user_id = p.id
            and ap.permission = p_permission
        )
      )
  );
2131;

revoke all on function public.has_admin_permission(uuid, text) from public, anon, authenticated;
grant execute on function public.has_admin_permission(uuid, text) to service_role;

-- ==============================================================================
-- 8. IMMUTABLE LEDGER GUARDS
-- ==============================================================================

create or replace function public.prevent_immutable_ledger_modifications()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- For admin_audit_logs: If an admin profile is deleted, PostgreSQL triggers an internal foreign-key SET NULL update.
  -- Allow deliberate preservation of audit history when ONLY admin_user_id transitions to NULL on deletion,
  -- while strictly prohibiting all other updates and all row deletions.
  if tg_table_name = 'admin_audit_logs' and tg_op = 'UPDATE' and new.admin_user_id is null and old.admin_user_id is not null then
    if (new.id = old.id and new.action = old.action and new.target_resource = old.target_resource and 
        new.resource_id is not distinct from old.resource_id and new.changes = old.changes and new.created_at = old.created_at) then
      return new;
    end if;
  end if;

  raise exception 'Security Violation: Immutable ledger and audit log entries cannot be modified or deleted once written.';
end;
$$;

revoke all on function public.prevent_immutable_ledger_modifications() from public, anon, authenticated;

-- Attach to main wallet ledger
drop trigger if exists trg_prevent_main_ledger_mod on public.main_wallet_ledger;
create trigger trg_prevent_main_ledger_mod
  before update or delete on public.main_wallet_ledger
  for each row execute function public.prevent_immutable_ledger_modifications();

-- Attach to bonus wallet ledger
drop trigger if exists trg_prevent_bonus_ledger_mod on public.bonus_wallet_ledger;
create trigger trg_prevent_bonus_ledger_mod
  before update or delete on public.bonus_wallet_ledger
  for each row execute function public.prevent_immutable_ledger_modifications();

-- Attach to points ledger
drop trigger if exists trg_prevent_points_ledger_mod on public.points_ledger;
create trigger trg_prevent_points_ledger_mod
  before update or delete on public.points_ledger
  for each row execute function public.prevent_immutable_ledger_modifications();

-- Attach to admin audit logs
drop trigger if exists trg_prevent_audit_logs_mod on public.admin_audit_logs;
create trigger trg_prevent_audit_logs_mod
  before update or delete on public.admin_audit_logs
  for each row execute function public.prevent_immutable_ledger_modifications();

-- ==============================================================================
-- 9. PROFILE FIELD PROTECTION TRIGGER (PREVENT PRIVILEGE ESCALATION)
-- ==============================================================================

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_is_super boolean := false;
  v_has_kyc_perm boolean := false;
  -- Genuine service_role session check: In PostgREST / Supabase, auth.role() returns the JWT role claim ('service_role').
  -- When invoked from direct SQL (migrations / psql as postgres/supabase_admin), session_user is the initial database connection role.
  -- CRITICAL SECURITY DEFINER GUARD: Never check current_user, because current_user inside a SECURITY DEFINER
  -- function owned by postgres evaluates to 'postgres' for ANY caller, causing critical privilege escalation!
  v_is_service_role boolean := (
    coalesce(auth.role(), '') = 'service_role' or
    (coalesce(auth.role(), '') = '' and session_user in ('postgres', 'supabase_admin'))
  );
begin
  -- Unauthenticated caller guard: reject unauthenticated modifications unless from verified service_role / postgres
  if v_caller is null and not v_is_service_role then
    raise exception 'Unauthenticated: Direct unauthenticated profile modification is strictly prohibited.';
  end if;

  -- Disallow modifying immutable profile ID and creation timestamp
  if new.id <> old.id then
    raise exception 'Security Violation: Profile ID cannot be modified.';
  end if;
  if new.created_at <> old.created_at then
    raise exception 'Security Violation: Profile created_at cannot be modified.';
  end if;
  if new.referral_code is distinct from old.referral_code then
    raise exception 'Security Violation: User referral code is immutable.';
  end if;

  -- Caller privilege assessment
  if v_caller is not null then
    select exists (
      select 1 from public.profiles
      where id = v_caller and role = 'super_admin' and is_active = true
    ) into v_is_super;
  end if;

  -- 1. ROLE ALTERATION GUARD
  if new.role is distinct from old.role then
    if v_caller = old.id and not v_is_service_role then
      raise exception 'Security Violation: Self-role modification or self-promotion is strictly prohibited.';
    end if;

    if not (v_is_super or v_is_service_role) then
      raise exception 'Permission Denied: Only super_admin can modify user roles.';
    end if;

    if old.role = 'super_admin' and new.role <> 'super_admin' then
      if (select count(*) from public.profiles where role = 'super_admin' and is_active = true) <= 1 then
        raise exception 'Security Violation: Cannot demote the last remaining active super_admin.';
      end if;
    end if;

    if v_caller is not null then
      insert into public.admin_audit_logs (
        admin_user_id, action, target_resource, resource_id, changes
      ) values (
        v_caller, 'update_user_role', 'profiles', old.id::text,
        jsonb_build_object('old_role', old.role, 'new_role', new.role)
      );
    end if;
  end if;

  -- 2. KYC STATUS & LEVEL GUARDS
  if (new.kyc_status is distinct from old.kyc_status) or (new.kyc_level is distinct from old.kyc_level) then
    if v_caller is not null then
      select public.has_admin_permission(v_caller, 'kyc.verify') into v_has_kyc_perm;
    end if;

    if not (v_is_super or v_has_kyc_perm or v_is_service_role) then
      raise exception 'Permission Denied: Only compliance administrators with kyc.verify permission or trusted verification services can alter KYC status or tier.';
    end if;

    if v_caller is not null then
      insert into public.admin_audit_logs (
        admin_user_id, action, target_resource, resource_id, changes
      ) values (
        v_caller, 'update_kyc_status', 'profiles', old.id::text,
        jsonb_build_object(
          'old_kyc_status', old.kyc_status,
          'new_kyc_status', new.kyc_status,
          'old_kyc_level', old.kyc_level,
          'new_kyc_level', new.kyc_level
        )
      );
    end if;
  end if;

  -- 3. ACCOUNT ACTIVATION GUARD
  if new.is_active is distinct from old.is_active then
    if v_caller = old.id and not v_is_service_role then
      raise exception 'Security Violation: Users cannot alter their own account activation status.';
    end if;
    if not (v_is_service_role or (v_caller is not null and public.is_admin())) then
      raise exception 'Permission Denied: Only administrators can modify account activation status.';
    end if;
  end if;

  -- 4. BVN / NIN CREDENTIAL GUARDS
  if (new.bvn_hash is distinct from old.bvn_hash) or (new.nin_hash is distinct from old.nin_hash) then
    if v_caller is not null then
      select public.has_admin_permission(v_caller, 'kyc.verify') into v_has_kyc_perm;
    end if;

    if not (v_is_super or v_has_kyc_perm or v_is_service_role) then
      raise exception 'Permission Denied: BVN/NIN credentials can only be verified or modified by compliance administrators or trusted verification services.';
    end if;
  end if;

  -- 5. REFERRED-BY SPONSOR IMMUTABILITY
  if new.referred_by is distinct from old.referred_by then
    if not (v_is_super or v_is_service_role) then
      raise exception 'Security Violation: Referred-by sponsor link cannot be altered by user.';
    end if;
  end if;

  -- 6. EMAIL SPOOFING & UNAUTHORIZED ALTERATION GUARD
  if new.email is distinct from old.email then
    if not (v_is_super or v_is_service_role) then
      if v_caller = old.id then
        if lower(trim(new.email)) <> lower(trim(coalesce(auth.jwt()->>'email', ''))) then
          raise exception 'Security Violation: Profile email must match authenticated session identity.';
        end if;
      else
        raise exception 'Permission Denied: Only super_admin or verified service_role workflows can modify another user''s email address.';
      end if;
    end if;

    if v_caller is not null and v_caller <> old.id then
      insert into public.admin_audit_logs (
        admin_user_id, action, target_resource, resource_id, changes
      ) values (
        v_caller, 'update_user_email', 'profiles', old.id::text,
        jsonb_build_object('old_email', old.email, 'new_email', new.email)
      );
    end if;
  end if;

  -- 7. PHONE ON KYC-VERIFIED ACCOUNTS
  if new.phone is distinct from old.phone and old.kyc_level >= 1 and not (v_is_super or v_is_service_role) then
    raise exception 'Security Violation: Phone number on KYC-verified accounts can only be updated through verified compliance support.';
  end if;

  -- 8. PIN STATUS GUARD (DIRECT MANIPULATION BLOCKED)
  if (new.transaction_pin_hash is distinct from old.transaction_pin_hash) or
     (new.transaction_pin_set is distinct from old.transaction_pin_set) then
    if current_setting('subplug.internal_pin_token', true) <> 'authorized_internal_pin_change' then
      raise exception 'Security Violation: Direct modification of transaction PIN columns is prohibited. Use official PIN procedures.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.protect_profile_fields() from public, anon, authenticated;

drop trigger if exists trg_protect_profile_fields on public.profiles;
create trigger trg_protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- ==============================================================================
-- 10. TRANSACTION PIN MANAGEMENT PROCEDURES
-- ==============================================================================

-- 1. Customer PIN Change Procedure
create or replace function public.change_transaction_pin(
  p_current_pin text,
  p_new_pin text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_profile record;
  v_pepper text;
  v_hashed text;
begin
  if v_caller is null then
    raise exception 'Unauthenticated: Valid customer session required.';
  end if;

  if p_new_pin is null or p_new_pin !~ '^[0-9]{4}$' then
    raise exception 'Invalid PIN format: Transaction PIN must consist of exactly 4 numeric digits.';
  end if;

  select * into v_profile
  from public.profiles
  where id = v_caller
  for update;

  if not found then
    raise exception 'Customer profile not found.';
  end if;

  if v_profile.pin_locked_until is not null and v_profile.pin_locked_until > now() then
    raise exception 'PIN entry locked until % due to multiple failed attempts. Please try again later or contact support.', v_profile.pin_locked_until;
  end if;

  if v_profile.transaction_pin_set then
    if p_current_pin is null or p_current_pin = '' then
      raise exception 'Current transaction PIN is required to change PIN.';
    end if;

    v_pepper := coalesce(current_setting('app.settings.pin_pepper', true), 'subplug_sec_salt_v1');
    if crypt(p_current_pin || v_pepper, v_profile.transaction_pin_hash) <> v_profile.transaction_pin_hash then
      update public.profiles
      set pin_failed_attempts = v_profile.pin_failed_attempts + 1,
          pin_locked_until = case when v_profile.pin_failed_attempts + 1 >= 5 then now() + interval '30 minutes' else null end,
          updated_at = now()
      where id = v_caller;

      if v_profile.pin_failed_attempts + 1 >= 5 then
        raise exception 'Invalid current PIN. Account locked for 30 minutes due to 5 failed attempts.';
      else
        raise exception 'Invalid current PIN. % attempt(s) remaining before account lockout.', (5 - (v_profile.pin_failed_attempts + 1));
      end if;
    end if;
  end if;

  v_pepper := coalesce(current_setting('app.settings.pin_pepper', true), 'subplug_sec_salt_v1');
  v_hashed := crypt(p_new_pin || v_pepper, gen_salt('bf', 10));

  perform set_config('subplug.internal_pin_token', 'authorized_internal_pin_change', true);

  update public.profiles
  set transaction_pin_hash = v_hashed,
      transaction_pin_set = true,
      pin_failed_attempts = 0,
      pin_locked_until = null,
      updated_at = now()
  where id = v_caller;

  perform set_config('subplug.internal_pin_token', '', true);

  return jsonb_build_object('success', true, 'message', 'Transaction PIN updated successfully.');
end;
$$;

revoke all on function public.change_transaction_pin(text, text) from public, anon;
grant execute on function public.change_transaction_pin(text, text) to authenticated, service_role;

-- 2. Customer PIN Verification Procedure
create or replace function public.verify_transaction_pin(
  p_pin text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_profile record;
  v_pepper text;
  v_matches boolean;
begin
  if v_caller is null then
    raise exception 'Unauthenticated: Valid customer session required.';
  end if;

  if p_pin is null or p_pin !~ '^[0-9]{4}$' then
    return false;
  end if;

  select * into v_profile
  from public.profiles
  where id = v_caller
  for update;

  if not found or not v_profile.transaction_pin_set or v_profile.transaction_pin_hash is null then
    return false;
  end if;

  if v_profile.pin_locked_until is not null and v_profile.pin_locked_until > now() then
    raise exception 'PIN entry locked until % due to multiple failed attempts.', v_profile.pin_locked_until;
  end if;

  v_pepper := coalesce(current_setting('app.settings.pin_pepper', true), 'subplug_sec_salt_v1');
  v_matches := (crypt(p_pin || v_pepper, v_profile.transaction_pin_hash) = v_profile.transaction_pin_hash);

  if v_matches then
    if v_profile.pin_failed_attempts > 0 or v_profile.pin_locked_until is not null then
      update public.profiles
      set pin_failed_attempts = 0,
          pin_locked_until = null,
          updated_at = now()
      where id = v_caller;
    end if;
    return true;
  else
    update public.profiles
    set pin_failed_attempts = v_profile.pin_failed_attempts + 1,
        pin_locked_until = case when v_profile.pin_failed_attempts + 1 >= 5 then now() + interval '30 minutes' else null end,
        updated_at = now()
    where id = v_caller;
    return false;
  end if;
end;
$$;

revoke all on function public.verify_transaction_pin(text) from public, anon;
grant execute on function public.verify_transaction_pin(text) to authenticated, service_role;

-- 3. Administrative / Trusted Recovery PIN Reset Procedure
create or replace function public.reset_transaction_pin_admin(
  p_target_user_id uuid,
  p_reason text default 'Administrative recovery'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_is_super boolean := false;
  v_is_service_role boolean := (
    coalesce(auth.role(), '') = 'service_role' or
    (coalesce(auth.role(), '') = '' and session_user in ('postgres', 'supabase_admin'))
  );
begin
  if not exists (select 1 from public.profiles where id = p_target_user_id) then
    raise exception 'Target user profile not found: %', p_target_user_id;
  end if;

  if v_caller is not null then
    select exists (
      select 1 from public.profiles
      where id = v_caller and role = 'super_admin' and is_active = true
    ) into v_is_super;
  end if;

  if not (v_is_super or v_is_service_role) then
    raise exception 'Permission Denied: Only super_admin or verified service_role recovery flows can reset transaction PINs.';
  end if;

  perform set_config('subplug.internal_pin_token', 'authorized_internal_pin_change', true);

  update public.profiles
  set transaction_pin_hash = null,
      transaction_pin_set = false,
      pin_failed_attempts = 0,
      pin_locked_until = null,
      updated_at = now()
  where id = p_target_user_id;

  perform set_config('subplug.internal_pin_token', '', true);

  insert into public.admin_audit_logs (
    admin_user_id, action, target_resource, resource_id, changes
  ) values (
    v_caller, 'reset_transaction_pin', 'profiles', p_target_user_id::text,
    jsonb_build_object(
      'reason', p_reason,
      'target_user_id', p_target_user_id,
      'actor', case
        when v_is_super then 'super_admin'
        when coalesce(auth.role(), '') = 'service_role' then 'service_role'
        else 'direct_db_' || session_user
      end
    )
  );

  return jsonb_build_object('success', true, 'message', 'Transaction PIN reset successfully. Customer can now perform initial PIN setup.');
end;
$$;

revoke all on function public.reset_transaction_pin_admin(uuid, text) from public, anon;
grant execute on function public.reset_transaction_pin_admin(uuid, text) to authenticated, service_role;

-- 4. Backward-Compatible Wrapper Procedure
create or replace function public.set_transaction_pin_atomic(
  p_new_pin text,
  p_current_pin text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return public.change_transaction_pin(p_current_pin, p_new_pin);
end;
$$;

revoke all on function public.set_transaction_pin_atomic(text, text) from public, anon;
grant execute on function public.set_transaction_pin_atomic(text, text) to authenticated, service_role;

-- ==============================================================================
-- 11. ADMIN PERMISSION MANAGEMENT PROCEDURES
-- ==============================================================================

create or replace function public.grant_admin_permission(
  p_target_user_id uuid,
  p_permission text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_is_super boolean;
begin
  if v_caller is null then
    raise exception 'Unauthenticated: Valid session required.';
  end if;

  select exists (
    select 1 from public.profiles where id = v_caller and role = 'super_admin' and is_active = true
  ) into v_is_super;

  if not v_is_super then
    raise exception 'Permission Denied: Only super_admin can grant administrative permissions.';
  end if;

  -- Ensure permissions can ONLY be assigned to active administrative accounts (admin / super_admin)
  -- Prevents independent privilege elevation of ordinary customers
  if not exists (
    select 1 from public.profiles
    where id = p_target_user_id
      and role in ('admin', 'super_admin')
      and is_active = true
  ) then
    raise exception 'Target user is not an active administrative account. Permissions can only be assigned to active admins or super_admins.';
  end if;

  insert into public.admin_permissions (user_id, permission, granted_by)
  values (p_target_user_id, p_permission, v_caller)
  on conflict (user_id, permission) do nothing;

  insert into public.admin_audit_logs (
    admin_user_id, action, target_resource, resource_id, changes
  ) values (
    v_caller, 'grant_permission', 'admin_permissions', p_target_user_id::text,
    jsonb_build_object('permission', p_permission, 'target_user_id', p_target_user_id)
  );

  return jsonb_build_object('success', true, 'message', 'Permission granted successfully.');
end;
$$;

revoke all on function public.grant_admin_permission(uuid, text) from public, anon;
grant execute on function public.grant_admin_permission(uuid, text) to authenticated, service_role;

create or replace function public.revoke_admin_permission(
  p_target_user_id uuid,
  p_permission text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_is_super boolean;
begin
  if v_caller is null then
    raise exception 'Unauthenticated: Valid session required.';
  end if;

  select exists (
    select 1 from public.profiles where id = v_caller and role = 'super_admin' and is_active = true
  ) into v_is_super;

  if not v_is_super then
    raise exception 'Permission Denied: Only super_admin can revoke administrative permissions.';
  end if;

  delete from public.admin_permissions
  where user_id = p_target_user_id and permission = p_permission;

  insert into public.admin_audit_logs (
    admin_user_id, action, target_resource, resource_id, changes
  ) values (
    v_caller, 'revoke_permission', 'admin_permissions', p_target_user_id::text,
    jsonb_build_object('permission', p_permission, 'target_user_id', p_target_user_id)
  );

  return jsonb_build_object('success', true, 'message', 'Permission revoked successfully.');
end;
$$;

revoke all on function public.revoke_admin_permission(uuid, text) from public, anon;
grant execute on function public.revoke_admin_permission(uuid, text) to authenticated, service_role;

-- ==============================================================================
-- 12. VOUCHER SYSTEM HARDENING (PEPPER, SECURE GENERATION & REDEMPTION)
-- ==============================================================================

create or replace function public.get_voucher_salt()
returns text
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare
  v_secret text;
begin
  -- Defense-in-depth: Prohibit direct execution by untrusted client roles.
  -- Inside an authorized SECURITY DEFINER procedure (e.g. redeem_voucher_atomic),
  -- current_user evaluates to the definer (postgres), allowing internal nested execution
  -- without exposing the pepper or allowing direct client invocation from anon or authenticated.
  if current_user in ('anon', 'authenticated') then
    raise exception 'Access Denied: Direct invocation of get_voucher_salt is strictly prohibited.';
  end if;

  -- Priority 1: Supabase Vault (if extension available)
  if exists (
    select 1 from information_schema.tables 
    where table_schema = 'vault' and table_name = 'decrypted_secrets'
  ) then
    begin
      execute 'select decrypted_secret from vault.decrypted_secrets where name = ''voucher_hmac_pepper'' limit 1'
      into v_secret;
      if v_secret is not null and length(trim(v_secret)) >= 32 then
        return trim(v_secret);
      end if;
    exception when others then
    end;
  end if;

  -- Priority 2: Database Parameter (app.settings.voucher_pepper)
  v_secret := current_setting('app.settings.voucher_pepper', true);
  if v_secret is not null and length(trim(v_secret)) >= 32 then
    return trim(v_secret);
  end if;

  -- HARDENED DEFENSE: Strictly prohibit hardcoded or deterministic fallback secrets in code.
  raise exception 'Cryptographic Configuration Failure: Voucher HMAC pepper is not configured or does not meet minimum entropy requirements (minimum 32 characters / 256 bits). Configure vault.decrypted_secrets or database setting app.settings.voucher_pepper.';
end;
$$;

revoke all on function public.get_voucher_salt() from public, anon, authenticated;
grant execute on function public.get_voucher_salt() to service_role;

create or replace function public.hash_voucher_code(p_code text)
returns text
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
begin
  if p_code is null or trim(p_code) = '' then
    return null;
  end if;
  return encode(hmac(upper(trim(p_code)), public.get_voucher_salt(), 'sha256'), 'hex');
end;
$$;

revoke all on function public.hash_voucher_code(text) from public, anon, authenticated;
grant execute on function public.hash_voucher_code(text) to service_role;

-- Preflight pepper and hash legacy plaintext vouchers
do $$
declare
  v_salt text;
  v_unhashed_count integer;
begin
  begin
    v_salt := public.get_voucher_salt();
  exception when others then
    raise exception 'Migration Preflight Failure: Voucher HMAC pepper is not configured or fails entropy checks. Configure vault.decrypted_secrets or database parameter app.settings.voucher_pepper before running migration. (Error: %)', sqlerrm;
  end;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'vouchers' and column_name = 'code'
  ) then
    update public.vouchers
    set code_prefix = coalesce(code_prefix, substr(code, 1, 8) || '-****'),
        code_hash = coalesce(code_hash, public.hash_voucher_code(code))
    where code is not null and code_hash is null;
  end if;

  select count(*) into v_unhashed_count
  from public.vouchers
  where status = 'unused' and code_hash is null;

  if v_unhashed_count > 0 then
    raise exception 'Migration Preflight Failure: % active unused voucher(s) lack cryptographic code_hash. Hashing required before enabling hardened voucher redemption.', v_unhashed_count;
  end if;
end;
$$;

update public.vouchers set code_prefix = 'SUB-VCH-****' where code_prefix is null;
alter table public.vouchers alter column code_prefix set not null;

create or replace function public.generate_vouchers_batch_atomic(
  p_count integer,
  p_value numeric,
  p_expiry_days integer,
  p_prefix text default 'SUB'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_caller_role user_role;
  v_is_super boolean := false;
  v_has_perm boolean := false;
  v_max_count integer;
  v_max_value numeric;
  v_batch_id text;
  v_expiry timestamptz;
  v_result_vouchers jsonb := '[]'::jsonb;
  v_i integer;
  v_raw_code text;
  v_code_hash text;
  v_masked text;
  v_rand_bytes bytea;
  v_rand_hex text;
  v_collision_retries integer;
begin
  if v_caller is null then
    raise exception 'Unauthenticated: Valid session required.';
  end if;

  select role into v_caller_role
  from public.profiles
  where id = v_caller and is_active = true;

  if v_caller_role is null then
    raise exception 'Caller profile not found or inactive.';
  end if;

  if v_caller_role not in ('admin', 'super_admin') then
    raise exception 'Permission Denied: Administrative role required to generate vouchers.';
  end if;

  v_is_super := (v_caller_role = 'super_admin');
  v_has_perm := public.has_admin_permission(v_caller, 'voucher.create');

  if not v_has_perm then
    raise exception 'Permission Denied: voucher.create permission is required. General admins possess view-only audit permissions.';
  end if;

  -- Dynamic limits based on role tier
  if v_is_super then
    v_max_count := 50;
    v_max_value := 50000.00;
  else
    v_max_count := 20;
    v_max_value := 10000.00;
  end if;

  if p_count is null or p_count < 1 or p_count > v_max_count then
    raise exception 'Invalid batch count: Must be between 1 and %.', v_max_count;
  end if;

  if p_value is null or p_value < 100.00 or p_value > v_max_value or p_value <> trunc(p_value) then
    raise exception 'Invalid voucher value: Must be an integer Naira amount between ₦100 and ₦% without fractional kobo.', v_max_value;
  end if;

  if p_expiry_days is null or p_expiry_days < 1 or p_expiry_days > 365 then
    raise exception 'Invalid expiry days: Must be between 1 and 365 days.';
  end if;

  if p_prefix is null or trim(p_prefix) !~ '^[A-Za-z0-9]{2,10}$' then
    raise exception 'Invalid voucher prefix: Must be 2-10 alphanumeric characters.';
  end if;

  v_batch_id := 'BATCH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  v_expiry := now() + (p_expiry_days || ' days')::interval;

  for v_i in 1..p_count loop
    v_collision_retries := 0;
    loop
      -- 128 bits of cryptographically secure randomness via gen_random_bytes(16)
      v_rand_bytes := gen_random_bytes(16);
      v_rand_hex := upper(encode(v_rand_bytes, 'hex')); -- 32 hex chars = full 128 bits entropy
      
      -- Format: <PREFIX>-<16-chars>-<16-chars> (Total 32 hex chars of entropy)
      v_raw_code := upper(trim(p_prefix)) || '-' || substr(v_rand_hex, 1, 16) || '-' || substr(v_rand_hex, 17, 16);
      v_code_hash := public.hash_voucher_code(v_raw_code);
      v_masked := upper(trim(p_prefix)) || '-' || substr(v_rand_hex, 1, 4) || '****-****';

      exit when not exists (
        select 1 from public.vouchers where code_hash = v_code_hash
      );

      v_collision_retries := v_collision_retries + 1;
      if v_collision_retries >= 10 then
        raise exception 'System Error: Cryptographic collision threshold reached while generating voucher batch.';
      end if;
    end loop;

    insert into public.vouchers (
      code,
      code_prefix,
      code_hash,
      value,
      status,
      destination_wallet,
      expiry_date,
      created_by,
      batch_id,
      source
    ) values (
      null,
      v_masked,
      v_code_hash,
      p_value,
      'unused',
      'main',
      v_expiry,
      v_caller,
      v_batch_id,
      'admin_generation'
    );

    v_result_vouchers := v_result_vouchers || jsonb_build_object(
      'code', v_raw_code,
      'prefix', v_masked,
      'value', p_value,
      'expiry_date', v_expiry
    );
  end loop;

  insert into public.admin_audit_logs (
    admin_user_id, action, target_resource, resource_id, changes
  ) values (
    v_caller, 'generate_voucher_batch', 'vouchers', v_batch_id,
    jsonb_build_object(
      'count', p_count,
      'value', p_value,
      'total_batch_value', p_count * p_value,
      'expiry_days', p_expiry_days,
      'batch_id', v_batch_id
    )
  );

  return jsonb_build_object(
    'success', true,
    'batch_id', v_batch_id,
    'count', p_count,
    'total_value', p_count * p_value,
    'expiry_date', v_expiry,
    'vouchers', v_result_vouchers,
    'message', 'Batch generated successfully. Store plaintext voucher codes immediately; they cannot be retrieved from the database again.'
  );
end;
$$;

revoke all on function public.generate_vouchers_batch_atomic(integer, numeric, integer, text) from public, anon;
grant execute on function public.generate_vouchers_batch_atomic(integer, numeric, integer, text) to authenticated, service_role;

create or replace function public.redeem_voucher_atomic(
  p_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_norm_code text;
  v_hash text;
  v_voucher record;
  v_main_balance numeric(14,2);
  v_new_balance numeric(14,2);
  v_tx_ref text;
begin
  if v_caller is null then
    return jsonb_build_object('success', false, 'error', 'Unauthenticated: Please log in to redeem vouchers.');
  end if;

  if p_code is null or trim(p_code) = '' then
    return jsonb_build_object('success', false, 'error', 'Please provide a valid voucher code.');
  end if;

  v_norm_code := upper(trim(p_code));
  v_hash := public.hash_voucher_code(v_norm_code);

  -- 1. Lock voucher row via unique hash lookup
  select * into v_voucher
  from public.vouchers
  where code_hash = v_hash
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Invalid voucher code.');
  end if;

  -- Strictly reject any status other than the exact permitted unused status (fail-closed for NULL)
  if v_voucher.status is distinct from 'unused' then
    if v_voucher.status = 'redeemed' then
      return jsonb_build_object('success', false, 'error', 'This voucher has already been redeemed.');
    elsif v_voucher.status = 'cancelled' then
      return jsonb_build_object('success', false, 'error', 'This voucher has been cancelled by administration.');
    elsif v_voucher.status = 'expired' then
      return jsonb_build_object('success', false, 'error', 'This voucher has expired.');
    else
      return jsonb_build_object('success', false, 'error', 'This voucher is not valid for redemption (status: ' || coalesce(v_voucher.status, 'null') || ').');
    end if;
  end if;

  if v_voucher.expiry_date is null or v_voucher.expiry_date < now() then
    if v_voucher.expiry_date is not null then
      update public.vouchers set status = 'expired' where id = v_voucher.id;
      return jsonb_build_object('success', false, 'error', 'This voucher expired on ' || v_voucher.expiry_date::text);
    else
      return jsonb_build_object('success', false, 'error', 'This voucher is invalid: missing expiry date.');
    end if;
  end if;

  if v_voucher.value is null or v_voucher.value <= 0.00 then
    return jsonb_build_object('success', false, 'error', 'Voucher record corrupted: invalid value.');
  end if;

  -- 2. Lock user main wallet
  select balance into v_main_balance
  from public.main_wallets
  where user_id = v_caller
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Customer main wallet not found.');
  end if;

  v_new_balance := v_main_balance + v_voucher.value;
  v_tx_ref := 'VCH-CR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  -- 3. Mark voucher redeemed
  update public.vouchers
  set status = 'redeemed',
      redeemer_user_id = v_caller,
      redeemed_at = now(),
      redemption_reference = v_tx_ref
  where id = v_voucher.id;

  -- 4. Credit main wallet
  update public.main_wallets
  set balance = v_new_balance,
      last_activity_at = now(),
      updated_at = now()
  where user_id = v_caller;

  -- 5. Insert immutable ledger entry
  insert into public.main_wallet_ledger (
    user_id,
    reference,
    entry_type,
    source,
    amount,
    balance_before,
    balance_after,
    description,
    metadata
  ) values (
    v_caller,
    v_tx_ref,
    'credit',
    'voucher_redemption',
    v_voucher.value,
    v_main_balance,
    v_new_balance,
    'Voucher redemption credit (' || v_voucher.code_prefix || ')',
    jsonb_build_object('voucher_id', v_voucher.id, 'prefix', v_voucher.code_prefix)
  );

  return jsonb_build_object(
    'success', true,
    'amount', v_voucher.value,
    'new_balance', v_new_balance,
    'reference', v_tx_ref,
    'message', 'Voucher redeemed successfully! ₦' || v_voucher.value::text || ' credited to your main wallet.'
  );
end;
$$;

revoke all on function public.redeem_voucher_atomic(text) from public, anon;
grant execute on function public.redeem_voucher_atomic(text) to authenticated, service_role;

-- ==============================================================================
-- 13. POINTS REDEMPTION & REFUND PROCEDURES
-- ==============================================================================

create or replace function public.redeem_points_atomic(
  p_catalogue_id uuid,
  p_idempotency_key text,
  p_recipient_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_item record;
  v_points_acc record;
  v_new_points integer;
  v_redemption_ref text;
  v_main_balance numeric(14,2);
  v_new_main_balance numeric(14,2);
  v_wallet_tx_ref text;
  v_monthly_claims integer;
  v_existing_record record;
  v_recipient text;
begin
  if v_caller is null then
    return jsonb_build_object('success', false, 'error', 'Unauthenticated: Please log in to redeem points.');
  end if;

  if p_idempotency_key is null or trim(p_idempotency_key) = '' then
    return jsonb_build_object('success', false, 'error', 'Idempotency key required.');
  end if;

  -- 1. Lock user points account FIRST to serialize concurrent requests for this user
  select * into v_points_acc
  from public.points_accounts
  where user_id = v_caller
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Customer points account not found.');
  end if;

  -- 2. Idempotency Check (Evaluated under serialized user lock to prevent race conditions)
  select * into v_existing_record
  from public.points_redemptions
  where user_id = v_caller
    and idempotency_key = p_idempotency_key;

  if found then
    return jsonb_build_object(
      'success', true,
      'is_idempotent_duplicate', true,
      'reference', v_existing_record.reference,
      'status', v_existing_record.status,
      'reward_type', v_existing_record.reward_type
    );
  end if;

  -- 3. Fetch and Validate Catalogue Item
  select * into v_item
  from public.points_redemption_catalogue
  where id = p_catalogue_id and is_active = true
  for share;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Reward offer is currently unavailable or inactive.');
  end if;

  -- Defense-in-depth: Airtime and mobile data redemptions are explicitly disabled pending automated telecom fulfillment integration
  if v_item.reward_type <> 'wallet_cash' then
    return jsonb_build_object(
      'success', false,
      'error', 'Airtime and mobile data point redemptions are temporarily suspended pending automated telecom provider integration. Please select wallet cash credit rewards.'
    );
  end if;

  -- 4. PRE-MUTATION VALIDATIONS: Validate cash amount and main wallet BEFORE any balance deductions
  if v_item.cash_credit_amount is null or v_item.cash_credit_amount <= 0.00 then
    return jsonb_build_object('success', false, 'error', 'Invalid reward configuration: cash credit amount must be greater than zero.');
  end if;

  select balance into v_main_balance
  from public.main_wallets
  where user_id = v_caller
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Customer main wallet not found.');
  end if;

  -- 5. Points balance and monthly limit checks
  if v_points_acc.available_points < v_item.points_required then
    return jsonb_build_object('success', false, 'error', 'Insufficient points balance.');
  end if;

  select count(*) into v_monthly_claims
  from public.points_redemptions
  where user_id = v_caller
    and catalogue_item_id = p_catalogue_id
    and status in ('pending', 'processing', 'completed')
    and created_at >= date_trunc('month', now());

  if v_monthly_claims >= v_item.per_user_monthly_limit then
    return jsonb_build_object(
      'success', false,
      'error', 'Monthly redemption limit reached for this reward (maximum ' || v_item.per_user_monthly_limit || ' per calendar month).'
    );
  end if;

  -- 6. ALL PREREQUISITES VERIFIED: Perform balance deductions and credits atomically
  v_new_points := v_points_acc.available_points - v_item.points_required;
  v_redemption_ref := 'RED-PTS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  -- Deduct Points
  update public.points_accounts
  set available_points = v_new_points,
      lifetime_redeemed = v_points_acc.lifetime_redeemed + v_item.points_required,
      last_activity_at = now(),
      updated_at = now()
  where user_id = v_caller;

  -- Immutable Points Ledger Entry
  insert into public.points_ledger (
    user_id,
    reference,
    entry_type,
    source,
    points,
    balance_before,
    balance_after,
    description,
    metadata
  ) values (
    v_caller,
    v_redemption_ref,
    'debit',
    'cash_redemption',
    v_item.points_required,
    v_points_acc.available_points,
    v_new_points,
    'Redeemed for ' || v_item.title,
    jsonb_build_object('catalogue_id', v_item.id, 'idempotency_key', p_idempotency_key)
  );

  -- Credit Main Wallet
  v_new_main_balance := v_main_balance + v_item.cash_credit_amount;
  v_wallet_tx_ref := 'TX-PTS-CR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  update public.main_wallets
  set balance = v_new_main_balance,
      last_activity_at = now(),
      updated_at = now()
  where user_id = v_caller;

  -- Immutable Wallet Ledger Entry
  insert into public.main_wallet_ledger (
    user_id,
    reference,
    entry_type,
    source,
    amount,
    balance_before,
    balance_after,
    description,
    metadata
  ) values (
    v_caller,
    v_wallet_tx_ref,
    'credit',
    'points_redemption',
    v_item.cash_credit_amount,
    v_main_balance,
    v_new_main_balance,
    'Points redemption cash credit (' || v_item.title || ')',
    jsonb_build_object('points_reference', v_redemption_ref)
  );

  -- Completed Redemption Record
  insert into public.points_redemptions (
    user_id,
    catalogue_item_id,
    reward_type,
    points_deducted,
    status,
    reference,
    idempotency_key,
    reward_reference,
    completed_at
  ) values (
    v_caller,
    v_item.id,
    v_item.reward_type,
    v_item.points_required,
    'completed',
    v_redemption_ref,
    p_idempotency_key,
    v_wallet_tx_ref,
    now()
  );

  return jsonb_build_object(
    'success', true,
    'reference', v_redemption_ref,
    'reward_type', v_item.reward_type,
    'points_deducted', v_item.points_required,
    'cash_credited', v_item.cash_credit_amount,
    'new_points_balance', v_new_points,
    'new_main_balance', v_new_main_balance,
    'message', 'Reward redeemed successfully! ₦' || v_item.cash_credit_amount::text || ' credited to your main wallet.'
  );
end;
$$;

revoke all on function public.redeem_points_atomic(uuid, text, text) from public, anon;
grant execute on function public.redeem_points_atomic(uuid, text, text) to authenticated, service_role;

create or replace function public.fail_and_refund_points_redemption(
  p_redemption_reference text,
  p_failure_reason text default 'Fulfillment failure refund',
  p_provider_response jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_is_super boolean := false;
  v_is_service_role boolean := (
    coalesce(auth.role(), '') = 'service_role' or
    (coalesce(auth.role(), '') = '' and session_user in ('postgres', 'supabase_admin'))
  );
  v_redemption record;
  v_points_acc record;
  v_new_points integer;
begin
  if v_caller is not null then
    select exists (
      select 1 from public.profiles
      where id = v_caller and role = 'super_admin' and is_active = true
    ) into v_is_super;
  end if;

  if not (v_is_super or v_is_service_role) then
    raise exception 'Permission Denied: Only super_admin or verified service_role can execute points redemption refunds.';
  end if;

  -- 1. Lock redemption row for update
  select * into v_redemption
  from public.points_redemptions
  where reference = p_redemption_reference
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Redemption record not found.');
  end if;

  -- Idempotency check: Already reversed/refunded? Single-refund enforcement
  if v_redemption.status = 'reversed' then
    return jsonb_build_object(
      'success', true,
      'is_idempotent_duplicate', true,
      'message', 'Redemption has already been refunded.',
      'reference', v_redemption.reference,
      'status', v_redemption.status
    );
  end if;

  if v_redemption.status not in ('pending', 'failed', 'processing') then
    return jsonb_build_object(
      'success', false,
      'error', 'Cannot refund redemption with status: ' || v_redemption.status
    );
  end if;

  -- 2. Lock user points account for update
  select * into v_points_acc
  from public.points_accounts
  where user_id = v_redemption.user_id
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'User points account not found.');
  end if;

  v_new_points := v_points_acc.available_points + v_redemption.points_deducted;

  -- 3. Restore points balance atomically
  update public.points_accounts
  set available_points = v_new_points,
      lifetime_redeemed = greatest(0, v_points_acc.lifetime_redeemed - v_redemption.points_deducted),
      last_activity_at = now(),
      updated_at = now()
  where user_id = v_redemption.user_id;

  -- 4. Mark redemption reversed (single refund enforcement)
  update public.points_redemptions
  set status = 'reversed',
      failure_reason = p_failure_reason,
      provider_response = coalesce(p_provider_response, '{}'::jsonb),
      completed_at = now()
  where id = v_redemption.id;

  -- 5. Write immutable points ledger credit entry
  insert into public.points_ledger (
    user_id,
    reference,
    entry_type,
    source,
    points,
    balance_before,
    balance_after,
    description,
    metadata
  ) values (
    v_redemption.user_id,
    'REF-PTS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    'credit',
    'points_refund',
    v_redemption.points_deducted,
    v_points_acc.available_points,
    v_new_points,
    'Points refund for ' || p_redemption_reference || ': ' || p_failure_reason,
    jsonb_build_object('redemption_reference', p_redemption_reference, 'original_idempotency_key', v_redemption.idempotency_key)
  );

  -- 6. Audit log
  insert into public.admin_audit_logs (
    admin_user_id, action, target_resource, resource_id, changes
  ) values (
    v_caller, 'refund_points_redemption', 'points_redemptions', v_redemption.id::text,
    jsonb_build_object(
      'reference', p_redemption_reference,
      'points_refunded', v_redemption.points_deducted,
      'reason', p_failure_reason,
      'actor', case when v_is_super then 'super_admin' when coalesce(auth.role(), '') = 'service_role' then 'service_role' else 'direct_db_' || session_user end
    )
  );

  return jsonb_build_object(
    'success', true,
    'message', 'Points refunded successfully.',
    'reference', p_redemption_reference,
    'points_restored', v_redemption.points_deducted,
    'new_points_balance', v_new_points
  );
end;
$$;

revoke all on function public.fail_and_refund_points_redemption(text, text, jsonb) from public, anon, authenticated;
grant execute on function public.fail_and_refund_points_redemption(text, text, jsonb) to service_role;

-- ==============================================================================
-- 14. AUTH TRIGGER PROCEDURE (AUTOMATIC ONBOARDING PROVISIONING)
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  ref_code text;
  sponsor_id uuid;
  v_retries integer := 0;
begin
  -- Generate cryptographically random referral code with collision retry loop (48 bits entropy)
  loop
    v_retries := v_retries + 1;
    ref_code := 'SUB' || upper(encode(gen_random_bytes(6), 'hex'));
    if not exists (select 1 from public.profiles where referral_code = ref_code) then
      exit;
    end if;
    if v_retries >= 10 then
      raise exception 'System Error: Unable to allocate unique referral code after multiple attempts.';
    end if;
  end loop;

  if (new.raw_user_meta_data->>'referral_code') is not null then
    select id into sponsor_id 
    from public.profiles 
    where referral_code = upper(trim(new.raw_user_meta_data->>'referral_code'))
    limit 1;
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    referral_code,
    referred_by
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    'customer',
    ref_code,
    sponsor_id
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  -- Provision initial empty Main Wallet and Bonus Wallet
  insert into public.main_wallets (user_id, balance, daily_limit, spent_today)
  values (new.id, 0.00, 50000.00, 0.00)
  on conflict (user_id) do nothing;

  insert into public.bonus_wallets (user_id, balance, total_earned)
  values (new.id, 0.00, 0.00)
  on conflict (user_id) do nothing;

  -- Provision initial empty Points Account
  insert into public.points_accounts (user_id, available_points, lifetime_earned, lifetime_redeemed)
  values (new.id, 0, 0, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- ==============================================================================
-- 15. ROW LEVEL SECURITY POLICIES & PRIVILEGE LOCKDOWN
-- ==============================================================================

-- Enable RLS on all sensitive tables
alter table public.profiles enable row level security;
alter table public.admin_permissions enable row level security;
alter table public.main_wallets enable row level security;
alter table public.main_wallet_ledger enable row level security;
alter table public.bonus_wallets enable row level security;
alter table public.bonus_wallet_ledger enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.vouchers enable row level security;
alter table public.points_accounts enable row level security;
alter table public.points_ledger enable row level security;
alter table public.points_tasks enable row level security;
alter table public.points_redemption_catalogue enable row level security;
alter table public.points_redemptions enable row level security;

-- Profiles Policies
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

revoke insert, delete on public.profiles from anon, authenticated;

-- Column-Level Privilege Lockdown on profiles
revoke update (
  id,
  created_at,
  role,
  kyc_status,
  kyc_level,
  bvn_hash,
  nin_hash,
  referral_code,
  referred_by,
  transaction_pin_hash,
  transaction_pin_set,
  pin_failed_attempts,
  pin_locked_until
) on public.profiles from anon, authenticated;

-- Admin Permissions Policies
create policy "admin_permissions_select" on public.admin_permissions
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Main Wallets Policies
create policy "main_wallets_select_own" on public.main_wallets
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy "main_ledger_select_own" on public.main_wallet_ledger
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Bonus Wallets Policies
create policy "bonus_wallets_select_own" on public.bonus_wallets
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy "bonus_ledger_select_own" on public.bonus_wallet_ledger
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Admin Audit Logs Policies
create policy "audit_admin_only" on public.admin_audit_logs
  for select to authenticated
  using (public.is_admin());

-- Vouchers Policies
create policy "vouchers_select" on public.vouchers
  for select to authenticated
  using (public.is_admin() or redeemer_user_id = auth.uid());

-- Points Policies
create policy "points_accounts_select_own" on public.points_accounts
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy "points_ledger_select_own" on public.points_ledger
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy "points_tasks_select" on public.points_tasks
  for select to anon, authenticated
  using (is_active = true or public.is_admin());

create policy "points_catalogue_select" on public.points_redemption_catalogue
  for select to anon, authenticated
  using (is_active = true or public.is_admin());

create policy "points_redemptions_select_own" on public.points_redemptions
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Lookup referral sponsor helper
create or replace function public.lookup_referral_sponsor(p_referral_code text)
returns jsonb
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare
  v_norm_code text;
  v_sponsor record;
begin
  if p_referral_code is null or trim(p_referral_code) = '' then
    return jsonb_build_object('found', false);
  end if;

  v_norm_code := upper(trim(p_referral_code));

  select id, full_name, role into v_sponsor
  from public.profiles
  where referral_code = v_norm_code and is_active = true;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'sponsor_id', v_sponsor.id,
    'sponsor_name', v_sponsor.full_name
  );
end;
$$;

revoke all on function public.lookup_referral_sponsor(text) from public;
grant execute on function public.lookup_referral_sponsor(text) to anon, authenticated, service_role;

COMMIT;
