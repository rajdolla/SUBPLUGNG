-- ==============================================================================
-- SUBPLUG PRODUCTION-GRADE SUPABASE ARCHITECTURE
-- Complete DDL, Immutable Ledgers, Hardened RBAC, Security Definer Defenses
-- ==============================================================================
-- 1. Extensions & Primitives
-- 2. Authentication & Profiles (with Granular Protection Trigger)
-- 3. Admin Permissions & Granular RBAC (voucher.create, kyc.verify, etc.)
-- 4. Main Wallet & Immutable Double-Entry Ledger
-- 5. Bonus Wallet & Immutable Double-Entry Ledger
-- 6. Transactions & Idempotency Controls
-- 7. Hardened Voucher System (HMAC-SHA256, Zero Plaintext Storage, Atomic Redemption)
-- 8. Rewards, Cashback & Referral System
-- 9. CMS Content & Telecom Partners
-- 10. Admin Audit Logs & Resolution Center
-- 11. Payment Webhooks & Virtual Accounts
-- 12. VTU Provider Switches & Failovers
-- 13. SUBPLUG Points Loyalty System (Decoupled Points Ledger & Provider Fulfilment Lifecycle)
-- 14. Row Level Security (RLS) & Zero-Trust Function Privilege Enforcements
-- ==============================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. AUTHENTICATION & PROFILES (with RBAC and KYC Level)
-- ==============================================================================

create type public.user_role as enum ('customer', 'vendor', 'reseller', 'support_agent', 'admin', 'super_admin');
create type public.kyc_status as enum ('not_started', 'pending', 'verified', 'rejected', 'needs_more_info');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  kyc_status public.kyc_status not null default 'not_started',
  kyc_level smallint not null default 0 check (kyc_level between 0 and 2),
  bvn_hash text,
  nin_hash text,
  transaction_pin_hash text,
  transaction_pin_set boolean not null default false,
  pin_failed_attempts integer not null default 0 check (pin_failed_attempts >= 0),
  pin_locked_until timestamptz,
  referral_code text unique,
  referred_by uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_transaction_pin_state check (
    (transaction_pin_set = false and transaction_pin_hash is null) or
    (transaction_pin_set = true and transaction_pin_hash is not null and length(transaction_pin_hash) >= 20)
  )
);

-- ==============================================================================
-- 3. ADMIN PERMISSIONS & GRANULAR RBAC
-- ==============================================================================

create table if not exists public.admin_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  permission text not null check (permission in (
    'voucher.create',
    'voucher.cancel',
    'kyc.verify',
    'cms.publish',
    'funds.adjust',
    'roles.manage'
  )),
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamptz not null default now(),
  constraint uq_admin_permission unique(user_id, permission)
);

create index if not exists idx_admin_perm_user on public.admin_permissions(user_id);

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
$$;

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
$$;

-- Explicit permission checker: verifies whether caller holds specific permission or is super_admin
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
$$;

-- Grant permission procedure (callable only by active super_admin)
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

-- Revoke permission procedure (callable only by active super_admin)
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

-- ==============================================================================
-- IMMUTABLE LEDGER GUARDS
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

-- ==============================================================================
-- 4. MAIN WALLET & IMMUTABLE DOUBLE-ENTRY LEDGER
-- ==============================================================================

create table if not exists public.main_wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance numeric(14,2) not null default 0.00 check (balance >= 0.00),
  daily_limit numeric(14,2) not null default 50000.00 check (daily_limit >= 0.00),
  spent_today numeric(14,2) not null default 0.00 check (spent_today >= 0.00),
  last_activity_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.ledger_entry_type as enum ('credit', 'debit');

create table if not exists public.main_wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null unique,
  entry_type public.ledger_entry_type not null,
  source text not null,
  amount numeric(14,2) not null check (amount > 0.00),
  balance_before numeric(14,2) not null check (balance_before >= 0.00),
  balance_after numeric(14,2) not null check (balance_after >= 0.00),
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_main_ledger_user on public.main_wallet_ledger(user_id, created_at desc);

drop trigger if exists trg_prevent_main_ledger_mod on public.main_wallet_ledger;
create trigger trg_prevent_main_ledger_mod
  before update or delete on public.main_wallet_ledger
  for each row execute function public.prevent_immutable_ledger_modifications();

-- ==============================================================================
-- 5. BONUS WALLET & IMMUTABLE DOUBLE-ENTRY LEDGER
-- ==============================================================================

