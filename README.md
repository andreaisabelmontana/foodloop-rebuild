# FoodLoop 🥬

[![Next.js](https://img.shields.io/badge/Next.js-15-000.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Making the Georgian food industry sustainable.** FoodLoop is a Georgian-language
Next.js landing page + waitlist experience + protected admin view for a
neighborhood surplus-food marketplace — connecting nearby customers with cafes,
bakeries, restaurants and markets that have affordable surplus meals.

🔗 **Live:** https://andreaisabelmontana.github.io/foodloop-rebuild/

> Built from scratch to explore the Next.js App Router + static-export +
> GitHub Actions deploy workflow, and the "separate the UI from testable
> business rules" pattern.

---

## What's inside

| Area | Purpose |
|------|---------|
| `app/` | App Router routes — landing page, protected `admin/` view, layout, global styling. |
| `components/` | `WaitlistForm` client component (owns browser interaction). |
| `lib/waitlist-core.ts` | **Pure, framework-free** validation + normalization — fully unit-tested. |
| `lib/store.ts` | Persistence boundary: localStorage (demo) or Supabase REST (live). |
| `tests/` | `node --test` coverage of the waitlist core (8 tests). |
| `supabase/` | Waitlist table migration + Row-Level-Security posture. |
| `.github/workflows/` | Build → test → static-export → deploy to GitHub Pages. |

## Architecture

The defining idea is the **split between UI and business rules**:

```
WaitlistForm (browser)  →  joinWaitlist (store boundary)  →  localStorage | Supabase
                                   │
                                   └─ submitWaitlistForm (pure core: validate + normalize)
```

`waitlist-core.ts` has no React/browser/Supabase imports, so the rules — "is
this a valid signup, and what exactly gets stored" — can be tested in complete
isolation and reused on either a client or a server boundary.

## Demo mode vs. live

- **Demo (default, and what Pages runs):** signups are saved to `localStorage`.
  Everything works with zero backend; the `/admin` view reads them back.
- **Live:** set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (see `.env.example`) and the *same* `joinWaitlist` call inserts into Postgres.
  RLS lets anon **insert** but never **read** — the admin list needs the service role.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # run the waitlist-core unit tests
npm run build        # static export to ./out  (BASE_PATH controls the prefix)
```

The landing page is bilingual (ქართული + English) with a **"market sheet"** art
direction — a grocer's price-list card with struck-through full prices and
surplus prices in tag-red, on warm paper with a faint market-grid texture.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which installs,
runs the tests, builds the static export with `BASE_PATH=/foodloop-rebuild`,
and publishes `out/` to GitHub Pages.

## License

MIT — see [LICENSE](LICENSE).
