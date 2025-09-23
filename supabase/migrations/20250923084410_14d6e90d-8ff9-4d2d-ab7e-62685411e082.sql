-- Fix remaining function security issue
-- Address the update_updated_at_column function search path

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Check for any tables with RLS enabled but no policies by securing common tables
-- Secure the teams table which should require authentication but may be missing policies
CREATE POLICY "Authenticated users can view teams" 
ON public.teams 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Secure kv_store if it exists and has RLS enabled
-- Add RLS policies to kv_store table for security
CREATE POLICY "Service role can access kv_store" 
ON public.kv_store_0b058238 
FOR ALL 
USING (auth.role() = 'service_role');

-- Enable RLS on kv_store if not already enabled
ALTER TABLE public.kv_store_0b058238 ENABLE ROW LEVEL SECURITY;