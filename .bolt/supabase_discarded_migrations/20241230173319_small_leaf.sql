/*
  # Setup notification processing
  
  1. Changes
    - Remove pg_cron dependency
    - Simplify notification processing
    - Use Edge Functions with cron.json instead
*/

-- Enable http extension only
CREATE EXTENSION IF NOT EXISTS http;

-- Create function to call Edge Function
CREATE OR REPLACE FUNCTION process_pending_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_response http_response;
BEGIN
  -- Call Edge Function
  SELECT * INTO v_response FROM http_post(
    'https://eoteacbcokgswnjkbudu.supabase.co/functions/v1/process-notifications',
    '{}'::jsonb,
    ARRAY[
      http_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdGVhY2Jjb2tnc3duamtidWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTM5OTk4NywiZXhwIjoyMDUwOTc1OTg3fQ.HQ9DXq3DomLI2gnAm9BCoqbSPGOKCYTE1D81Z0ItrEw'),
      http_header('Content-Type', 'application/json')
    ]
  );

  -- Log response
  IF v_response.status != 200 THEN
    RAISE WARNING 'Failed to process notifications: status=%, body=%', 
      v_response.status, 
      v_response.content;
  END IF;
END;
$$;