
-- Update player_tracking table to handle integer player IDs from players_new
ALTER TABLE public.player_tracking 
ALTER COLUMN player_id TYPE text;

-- Update player_notes table to handle integer player IDs from players_new  
ALTER TABLE public.player_notes
ALTER COLUMN player_id TYPE text;

-- Add comments to document the mixed ID types
COMMENT ON COLUMN public.player_tracking.player_id IS 'Can contain UUID (from players table) or numeric string ID (from players_new table)';
COMMENT ON COLUMN public.player_notes.player_id IS 'Can contain UUID (from players table) or numeric string ID (from players_new table)';
