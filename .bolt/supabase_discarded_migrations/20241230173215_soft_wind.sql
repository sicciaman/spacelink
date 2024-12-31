/*
  # Setup pg_cron notification trigger

  1. Changes
    - Enable required extensions
    - Create notification trigger function
    - Setup cron job schedule
    
  2. Security
    - Function runs with SECURITY DEFINER
    - Proper error handling
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Create function to call Edge Function
CREATE OR REPLACE FUNCTION trigger_process_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_response http_response;
BEGIN
  -- Call Edge Function using real values
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
    RAISE WARNING 'Edge Function call failed: status=%, body=%', 
      v_response.status, 
      v_response.content;
  ELSE
    RAISE LOG 'Edge Function called successfully: %', v_response.content;
  END IF;
END;
$$;

-- Create the cron job directly without removing existing
SELECT cron.schedule(
  'process-notifications',         -- unique job name
  '* * * * *',                    -- every minute (cron format)
  'SELECT trigger_process_notifications()'
);

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION trigger_process_notifications() TO postgres;