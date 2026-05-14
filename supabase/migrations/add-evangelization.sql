-- =====================================================================
-- Tabla: nahui.evangelization_media
-- Imágenes y videos mostrados en la sección pública "Evangelización"
-- como una galería. Estructura espejo de gallery_images.
-- Idempotente. Reemplaza la tabla anterior evangelization_cases.
-- =====================================================================

-- Limpiar versión previa (si existiera) -----------------------------------
drop table if exists nahui.evangelization_cases cascade;

create table if not exists nahui.evangelization_media (
  id uuid primary key default extensions.uuid_generate_v4(),
  url text not null,
  alt text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists evangelization_media_sort_idx
  on nahui.evangelization_media (sort_order);
create index if not exists evangelization_media_type_idx
  on nahui.evangelization_media (media_type);

alter table nahui.evangelization_media enable row level security;

drop policy if exists "public read visible evangelization media" on nahui.evangelization_media;
create policy "public read visible evangelization media"
  on nahui.evangelization_media for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "authenticated read all evangelization media" on nahui.evangelization_media;
create policy "authenticated read all evangelization media"
  on nahui.evangelization_media for select
  to authenticated
  using (true);

drop policy if exists "authenticated write evangelization media" on nahui.evangelization_media;
create policy "authenticated write evangelization media"
  on nahui.evangelization_media for all
  to authenticated
  using (true)
  with check (true);

grant select on nahui.evangelization_media to anon;
grant all    on nahui.evangelization_media to authenticated;
