
-- First, let's check if the user exists
SELECT id, email, first_name, last_name, role, club_id
FROM public.profiles 
WHERE email = 'jay.hughes@transferroom.com';

-- If the user doesn't exist, we need to create the profile
-- This assumes the user exists in auth.users but not in profiles
INSERT INTO public.profiles (id, email, first_name, last_name, role, club_id)
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data ->> 'first_name',
    u.raw_user_meta_data ->> 'last_name',
    'recruitment',
    (SELECT id FROM public.clubs WHERE name ILIKE '%chelsea%' LIMIT 1)
FROM auth.users u
WHERE u.email = 'jay.hughes@transferroom.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.email = 'jay.hughes@transferroom.com'
  );

-- Update the user profile to have recruitment role and Chelsea club
UPDATE public.profiles 
SET 
  role = 'recruitment',
  club_id = (SELECT id FROM public.clubs WHERE name ILIKE '%chelsea%' LIMIT 1)
WHERE email = 'jay.hughes@transferroom.com';

-- Verify the changes
SELECT id, email, first_name, last_name, role, club_id, created_at, updated_at
FROM public.profiles 
WHERE email = 'jay.hughes@transferroom.com';
