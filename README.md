# Peply

Hello world React app scaffolded with Vite, Supabase, and Vercel deployment
config.

## Local setup

```sh
npm install
Copy-Item .env.example .env.local
npm run dev
```

Fill `.env.local` with values from your Supabase project:

```sh
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Vercel's managed Supabase integration also works out of the box with
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

To load the sample data shown by the app, run
`supabase/instruments.sql` in the Supabase SQL editor. It creates the
`public.instruments` table, grants read access to `anon`, enables RLS, and
adds a public read policy for the sample rows.

## Scripts

```sh
npm run dev
npm run build
npm run preview
npm run deploy
npm run deploy:prod
```

Before deploying, connect the Vercel Supabase integration or add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the Vercel project
environment variables.
