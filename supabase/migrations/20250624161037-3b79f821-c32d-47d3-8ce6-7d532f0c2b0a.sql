
-- First, let's check if Chelsea F.C. exists in the clubs table
SELECT id, name FROM public.clubs WHERE name ILIKE '%chelsea%';

-- If Chelsea doesn't exist, insert it
INSERT INTO public.clubs (name, league, country, logo_url)
SELECT 'Chelsea F.C.', 'Premier League', 'England', 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png'
WHERE NOT EXISTS (
    SELECT 1 FROM public.clubs WHERE name ILIKE '%chelsea%'
);

-- Get Chelsea's ID for the update
WITH chelsea_club AS (
    SELECT id FROM public.clubs WHERE name ILIKE '%chelsea%' LIMIT 1
)
-- Update all profiles to be associated with Chelsea F.C.
UPDATE public.profiles 
SET club_id = (SELECT id FROM chelsea_club)
WHERE club_id IS NULL OR club_id != (SELECT id FROM chelsea_club);

-- Verify the changes
SELECT 
    p.email, 
    p.first_name, 
    p.last_name, 
    p.role,
    c.name as club_name
FROM public.profiles p
LEFT JOIN public.clubs c ON p.club_id = c.id
ORDER BY p.email;
