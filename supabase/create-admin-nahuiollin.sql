-- =====================================================================
-- Crear usuario admin "nahuiollininc" con UUID fijo
--   UUID:  01788ad9-bb7d-4d17-ba27-eac6b099fcb1
--   Email: nahuiollininc@gmail.com
--   Pass:  Neura2026!
-- Pegar en Supabase SQL Editor → Run. Idempotente.
-- =====================================================================

create extension if not exists pgcrypto;

-- 1) auth.users -----------------------------------------------------------
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  is_sso_user,
  is_anonymous
) values (
  '00000000-0000-0000-0000-000000000000',
  '01788ad9-bb7d-4d17-ba27-eac6b099fcb1'::uuid,
  'authenticated',
  'authenticated',
  'nahuiollininc@gmail.com',
  crypt('Neura2026!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  '',
  false,
  false
)
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = now();

-- 2) auth.identities ------------------------------------------------------
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  gen_random_uuid(),
  '01788ad9-bb7d-4d17-ba27-eac6b099fcb1'::uuid,
  jsonb_build_object(
    'sub',   '01788ad9-bb7d-4d17-ba27-eac6b099fcb1',
    'email', 'nahuiollininc@gmail.com'
  ),
  'email',
  'nahuiollininc@gmail.com',
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do update set
  identity_data = excluded.identity_data,
  updated_at = now();

-- 3) nahui.profiles -------------------------------------------------------
-- El trigger on_auth_user_created ya inserta el profile automáticamente al
-- correr el paso 1, pero forzamos role='admin' y full_name explícito acá.
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

-- 4) Confirmación ---------------------------------------------------------
select u.id, u.email, u.email_confirmed_at, p.role, p.full_name
from auth.users u
left join nahui.profiles p on p.id = u.id
where u.id = '01788ad9-bb7d-4d17-ba27-eac6b099fcb1'::uuid;
