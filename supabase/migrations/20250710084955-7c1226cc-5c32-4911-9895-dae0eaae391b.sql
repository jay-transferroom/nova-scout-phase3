-- Update shortlists table to add requirement_id for directors
ALTER TABLE public.shortlists 
ADD COLUMN requirement_id uuid DEFAULT NULL;

-- Update RLS policies to allow everyone to view shortlists
DROP POLICY IF EXISTS "Users can view their own shortlists" ON public.shortlists;

CREATE POLICY "Everyone can view shortlists" 
ON public.shortlists 
FOR SELECT 
USING (true);

-- Update shortlist_players policies to allow everyone to view
DROP POLICY IF EXISTS "Users can view players in their shortlists" ON public.shortlist_players;

CREATE POLICY "Everyone can view shortlist players" 
ON public.shortlist_players 
FOR SELECT 
USING (true);