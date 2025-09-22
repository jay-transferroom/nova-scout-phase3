-- Remove duplicate players, keeping the most recent entry (highest ID)
WITH duplicates AS (
  SELECT name, MIN(id) as oldest_id
  FROM players_new 
  WHERE name IN (
    SELECT name 
    FROM players_new 
    GROUP BY name 
    HAVING COUNT(*) > 1
  )
  GROUP BY name
)
DELETE FROM players_new 
WHERE id IN (SELECT oldest_id FROM duplicates);

-- Create table for club formation and philosophy settings
CREATE TABLE public.club_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name text NOT NULL,
  formation text NOT NULL DEFAULT '4-3-3',
  style_of_play text,
  philosophy text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by_user_id uuid REFERENCES auth.users(id),
  UNIQUE(club_name)
);

-- Enable RLS
ALTER TABLE public.club_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for club_settings
CREATE POLICY "Everyone can view club settings"
ON public.club_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Recruitment and director can manage club settings"
ON public.club_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('recruitment','director')
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_club_settings_updated_at
BEFORE UPDATE ON public.club_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Chelsea settings
INSERT INTO public.club_settings (club_name, formation, style_of_play, philosophy)
VALUES (
  'Chelsea F.C.',
  '4-3-3',
  'Possession-based with high pressing',
  'Attacking football with emphasis on technical ability, pace, and creativity. Focus on developing young talent while maintaining competitive edge.'
) ON CONFLICT (club_name) DO NOTHING;