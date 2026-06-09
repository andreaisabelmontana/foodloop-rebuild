"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listLocalSignups, clearLocalSignups } from "@/lib/store";
import type { WaitlistEntry } from "@/lib/waitlist-core";

// Demo gate only — a real deployment puts this behind Supabase auth / RLS.
// The passcode is intentionally trivial because demo data never leaves the browser.
const DEMO_PASSCODE = "foodloop";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [rows, setRows] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    if (authed) setRows(listLocalSignups());
  }, [authed]);

  if (!authed) {
    return (
      <main className="admin-gate">
        <div className="card">
          <h1>🔒 Admin</h1>
          <p>Protected waitlist view. Demo passcode: <code>foodloop</code></p>
          <input
            type="password"
            value={pass}
            placeholder="Passcode"
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setAuthed(pass === DEMO_PASSCODE)}
          />
          <button className="btn-primary" onClick={() => setAuthed(pass === DEMO_PASSCODE)}>
            Enter
          </button>
          <Link href="/" className="back">← back to site</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin">
      <header className="admin-head">
        <h1>Waitlist signups <span className="count">{rows.length}</span></h1>
        <div>
          <button className="btn-ghost" onClick={() => setRows(listLocalSignups())}>Refresh</button>
          <button
            className="btn-danger"
            onClick={() => { clearLocalSignups(); setRows([]); }}
          >
            Clear demo data
          </button>
        </div>
      </header>

      {rows.length === 0 ? (
        <p className="empty">No signups yet. Add some on the <Link href="/">landing page</Link>.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>City</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.email}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td><span className={`pill ${r.role}`}>{r.role}</span></td>
                <td>{r.city ?? "—"}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link href="/" className="back">← back to site</Link>
    </main>
  );
}
