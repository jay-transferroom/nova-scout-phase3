-- Add reviewed status and reviewed date to scouting assignments
ALTER TABLE public.scouting_assignments 
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS reviewed_by_manager_id uuid REFERENCES public.profiles(id);

-- Update the status enum to include 'reviewed'
-- Note: We'll handle this in the application logic since the current status is just text