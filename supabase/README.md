# SUBPLUG Production Supabase Architecture & Security Specification

This document details the production-grade, hardened Supabase database architecture for SUBPLUG, incorporating zero-trust privilege boundaries, immutable financial ledgers, granular admin permissions, cryptographic voucher storage, race-condition-safe points redemption, and secure external provider fulfilment.

---

## 1. Migration Overview & State Integrity

* **Migration Status:** The additive migration script `supabase/migrations/20261009_harden_security_and_rbac.sql` and the baseline definition `supabase/schema.sql` are finalized and staged for review.
* **Non-Execution Notice:** **No SQL has been executed against Supabase** during this audit and remediation gate. The live Supabase database remains untouched.
* **Preservation of Earlier Foundation:** All table schemas, foreign key references, and user records established during the initial database foundation are preserved. The migration is strictly additive and non-destructive.
* **Gate Recommendation:** **`BLOCK MIGRATION`** until isolated staging review, Supabase Vault provisioning, and external provider webhook HMAC verification are completed.

---

## 2. PostgreSQL Function Grants & Zero-Trust Privilege Matrix

### A. The PostgreSQL Default `PUBLIC EXECUTE` Hazard
In PostgreSQL, whenever a function is created with `CREATE OR REPLACE FUNCTION ...`, execution privilege (`EXECUTE`) is automatically granted to the pseudo-role `PUBLIC` by default. Because all PostgreSQL roles—including `anon` and `authenticated` in Supabase—are members of `PUBLIC`, attempting to secure a function solely by executing `REVOKE ... FROM anon, authenticated;` leaves the function executable by any client via `PUBLIC` inheritance.

To establish true zero-trust boundaries:
1. Every sensitive function explicitly executes:
   ```sql
   REVOKE ALL ON FUNCTION <func> FROM PUBLIC, anon, authenticated;
   ```
2. Execution is then explicitly granted **only** to the minimum required roles (`service_role` or `authenticated`).

### B. Security Definer Function Inventory & Effective Grant Matrix

