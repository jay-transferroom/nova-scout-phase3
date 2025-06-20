
-- Create the player_notes table
CREATE TABLE public.player_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.player_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for player_notes
CREATE POLICY "Anyone can view player notes" 
  ON public.player_notes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create notes" 
  ON public.player_notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own notes" 
  ON public.player_notes 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own notes" 
  ON public.player_notes 
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Create an index for better performance when querying by player_id
CREATE INDEX idx_player_notes_player_id ON public.player_notes(player_id);

-- Create an index for better performance when querying by author_id
CREATE INDEX idx_player_notes_author_id ON public.player_notes(author_id);
