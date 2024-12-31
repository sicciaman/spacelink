-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create function to process notifications
CREATE OR REPLACE FUNCTION process_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification RECORD;
BEGIN
  -- Process each unprocessed notification
  FOR v_notification IN 
    SELECT * FROM admin_notifications 
    WHERE sent_at IS NULL 
    AND error IS NULL
    ORDER BY created_at
    LIMIT 10
  LOOP
    BEGIN
      -- Mark as processed
      UPDATE admin_notifications
      SET sent_at = now()
      WHERE id = v_notification.id;
      
      -- Log success
      RAISE NOTICE 'Processed notification %: type=%, data=%', 
        v_notification.id, 
        v_notification.type, 
        v_notification.data;
    EXCEPTION WHEN OTHERS THEN
      -- Log error and update notification
      UPDATE admin_notifications
      SET error = SQLERRM
      WHERE id = v_notification.id;
      
      RAISE NOTICE 'Error processing notification %: %', 
        v_notification.id, 
        SQLERRM;
    END;
  END LOOP;
END;
$$;

-- Schedule the job to run every minute
SELECT cron.schedule(
  'process-notifications',  -- job name
  '* * * * *',            -- every minute
  'SELECT process_notifications()'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA cron TO postgres;