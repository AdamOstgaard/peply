# Peply

A playful lifestyle motivation app. Set goals, attach meaningful rewards,
log progress with one tap, and unlock celebrations when you follow through.

Mobile-first React app built with Vite, deployed on Vercel, with a Supabase
backend ready for sync. The MVP runs entirely offline using localStorage —
no signup required to try the core loop.

## Local setup

```sh
npm install
Copy-Item .env.example .env.local
npm run dev
```

The app works as-is offline. To enable Supabase sync, fill `.env.local`:

```sh
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Vercel's managed Supabase integration also works out of the box with
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

To create the goals/rewards/logs schema, run `supabase/schema.sql` in the
Supabase SQL editor.

## Scripts

```sh
npm run dev
npm run build
npm run preview
npm run deploy
npm run deploy:prod
```

## Architecture

- `src/lib/store.jsx` — React Context store with `useReducer`, persisted to
  `localStorage` under `peply.v1`.
- `src/lib/domain.js` — Pure helpers: goal types, progress math, momentum
  scoring, copy pools.
- `src/lib/supabase.js` — Supabase client (optional; not yet wired to sync).
- `src/components/` — Reusable UI: `GoalCard`, `RewardCard`, `ProgressRing`,
  `MomentumMeter`, `EmptyState`, `CelebrationOverlay`, `BottomNav`, `Toast`.
- `src/screens/` — Routes: Home, GoalBuilder, GoalDetail, GoalsList,
  RewardVault, RewardCreate, Profile.
- `src/index.css` — Design tokens from `DESIGN_SYSTEM.md`.

Animation is powered by Framer Motion, with `useReducedMotion()` everywhere.
Confetti comes from `canvas-confetti`. Icons from `@phosphor-icons/react`.
