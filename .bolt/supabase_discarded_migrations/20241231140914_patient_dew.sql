-- Function to handle expired subscriptions and packages
CREATE OR REPLACE FUNCTION handle_expirations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update expired subscriptions
  UPDATE subscriptions
  SET status = 'expired'
  WHERE status = 'active'
    AND current_period_end < now();

  -- Update expired packages (optional)
  UPDATE purchases
  SET posts_remaining = 0
  WHERE expires_at < now()
    AND posts_remaining > 0;
END;
$$;

-- Create a cron job to run every hour
SELECT cron.schedule(
  'handle-expirations',
  '0 * * * *', -- Every hour
  'SELECT handle_expirations()'
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_expirations TO postgres;