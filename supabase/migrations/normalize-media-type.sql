-- =====================================================================
-- Normaliza media_type en gallery_images, evangelization_media y
-- reference_letters según la extensión de la URL.
-- Pegar en Supabase SQL Editor → Run.
-- =====================================================================

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

-- Confirmación: ver cuántas filas hay de cada tipo
select 'gallery_images' as tabla, media_type, count(*) from nahui.gallery_images group by media_type
union all
select 'evangelization_media', media_type, count(*) from nahui.evangelization_media group by media_type
union all
select 'reference_letters', media_type, count(*) from nahui.reference_letters group by media_type
order by tabla, media_type;
