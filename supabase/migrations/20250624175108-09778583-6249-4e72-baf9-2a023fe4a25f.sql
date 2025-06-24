
-- First, drop the foreign key constraint
ALTER TABLE public.scouting_assignments 
DROP CONSTRAINT IF EXISTS scouting_assignments_player_id_fkey;

-- Now change the column type to text to match players_new.id
ALTER TABLE public.scouting_assignments 
ALTER COLUMN player_id TYPE text;

-- Note: We're not adding a new foreign key to players_new because it uses bigint IDs
-- The application will handle the relationship through queries
