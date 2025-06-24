
-- First, let's see what we're working with
SELECT name, league, country, COUNT(*) as duplicate_count
FROM public.clubs 
GROUP BY name, league, country 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Create a temporary table with unique clubs (keeping the oldest record for each unique combination)
CREATE TEMP TABLE unique_clubs AS
SELECT DISTINCT ON (LOWER(TRIM(name)), COALESCE(league, ''), COALESCE(country, ''))
    id, name, league, country, logo_url, created_at, updated_at
FROM public.clubs
ORDER BY LOWER(TRIM(name)), COALESCE(league, ''), COALESCE(country, ''), created_at ASC;

-- Update any profile references to point to the kept club records
UPDATE public.profiles 
SET club_id = (
    SELECT uc.id 
    FROM unique_clubs uc 
    JOIN public.clubs original ON LOWER(TRIM(uc.name)) = LOWER(TRIM(original.name))
    WHERE original.id = profiles.club_id
    LIMIT 1
)
WHERE club_id IS NOT NULL;

-- Clear the clubs table
TRUNCATE TABLE public.clubs RESTART IDENTITY CASCADE;

-- Insert the unique clubs back
INSERT INTO public.clubs (id, name, league, country, logo_url, created_at, updated_at)
SELECT id, name, league, country, logo_url, created_at, updated_at
FROM unique_clubs;

-- Verify the cleanup
SELECT COUNT(*) as total_clubs FROM public.clubs;
SELECT name, league, country, COUNT(*) as count
FROM public.clubs 
GROUP BY name, league, country 
HAVING COUNT(*) > 1;