| Function Name | Definer Context | Intended Execution Caller | Revoked Roles | Granted Roles | Security Defenses Inside Routine |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `get_voucher_salt()` | `SECURITY DEFINER` | Internal helper / `service_role` | `PUBLIC`, `anon`, `authenticated` | `service_role` | Reads Vault / parameter; raises exception if entropy < 32 chars; no hardcoded fallback. |
| `hash_voucher_code(text)` | `SECURITY DEFINER` | Internal helper / `service_role` | `PUBLIC`, `anon`, `authenticated` | `service_role` | HMAC-SHA256 hasher; zero public RPC invocation to prevent hash oracles. |
| `confirm_points_fulfilment(...)` | `SECURITY DEFINER` | **DISABLED AT DATABASE LEVEL** | `PUBLIC`, `anon`, `authenticated` | None (Execution disabled) | Throws fatal exception: provider webhook signature verification not yet implemented. |
| `fail_and_refund_points_redemption(...)` | `SECURITY DEFINER` | **DISABLED AT DATABASE LEVEL** | `PUBLIC`, `anon`, `authenticated` | None (Execution disabled) | Throws fatal exception: provider webhook signature verification not yet implemented. |
| `grant_admin_permission(...)` | `SECURITY DEFINER` | Interactive Super Admin (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Strictly enforces caller `role = 'super_admin'` and writes append-only audit log. |
| `revoke_admin_permission(...)` | `SECURITY DEFINER` | Interactive Super Admin (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Strictly enforces caller `role = 'super_admin'` and writes append-only audit log. |
| `generate_vouchers_batch_atomic(...)` | `SECURITY DEFINER` | Voucher Manager / Super Admin | `PUBLIC`, `anon` | `authenticated`, `service_role` | Enforces `has_admin_permission(auth.uid(), 'voucher.create')`; batch limits; 128-bit entropy. |
| `redeem_voucher_atomic(...)` | `SECURITY DEFINER` | Customer (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Derives identity strictly from `auth.uid()`; row lock; single-use hash lookup. |
| `redeem_points_atomic(...)` | `SECURITY DEFINER` | Customer (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Derives identity from `auth.uid()`; locks points account before limit checks. |
| `is_admin()` | `SECURITY DEFINER` | Application logic (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Verifies caller is active `admin` or `super_admin`. |
| `is_super_admin()` | `SECURITY DEFINER` | Application logic (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Verifies caller is active `super_admin`. |
| `has_admin_permission(...)` | `SECURITY DEFINER` | Application logic (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Verifies specific permission in `admin_permissions` or `super_admin`. |
| `lookup_referral_sponsor(text)` | `SECURITY DEFINER` | Application logic (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Safe referral lookup returning uniform `{valid, sponsor_name}`; zero enumeration side-channels. |
| `initialize_transaction_pin(text)` | `SECURITY DEFINER` | Customer (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Initial PIN configuration; strictly callable only once when PIN is unset; enforces 4 digits. |
| `change_transaction_pin(text, text)` | `SECURITY DEFINER` | Customer (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | PIN update; verifies current PIN with safe NULL check, 5-attempt limit, and 30-min lockout. |
| `reset_transaction_pin_admin(uuid, text)` | `SECURITY DEFINER` | Super Admin / Service Role | `PUBLIC`, `anon` | `authenticated`, `service_role` | Administrative / verified recovery reset; clears PIN to unset state; audited. |
| `set_transaction_pin_atomic(text, text)` | `SECURITY DEFINER` | Customer (`authenticated`) | `PUBLIC`, `anon` | `authenticated`, `service_role` | Backward-compatible wrapper delegating to initialize or change PIN routines. |
| `protect_profile_fields()` | `SECURITY DEFINER` | Table Trigger (`BEFORE UPDATE`) | `PUBLIC`, `anon`, `authenticated` | None (Trigger internal) | Prevents self-promotion, preserves ID, created_at, referral_code, protects KYC tiers. |
| `prevent_immutable_ledger_modifications()` | `SECURITY DEFINER` | Table Trigger (`BEFORE UPDATE/DELETE`)| `PUBLIC`, `anon`, `authenticated` | None (Trigger internal) | Immediately throws fatal exception on any modification or deletion attempt. |
| `handle_new_user()` | `SECURITY DEFINER` | Auth Trigger (`AFTER INSERT on auth.users`) | `PUBLIC`, `anon`, `authenticated` | None (Trigger internal) | Provisions profile, main wallet, bonus wallet, and points account atomically. |

---

## 3. Cryptographic Voucher Pepper Architecture & Key Lifecycle

### A. Non-Reversibility of HMAC-SHA256
HMAC-SHA256 is a one-way cryptographic keyed digest function, **not** reversible encryption. It is mathematically impossible to "decrypt" an HMAC hash to recover the plaintext voucher code. Because the database never stores plaintext voucher codes, the database cannot re-hash active vouchers in bulk without customer submission.

### B. True Key Rotation Strategy for One-Way HMAC Vouchers
1. **Normal Voucher Issue:** Vouchers are issued using `voucher_hmac_pepper_current`.
2. **Key Rotation Execution:**
   * When rotating keys, the administrator generates a new key and sets it as `voucher_hmac_pepper_current`.
   * The former active key is moved to `voucher_hmac_pepper_previous`.
3. **Dual-Key Verification at Redemption:**
   * When a customer enters their voucher code, `redeem_voucher_atomic` computes HMAC against `voucher_hmac_pepper_current`.
   * If not found, it computes HMAC against `voucher_hmac_pepper_previous`.
   * Upon finding a match, the voucher is marked `redeemed`.
   * Once all vouchers issued under `voucher_hmac_pepper_previous` reach their expiry date (maximum 365 days), `voucher_hmac_pepper_previous` can be safely deleted.
4. **Emergency Compromise Posture:**
   * If a pepper is compromised, all unredeemed vouchers linked to that pepper must be cancelled via an administrative revocation statement, and new vouchers re-issued with fresh cryptographic entropy.

### C. Security Warning on Example Keys
> **CRITICAL WARNING:** NEVER use example keys or hex strings from documentation in a live database. Generate high-entropy 256-bit random keys in a secure offline terminal:
> ```bash
> openssl rand -hex 32
> ```

---

## 4. Provider Fulfilment & Refund Safeguards (Database-Enforced Lockdown)

### A. Why Provider Fulfilment is Disabled
In a production telecom integration, external providers (VTU aggregators) deliver airtime and data asynchronously and send webhook callbacks to the application backend.
A secure provider fulfilment pipeline requires:
1. Validating the provider's HTTP request HMAC signature against a shared webhook signing secret.
2. Ingesting the webhook into an append-only event ledger with a unique provider transaction reference.
3. Guaranteeing idempotent processing so duplicate provider retries do not trigger duplicate credits or reversals.

Because this cryptographic webhook signature verification and provider event ledger are implemented in backend services and have not yet been deployed to the database, leaving `confirm_points_fulfilment` and `fail_and_refund_points_redemption` active—even restricted to `service_role`—would expose an unverified state-transition pathway.

### B. Enforcement Mechanism
Both `confirm_points_fulfilment()` and `fail_and_refund_points_redemption()` contain active database exceptions that immediately abort execution:
```sql
raise exception 'Security Gate: confirm_points_fulfilment is disabled pending implementation of cryptographic provider webhook signature verification and isolated staging audit.';
```
All execution grants are revoked. No role—including `service_role`—can trigger unverified provider status completions or automated refunds.

---

## 5. Profile & KYC Privacy Architecture

### A. Column Classification & Sensitivity Inventory
The `public.profiles` table contains highly sensitive customer identity, compliance, and financial authorization data:
* **PII (Personally Identifiable Information):** `email`, `full_name`, `phone`.
* **Compliance & KYC State:** `kyc_status` (`not_started`, `pending`, `verified`, `rejected`, `needs_more_info`), `kyc_level` (Tier 0-2 transaction ceiling).
* **Cryptographic Identity & Financial Secrets:** `bvn_hash` (Bank Verification Number digest), `nin_hash` (National Identity Number digest), `transaction_pin_hash` (Wallet authorization digest), `transaction_pin_set`.
* **Privilege & System State:** `role` (User authorization tier), `is_active` (Account ban/suspension status), `id` (User UUID), `created_at`, `updated_at`.
* **Relationship & Affiliate:** `referral_code` (Unique affiliate handle), `referred_by` (Sponsor UUID).

### B. Row Level Security Policy Enforcement
To prevent cross-customer data leakage and identity enumeration:
1. **Private Read Scope (`profiles_select_own`):**
   ```sql
   CREATE POLICY "profiles_select_own" ON public.profiles
     FOR SELECT TO authenticated
     USING (auth.uid() = id OR public.is_admin());
   ```
   An ordinary authenticated customer cannot select or view any profile other than their own.
2. **Direct Joins & Relationship Leaks:** PostgREST foreign key joins (e.g. embedding `profiles` inside transactions or tickets) evaluate against `profiles` RLS. If another user's ID is joined, the relation returns `NULL`.
3. **Table Privilege Revocations:** Direct `INSERT` and `DELETE` on `public.profiles` are revoked from `anon` and `authenticated`. User creation is strictly handled by the database trigger `handle_new_user()` upon auth registration.

### C. Mutation Defense: `protect_profile_fields()`
Direct client `UPDATE` operations are intercepted by `protect_profile_fields()`:
* **Caller Context Verification:** Verifies caller identity. Rejects unauthenticated updates (`v_caller IS NULL`) unless verified as `service_role` (`current_setting('role') = 'service_role'` or `current_user IN ('postgres', 'supabase_admin')`).
* **Role Tampering:** Non-super admins and users attempting self-role updates are aborted with `Security Violation`. Demoting the last super admin is blocked.
* **KYC & Limit Tampering:** Alterations to `kyc_status` or `kyc_level` require explicit `kyc.verify` admin permission, `super_admin`, or trusted `service_role`.
* **Credential Tampering:** `bvn_hash` and `nin_hash` can only be set or modified by compliance administrators with `kyc.verify` permission, `super_admin`, or trusted `service_role` (e.g. IdentityPass verification service).
* **Transaction PIN Protection:** Direct client modification of `transaction_pin_hash` or `transaction_pin_set` via standard `UPDATE` is strictly prohibited. Users must invoke the dedicated atomic procedure `public.set_transaction_pin_atomic(p_new_pin, p_current_pin)` which enforces 4-digit validation, verifies current PIN, and hashes the new PIN via bcrypt.
* **Phone on KYC-Verified Accounts:** Users on KYC Tier 1 or 2 cannot change their phone number directly; updates must go through compliance support to prevent SIM-swap account takeovers.
* **Affiliate & Identity Immutability:** `id`, `created_at`, `referral_code`, and `referred_by` (once assigned) are strictly immutable.
* **Email Consistency:** Profile `email` must match the verified JWT session identity unless updated by a verified `super_admin` or `service_role`.

### D. Safe Public Referral Validation Design & Gateway Rate Limiting
When an onboarding or dashboard feature validates an affiliate/sponsor referral code:
* The client **never** queries `public.profiles` directly.
* Instead, the client invokes `public.lookup_referral_sponsor(p_referral_code text)`.
* **Zero Identifier Disclosure:** Does NOT disclose internal user `id` (UUID), phone number, email address, KYC status, or wallet balances.
* **Masked Output:** Returns `{ "valid": true, "sponsor_name": "John D." }`.
* **Format Guard:** Rejects malformed strings (must be alphanumeric, 4–20 characters).
* **Rate Limiting Architecture:** Database-level rate limiting on read-only lookup RPCs creates table lock contention and bloat. Therefore, rate limiting is **not implemented in SQL**. A **trusted API gateway, Cloudflare rule, or Edge Function reverse proxy MUST enforce rate limiting** (e.g. maximum 5 requests per minute per IP) to mitigate brute-force enumeration of referral handles.

---

## 6. Security Verification & Pre-Deployment Review Checklist

Before executing `supabase/migrations/20261009_harden_security_and_rbac.sql` against Supabase:

- [ ] **1. Isolated Staging Deployment:** Deploy to a non-production Supabase project first.
- [ ] **2. Provision Secret in Vault:**
  ```sql
  -- Generate key via openssl rand -hex 32, then store in Vault:
  select vault.create_secret(
    '<generated-64-character-hex-secret>',
    'voucher_hmac_pepper',
    'SUBPLUG Voucher HMAC Pepper'
  );
  ```
- [ ] **3. Verify Grant Revocations:**
  Confirm that `anon` and `authenticated` cannot execute:
  * `get_voucher_salt`
  * `hash_voucher_code`
  * `confirm_points_fulfilment`
  * `fail_and_refund_points_redemption`
- [ ] **4. Test Concurrency & Row Locking:** Execute concurrent requests to `redeem_points_atomic` to verify serialization under load.
- [ ] **5. Test Ledger Immutability:** Attempt `UPDATE` on `public.points_ledger` and verify trigger abortion.
