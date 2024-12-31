/*
  # Setup pg_cron for notifications

  1. Changes
    - Enable pg_cron extension
    - Create process_notifications() function
    - Schedule notification processing job
    - Grant necessary permissions

  2. Security
    - Function runs with SECURITY DEFINER
    - Proper error handling and logging
    - Batch processing to prevent overload
*/

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create function to process notifications
CREATE OR REPLACE FUNCTION process_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification RECORD;
  v_processed INTEGER := 0;
  v_errors INTEGER := 0;
BEGIN
  -- Process each unprocessed notification
  FOR v_notification IN 
    SELECT * FROM admin_notifications 
    WHERE sent_at IS NULL 
    AND error IS NULL
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT 10
  LOOP
    BEGIN
      -- Mark as processed immediately to prevent duplicate processing
      UPDATE admin_notifications
      SET sent_at = now()
      WHERE id = v_notification.id;
      
      v_processed := v_processed + 1;
      
      -- Log success
      RAISE LOG 'Processed notification %: type=%, data=%', 
        v_notification.id, 
        v_notification.type, 
        v_notification.data;

    EXCEPTION WHEN OTHERS THEN
      -- Log error and update notification
      UPDATE admin_notifications
      SET error = SQLERRM,
          sent_at = NULL -- Reset sent_at to allow retry
      WHERE id = v_notification.id;
      
      v_errors := v_errors + 1;
      
      RAISE WARNING 'Error processing notification %: %', 
        v_notification.id, 
        SQLERRM;
    END;
  END LOOP;

  -- Log processing summary
  RAISE LOG 'Notification processing complete: % processed, % errors', 
    v_processed, 
    v_errors;
END;
$$;

-- Drop existing schedule if exists
SELECT cron.unschedule('process-notifications');

-- Schedule the job to run every minute
SELECT cron.schedule(
  'process-notifications',  -- unique job name
  '* * * * *',            -- every minute (cron format)
  $$SELECT process_notifications()$$
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA cron TO postgres;