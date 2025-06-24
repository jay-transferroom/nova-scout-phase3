
-- Update the user profile to have jay@transferroom.com email and recruitment role
UPDATE public.profiles 
SET 
  email = 'jay@transferroom.com',
  role = 'recruitment'
WHERE id = '4843ff42-a04b-4a79-aa8c-c4d7200501d2';
