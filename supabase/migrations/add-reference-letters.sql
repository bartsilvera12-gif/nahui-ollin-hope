-- =====================================================================
-- Tabla: nahui.reference_letters
-- Imágenes y videos de la sección pública "Cartas Referenciales".
-- Estructura espejo de gallery_images / evangelization_media.
-- Idempotente.
-- =====================================================================

create table if not exists nahui.reference_letters (
  id uuid primary key default extensions.uuid_generate_v4(),
  url text not null,
  alt text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reference_letters_sort_idx
  on nahui.reference_letters (sort_order);
create index if not exists reference_letters_type_idx
  on nahui.reference_letters (media_type);

alter table nahui.reference_letters enable row level security;

drop policy if exists "public read visible reference letters" on nahui.reference_letters;
create policy "public read visible reference letters"
  on nahui.reference_letters for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "authenticated read all reference letters" on nahui.reference_letters;
create policy "authenticated read all reference letters"
  on nahui.reference_letters for select
  to authenticated
  using (true);

drop policy if exists "authenticated write reference letters" on nahui.reference_letters;
create policy "authenticated write reference letters"
  on nahui.reference_letters for all
  to authenticated
  using (true)
  with check (true);

grant select on nahui.reference_letters to anon;
grant all    on nahui.reference_letters to authenticated;

-- Seed con las 5 cartas iniciales en /cartas-referenciales/
insert into nahui.reference_letters (url, alt, media_type, sort_order, visible)
values
  ('/cartas-referenciales/carta-01.jpg', 'Carta referencial 1', 'image', 1, true),
  ('/cartas-referenciales/carta-02.jpg', 'Carta referencial 2', 'image', 2, true),
  ('/cartas-referenciales/carta-03.jpg', 'Carta referencial 3', 'image', 3, true),
  ('/cartas-referenciales/carta-04.jpg', 'Carta referencial 4', 'image', 4, true),
  ('/cartas-referenciales/carta-05.jpg', 'Carta referencial 5', 'image', 5, true)
on conflict do nothing;
