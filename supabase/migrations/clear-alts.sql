-- =====================================================================
-- Vaciar las descripciones (alt) de TODAS las imágenes ya cargadas en:
--   gallery_images, evangelization_media, reference_letters
-- Pegar en Supabase SQL Editor → Run. Idempotente.
-- =====================================================================

-- Galería
update gallery_images
   set alt = null
 where alt is not null;

-- Evangelización
update evangelization_media
   set alt = null
 where alt is not null;

-- Cartas referenciales
update reference_letters
   set alt = null
 where alt is not null;

-- Confirmación: cuántas filas quedan con alt no-nulo (debería ser 0 en todas)
select 'gallery_images'      as tabla, count(*) filter (where alt is not null) as con_alt, count(*) as total from gallery_images
union all
select 'evangelization_media' as tabla, count(*) filter (where alt is not null) as con_alt, count(*) as total from evangelization_media
union all
select 'reference_letters'    as tabla, count(*) filter (where alt is not null) as con_alt, count(*) as total from reference_letters;
