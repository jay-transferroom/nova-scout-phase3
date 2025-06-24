
-- First, let's see what's in the profiles table
SELECT * FROM public.profiles;

-- Check if there are any users in auth.users but not in profiles
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  p.id as profile_id,
  p.email as profile_email,
  p.role as profile_role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- If we find users in auth.users without profiles, let's recreate them
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data ->> 'first_name' as first_name,
  au.raw_user_meta_data ->> 'last_name' as last_name,
  COALESCE(au.raw_user_meta_data ->> 'role', 'scout') as role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Update your specific role to 'recruitment' since you mentioned you're a Scout Manager
UPDATE public.profiles 
SET role = 'recruitment' 
WHERE email = 'jay.hughes@transferroom.com';

-- Verify the results
SELECT id, email, first_name, last_name, role, club_id, created_at 
FROM public.profiles 
ORDER BY created_at;
