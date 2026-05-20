-- =====================================================================
-- Crear profile admin para usuario YA EXISTENTE en auth.users
--   UUID:  01788ad9-bb7d-4d17-ba27-eac6b099fcb1
--   Email: nahuiollininc@gmail.com
-- Pegar en Supabase SQL Editor → Run. Idempotente.
-- =====================================================================

-- Validación: el user tiene que existir en auth.users
do $$
begin
  if not exists (
    select 1 from auth.users
    where id = '01788ad9-bb7d-4d17-ba27-eac6b099fcb1'::uuid
  ) then
    raise exception 'El usuario 01788ad9-bb7d-4d17-ba27-eac6b099fcb1 NO existe en auth.users. Creálo primero en Authentication > Users.';
  end if;
end $$;

-- Upsert del profile con role=admin
insert into nahui.profiles (id, email, full_name, role)
values (
  '01788ad9-bb7d-4d17-ba27-eac6b099fcb1'::uuid,
  'nahuiollininc@gmail.com',
  'Nahui Ollin Inc',
  'admin'
)
on conflict (id) do update set
  email      = excluded.email,
  full_name  = excluded.full_name,
  role       = excluded.role,
  updated_at = now();

-- Confirmación
select u.id, u.email, u.email_confirmed_at, p.role, p.full_name
from auth.users u
left join nahui.profiles p on p.id = u.id
where u.id = '01788ad9-bb7d-4d17-ba27-eac6b099fcb1'::uuid;
