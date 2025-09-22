-- Add tags column to player_notes table
ALTER TABLE public.player_notes 
ADD COLUMN tags TEXT[] DEFAULT '{}';