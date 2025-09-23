-- Phase 1: Emergency Data Protection - Secure publicly exposed tables
-- Fix critical security vulnerabilities in players, fixtures, and related tables

-- PLAYERS TABLE: Remove public access, require authentication
DROP POLICY IF EXISTS "Allow public delete to players" ON public.players;
DROP POLICY IF EXISTS "Allow public insert to players" ON public.players;
DROP POLICY IF EXISTS "Allow public read access to players" ON public.players;
DROP POLICY IF EXISTS "Allow public update to players" ON public.players;

-- Create secure policies for players table
CREATE POLICY "Authenticated users can view players" 
ON public.players 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Recruitment and director can manage players" 
ON public.players 
FOR ALL 
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

-- PLAYER_RECENT_FORM TABLE: Remove public access, require authentication
DROP POLICY IF EXISTS "Allow public delete to player_recent_form" ON public.player_recent_form;
DROP POLICY IF EXISTS "Allow public insert to player_recent_form" ON public.player_recent_form;
DROP POLICY IF EXISTS "Allow public read access to player_recent_form" ON public.player_recent_form;
DROP POLICY IF EXISTS "Allow public update to player_recent_form" ON public.player_recent_form;

-- Create secure policies for player_recent_form table
CREATE POLICY "Authenticated users can view player recent form" 
ON public.player_recent_form 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Recruitment and director can manage player recent form" 
ON public.player_recent_form 
FOR ALL 
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

-- FIXTURES TABLE: Remove public access, require authentication
DROP POLICY IF EXISTS "Allow public delete to fixtures" ON public.fixtures;
DROP POLICY IF EXISTS "Allow public insert to fixtures" ON public.fixtures;
DROP POLICY IF EXISTS "Allow public read access to fixtures" ON public.fixtures;
DROP POLICY IF EXISTS "Allow public update to fixtures" ON public.fixtures;

-- Create secure policies for fixtures table
CREATE POLICY "Authenticated users can view fixtures" 
ON public.fixtures 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Recruitment and director can manage fixtures" 
ON public.fixtures 
FOR ALL 
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

-- PLAYER_FIXTURES TABLE: Remove public access, require authentication
DROP POLICY IF EXISTS "Allow public delete to player_fixtures" ON public.player_fixtures;
DROP POLICY IF EXISTS "Allow public insert to player_fixtures" ON public.player_fixtures;
DROP POLICY IF EXISTS "Allow public read access to player_fixtures" ON public.player_fixtures;
DROP POLICY IF EXISTS "Allow public update to player_fixtures" ON public.player_fixtures;

-- Create secure policies for player_fixtures table
CREATE POLICY "Authenticated users can view player fixtures" 
ON public.player_fixtures 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Recruitment and director can manage player fixtures" 
ON public.player_fixtures 
FOR ALL 
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

-- PLAYERS_NEW TABLE: Secure the main players data source
DROP POLICY IF EXISTS "Allow authenticated users to delete from players_new" ON public.players_new;
DROP POLICY IF EXISTS "Allow authenticated users to insert into players_new" ON public.players_new;
DROP POLICY IF EXISTS "Allow authenticated users to select from players_new" ON public.players_new;
DROP POLICY IF EXISTS "Allow authenticated users to update players_new" ON public.players_new;

-- Create secure policies for players_new table
CREATE POLICY "Authenticated users can view players_new" 
ON public.players_new 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Recruitment and director can manage players_new" 
ON public.players_new 
FOR ALL 
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

-- Phase 2: Fix database functions security issues
-- Fix get_current_user_role function to be immutable and secure
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;