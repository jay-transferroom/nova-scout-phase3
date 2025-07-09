-- Add 'director' to the role options in the profiles table
-- First, update any existing check constraints or modify the default role logic

-- Update the profiles table to allow 'director' as a role
-- Note: Since there might be constraints on the role column, we'll handle this carefully
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add a new check constraint that includes 'director'
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('scout', 'recruitment', 'director'));

-- Update the default role to still be 'scout' for new users
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'scout';