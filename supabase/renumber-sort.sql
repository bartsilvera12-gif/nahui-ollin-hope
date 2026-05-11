-- =====================================================================
-- Renumerar sort_order en todas las tablas a 1, 2, 3, 4...
-- Conserva el orden relativo actual; solo compacta los valores.
-- Idempotente: se puede correr múltiples veces.
-- =====================================================================

-- Stories
with renum as (
  select id, row_number() over (order by sort_order, created_at) as new_order
  from nahui.stories
)
update nahui.stories s
set sort_order = r.new_order
from renum r
where s.id = r.id and s.sort_order is distinct from r.new_order;

-- Actions
with renum as (
  select id, row_number() over (order by sort_order, created_at) as new_order
  from nahui.actions
)
update nahui.actions a
set sort_order = r.new_order
from renum r
where a.id = r.id and a.sort_order is distinct from r.new_order;

-- Gallery
with renum as (
  select id, row_number() over (order by sort_order, created_at) as new_order
  from nahui.gallery_images
)
update nahui.gallery_images g
set sort_order = r.new_order
from renum r
where g.id = r.id and g.sort_order is distinct from r.new_order;

-- Verificación
select * from (
  select 'stories' as tabla, id::text, sort_order, title from nahui.stories
  union all
  select 'actions' as tabla, id::text, sort_order, title from nahui.actions
  union all
  select 'gallery' as tabla, id::text, sort_order, coalesce(alt, url) as title from nahui.gallery_images
) t
order by tabla, sort_order;
