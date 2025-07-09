-- Update the reports SELECT policy to allow directors to view all reports
DROP POLICY IF EXISTS "Scouts can view their own reports" ON reports;

CREATE POLICY "Users can view reports based on role" ON reports
FOR SELECT
USING (
  (auth.uid() = scout_id) OR 
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('recruitment', 'director')
  ))
);