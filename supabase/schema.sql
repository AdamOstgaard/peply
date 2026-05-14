-- Peply schema — goals, rewards, progress logs.
-- This is the canonical schema for future Supabase sync. The MVP is offline-first
-- and stores data in browser localStorage; running this is only required when
-- enabling a real Supabase backend for the app.

create extension if not exists "pgcrypto";

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  note text,
  emoji text,
  image_url text,
  tier text check (tier in ('small', 'medium', 'big', 'dream')) default 'medium',
  cost numeric,
  -- How the reward unlocks when multiple goals are linked to it.
  --   each = earn the reward each time a linked goal finishes
  --   any  = unlock once on the first linked-goal completion
  --   all  = unlock once after every linked goal is complete
  unlock_mode text not null check (unlock_mode in ('each', 'any', 'all')) default 'each',
  unlock_count integer not null default 0,
  created_at timestamptz not null default now(),
  unlocked_at timestamptz,
  claimed_at timestamptz
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  emoji text,
  type text not null check (type in ('count', 'habit', 'avoid', 'milestone')),
  target numeric,
  unit text,
  schedule jsonb,
  deadline date,
  reward_id uuid references public.rewards(id) on delete set null,
  motivation text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  archived_at timestamptz
);

create table if not exists public.progress_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  kind text not null check (kind in ('done', 'increment', 'on-track', 'skip')),
  value numeric default 1,
  note text,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists progress_logs_goal_id_idx on public.progress_logs (goal_id);
create index if not exists progress_logs_user_date_idx on public.progress_logs (user_id, date desc);
create index if not exists goals_user_id_idx on public.goals (user_id);
create index if not exists rewards_user_id_idx on public.rewards (user_id);

alter table public.goals enable row level security;
alter table public.rewards enable row level security;
alter table public.progress_logs enable row level security;

drop policy if exists "goals owner full access" on public.goals;
create policy "goals owner full access" on public.goals
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "rewards owner full access" on public.rewards;
create policy "rewards owner full access" on public.rewards
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "logs owner full access" on public.progress_logs;
create policy "logs owner full access" on public.progress_logs
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
