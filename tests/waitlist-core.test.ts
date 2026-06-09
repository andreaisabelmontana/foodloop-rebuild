/** Unit tests for the pure waitlist validation/normalization core.
 *  Run with: npm test  (node --test, with Node's built-in TS type stripping). */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateWaitlistInput,
  normalizeEntry,
  submitWaitlistForm,
} from "../lib/waitlist-core.ts";

const FIXED = () => "2026-01-01T00:00:00.000Z";

test("accepts a valid customer submission", () => {
  const r = validateWaitlistInput({ name: "Nino", email: "nino@example.ge", role: "customer" });
  assert.equal(r.ok, true);
  assert.deepEqual(r.errors, {});
});

test("rejects short names", () => {
  const r = validateWaitlistInput({ name: "N", email: "n@x.ge", role: "customer" });
  assert.equal(r.ok, false);
  assert.match(r.errors.name ?? "", /at least 2/);
});

test("rejects malformed emails", () => {
  for (const email of ["", "no-at", "a@b", "a b@x.ge"]) {
    const r = validateWaitlistInput({ name: "Nino", email, role: "customer" });
    assert.equal(r.ok, false, `expected ${email} to be invalid`);
    assert.ok(r.errors.email);
  }
});

test("rejects an invalid role", () => {
  // @ts-expect-error testing runtime guard against bad role
  const r = validateWaitlistInput({ name: "Nino", email: "n@x.ge", role: "vendor" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.role);
});

test("normalizeEntry lowercases email, trims, stamps time", () => {
  const e = normalizeEntry(
    { name: "  Giorgi ", email: "  GIO@Example.GE ", role: "partner", city: " Tbilisi " },
    FIXED,
  );
  assert.equal(e.name, "Giorgi");
  assert.equal(e.email, "gio@example.ge");
  assert.equal(e.city, "Tbilisi");
  assert.equal(e.createdAt, "2026-01-01T00:00:00.000Z");
});

test("normalizeEntry stores null for an empty city", () => {
  const e = normalizeEntry({ name: "Ana", email: "a@x.ge", role: "customer" }, FIXED);
  assert.equal(e.city, null);
});

test("submitWaitlistForm short-circuits on invalid input", () => {
  const r = submitWaitlistForm({ name: "", email: "bad", role: "customer" });
  assert.equal(r.ok, false);
});

test("submitWaitlistForm returns a normalized entry when valid", () => {
  const r = submitWaitlistForm(
    { name: "Nino", email: "Nino@Example.GE", role: "customer" },
    FIXED,
  );
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.entry.email, "nino@example.ge");
    assert.equal(r.entry.createdAt, FIXED());
  }
});
