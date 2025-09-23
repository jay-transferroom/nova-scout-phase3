-- SECURITY FIXES: Critical Issues Resolution (Fixed)

-- 1. FIX PROFILES TABLE RECURSION ISSUE
-- Drop existing problematic policies that cause recursion
DROP POLICY IF EXISTS "Management can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Management can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Management can create profiles" ON public.profiles;

-- Create safe policies using security definer function
CREATE POLICY "Management can view profiles (safe)" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = id) OR 
  (public.get_current_user_role() IN ('recruitment', 'director'))
);

CREATE POLICY "Management can update profiles (safe)" 
ON public.profiles 
FOR UPDATE 
USING (
  (auth.uid() = id) OR 
  (public.get_current_user_role() IN ('recruitment', 'director'))
)
WITH CHECK (
  (auth.uid() = id) OR 
  (public.get_current_user_role() IN ('recruitment', 'director'))
);

CREATE POLICY "Management can create profiles (safe)" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.get_current_user_role() IN ('recruitment', 'director'));

-- 2. SECURE SHORTLISTS - Remove overly permissive policies
DROP POLICY IF EXISTS "Everyone can view shortlists" ON public.shortlists;

-- Replace with restricted access
CREATE POLICY "Restricted shortlist viewing" 
ON public.shortlists 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (is_scouting_assignment_list = true AND auth.uid() IS NOT NULL) OR
  (public.get_current_user_role() IN ('recruitment', 'director'))
);

-- 3. SECURE SHORTLIST PLAYERS - Remove overly permissive policies
DROP POLICY IF EXISTS "Everyone can view shortlist players" ON public.shortlist_players;

-- Replace with restricted access
CREATE POLICY "Restricted shortlist players viewing" 
ON public.shortlist_players 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM shortlists s 
    WHERE s.id = shortlist_players.shortlist_id 
    AND (
      s.user_id = auth.uid() OR 
      (s.is_scouting_assignment_list = true AND auth.uid() IS NOT NULL) OR
      public.get_current_user_role() IN ('recruitment', 'director')
    )
  )
);

-- 4. SECURE CLUB SETTINGS - Restrict to authenticated users only
DROP POLICY IF EXISTS "Everyone can view club settings" ON public.club_settings;

CREATE POLICY "Authenticated users can view club settings" 
ON public.club_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 5. SECURE TEAMS TABLE - Should require authentication
DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;

-- Replace with authenticated access only
CREATE POLICY "Authenticated users can view teams (secure)" 
ON public.teams 
FOR SELECT 
USING (auth.uid() IS NOT NULL);