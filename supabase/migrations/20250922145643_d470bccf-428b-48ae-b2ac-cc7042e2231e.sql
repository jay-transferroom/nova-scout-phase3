-- Create table to store player position assignments
CREATE TABLE IF NOT EXISTS public.player_position_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_name TEXT NOT NULL,
  position TEXT NOT NULL,
  player_id TEXT NOT NULL,
  formation TEXT NOT NULL DEFAULT '4-3-3',
  squad_type TEXT NOT NULL DEFAULT 'first-team',
  assigned_by_user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(club_name, position, formation, squad_type)
);

-- Enable RLS
ALTER TABLE public.player_position_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Recruitment and director can manage position assignments"
ON public.player_position_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role IN ('recruitment', 'director')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role IN ('recruitment', 'director')
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_player_position_assignments_updated_at
BEFORE UPDATE ON public.player_position_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();