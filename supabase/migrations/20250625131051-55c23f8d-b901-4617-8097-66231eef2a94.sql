
-- First, drop the existing foreign key constraint
ALTER TABLE public.reports 
DROP CONSTRAINT IF EXISTS reports_player_id_fkey;

-- Now change the player_id column from UUID to TEXT to handle both UUID and numeric IDs
ALTER TABLE public.reports 
ALTER COLUMN player_id TYPE text;

-- Add a comment to document the mixed ID types
COMMENT ON COLUMN public.reports.player_id IS 'Can contain UUID (from players table) or numeric string ID (from players_new table)';
