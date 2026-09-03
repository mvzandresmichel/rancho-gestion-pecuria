-- RANCHO GESTIÓN PECUARIA V5 — SUPABASE / POSTGRES
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_name text,
  location_text text,
  production_type text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz default now()
);

create table public.farm_members (
  farm_id uuid references public.farms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','mvz','manager','worker')),
  primary key (farm_id,user_id)
);

create table public.animals (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  tag text not null,
  species text default 'Bovino',
  sex text,
  breed text,
  lot text,
  birth_date date,
  weight_kg numeric,
  reproductive_status text,
  production_status text,
  sire text,
  dam text,
  notes text,
  created_at timestamptz default now(),
  unique(farm_id,tag)
);

create table public.animal_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete cascade,
  event_type text not null,
  event_date date not null default current_date,
  data jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.farms enable row level security;
alter table public.farm_members enable row level security;
alter table public.animals enable row level security;
alter table public.animal_events enable row level security;

create policy "members read farms" on public.farms for select
using (exists(select 1 from public.farm_members m where m.farm_id=id and m.user_id=auth.uid()));

create policy "members read animals" on public.animals for select
using (exists(select 1 from public.farm_members m where m.farm_id=farm_id and m.user_id=auth.uid()));

create policy "members read events" on public.animal_events for select
using (exists(select 1 from public.farm_members m where m.farm_id=farm_id and m.user_id=auth.uid()));

-- Para producción real deben añadirse políticas INSERT/UPDATE/DELETE por rol.
