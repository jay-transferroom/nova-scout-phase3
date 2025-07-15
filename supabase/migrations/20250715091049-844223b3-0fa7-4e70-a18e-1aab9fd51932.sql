-- Update RLS policies to allow director users to manage all profiles

-- Drop existing recruitment-only policies
DROP POLICY IF EXISTS "Recruitment users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Recruitment users can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Recruitment users can insert profiles" ON public.profiles;

-- Create new policies that allow both recruitment and director users
CREATE POLICY "Recruitment and director users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  get_current_user_role() = 'recruitment' OR 
  get_current_user_role() = 'director'
);

CREATE POLICY "Recruitment and director users can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  get_current_user_role() = 'recruitment' OR 
  get_current_user_role() = 'director'
);

CREATE POLICY "Recruitment and director users can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  get_current_user_role() = 'recruitment' OR 
  get_current_user_role() = 'director'
);