-- Allow recruitment/director to manage shortlist players across all shortlists
-- Insert policy
CREATE POLICY "Recruitment and director can insert shortlist players"
ON public.shortlist_players
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
);

-- Delete policy
CREATE POLICY "Recruitment and director can delete shortlist players"
ON public.shortlist_players
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
);

-- Update policy
CREATE POLICY "Recruitment and director can update shortlist players"
ON public.shortlist_players
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
);

-- Allow recruitment/director to update and delete any shortlists (CRUD management)
CREATE POLICY "Recruitment and director can update any shortlists"
ON public.shortlists
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
);

CREATE POLICY "Recruitment and director can delete any shortlists"
ON public.shortlists
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
);