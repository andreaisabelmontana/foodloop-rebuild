/**
 * store — persistence boundary for waitlist entries.
 *
 * In DEMO mode (the default, and what GitHub Pages runs) entries are saved to
 * localStorage so the whole experience works with zero backend. To go live,
 * provide Supabase env vars and the same `joinWaitlist` call will insert into
 * Postgres instead — the UI and validation code do not change.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 *
 * The Supabase path is written against the REST endpoint directly to avoid a
 * client dependency; swap in @supabase/supabase-js if you prefer.
 */
import { submitWaitlistForm, type WaitlistEntry, type WaitlistInput } from "./waitlist-core";

const STORAGE_KEY = "foodloop.waitlist.v1";

function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function readLocal(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as WaitlistEntry[];
  } catch {
    return [];
  }
}

function writeLocal(entries: WaitlistEntry[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export type JoinResult =
  | { ok: true; entry: WaitlistEntry; mode: "demo" | "supabase" }
  | { ok: false; errors: Record<string, string> };

/** Validate, then persist to the configured backend. */
export async function joinWaitlist(input: Partial<WaitlistInput>): Promise<JoinResult> {
  const result = submitWaitlistForm(input);
  if (!result.ok) return { ok: false, errors: result.errors };

  if (hasSupabase()) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/waitlist_signups`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: result.entry.name,
        email: result.entry.email,
        role: result.entry.role,
        city: result.entry.city,
        created_at: result.entry.createdAt,
      }),
    });
    if (!res.ok) {
      // Unique-violation (duplicate email) is the common, friendly failure.
      if (res.status === 409) return { ok: false, errors: { email: "You're already on the list." } };
      return { ok: false, errors: { email: "Something went wrong. Try again." } };
    }
    return { ok: true, entry: result.entry, mode: "supabase" };
  }

  // Demo mode: localStorage, with a friendly duplicate guard.
  const entries = readLocal();
  if (entries.some((e) => e.email === result.entry.email)) {
    return { ok: false, errors: { email: "You're already on the list." } };
  }
  entries.push(result.entry);
  writeLocal(entries);
  return { ok: true, entry: result.entry, mode: "demo" };
}

/** Read all stored signups (demo mode only — admin view). */
export function listLocalSignups(): WaitlistEntry[] {
  return readLocal().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function clearLocalSignups(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