create table if not exists public.bonus_wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance numeric(14,2) not null default 0.00 check (balance >= 0.00),
  total_earned numeric(14,2) not null default 0.00 check (total_earned >= 0.00),
  last_activity_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bonus_wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null unique,
  entry_type public.ledger_entry_type not null,
  source text not null,
  amount numeric(14,2) not null check (amount > 0.00),
  balance_before numeric(14,2) not null check (balance_before >= 0.00),
  balance_after numeric(14,2) not null check (balance_after >= 0.00),
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_bonus_ledger_user on public.bonus_wallet_ledger(user_id, created_at desc);

drop trigger if exists trg_prevent_bonus_ledger_mod on public.bonus_wallet_ledger;
create trigger trg_prevent_bonus_ledger_mod
  before update or delete on public.bonus_wallet_ledger
  for each row execute function public.prevent_immutable_ledger_modifications();

-- Trigger on profiles to protect sensitive fields from escalation
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

  -- 8. TRANSACTION PIN CREDENTIAL & LOCKOUT GUARDS
  if (new.transaction_pin_hash is distinct from old.transaction_pin_hash) or
     (new.transaction_pin_set is distinct from old.transaction_pin_set) or
     (new.pin_failed_attempts is distinct from old.pin_failed_attempts) or
     (new.pin_locked_until is distinct from old.pin_locked_until) then
    -- State consistency invariant: reject invalid or orphaned state
    if (new.transaction_pin_set = true and (new.transaction_pin_hash is null or length(trim(new.transaction_pin_hash)) < 20)) or
       (new.transaction_pin_set = false and new.transaction_pin_hash is not null) then
      raise exception 'Security Violation: Inconsistent transaction PIN state. When PIN is set, valid hash is required; when unset, hash must be null.';
    end if;

    -- Reject direct client updates: only authorized internal procedures, super_admin, or service_role permitted
    if current_setting('subplug.internal_pin_token', true) is distinct from 'authorized_internal_pin_change' and
       not v_is_super and
       not v_is_service_role then
      raise exception 'Security Violation: Direct client mutation of transaction PIN credentials or lockout state is prohibited. Use initialize_transaction_pin or change_transaction_pin.';
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_fields on public.profiles;
create trigger trg_protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- Column-Level Privilege Lockdown: Physically deny direct client updates to protected fields
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
  is_active,
  transaction_pin_hash,
  transaction_pin_set,
  pin_failed_attempts,
  pin_locked_until
) on public.profiles from anon, authenticated;

