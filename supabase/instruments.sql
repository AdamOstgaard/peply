create table if not exists public.instruments (
  id bigint primary key generated always as identity,
  name text not null
);

insert into public.instruments (name)
select seed.name
from (
  values
    ('violin'),
    ('viola'),
    ('cello')
) as seed(name)
where not exists (
  select 1
  from public.instruments
  where instruments.name = seed.name
);

grant select on public.instruments to anon;

alter table public.instruments enable row level security;

drop policy if exists "public can read instruments" on public.instruments;

create policy "public can read instruments"
on public.instruments
for select
to anon
using (true);
