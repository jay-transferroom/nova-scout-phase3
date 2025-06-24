
-- Update the user profile to have jay.hughes@transferroom.com email and recruitment role
UPDATE public.profiles 
SET 
  role = 'recruitment'
WHERE email = 'jay.hughes@transferroom.com';

-- Check if the update was successful
SELECT id, email, first_name, last_name, role, created_at, updated_at
FROM public.profiles 
WHERE email = 'jay.hughes@transferroom.com';
