-- Create function to handle expirations
CREATE OR REPLACE FUNCTION handle_expirations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update expired subscriptions
  UPDATE subscriptions
  SET status = 'expired'
  WHERE status IN ('active', 'cancelled')
    AND current_period_end < now();

  -- Update purchases table to track expiration
  UPDATE purchases
  SET posts_remaining = 0
  WHERE expires_at < now()
    AND posts_remaining > 0;

  -- Create notifications for expired items
  INSERT INTO admin_notifications (type, data)
  SELECT 
    'subscription_expired',
    jsonb_build_object(
      'user_id', user_id,
      'expired_at', current_period_end
    )
  FROM subscriptions
  WHERE status IN ('active', 'cancelled')
    AND current_period_end < now();

  INSERT INTO admin_notifications (type, data)
  SELECT 
    'package_expired',
    jsonb_build_object(
      'user_id', user_id,
      'package_id', package_id,
      'expired_at', expires_at
    )
  FROM purchases
  WHERE expires_at < now()
    AND posts_remaining > 0;
END;
$$;

-- Create cron job to run expiration check every hour
SELECT cron.schedule(
  'handle-expirations',
  '0 * * * *', -- Every hour
  'SELECT handle_expirations()'
);

-- Create function to check if package is expired
CREATE OR REPLACE FUNCTION is_package_expired(package_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM purchases
    WHERE id = package_id
      AND (
        expires_at < now()
        OR posts_remaining = 0
      )
  );
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_expirations TO postgres;
GRANT EXECUTE ON FUNCTION is_package_expired TO authenticated;