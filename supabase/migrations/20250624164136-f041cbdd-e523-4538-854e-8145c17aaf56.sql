
-- First, let's check what profiles exist
SELECT id, email, first_name, last_name, role, club_id, created_at 
FROM public.profiles 
ORDER BY created_at;

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
  CASE 
    WHEN au.email = 'hello@jayhughes.co.uk' THEN 'recruitment'
    ELSE COALESCE(au.raw_user_meta_data ->> 'role', 'scout')
  END as role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Ensure your specific profile has the correct role
UPDATE public.profiles 
SET role = 'recruitment' 
WHERE email = 'hello@jayhughes.co.uk';

-- Verify the results
SELECT id, email, first_name, last_name, role, club_id, created_at 
FROM public.profiles 
ORDER BY created_at;
