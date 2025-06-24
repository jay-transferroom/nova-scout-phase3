
-- Create a table to track which players users are following
CREATE TABLE public.player_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  player_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, player_id)
);

-- Add Row Level Security (RLS) to ensure users can only see their own tracking
ALTER TABLE public.player_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own tracking records
CREATE POLICY "Users can view their own player tracking" 
  ON public.player_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own tracking records
CREATE POLICY "Users can create their own player tracking" 
  ON public.player_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own tracking records
CREATE POLICY "Users can delete their own player tracking" 
  ON public.player_tracking 
  FOR DELETE 
  USING (auth.uid() = user_id);
