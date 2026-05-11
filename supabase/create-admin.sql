-- =====================================================================
-- Crear usuario admin con UUID específico para el panel /admin
-- Pegar en Supabase SQL Editor → reemplazar los dos placeholders → Run.
-- =====================================================================

-- 1) REEMPLAZÁ ESTOS DOS VALORES ANTES DE EJECUTAR:
--    - TU_EMAIL: el correo con el que vas a loguearte en /admin/login
--    - TU_PASSWORD_FUERTE: la contraseña en texto plano (se encripta abajo)

-- Requiere pgcrypto para crypt() + gen_salt(); Supabase la tiene habilitada por default.
create extension if not exists pgcrypto;

-- 2) Insertar usuario en auth.users con UUID fijo ---------------------------
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
  '08b2d8b5-10a2-4fd5-82a8-89abf311608b'::uuid,
  'authenticated',
  'authenticated',
  'TU_EMAIL',                                  -- <--- REEMPLAZAR
  crypt('TU_PASSWORD_FUERTE', gen_salt('bf')), -- <--- REEMPLAZAR (solo el texto entre comillas)
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

-- 3) Identidad de email para que GoTrue acepte el login --------------------
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
  '08b2d8b5-10a2-4fd5-82a8-89abf311608b'::uuid,
  jsonb_build_object(
    'sub', '08b2d8b5-10a2-4fd5-82a8-89abf311608b',
    'email', 'TU_EMAIL'                        -- <--- REEMPLAZAR (mismo email que arriba)
  ),
  'email',
  'TU_EMAIL',                                  -- <--- REEMPLAZAR (mismo email que arriba)
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do update set
  identity_data = excluded.identity_data,
  updated_at = now();

-- 4) Confirmación rápida --------------------------------------------------
-- Después de correr esto, deberías poder hacer login en /admin/login con
-- el email y password que pusiste arriba.
select id, email, email_confirmed_at, role from auth.users where id = '08b2d8b5-10a2-4fd5-82a8-89abf311608b';
