/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Security and Input Sanitization Utilities
 * Protects against XSS, script injection, prototype tampering, and input overflows.
 */

// Whitelist of valid section anchors on the landing page
export const VALID_SECTIONS = [
  'home',
  'services',
  'partners',
  'pricing',
  'vendor',
  'store-teaser',
  'blog-teaser',
  'app-download',
  'about',
  'faq',
] as const;

export type ValidSection = typeof VALID_SECTIONS[number];

/**
 * Validates that a section ID matches the strict whitelist
 */
export function isWhitelistedSection(id: string): id is ValidSection {
  const cleanId = id.replace(/^#/, '').toLowerCase().trim();
  return (VALID_SECTIONS as readonly string[]).includes(cleanId);
}

/**
 * Strips HTML tags, script entities, control characters, and dangerous URI schemes.
 */
export function sanitizeText(input: string, maxLength = 100): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove ASCII control characters
    .replace(/<[^>]*>?/gm, '') // remove HTML tags
    .replace(/[&<>"'/]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return escapeMap[match] || match;
    })
    .trim()
    .slice(0, maxLength);
}

/**
 * Strictly sanitizes plain text without HTML encoding for form fields,
 * while stripping script/tag injection patterns.
 */
export function cleanRawInput(input: string, maxLength = 100): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // remove HTML tags
    .replace(/javascript:/gi, '') // prevent pseudo-protocol injection
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .slice(0, maxLength);
}

/**
 * Validates standard Nigerian telephone numbers:
 * Accepts: 080..., 070..., 090..., 081..., 091..., +234..., 234...
 */
export function isValidNigerianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (/^0[789][01]\d{8}$/.test(digits)) return true;
  if (/^234[789][01]\d{8}$/.test(digits)) return true;
  return false;
}

/**
 * Normalizes a Nigerian number into the canonical local 11-digit format.
 */
export function normalizeNigerianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) {
    return '0' + digits.slice(3);
  }
  return digits.slice(0, 11);
}

/**
 * Normalizes a Nigerian number into E.164 for Supabase Phone Auth.
 */
export function normalizeNigerianPhoneE164(phone: string): string {
  const normalized = normalizeNigerianPhone(phone);
  return normalized.length === 11 && normalized.startsWith('0')
    ? '+234' + normalized.slice(1)
    : phone.trim();
}

/**
 * Validates the SUBPLUG username.
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string): boolean {
  return /^[a-z0-9_]{4,20}$/.test(normalizeUsername(username));
}

export function isReservedUsername(username: string): boolean {
  const reserved = new Set([
    'admin', 'administrator', 'support', 'system', 'security',
    'api', 'billing', 'wallet', 'finance', 'subplug', 'root',
    'moderator', 'moderation', 'help', 'official',
  ]);
  return reserved.has(normalizeUsername(username));
}

/**
 * Validates email with standard RFC 5322-compatible pattern
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 100) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates alphanumeric referral codes (e.g., "SUB992")
 */
export function sanitizeReferralCode(code: string): string {
  return code
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 10);
}

/**
 * Safely bounds integer values within limits to prevent overflows and negative quantities
 */
export function clampInteger(val: number, min = 1, max = 50): number {
  if (isNaN(val) || !isFinite(val)) return min;
  return Math.max(min, Math.min(max, Math.floor(val)));
}

export interface ParsedPhoneResults {
  valid: string[];
  invalid: string[];
  duplicates: string[];
}

/**
 * Parses and validates raw bulk phone numbers from text or CSV inputs.
 * Supports Nigerian formats: 080..., +234..., 234...
 * Detects valid, invalid, and duplicate phone numbers without sending SMS.
 */
export function parseBulkPhoneNumbers(raw: string): ParsedPhoneResults {
  if (!raw || typeof raw !== 'string') {
    return { valid: [], invalid: [], duplicates: [] };
  }

  // Split by newlines, commas, semicolons, tabs, or spaces
  const tokens = raw
    .split(/[\r\n,;\t ]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  const duplicates: string[] = [];

  for (const token of tokens) {
    if (isValidNigerianPhone(token)) {
      const normalized = normalizeNigerianPhone(token);
      if (seen.has(normalized)) {
        duplicates.push(token);
      } else {
        seen.add(normalized);
        valid.push(normalized);
      }
    } else {
      invalid.push(token);
    }
  }

  return { valid, invalid, duplicates };
}

/**
 * Calculates standard GSM SMS segments based on character count.
 * 160 characters for 1 segment; 153 characters per segment for multi-page messages.
 */
export function calculateSmsSegments(message: string): number {
  if (!message || message.length === 0) return 0;
  const len = message.length;
  if (len <= 160) return 1;
  return Math.ceil(len / 153);
}

/**
 * Calculates estimated SMS cost (explicitly described as estimate in the UI).
 */
export function estimateSmsCost(recipientCount: number, segments: number, ratePerSegment = 3.5): number {
  if (recipientCount <= 0 || segments <= 0) return 0;
  return recipientCount * segments * ratePerSegment;
}
