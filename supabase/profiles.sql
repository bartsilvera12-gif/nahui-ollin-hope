-- =====================================================================
-- Nahui Ollin Inc — tabla nahui.profiles + seed del usuario admin
-- Pegar este archivo en Supabase SQL Editor → Run.
-- Idempotente: se puede re-ejecutar sin romper nada.
-- =====================================================================

-- 1) Tabla nahui.profiles -------------------------------------------------
-- id mapea 1:1 contra auth.users.id. Si se borra el usuario en auth,
-- el profile cae en cascada.
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

-- 2) RLS ------------------------------------------------------------------
alter table nahui.profiles enable row level security;

-- Cualquier autenticado puede LEER todos los profiles (útil para listar
-- staff en el admin).
drop policy if exists "authenticated read profiles" on nahui.profiles;
create policy "authenticated read profiles"
  on nahui.profiles for select
  to authenticated
  using (true);

-- Cada usuario solo puede actualizar su PROPIO profile.
drop policy if exists "users update own profile" on nahui.profiles;
create policy "users update own profile"
  on nahui.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Solo se puede insertar profile para uno mismo (defensa adicional aparte
-- del trigger auto-create).
drop policy if exists "users insert own profile" on nahui.profiles;
create policy "users insert own profile"
  on nahui.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- Grants en la tabla nueva
grant select         on nahui.profiles to anon;
grant select, insert, update on nahui.profiles to authenticated;

-- 3) Trigger auto-create profile al crear usuario en auth.users -----------
-- Cuando alguien se cree en Authentication > Users, automáticamente le
-- generamos su fila en nahui.profiles.
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

-- 4) Seed: profile para el usuario Neura ----------------------------------
do $$
begin
  if exists (
    select 1 from auth.users
    where id = '08b2d8b5-10a2-4fd5-82a8-89abf311608b'::uuid
  ) then
    insert into nahui.profiles (id, email, full_name, role)
    values (
      '08b2d8b5-10a2-4fd5-82a8-89abf311608b'::uuid,
      'neurautomations@gmail.com',
      'Neura',
      'admin'
    )
    on conflict (id) do update set
      email     = excluded.email,
      full_name = excluded.full_name,
      role      = excluded.role,
      updated_at = now();
    raise notice 'Profile creado/actualizado para Neura ✓';
  else
    raise exception
      'El usuario 08b2d8b5-10a2-4fd5-82a8-89abf311608b NO existe en auth.users. Creálo primero en Authentication > Users (o con supabase/create-admin.sql) y volvé a correr este script.';
  end if;
end $$;

-- 5) Confirmación
select id, email, full_name, role from nahui.profiles
where id = '08b2d8b5-10a2-4fd5-82a8-89abf311608b'::uuid;