-- 1. Initial Transaction PIN Setup Procedure (Callable ONLY when PIN is not yet configured)
create or replace function public.initialize_transaction_pin(
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
  v_hashed_new text;
begin
  if v_caller is null then
    return jsonb_build_object('success', false, 'error', 'Unauthenticated: Valid session required.');
  end if;

  if p_new_pin is null or length(trim(p_new_pin)) <> 4 or p_new_pin !~ '^[0-9]{4}$' then
    return jsonb_build_object('success', false, 'error', 'Transaction PIN must consist of exactly 4 numeric digits.');
  end if;

  select * into v_profile
  from public.profiles
  where id = v_caller
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Profile not found.');
  end if;

  -- Strictly reject if PIN is already configured
  if v_profile.transaction_pin_set or v_profile.transaction_pin_hash is not null then
    return jsonb_build_object('success', false, 'error', 'Transaction PIN is already configured. Use change_transaction_pin to update your PIN.');
  end if;

  v_hashed_new := crypt(p_new_pin, gen_salt('bf', 10));

  perform set_config('subplug.internal_pin_token', 'authorized_internal_pin_change', true);

  update public.profiles
  set transaction_pin_hash = v_hashed_new,
      transaction_pin_set = true,
      pin_failed_attempts = 0,
      pin_locked_until = null,
      updated_at = now()
  where id = v_caller;

  perform set_config('subplug.internal_pin_token', '', true);

  return jsonb_build_object('success', true, 'message', 'Transaction PIN initialized successfully.');
end;
$$;

revoke all on function public.initialize_transaction_pin(text) from public, anon;
grant execute on function public.initialize_transaction_pin(text) to authenticated, service_role;

-- 2. Transaction PIN Change Procedure (Enforces current PIN verification & lockout)
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
  v_hashed_new text;
  v_attempts integer;
begin
  if v_caller is null then
    return jsonb_build_object('success', false, 'error', 'Unauthenticated: Valid session required.');
  end if;

  if p_new_pin is null or length(trim(p_new_pin)) <> 4 or p_new_pin !~ '^[0-9]{4}$' then
    return jsonb_build_object('success', false, 'error', 'New transaction PIN must consist of exactly 4 numeric digits.');
  end if;

  if p_current_pin is null or trim(p_current_pin) = '' then
    return jsonb_build_object('success', false, 'error', 'Current transaction PIN is required.');
  end if;

  select * into v_profile
  from public.profiles
  where id = v_caller
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Profile not found.');
  end if;

  if not v_profile.transaction_pin_set or v_profile.transaction_pin_hash is null then
    return jsonb_build_object('success', false, 'error', 'Transaction PIN is not yet configured. Use initialize_transaction_pin first.');
  end if;

  -- Lockout verification: check if account is currently locked out
  if v_profile.pin_locked_until is not null and v_profile.pin_locked_until > now() then
    return jsonb_build_object(
      'success', false,
      'error', 'Transaction PIN is temporarily locked due to excessive failed attempts. Please try again after ' || to_char(v_profile.pin_locked_until, 'YYYY-MM-DD HH24:MI:SS UTC') || '.'
    );
  end if;

  -- Safe crypt comparison: fail closed on NULLs or mismatched hashes
  if v_profile.transaction_pin_hash is null or
     length(trim(v_profile.transaction_pin_hash)) < 20 or
     crypt(p_current_pin, v_profile.transaction_pin_hash) is distinct from v_profile.transaction_pin_hash then

    v_attempts := coalesce(v_profile.pin_failed_attempts, 0) + 1;

    perform set_config('subplug.internal_pin_token', 'authorized_internal_pin_change', true);

    if v_attempts >= 5 then
      -- Trigger 30-minute lockout on 5 consecutive failures
      update public.profiles
      set pin_failed_attempts = 0,
          pin_locked_until = now() + interval '30 minutes',
          updated_at = now()
      where id = v_caller;

      perform set_config('subplug.internal_pin_token', '', true);

      return jsonb_build_object(
        'success', false,
        'error', 'Incorrect current transaction PIN. Too many failed attempts: your PIN is locked for 30 minutes.'
      );
    else
      update public.profiles
      set pin_failed_attempts = v_attempts,
          updated_at = now()
      where id = v_caller;

      perform set_config('subplug.internal_pin_token', '', true);

      return jsonb_build_object(
        'success', false,
        'error', 'Incorrect current transaction PIN. ' || (5 - v_attempts)::text || ' attempt(s) remaining before temporary lockout.'
      );
    end if;
  end if;

  -- Verification succeeded: reset failed attempts, update hash
  v_hashed_new := crypt(p_new_pin, gen_salt('bf', 10));

  perform set_config('subplug.internal_pin_token', 'authorized_internal_pin_change', true);

  update public.profiles
  set transaction_pin_hash = v_hashed_new,
      transaction_pin_set = true,
      pin_failed_attempts = 0,
      pin_locked_until = null,
      updated_at = now()
  where id = v_caller;

  perform set_config('subplug.internal_pin_token', '', true);

  return jsonb_build_object('success', true, 'message', 'Transaction PIN changed successfully.');
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
  -- Genuine service_role session check: In PostgREST / Supabase, auth.role() returns the JWT role claim ('service_role').
  -- When invoked from direct SQL (migrations / psql as postgres/supabase_admin), session_user is the initial database connection role.
  -- CRITICAL SECURITY DEFINER GUARD: Never check current_user, because current_user inside a SECURITY DEFINER
  -- function owned by postgres evaluates to 'postgres' for ANY caller, causing critical privilege escalation!
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
declare
  v_caller uuid := auth.uid();
  v_pin_set boolean;
begin
  if v_caller is null then
    return jsonb_build_object('success', false, 'error', 'Unauthenticated: Valid session required.');
  end if;

  select transaction_pin_set into v_pin_set
  from public.profiles
  where id = v_caller;

  if coalesce(v_pin_set, false) = false then
    return public.initialize_transaction_pin(p_new_pin);
  else
    return public.change_transaction_pin(p_current_pin, p_new_pin);
  end if;
end;
$$;

revoke all on function public.set_transaction_pin_atomic(text, text) from public, anon;
grant execute on function public.set_transaction_pin_atomic(text, text) to authenticated, service_role;

-- ==============================================================================
-- 6. TRANSACTIONS & SERVICE DISPATCH
-- ==============================================================================

create type public.transaction_status as enum ('pending', 'processing', 'successful', 'failed', 'reversed');
create type public.service_category as enum ('airtime', 'data', 'electricity', 'cable', 'bulk_sms', 'airtime_cash', 'data_pins', 'exam_pins', 'recharge_card', 'wallet_funding');

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null unique,
  idempotency_key text unique,
  service_category public.service_category not null,
  provider_name text not null,
  provider_reference text,
  amount numeric(14,2) not null check (amount > 0),
  fee numeric(14,2) not null default 0.00,
  cashback_awarded numeric(14,2) not null default 0.00,
  recipient text not null,
  status public.transaction_status not null default 'pending',
  provider_response jsonb not null default '{}'::jsonb,
  customer_note text,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tx_user_created on public.transactions(user_id, created_at desc);
create index if not exists idx_tx_status on public.transactions(status);
create index if not exists idx_tx_provider_ref on public.transactions(provider_reference);

-- ==============================================================================
-- 7. VOUCHER SYSTEM (Zero Plaintext Storage, HMAC Hashing, Single-Use)
-- ==============================================================================

create type public.voucher_status as enum ('unused', 'redeemed', 'expired', 'cancelled');

-- Dynamically retrieve voucher HMAC pepper from Supabase Vault or database configuration setting
-- Strictly raises exception if not configured with >= 32 characters (256 bits).
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
  -- Defense-in-depth: Never allow untrusted client roles to execute this secret helper directly.
  -- Inside an authorized SECURITY DEFINER procedure (e.g. redeem_voucher_atomic),
  -- current_user evaluates to the definer (postgres), allowing internal nested execution
  -- without exposing the pepper or allowing direct client invocation from anon or authenticated.
  if current_user in ('anon', 'authenticated') then
    raise exception 'Access Denied: Direct invocation of get_voucher_salt is strictly prohibited.';
  end if;

  -- Priority 1: Supabase Vault (if extension available)
  -- Accessible only by SECURITY DEFINER / postgres role; blocked from anon/authenticated
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
      -- vault table not accessible or unconfigured
    end;
  end if;

  -- Priority 2: Database Parameter (app.settings.voucher_pepper)
  -- Configured via: ALTER DATABASE postgres SET "app.settings.voucher_pepper" = '<secure-entropy>';
  v_secret := current_setting('app.settings.voucher_pepper', true);
  if v_secret is not null and length(trim(v_secret)) >= 32 then
    return trim(v_secret);
  end if;

  -- HARDENED DEFENSE: Strictly prohibit hardcoded or deterministic fallback secrets in code.
  raise exception 'Cryptographic Configuration Failure: Voucher HMAC pepper is not configured or does not meet minimum entropy requirements (minimum 32 characters / 256 bits). Configure vault.decrypted_secrets or database setting app.settings.voucher_pepper.';
end;
$$;

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

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  code_prefix text not null, -- Masked display: e.g. 'SUB-5000-****-8172'
  value numeric(14,2) not null check (value > 0),
  status public.voucher_status not null default 'unused',
  expiry_date timestamptz not null,
  batch_id text not null,
  source text not null check (source in ('purchase', 'promotion', 'admin_generation', 'support_resolution')),
  destination_wallet text not null default 'main' check (destination_wallet = 'main'),
  redeemer_user_id uuid references public.profiles(id) on delete set null,
  redeemed_at timestamptz,
  redemption_reference text unique,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_vouchers_status on public.vouchers(status);
create index if not exists idx_vouchers_redeemer on public.vouchers(redeemer_user_id);
create unique index if not exists idx_vouchers_code_hash_unique on public.vouchers(code_hash);

-- Atomic Batch Voucher Generation Procedure
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
      
      -- Format code: PREFIX-VALUE-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX (using all 32 hex chars)
      v_raw_code := upper(trim(p_prefix)) || '-' || p_value::integer || '-' ||
                    substr(v_rand_hex, 1, 4) || '-' ||
                    substr(v_rand_hex, 5, 4) || '-' ||
                    substr(v_rand_hex, 9, 4) || '-' ||
                    substr(v_rand_hex, 13, 4) || '-' ||
                    substr(v_rand_hex, 17, 4) || '-' ||
                    substr(v_rand_hex, 21, 4) || '-' ||
                    substr(v_rand_hex, 25, 4) || '-' ||
                    substr(v_rand_hex, 29, 4);

      v_code_hash := public.hash_voucher_code(v_raw_code);

      if not exists (select 1 from public.vouchers where code_hash = v_code_hash) then
        exit;
      end if;

      v_collision_retries := v_collision_retries + 1;
      if v_collision_retries >= 5 then
        raise exception 'Voucher generation collision threshold exceeded. Aborting batch.';
      end if;
    end loop;

    v_masked := upper(trim(p_prefix)) || '-' || p_value::integer || '-****-****-****-****-****-****-****-' || substr(v_rand_hex, 29, 4);

    insert into public.vouchers (
      code_hash,
      code_prefix,
      value,
      status,
      expiry_date,
      batch_id,
      source,
      destination_wallet,
      created_by
    ) values (
      v_code_hash,
      v_masked,
      p_value,
      'unused',
      v_expiry,
      v_batch_id,
      'admin_generation',
      'main',
      v_caller
    );

    v_result_vouchers := v_result_vouchers || jsonb_build_object(
      'code', v_raw_code,
      'masked_code', v_masked,
      'value', p_value,
      'expiry_date', v_expiry,
      'batch_id', v_batch_id
    );
  end loop;

  -- Append-only audit log
  insert into public.admin_audit_logs (
    admin_user_id, action, target_resource, resource_id, changes
  ) values (
    v_caller, 'generate_vouchers_batch', 'vouchers', v_batch_id,
    jsonb_build_object(
      'batch_id', v_batch_id,
      'count', p_count,
      'unit_value', p_value,
      'total_value', p_count * p_value,
      'expiry_date', v_expiry,
      'prefix', p_prefix
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

-- Atomic Voucher Redemption Procedure (Strictly Session-Derived Identity)
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
  -- Strictly enforce authenticated session
  if v_caller is null then
    return jsonb_build_object('success', false, 'error', 'Unauthenticated: Please log in to redeem vouchers.');
  end if;

  if p_code is null or trim(p_code) = '' then
    return jsonb_build_object('success', false, 'error', 'Please provide a valid voucher code.');
  end if;

  -- Consistent normalization: uppercase and trimmed
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
    'Voucher ' || v_voucher.code_prefix || ' funding credit',
    jsonb_build_object('voucher_id', v_voucher.id, 'batch_id', v_voucher.batch_id)
  );

  return jsonb_build_object(
    'success', true,
    'amount', v_voucher.value,
    'reference', v_tx_ref,
    'new_balance', v_new_balance,
    'message', 'Voucher redeemed successfully! ₦' || v_voucher.value::text || ' credited to Main Wallet.'
  );
end;
$$;

-- ==============================================================================
-- 8. REWARDS, CASHBACK & REFERRAL SYSTEM
-- ==============================================================================

create table if not exists public.cashback_rules (
  id uuid primary key default gen_random_uuid(),
  service_category public.service_category not null,
  percentage numeric(5,2) not null check (percentage >= 0 and percentage <= 100),
  min_transaction numeric(14,2) not null default 0.00,
  max_cashback numeric(14,2) not null default 1000.00,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.referral_rules (
  id uuid primary key default gen_random_uuid(),
  referrer_bonus numeric(14,2) not null default 100.00,
  referee_bonus numeric(14,2) not null default 50.00,
  min_funding_required numeric(14,2) not null default 1000.00,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 9. CMS CONTENT & TELECOM PARTNERS
-- ==============================================================================

create table if not exists public.cms_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_type text not null,
  is_active boolean not null default true,
  status_note text,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 10. ADMIN AUDIT LOGS & RESOLUTION CENTER
-- ==============================================================================

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

drop trigger if exists trg_prevent_audit_logs_mod on public.admin_audit_logs;
create trigger trg_prevent_audit_logs_mod
  before update or delete on public.admin_audit_logs
  for each row execute function public.prevent_immutable_ledger_modifications();

create type public.ticket_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');

create table if not exists public.resolution_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  transaction_reference text,
  category text not null,
  priority public.ticket_priority not null default 'medium',
  status public.ticket_status not null default 'open',
  subject text not null,
  description text not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- 11. PAYMENT WEBHOOKS & VIRTUAL ACCOUNTS
-- ==============================================================================

create table if not exists public.virtual_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bank_name text not null,
  account_number text not null,
  account_name text not null,
  provider text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  event_reference text not null unique,
  payload jsonb not null default '{}'::jsonb,
  is_processed boolean not null default false,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 12. VTU PROVIDER SWITCHES
-- ==============================================================================

create table if not exists public.provider_switches (
  service_category public.service_category primary key,
  primary_provider text not null,
  secondary_provider text,
  auto_failover_enabled boolean not null default true,
  failure_threshold integer not null default 3,
  consecutive_failures integer not null default 0,
  active_provider text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 13. SUBPLUG POINTS LOYALTY SYSTEM (DECOUPLED LEDGER & PROVIDER LIFECYCLE)
-- ==============================================================================

create table if not exists public.points_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  available_points integer not null default 0 check (available_points >= 0),
  lifetime_earned integer not null default 0 check (lifetime_earned >= 0),
  lifetime_redeemed integer not null default 0 check (lifetime_redeemed >= 0),
  last_activity_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create index if not exists idx_points_ledger_user on public.points_ledger(user_id, created_at desc);

drop trigger if exists trg_prevent_points_ledger_mod on public.points_ledger;
create trigger trg_prevent_points_ledger_mod
  before update or delete on public.points_ledger
  for each row execute function public.prevent_immutable_ledger_modifications();

create table if not exists public.points_tasks (
  id uuid primary key default gen_random_uuid(),
  task_code text not null unique,
  title text not null,
  description text not null,
  points_reward integer not null check (points_reward > 0),
  action_type text not null check (action_type in ('daily_login', 'first_wallet_funding', 'first_utility_bill', 'referral_completion', 'profile_kyc_tier_1', 'review_submission')),
  per_user_limit integer not null default 1 check (per_user_limit >= 1),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

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

-- Automatic new user handler
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

-- Atomic Points Redemption Procedure (Concurrency Safe & Normalized)
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

  if v_points_acc.available_points < v_item.points_required then
    return jsonb_build_object('success', false, 'error', 'Insufficient points balance.');
  end if;

  -- 4. Monthly per-user limit check (Evaluated AFTER row lock to prevent race conditions)
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

  v_new_points := v_points_acc.available_points - v_item.points_required;
  v_redemption_ref := 'RED-PTS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  -- 5. Deduct Points & Update Account
  update public.points_accounts
  set available_points = v_new_points,
      lifetime_redeemed = v_points_acc.lifetime_redeemed + v_item.points_required,
      last_activity_at = now(),
      updated_at = now()
  where user_id = v_caller;

  -- 6. Write Points Ledger Entry (Immutable Debit)
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
    case
      when v_item.reward_type = 'wallet_cash' then 'cash_redemption'
      when v_item.reward_type = 'airtime' then 'airtime_redemption'
      else 'data_redemption'
    end,
    v_item.points_required,
    v_points_acc.available_points,
    v_new_points,
    'Redeemed for ' || v_item.title,
    jsonb_build_object('catalogue_id', v_item.id, 'idempotency_key', p_idempotency_key)
  );

  select coalesce(p_recipient_phone, phone, '') into v_recipient
  from public.profiles
  where id = v_caller;

  -- 7. Reward Fulfillment Strategy
  if v_item.reward_type = 'wallet_cash' then
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

    v_new_main_balance := v_main_balance + v_item.cash_credit_amount;
    v_wallet_tx_ref := 'TX-PTS-CR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

    update public.main_wallets
    set balance = v_new_main_balance,
        last_activity_at = now(),
        updated_at = now()
    where user_id = v_caller;

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
      'status', 'completed',
      'reference', v_redemption_ref,
      'remaining_points', v_new_points,
      'reward_type', v_item.reward_type,
      'credited_amount', v_item.cash_credit_amount
    );
  else
    insert into public.points_redemptions (
      user_id,
      catalogue_item_id,
      reward_type,
      points_deducted,
      status,
      reference,
      idempotency_key,
      recipient_phone,
      metadata
    ) values (
      v_caller,
      v_item.id,
      v_item.reward_type,
      v_item.points_required,
      'pending',
      v_redemption_ref,
      p_idempotency_key,
      v_recipient,
      jsonb_build_object('network', v_item.network, 'data_plan', v_item.data_plan_name)
    );

    return jsonb_build_object(
      'success', true,
      'status', 'pending',
      'reference', v_redemption_ref,
      'remaining_points', v_new_points,
      'reward_type', v_item.reward_type,
      'message', 'Points deducted. External telecom delivery is pending provider fulfillment.'
    );
  end if;
end;
$$;

-- Provider Fulfilment Confirmation Procedure (SECURITY GATE: DISABLED)
-- External telecom provider webhook cryptographic signature verification is not yet implemented.
create or replace function public.confirm_points_fulfilment(
  p_redemption_reference text,
  p_provider_reference text,
  p_provider_response jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- CRITICAL DEFENSE: External telecom provider webhook cryptographic signature verification
  -- and provider event replay prevention are not yet implemented in database procedures.
  -- As required by the security gate, provider fulfilment is disabled to prevent forged state transitions.
  raise exception 'Security Gate: confirm_points_fulfilment is disabled pending implementation of cryptographic provider webhook signature verification and isolated staging audit.';
end;
$$;

-- Provider Fulfilment Failure & Safe Points Refund Procedure (SECURITY GATE: DISABLED)
-- External telecom provider webhook cryptographic signature verification is not yet implemented.
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
    'status', 'reversed',
    'reference', p_redemption_reference,
    'points_refunded', v_redemption.points_deducted,
    'available_points', v_new_points,
    'message', 'Points restored and ledger updated atomically.'
  );
end;
$$;

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES & FUNCTION GRANTS ENFORCEMENT
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.admin_permissions enable row level security;
alter table public.main_wallets enable row level security;
alter table public.main_wallet_ledger enable row level security;
alter table public.bonus_wallets enable row level security;
alter table public.bonus_wallet_ledger enable row level security;
alter table public.points_accounts enable row level security;
alter table public.points_ledger enable row level security;
alter table public.points_tasks enable row level security;
alter table public.points_redemption_catalogue enable row level security;
alter table public.points_redemptions enable row level security;
alter table public.transactions enable row level security;
alter table public.vouchers enable row level security;
alter table public.cashback_rules enable row level security;
alter table public.referral_rules enable row level security;
alter table public.cms_content enable row level security;
alter table public.partners enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.resolution_tickets enable row level security;
alter table public.virtual_accounts enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.provider_switches enable row level security;
alter table public.notifications enable row level security;

-- Profiles Policies
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

-- Admin Permissions Policies
create policy "admin_permissions_select" on public.admin_permissions for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- Main Wallet (Read own only, NO client mutations)
create policy "main_wallets_select_own" on public.main_wallets for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "main_ledger_select_own" on public.main_wallet_ledger for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- Bonus Wallet (Read own only, NO client mutations)
create policy "bonus_wallets_select_own" on public.bonus_wallets for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "bonus_ledger_select_own" on public.bonus_wallet_ledger for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- Points Accounts & Ledger (Read own only, NO client mutations)
create policy "points_accounts_select_own" on public.points_accounts for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "points_ledger_select_own" on public.points_ledger for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- Points Tasks & Catalogue (Public read active, Admin manages all)
create policy "points_tasks_select" on public.points_tasks for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "points_tasks_admin_all" on public.points_tasks for all to authenticated using (public.is_admin());

create policy "points_catalogue_select" on public.points_redemption_catalogue for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "points_catalogue_admin_all" on public.points_redemption_catalogue for all to authenticated using (public.is_admin());

-- Points Redemptions (Read own only, Admin reads all)
create policy "points_redemptions_select_own" on public.points_redemptions for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- Transactions (Read own only, NO client updates)
create policy "transactions_select_own" on public.transactions for select to authenticated using (auth.uid() = user_id or public.is_admin());

-- Vouchers (Users see their redeemed vouchers; admins see masked vouchers; NO direct client mutations)
create policy "vouchers_select" on public.vouchers for select to authenticated using (public.is_admin() or redeemer_user_id = auth.uid());

-- CMS & Partners (Public Read, Admin Write)
create policy "cms_content_public_read" on public.cms_content for select to anon, authenticated using (true);
create policy "cms_content_admin_manage" on public.cms_content for all to authenticated using (public.is_admin());

create policy "partners_public_read" on public.partners for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "partners_admin_manage" on public.partners for all to authenticated using (public.is_admin());

-- Resolution Tickets (Customer reads/submits own, Admin manages all)
create policy "tickets_select_own" on public.resolution_tickets for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "tickets_insert_own" on public.resolution_tickets for insert to authenticated with check (auth.uid() = user_id);
create policy "tickets_admin_manage" on public.resolution_tickets for update to authenticated using (public.is_admin());

-- Notifications
create policy "notif_select_own" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "notif_update_own" on public.notifications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admin Audit Logs (Admin read only)
create policy "audit_admin_only" on public.admin_audit_logs for select to authenticated using (public.is_admin());

-- Rules & Switches
create policy "cashback_rules_read" on public.cashback_rules for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "referral_rules_read" on public.referral_rules for select to anon, authenticated using (is_active = true or public.is_admin());

-- Explicit Table Grants Revocations to Defend Financial Ledgers and Vouchers Against Direct Manipulation
revoke insert, delete, truncate on public.profiles from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.vouchers from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.main_wallets from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.main_wallet_ledger from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.bonus_wallets from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.bonus_wallet_ledger from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_ledger from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_accounts from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.points_redemptions from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.admin_permissions from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.admin_audit_logs from public, anon, authenticated;

-- Safe public referral validation routine (zero internal UUID disclosure, zero PII/KYC/financial exposure)
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
  v_display_name text;
begin
  if p_referral_code is null or trim(p_referral_code) = '' then
    return jsonb_build_object('valid', false, 'sponsor_name', null);
  end if;

  v_norm_code := upper(trim(p_referral_code));

  -- Format guard: strictly alphanumeric between 4 and 20 characters
  if length(v_norm_code) < 4 or length(v_norm_code) > 20 or v_norm_code !~ '^[A-Z0-9_-]+$' then
    return jsonb_build_object('valid', false, 'sponsor_name', null);
  end if;

  select full_name into v_sponsor
  from public.profiles
  where referral_code = v_norm_code and is_active = true
  limit 1;

  if not found then
    return jsonb_build_object('valid', false, 'sponsor_name', null);
  end if;

  -- Mask name to avoid disclosing full legal identity (e.g. "John D.")
  v_display_name := split_part(v_sponsor.full_name, ' ', 1);
  if split_part(v_sponsor.full_name, ' ', 2) <> '' then
    v_display_name := v_display_name || ' ' || substr(split_part(v_sponsor.full_name, ' ', 2), 1, 1) || '.';
  end if;

  -- Zero internal UUID disclosure, zero PII, zero financial or KYC data exposed
  return jsonb_build_object(
    'valid', true,
    'sponsor_name', v_display_name
  );
end;
$$;

-- ==============================================================================
-- POSTGRESQL FUNCTION GRANTS AUDIT & ZERO-TRUST PRIVILEGE ENFORCEMENT
-- ==============================================================================
-- Eliminate PostgreSQL's default PUBLIC EXECUTE privilege on all security definer functions:
-- Revoke ALL from PUBLIC, anon, and authenticated; then grant minimum necessary access.

-- 1. Internal Cryptographic / Secret Helpers (Zero Public Access)
revoke all on function public.get_voucher_salt() from public, anon, authenticated;
grant execute on function public.get_voucher_salt() to service_role;

revoke all on function public.hash_voucher_code(text) from public, anon, authenticated;
grant execute on function public.hash_voucher_code(text) to service_role;

-- 2. Provider Webhook / External Fulfilment Procedures
revoke all on function public.confirm_points_fulfilment(text, text, jsonb) from public, anon, authenticated;

revoke all on function public.fail_and_refund_points_redemption(text, text, jsonb) from public, anon;
grant execute on function public.fail_and_refund_points_redemption(text, text, jsonb) to authenticated, service_role;

-- 3. Super Admin Administrative RBAC Procedures
revoke all on function public.grant_admin_permission(uuid, text) from public, anon;
grant execute on function public.grant_admin_permission(uuid, text) to authenticated, service_role;

revoke all on function public.revoke_admin_permission(uuid, text) from public, anon;
grant execute on function public.revoke_admin_permission(uuid, text) to authenticated, service_role;

-- 4. Voucher Batch Generation RPC (Designated Voucher Manager / Super Admin)
revoke all on function public.generate_vouchers_batch_atomic(integer, numeric, integer, text) from public, anon;
grant execute on function public.generate_vouchers_batch_atomic(integer, numeric, integer, text) to authenticated, service_role;

-- 5. Customer Self-Service Atomic RPCs (Authenticated Sessions Only)
revoke all on function public.redeem_voucher_atomic(text) from public, anon;
grant execute on function public.redeem_voucher_atomic(text) to authenticated, service_role;

revoke all on function public.redeem_points_atomic(uuid, text, text) from public, anon;
grant execute on function public.redeem_points_atomic(uuid, text, text) to authenticated, service_role;

revoke all on function public.initialize_transaction_pin(text) from public, anon;
grant execute on function public.initialize_transaction_pin(text) to authenticated, service_role;

revoke all on function public.change_transaction_pin(text, text) from public, anon;
grant execute on function public.change_transaction_pin(text, text) to authenticated, service_role;

revoke all on function public.reset_transaction_pin_admin(uuid, text) from public, anon;
grant execute on function public.reset_transaction_pin_admin(uuid, text) to authenticated, service_role;

revoke all on function public.set_transaction_pin_atomic(text, text) from public, anon;
grant execute on function public.set_transaction_pin_atomic(text, text) to authenticated, service_role;

-- 6. Helper Role Verification Functions (Authenticated & Service Role)
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

revoke all on function public.is_super_admin() from public, anon;
grant execute on function public.is_super_admin() to authenticated, service_role;

revoke all on function public.has_admin_permission(uuid, text) from public, anon, authenticated;
grant execute on function public.has_admin_permission(uuid, text) to service_role;

revoke all on function public.lookup_referral_sponsor(text) from public, anon;
grant execute on function public.lookup_referral_sponsor(text) to authenticated, service_role;

-- 7. Internal Trigger Functions
revoke all on function public.prevent_immutable_ledger_modifications() from public, anon, authenticated;
revoke all on function public.protect_profile_fields() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
