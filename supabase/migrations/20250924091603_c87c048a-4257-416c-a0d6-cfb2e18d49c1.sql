-- Add RLS policy for fixtures_results_2526 table to allow authenticated users to view fixtures
CREATE POLICY "Authenticated users can view fixtures" 
ON fixtures_results_2526 
FOR SELECT 
USING (auth.uid() IS NOT NULL);