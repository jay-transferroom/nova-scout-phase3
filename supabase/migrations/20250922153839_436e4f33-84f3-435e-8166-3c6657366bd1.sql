-- Fix security vulnerability: Restrict player notes access to authenticated users only
-- Remove the overly permissive public read policy
DROP POLICY IF EXISTS "Anyone can view player notes" ON public.player_notes;

-- Create secure policies that restrict access to authenticated users with appropriate roles
CREATE POLICY "Authors can view their own notes" 
ON public.player_notes 
FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Recruitment and director can view all notes" 
ON public.player_notes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('recruitment', 'director')
  )
);

CREATE POLICY "Scouts can view all notes" 
ON public.player_notes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'scout'
  )
);