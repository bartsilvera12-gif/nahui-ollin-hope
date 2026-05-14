-- Agrega soporte para videos en la galería
-- Correr en el SQL editor de Supabase

alter table nahui.gallery_images
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image', 'video'));

create index if not exists gallery_media_type_idx on nahui.gallery_images (media_type);
