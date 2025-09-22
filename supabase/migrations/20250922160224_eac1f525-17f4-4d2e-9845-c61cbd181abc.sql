-- Fix critical security vulnerability: Restrict profiles table access to prevent email theft
-- Users should only be able to see their own profile data, except for authorized management roles

-- Remove all existing policies to start fresh and avoid conflicts
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Recruitment and director users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Recruitment and director users can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Recruitment and director users can insert profiles" ON public.profiles;

-- Create secure, non-overlapping policies with proper access control
-- Policy 1: Users can only view their own profile (prevents email theft)
CREATE POLICY "Users can view own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can only update their own profile
CREATE POLICY "Users can update own profile only" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Only recruitment and director can view all profiles (for legitimate management)
CREATE POLICY "Management can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('recruitment', 'director')
  )
);

-- Policy 4: Only recruitment and director can create new profiles
CREATE POLICY "Management can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('recruitment', 'director')
  )
);

-- Policy 5: Only recruitment and director can update any profile (for management)
CREATE POLICY "Management can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('recruitment', 'director')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('recruitment', 'director')
  )
);