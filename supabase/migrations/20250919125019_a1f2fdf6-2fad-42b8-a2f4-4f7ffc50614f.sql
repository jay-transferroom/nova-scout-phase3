-- Add a field to identify system-wide assigned for scouting list
ALTER TABLE public.shortlists 
ADD COLUMN is_scouting_assignment_list BOOLEAN DEFAULT FALSE;

-- Create the global "Assigned for scouting" list
INSERT INTO public.shortlists (
  name, 
  description, 
  color, 
  user_id, 
  is_scouting_assignment_list
) VALUES (
  'Assigned for Scouting',
  'Players assigned by scout managers for scouting assessment',
  'bg-orange-500',
  (SELECT id FROM auth.users LIMIT 1), -- Use first user as owner, but it's globally accessible
  TRUE
) ON CONFLICT DO NOTHING;

-- Update RLS policies to allow all authenticated users to view the scouting assignment list
CREATE POLICY "Everyone can view scouting assignment list" 
ON public.shortlists 
FOR SELECT 
USING (is_scouting_assignment_list = TRUE OR auth.uid() = user_id);

-- Allow recruitment/director users to modify the scouting assignment list
CREATE POLICY "Recruitment can manage scouting assignment list" 
ON public.shortlist_players 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.shortlists 
  WHERE shortlists.id = shortlist_players.shortlist_id 
  AND shortlists.is_scouting_assignment_list = TRUE
  AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('recruitment', 'director'))
  )
));