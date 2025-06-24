
-- First, let's clear the existing clubs table and populate it with clubs from players_new
TRUNCATE TABLE public.clubs RESTART IDENTITY CASCADE;

-- Insert unique clubs from players_new into clubs table
INSERT INTO public.clubs (name, league, country)
SELECT DISTINCT 
  COALESCE(currentteam, parentteam) as name,
  NULL as league,  -- We don't have league info in players_new
  firstnationality as country
FROM public.players_new 
WHERE COALESCE(currentteam, parentteam) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Update clubs table to have better structure for the clubs we found
UPDATE public.clubs 
SET 
  league = CASE 
    WHEN country = 'England' THEN 'Premier League'
    WHEN country = 'Spain' THEN 'La Liga'
    WHEN country = 'Germany' THEN 'Bundesliga'
    WHEN country = 'Italy' THEN 'Serie A'
    WHEN country = 'France' THEN 'Ligue 1'
    ELSE 'Other'
  END
WHERE league IS NULL;
