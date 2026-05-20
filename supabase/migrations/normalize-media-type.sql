-- =====================================================================
-- 1) Agrega media_type si falta + 2) Normaliza según extensión de URL
-- Pegar en Supabase SQL Editor → Run. Idempotente.
-- =====================================================================

-- 1) Asegurar la columna media_type en las 3 tablas (idempotente)
alter table nahui.gallery_images
  add column if not exists media_type text not null default 'image'
  check (media_type in ('image', 'video'));

alter table nahui.evangelization_media
  add column if not exists media_type text not null default 'image'
  check (media_type in ('image', 'video'));

alter table nahui.reference_letters
  add column if not exists media_type text not null default 'image'
  check (media_type in ('image', 'video'));

-- 2) Normalizar valores según extensión

-- Galería
update nahui.gallery_images
   set media_type = 'image'
 where lower(url) ~ '\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)'
   and media_type <> 'image';

update nahui.gallery_images
   set media_type = 'video'
 where lower(url) ~ '\.(mp4|webm|ogg|mov|m4v)(\?|$)'
   and media_type <> 'video';

-- Evangelización
update nahui.evangelization_media
   set media_type = 'image'
 where lower(url) ~ '\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)'
   and media_type <> 'image';

update nahui.evangelization_media
   set media_type = 'video'
 where lower(url) ~ '\.(mp4|webm|ogg|mov|m4v)(\?|$)'
   and media_type <> 'video';

-- Cartas referenciales
update nahui.reference_letters
   set media_type = 'image'
 where lower(url) ~ '\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)'
   and media_type <> 'image';

update nahui.reference_letters
   set media_type = 'video'
 where lower(url) ~ '\.(mp4|webm|ogg|mov|m4v)(\?|$)'
   and media_type <> 'video';

-- 3) Confirmación
select 'gallery_images' as tabla, media_type, count(*) from nahui.gallery_images group by media_type
union all
select 'evangelization_media', media_type, count(*) from nahui.evangelization_media group by media_type
union all
select 'reference_letters', media_type, count(*) from nahui.reference_letters group by media_type
order by tabla, media_type;
