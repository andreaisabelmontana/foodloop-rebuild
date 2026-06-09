"use client";

import { useState } from "react";
import { joinWaitlist } from "@/lib/store";
import type { SignupRole } from "@/lib/waitlist-core";

type Status = "idle" | "submitting" | "done";

export default function WaitlistForm() {
  const [role, setRole] = useState<SignupRole>("customer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    const form = new FormData(e.currentTarget);
    const res = await joinWaitlist({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      city: String(form.get("city") ?? ""),
      role,
    });
    if (res.ok) {
      setStatus("done");
    } else {
      setErrors(res.errors);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="card success" role="status">
        <h3>თქვენ სიაში ხართ! 🎉</h3>
        <p>You&apos;re on the list. We&apos;ll reach out as FoodLoop opens in your neighborhood.</p>
      </div>
    );
  }

  return (
    <form className="card waitlist" onSubmit={onSubmit} noValidate>
      <div className="role-toggle" role="tablist" aria-label="I am a">
        <button
          type="button"
          role="tab"
          aria-selected={role === "customer"}
          className={role === "customer" ? "active" : ""}
          onClick={() => setRole("customer")}
        >
          🍽️ მომხმარებელი / Customer
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={role === "partner"}
          className={role === "partner" ? "active" : ""}
          onClick={() => setRole("partner")}
        >
          🏪 პარტნიორი / Partner
        </button>
      </div>

      <label>
        <span>სახელი / Name</span>
        <input name="name" type="text" placeholder="ნინო" autoComplete="name" />
        {errors.name && <em className="err">{errors.name}</em>}
      </label>

      <label>
        <span>ელ-ფოსტა / Email</span>
        <input name="email" type="email" placeholder="nino@example.ge" autoComplete="email" />
        {errors.email && <em className="err">{errors.email}</em>}
      </label>

      <label>
        <span>ქალაქი / City <small>(optional)</small></span>
        <input name="city" type="text" placeholder="თბილისი" autoComplete="address-level2" />
      </label>

      {errors.role && <em className="err">{errors.role}</em>}

      <button type="submit" className="btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "..." : "შემიერთე სიაში / Join the waitlist"}
      </button>
      <p className="fineprint">
        Demo mode stores your signup locally in this browser. No data leaves your device.
      </p>
    </form>
  );
}
