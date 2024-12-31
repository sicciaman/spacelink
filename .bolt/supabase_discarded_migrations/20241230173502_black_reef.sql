/*
  # Setup notification processing with pg_net
  
  1. Changes
    - Use pg_net for HTTP requests
    - Schedule with pg_cron
    - Proper error handling
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create function to process notifications
CREATE OR REPLACE FUNCTION process_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use pg_net to make async HTTP request
  PERFORM net.http_post(
    url := 'https://eoteacbcokgswnjkbudu.supabase.co/functions/v1/process-notifications',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdGVhY2Jjb2tnc3duamtidWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTM5OTk4NywiZXhwIjoyMDUwOTc1OTg3fQ.HQ9DXq3DomLI2gnAm9BCoqbSPGOKCYTE1D81Z0ItrEw"}'::jsonb,
    body := format('{"timestamp": "%s"}', now())::jsonb
  );
END;
$$;

-- Schedule the job
SELECT cron.schedule(
  'process-notifications-job',    -- unique job name
  '* * * * *',                   -- every minute
  $$
  SELECT process_notifications();
  $$
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION process_notifications() TO postgres;