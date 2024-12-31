/*
  # Set up notification processing
  
  1. Enable Extensions
    - Enable pg_net for HTTP requests
  
  2. Create Function
    - Create a function to process notifications that can be called by Supabase scheduler
*/

-- Enable required extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to process notifications
CREATE OR REPLACE FUNCTION process_pending_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://eoteacbcokgswnjkbudu.supabase.co/functions/v1/process-notifications',
    headers := jsonb_build_object(
      'Authorization', 
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdGVhY2Jjb2tnc3duamtidWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTM5OTk4NywiZXhwIjoyMDUwOTc1OTg3fQ.HQ9DXq3DomLI2gnAm9BCoqbSPGOKCYTE1D81Z0ItrEw'
    ),
    timeout_milliseconds := 1000
  );
END;
$$;