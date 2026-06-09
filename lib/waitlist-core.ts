/**
 * waitlist-core — pure, dependency-free validation and normalization for
 * waitlist submissions.
 *
 * This module is deliberately framework-light and has NO browser, React, or
 * Supabase imports, so the business rules can be unit-tested in isolation and
 * reused identically on a server boundary or a client form. The UI owns
 * interaction; this owns "is this submission valid, and what gets stored".
 */

export type SignupRole = "customer" | "partner";

export interface WaitlistInput {
  name: string;
  email: string;
  role: SignupRole;
  city?: string;
}

export interface WaitlistEntry {
  name: string;
  email: string;
  role: SignupRole;
  city: string | null;
  createdAt: string; // ISO timestamp, supplied by the caller (testable)
}

export interface ValidationResult {
  ok: boolean;
  errors: Partial<Record<keyof WaitlistInput, string>>;
}

// Pragmatic email check: one @, a dot in the domain, no whitespace.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES: SignupRole[] = ["customer", "partner"];

/** Validate raw input. Returns per-field error messages (English keys). */
export function validateWaitlistInput(input: Partial<WaitlistInput>): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  const name = (input.name ?? "").trim();
  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (name.length > 80) errors.name = "Name must be at most 80 characters.";

  const email = (input.email ?? "").trim();
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!input.role || !VALID_ROLES.includes(input.role)) {
    errors.role = "Choose customer or partner.";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

/**
 * Normalize valid input into the row we persist. Lowercases the email,
 * trims everything, and stamps `createdAt` from the injected clock so the
 * function stays pure and deterministic in tests.
 */
export function normalizeEntry(input: WaitlistInput, now: () => string): WaitlistEntry {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    city: input.city?.trim() ? input.city.trim() : null,
    createdAt: now(),
  };
}

/** Convenience: validate + normalize in one call. */
export function submitWaitlistForm(
  input: Partial<WaitlistInput>,
  now: () => string = () => new Date().toISOString(),
): { ok: true; entry: WaitlistEntry } | { ok: false; errors: ValidationResult["errors"] } {
  const result = validateWaitlistInput(input);
  if (!result.ok) return { ok: false, errors: result.errors };
  return { ok: true, entry: normalizeEntry(input as WaitlistInput, now) };
}
