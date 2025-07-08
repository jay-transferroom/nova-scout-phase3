-- Update the RLS policy to allow anyone to view private players
DROP POLICY IF EXISTS "Users can view their own private players" ON public.private_players;

-- Create new policy that allows anyone to view private players
CREATE POLICY "Anyone can view private players" 
ON public.private_players 
FOR SELECT 
USING (true);