-- Create demo users in auth.users table
-- Note: In a real application, users would be created through the signup process
-- This is for demo purposes only

-- Insert demo scout user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'scout@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert demo recruitment manager user  
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'manager@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert demo director user
INSERT INTO auth.users (
  id,
  instance_id, 
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'director@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create corresponding profiles for the demo users
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN u.email = 'scout@demo.com' THEN 'Oliver'
    WHEN u.email = 'manager@demo.com' THEN 'James'
    WHEN u.email = 'director@demo.com' THEN 'Sarah'
  END as first_name,
  CASE 
    WHEN u.email = 'scout@demo.com' THEN 'Smith'
    WHEN u.email = 'manager@demo.com' THEN 'Wilson' 
    WHEN u.email = 'director@demo.com' THEN 'Mitchell'
  END as last_name,
  CASE 
    WHEN u.email = 'scout@demo.com' THEN 'scout'
    WHEN u.email = 'manager@demo.com' THEN 'recruitment'
    WHEN u.email = 'director@demo.com' THEN 'director'
  END as role,
  now() as created_at,
  now() as updated_at
FROM auth.users u 
WHERE u.email IN ('scout@demo.com', 'manager@demo.com', 'director@demo.com')
ON CONFLICT (id) DO NOTHING;