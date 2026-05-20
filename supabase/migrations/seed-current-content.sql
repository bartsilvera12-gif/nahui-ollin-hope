-- =====================================================================
-- Seed del contenido actual del fallback estatico hacia Supabase
-- =====================================================================
-- Inserta las 9 cartas referenciales y las 5 fotos de evangelizacion
-- que viven en public/img-cartas-referenciales/ e public/img-evangelizacion/
-- Idempotente: usa NOT EXISTS para no duplicar.
-- =====================================================================

-- Cartas Referenciales --------------------------------------------------
-- Asegura que la tabla exista (si nunca se corrio add-reference-letters.sql)
create table if not exists nahui.reference_letters (
  id uuid primary key default extensions.uuid_generate_v4(),
  url text not null,
  alt text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

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

-- Seed cartas (9 imagenes) ---------------------------------------------
-- alt se deja NULL: el admin lo puede cargar después si quiere mostrar caption.
insert into nahui.reference_letters (url, alt, media_type, sort_order, visible)
select v.url, null, 'image', v.sort_order, true
from (values
  ('/img-cartas-referenciales/carta-01.jpg', 1),
  ('/img-cartas-referenciales/carta-02.jpg', 2),
  ('/img-cartas-referenciales/carta-03.jpg', 3),
  ('/img-cartas-referenciales/carta-04.jpg', 4),
  ('/img-cartas-referenciales/carta-05.jpg', 5),
  ('/img-cartas-referenciales/carta-06.jpg', 6),
  ('/img-cartas-referenciales/carta-07.jpg', 7),
  ('/img-cartas-referenciales/carta-08.jpg', 8),
  ('/img-cartas-referenciales/carta-09.jpg', 9)
) as v(url, sort_order)
where not exists (
  select 1 from nahui.reference_letters r where r.url = v.url
);

-- Evangelizacion (5 fotos) ---------------------------------------------
-- alt se deja NULL: el admin lo puede cargar después si quiere mostrar caption.
insert into nahui.evangelization_media (url, alt, media_type, sort_order, visible)
select v.url, null, 'image', v.sort_order, true
from (values
  ('/img-evangelizacion/evang-01.jpg', 1),
  ('/img-evangelizacion/evang-02.jpg', 2),
  ('/img-evangelizacion/evang-03.jpg', 3),
  ('/img-evangelizacion/evang-04.jpg', 4),
  ('/img-evangelizacion/evang-05.jpg', 5),
  ('/img-evangelizacion/evang-06.jpg', 6),
  ('/img-evangelizacion/evang-07.jpg', 7),
  ('/img-evangelizacion/evang-08.jpg', 8),
  ('/img-evangelizacion/evang-09.jpg', 9)
) as v(url, sort_order)
where not exists (
  select 1 from nahui.evangelization_media e where e.url = v.url
);
