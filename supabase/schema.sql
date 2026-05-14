-- =====================================================================
-- Nahui Ollin Inc - schema `nahui`
-- Pegar TODO este archivo en Supabase Dashboard → SQL Editor → Run.
-- Idempotente: se puede correr múltiples veces sin romper nada.
-- =====================================================================

-- 1. Schema + extensiones --------------------------------------------------
create schema if not exists nahui;
create extension if not exists "uuid-ossp" with schema extensions;

-- 2. Grants para PostgREST (anon = lectura pública, authenticated = CRUD) -
grant usage on schema nahui to anon, authenticated, service_role;

-- 3. Trigger genérico de updated_at ---------------------------------------
create or replace function nahui.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 4. Tablas ----------------------------------------------------------------

-- 4.1 Historias / testimonios
create table if not exists nahui.stories (
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
create index if not exists stories_sort_idx on nahui.stories (sort_order);
create index if not exists stories_visible_idx on nahui.stories (visible);
drop trigger if exists stories_set_updated_at on nahui.stories;
create trigger stories_set_updated_at
  before update on nahui.stories
  for each row execute function nahui.set_updated_at();

-- 4.2 Acciones
create table if not exists nahui.actions (
  id uuid primary key default extensions.uuid_generate_v4(),
  icon text not null,
  title text not null,
  description text not null,
  image text not null,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists actions_sort_idx on nahui.actions (sort_order);
drop trigger if exists actions_set_updated_at on nahui.actions;
create trigger actions_set_updated_at
  before update on nahui.actions
  for each row execute function nahui.set_updated_at();

-- 4.3 Imágenes de galería
create table if not exists nahui.gallery_images (
  id uuid primary key default extensions.uuid_generate_v4(),
  url text not null,
  alt text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);
-- Para instalaciones existentes (idempotente)
alter table nahui.gallery_images
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image', 'video'));
create index if not exists gallery_sort_idx on nahui.gallery_images (sort_order);
create index if not exists gallery_media_type_idx on nahui.gallery_images (media_type);

-- 4.4 Profiles (espejo de auth.users con metadata adicional)
create table if not exists nahui.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on nahui.profiles (role);
drop trigger if exists profiles_set_updated_at on nahui.profiles;
create trigger profiles_set_updated_at
  before update on nahui.profiles
  for each row execute function nahui.set_updated_at();

-- Trigger: cuando se crea un usuario en auth.users, crear su profile.
create or replace function nahui.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into nahui.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function nahui.handle_new_user();

-- 5. RLS policies ---------------------------------------------------------

alter table nahui.stories enable row level security;
alter table nahui.actions enable row level security;
alter table nahui.gallery_images enable row level security;
alter table nahui.profiles enable row level security;

-- Profiles: leer todos los autenticados, modificar solo el propio
drop policy if exists "authenticated read profiles" on nahui.profiles;
create policy "authenticated read profiles"
  on nahui.profiles for select to authenticated using (true);
drop policy if exists "users update own profile" on nahui.profiles;
create policy "users update own profile"
  on nahui.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "users insert own profile" on nahui.profiles;
create policy "users insert own profile"
  on nahui.profiles for insert to authenticated with check (id = auth.uid());

-- Lectura pública SOLO de filas visibles
drop policy if exists "public read visible stories" on nahui.stories;
create policy "public read visible stories"
  on nahui.stories for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "public read visible actions" on nahui.actions;
create policy "public read visible actions"
  on nahui.actions for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "public read visible gallery" on nahui.gallery_images;
create policy "public read visible gallery"
  on nahui.gallery_images for select
  to anon, authenticated
  using (visible = true);

-- Usuarios autenticados pueden ver TODO (incluido lo oculto) y CRUD completo
drop policy if exists "authenticated read all stories" on nahui.stories;
create policy "authenticated read all stories"
  on nahui.stories for select
  to authenticated
  using (true);

drop policy if exists "authenticated write stories" on nahui.stories;
create policy "authenticated write stories"
  on nahui.stories for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated read all actions" on nahui.actions;
create policy "authenticated read all actions"
  on nahui.actions for select
  to authenticated
  using (true);

drop policy if exists "authenticated write actions" on nahui.actions;
create policy "authenticated write actions"
  on nahui.actions for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated read all gallery" on nahui.gallery_images;
create policy "authenticated read all gallery"
  on nahui.gallery_images for select
  to authenticated
  using (true);

drop policy if exists "authenticated write gallery" on nahui.gallery_images;
create policy "authenticated write gallery"
  on nahui.gallery_images for all
  to authenticated
  using (true)
  with check (true);

-- 6. Storage bucket para imágenes -----------------------------------------
insert into storage.buckets (id, name, public)
  values ('nahui-media', 'nahui-media', true)
  on conflict (id) do update set public = excluded.public;

drop policy if exists "public read nahui-media" on storage.objects;
create policy "public read nahui-media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'nahui-media');

drop policy if exists "authenticated upload nahui-media" on storage.objects;
create policy "authenticated upload nahui-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'nahui-media');

drop policy if exists "authenticated update nahui-media" on storage.objects;
create policy "authenticated update nahui-media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'nahui-media')
  with check (bucket_id = 'nahui-media');

drop policy if exists "authenticated delete nahui-media" on storage.objects;
create policy "authenticated delete nahui-media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'nahui-media');

-- 7. SEED: datos actuales del sitio --------------------------------------
-- Se usan upserts por título para que correrlo dos veces no duplique.

-- 7.1 Stories
insert into nahui.stories (title, date, description, has_before_after, before_images, after_images, images, sort_order)
values
  (
    'La nueva casa de Yoselin',
    'Transformación reciente',
    'La casa de Yoselin pasó de ser un espacio precario e inseguro a convertirse en un hogar digno, con luz, paredes firmes y un techo que la abriga. Gracias al trabajo conjunto de voluntarios, donantes y la comunidad, hoy Yoselin puede crecer en un ambiente que merece.',
    true,
    array[
      '/historias/yoselin/antes/antes-1.jpg',
      '/historias/yoselin/antes/antes-2.jpg',
      '/historias/yoselin/antes/antes-3.jpg',
      '/historias/yoselin/antes/antes-4.jpg',
      '/historias/yoselin/antes/antes-5.jpg'
    ],
    array[
      '/historias/yoselin/ahora/ahora-1.jpg',
      '/historias/yoselin/ahora/ahora-2.jpg',
      '/historias/yoselin/ahora/ahora-3.jpg',
      '/historias/yoselin/ahora/ahora-4.jpg',
      '/historias/yoselin/ahora/ahora-5.jpg'
    ],
    array['/historias/yoselin/antes/antes-1.jpg', '/historias/yoselin/ahora/ahora-1.jpg'],
    1
  ),
  (
    'Regalos que abrazan',
    'Diciembre 2025',
    'Gracias al apoyo de voluntarios y donantes, pudimos entregar regalos y compartir una tarde especial con niños en situación vulnerable.',
    false,
    '{}',
    '{}',
    array['/galeria/galeria-09.jpg'],
    2
  ),
  (
    'Un plato de comida, una esperanza',
    'Enero 2026',
    'En cada jornada de alimentación buscamos brindar más que comida: queremos ofrecer compañía, respeto y esperanza.',
    false,
    '{}',
    '{}',
    array[
      '/galeria/galeria-08.jpg',
      '/galeria/galeria-22.jpg'
    ],
    3
  )
on conflict do nothing;

-- 7.2 Actions
insert into nahui.actions (icon, title, description, image, sort_order)
values
  ('Utensils',  'Alimentación',            'Realizamos jornadas de entrega de alimentos para niños en situación de calle y comunidades vulnerables.',  '/galeria/galeria-08.jpg', 1),
  ('Gift',      'Entrega de regalos',      'Organizamos campañas para entregar juguetes, ropa y detalles especiales que llenan de alegría a los niños.', '/galeria/galeria-05.jpg', 2),
  ('Sun',       'Jornadas solidarias',     'Creamos espacios de encuentro donde voluntarios y familias se unen para ayudar.',                          '/galeria/galeria-11.jpg', 3),
  ('HandHeart', 'Acompañamiento social',   'Buscamos escuchar, contener y acompañar a quienes más lo necesitan.',                                        '/galeria/galeria-04.jpg', 4),
  ('Smile',     'Actividades recreativas', 'Promovemos momentos de juego, sonrisas y conexión humana.',                                                  '/galeria/galeria-15.jpg', 5),
  ('Megaphone', 'Campañas de donación',    'Impulsamos campañas para reunir alimentos, juguetes, ropa y fondos para nuestras acciones.',                 '/galeria/galeria-06.jpg', 6)
on conflict do nothing;

-- 7.3 Gallery (21 imágenes existentes)
do $$
declare i int;
begin
  for i in 1..21 loop
    insert into nahui.gallery_images (url, alt, sort_order)
    values (
      '/galeria/galeria-' || lpad(i::text, 2, '0') || '.jpg',
      'Galería Nahui Ollin ' || i,
      i
    )
    on conflict do nothing;
  end loop;
end $$;

-- 8. Grants sobre tablas (después de crearlas) ---------------------------
grant select on all tables in schema nahui to anon;
grant all    on all tables in schema nahui to authenticated;
alter default privileges in schema nahui grant select on tables to anon;
alter default privileges in schema nahui grant all    on tables to authenticated;
