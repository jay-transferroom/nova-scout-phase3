-- Create shortlists table with user associations
CREATE TABLE public.shortlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT 'bg-gray-500',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own shortlists" 
ON public.shortlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shortlists" 
ON public.shortlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shortlists" 
ON public.shortlists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shortlists" 
ON public.shortlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create shortlist_players junction table for many-to-many relationship
CREATE TABLE public.shortlist_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shortlist_id UUID NOT NULL REFERENCES public.shortlists(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shortlist_players ENABLE ROW LEVEL SECURITY;

-- Create policies for shortlist_players (users can only access players in their shortlists)
CREATE POLICY "Users can view players in their shortlists" 
ON public.shortlist_players 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.shortlists 
  WHERE id = shortlist_id AND user_id = auth.uid()
));

CREATE POLICY "Users can add players to their shortlists" 
ON public.shortlist_players 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.shortlists 
  WHERE id = shortlist_id AND user_id = auth.uid()
));

CREATE POLICY "Users can remove players from their shortlists" 
ON public.shortlist_players 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.shortlists 
  WHERE id = shortlist_id AND user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shortlists_updated_at
BEFORE UPDATE ON public.shortlists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint to prevent duplicate players in same shortlist
ALTER TABLE public.shortlist_players 
ADD CONSTRAINT unique_shortlist_player 
UNIQUE (shortlist_id, player_id);