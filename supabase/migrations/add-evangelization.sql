-- =====================================================================
-- Tabla: nahui.evangelization_cases
-- Casos de evangelización mostrados en la sección pública "Evangelización".
-- Estructura espejo de stories: soporta modo antes/ahora.
-- Idempotente.
-- =====================================================================

create table if not exists nahui.evangelization_cases (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  date text,
  description text not null,
  has_before_after boolean not null default false,
  images text[] not null default '{}',
  before_images text[] not null default '{}',
  after_images text[] not null default '{}',
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evangelization_sort_idx on nahui.evangelization_cases (sort_order);
create index if not exists evangelization_visible_idx on nahui.evangelization_cases (visible);

drop trigger if exists evangelization_set_updated_at on nahui.evangelization_cases;
create trigger evangelization_set_updated_at
  before update on nahui.evangelization_cases
  for each row execute function nahui.set_updated_at();

alter table nahui.evangelization_cases enable row level security;

drop policy if exists "public read visible evangelization" on nahui.evangelization_cases;
create policy "public read visible evangelization"
  on nahui.evangelization_cases for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "authenticated read all evangelization" on nahui.evangelization_cases;
create policy "authenticated read all evangelization"
  on nahui.evangelization_cases for select
  to authenticated
  using (true);

drop policy if exists "authenticated write evangelization" on nahui.evangelization_cases;
create policy "authenticated write evangelization"
  on nahui.evangelization_cases for all
  to authenticated
  using (true)
  with check (true);

grant select on nahui.evangelization_cases to anon;
grant all    on nahui.evangelization_cases to authenticated;
