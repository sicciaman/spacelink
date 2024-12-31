/*
  # Setup pg_cron for Edge Function with environment variables

  1. Changes
    - Enable pg_cron and http extensions
    - Create function to call Edge Function using environment variables
    - Schedule cron job safely
    - Grant necessary permissions

  2. Security
    - Function runs with SECURITY DEFINER
    - Proper error handling and logging
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
  -- Call Edge Function using environment variables
  SELECT * INTO v_response FROM http_post(
    'http://localhost:54321/functions/v1/process-notifications',
    '{}'::jsonb,
    ARRAY[
      http_header('Authorization', 'Bearer ' || NULLIF(current_setting('app.settings.service_role_key', true), '')),
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

-- Safely remove existing schedule if it exists
DO $$
BEGIN
  PERFORM cron.unschedule('trigger-process-notifications');
EXCEPTION
  WHEN OTHERS THEN
    -- Job doesn't exist, ignore the error
    NULL;
END $$;

-- Schedule the job to run every minute
SELECT cron.schedule(
  'trigger-process-notifications',  -- unique job name
  '* * * * *',                     -- every minute (cron format)
  'SELECT trigger_process_notifications()'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA cron TO postgres;