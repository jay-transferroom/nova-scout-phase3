
-- Create/update the trigger function to automatically create profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(new.raw_user_meta_data ->> 'role', 'scout')
  );
  RETURN new;
END;
$$;

-- Create the trigger that fires when a new user signs up (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now let's recreate any missing profiles for existing users
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
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Ensure your specific profile has the correct role
UPDATE public.profiles 
SET role = 'recruitment' 
WHERE email = 'hello@jayhughes.co.uk';
