
-- Create a table for private players that users can add manually
CREATE TABLE public.private_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by_user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  club TEXT,
  age INTEGER,
  date_of_birth DATE,
  positions TEXT[] DEFAULT '{}',
  nationality TEXT,
  dominant_foot TEXT CHECK (dominant_foot IN ('Left', 'Right', 'Both')),
  region TEXT,
  notes TEXT,
  source_context TEXT, -- How/where they discovered this player
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'organization')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see appropriate players
ALTER TABLE public.private_players ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own private players
CREATE POLICY "Users can view their own private players" 
  ON public.private_players 
  FOR SELECT 
  USING (created_by_user_id = auth.uid());

-- Create policy that allows users to insert their own private players
CREATE POLICY "Users can create private players" 
  ON public.private_players 
  FOR INSERT 
  WITH CHECK (created_by_user_id = auth.uid());

-- Create policy that allows users to update their own private players
CREATE POLICY "Users can update their own private players" 
  ON public.private_players 
  FOR UPDATE 
  USING (created_by_user_id = auth.uid());

-- Create policy that allows users to delete their own private players
CREATE POLICY "Users can delete their own private players" 
  ON public.private_players 
  FOR DELETE 
  USING (created_by_user_id = auth.uid());

-- Add index for better performance
CREATE INDEX idx_private_players_created_by ON public.private_players(created_by_user_id);
CREATE INDEX idx_private_players_name ON public.private_players(name);
