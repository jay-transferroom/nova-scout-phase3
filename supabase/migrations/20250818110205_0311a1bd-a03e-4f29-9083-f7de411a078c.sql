-- Fix critical security issue: Restrict private players access to owners only

-- Drop the overly permissive policy that allows anyone to view private players
DROP POLICY IF EXISTS "Anyone can view private players" ON public.private_players;

-- Create a new policy that only allows users to view their own private players
CREATE POLICY "Users can view their own private players" 
ON public.private_players 
FOR SELECT 
USING (created_by_user_id = auth.uid());

-- Allow recruitment and director users to view all private players for management purposes
CREATE POLICY "Recruitment and director can view all private players" 
ON public.private_players 
FOR SELECT 
USING (
  get_current_user_role() = 'recruitment' OR 
  get_current_user_role() = 'director'
);