
-- Add new rating fields to the players table
ALTER TABLE public.players 
ADD COLUMN xtv_score numeric DEFAULT NULL,
ADD COLUMN transferroom_rating numeric DEFAULT NULL,
ADD COLUMN future_rating numeric DEFAULT NULL;

-- Add comments to clarify the difference between rating types
COMMENT ON COLUMN public.players.xtv_score IS 'Expected Transfer Value score';
COMMENT ON COLUMN public.players.transferroom_rating IS 'TransferRoom platform rating score';
COMMENT ON COLUMN public.players.future_rating IS 'Predicted future potential rating';
