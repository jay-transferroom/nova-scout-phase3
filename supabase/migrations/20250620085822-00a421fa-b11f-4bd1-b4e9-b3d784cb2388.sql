
-- Add sample xTV, TransferRoom, and Future rating data to existing players
-- Using realistic values based on player quality tiers

-- Update players with sample ratings (using random but realistic values)
UPDATE public.players 
SET 
  xtv_score = CASE 
    WHEN random() < 0.3 THEN round((random() * 3 + 7)::numeric, 1) -- Top tier: 7-10
    WHEN random() < 0.6 THEN round((random() * 2 + 5)::numeric, 1) -- Mid tier: 5-7
    ELSE round((random() * 2 + 3)::numeric, 1) -- Lower tier: 3-5
  END,
  transferroom_rating = CASE 
    WHEN random() < 0.3 THEN round((random() * 2 + 8)::numeric, 1) -- Top tier: 8-10
    WHEN random() < 0.6 THEN round((random() * 2.5 + 5.5)::numeric, 1) -- Mid tier: 5.5-8
    ELSE round((random() * 2 + 3.5)::numeric, 1) -- Lower tier: 3.5-5.5
  END,
  future_rating = CASE 
    WHEN age <= 23 THEN round((random() * 3 + 6)::numeric, 1) -- Young players: 6-9
    WHEN age <= 27 THEN round((random() * 2 + 5)::numeric, 1) -- Prime age: 5-7
    ELSE round((random() * 2 + 3)::numeric, 1) -- Older players: 3-5
  END
WHERE xtv_score IS NULL OR transferroom_rating IS NULL OR future_rating IS NULL;
