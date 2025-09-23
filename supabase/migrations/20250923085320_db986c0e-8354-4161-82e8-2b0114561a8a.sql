-- SECURITY FIXES: Critical Issues Resolution (Force Replace)

-- 1. FIX PROFILES TABLE RECURSION ISSUE (Force replacement)
DROP POLICY IF EXISTS "Management can view profiles (safe)" ON public.profiles;
DROP POLICY IF EXISTS "Management can update profiles (safe)" ON public.profiles;
DROP POLICY IF EXISTS "Management can create profiles (safe)" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile only" ON public.profiles;

-- Create completely new safe policies
CREATE POLICY "Safe profile viewing" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = id) OR 
  (public.get_current_user_role() IN ('recruitment', 'director'))
);

CREATE POLICY "Safe profile updates" 
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

CREATE POLICY "Safe profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.get_current_user_role() IN ('recruitment', 'director'));

-- 2. SECURE SHORTLISTS
DROP POLICY IF EXISTS "Everyone can view shortlists" ON public.shortlists;
DROP POLICY IF EXISTS "Restricted shortlist viewing" ON public.shortlists;

CREATE POLICY "Secure shortlist access" 
ON public.shortlists 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (is_scouting_assignment_list = true AND auth.uid() IS NOT NULL) OR
  (public.get_current_user_role() IN ('recruitment', 'director'))
);

-- 3. SECURE SHORTLIST PLAYERS
DROP POLICY IF EXISTS "Everyone can view shortlist players" ON public.shortlist_players;
DROP POLICY IF EXISTS "Restricted shortlist players viewing" ON public.shortlist_players;

CREATE POLICY "Secure shortlist players access" 
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

-- 4. SECURE CLUB SETTINGS
DROP POLICY IF EXISTS "Everyone can view club settings" ON public.club_settings;
DROP POLICY IF EXISTS "Authenticated users can view club settings" ON public.club_settings;

CREATE POLICY "Secure club settings access" 
ON public.club_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 5. SECURE TEAMS TABLE
DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can view teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can view teams (secure)" ON public.teams;

CREATE POLICY "Secure teams access" 
ON public.teams 
FOR SELECT 
USING (auth.uid() IS NOT NULL);