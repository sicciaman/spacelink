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

  -- Update purchases with expired posts
  UPDATE purchases
  SET posts_remaining = 0
  WHERE expires_at < now()
    AND posts_remaining > 0;

  -- Create notifications for items expiring in 2 days
  INSERT INTO admin_notifications (type, data)
  SELECT 
    'subscription_expiring_soon',
    jsonb_build_object(
      'user_id', user_id,
      'expires_at', current_period_end
    )
  FROM subscriptions
  WHERE status IN ('active', 'cancelled')
    AND current_period_end > now()
    AND current_period_end <= now() + interval '2 days'
    AND NOT EXISTS (
      SELECT 1 FROM admin_notifications
      WHERE type = 'subscription_expiring_soon'
      AND (data->>'user_id')::uuid = subscriptions.user_id
      AND sent_at IS NULL
    );

  INSERT INTO admin_notifications (type, data)
  SELECT 
    'package_expiring_soon',
    jsonb_build_object(
      'user_id', user_id,
      'package_id', package_id,
      'expires_at', expires_at,
      'posts_remaining', posts_remaining
    )
  FROM purchases
  WHERE expires_at > now()
    AND expires_at <= now() + interval '2 days'
    AND posts_remaining > 0
    AND NOT EXISTS (
      SELECT 1 FROM admin_notifications
      WHERE type = 'package_expiring_soon'
      AND (data->>'package_id')::uuid = purchases.id
      AND sent_at IS NULL
    );

  -- Create notifications for expired items
  INSERT INTO admin_notifications (type, data)
  SELECT 
    'subscription_expired',
    jsonb_build_object(
      'user_id', user_id,
      'expired_at', current_period_end
    )
  FROM subscriptions
  WHERE status = 'expired'
    AND current_period_end < now()
    AND NOT EXISTS (
      SELECT 1 FROM admin_notifications
      WHERE type = 'subscription_expired'
      AND (data->>'user_id')::uuid = subscriptions.user_id
      AND sent_at IS NULL
    );

  INSERT INTO admin_notifications (type, data)
  SELECT 
    'package_expired',
    jsonb_build_object(
      'user_id', user_id,
      'package_id', package_id,
      'expired_at', expires_at,
      'remaining_posts', posts_remaining
    )
  FROM purchases
  WHERE expires_at < now()
    AND posts_remaining > 0
    AND NOT EXISTS (
      SELECT 1 FROM admin_notifications
      WHERE type = 'package_expired'
      AND (data->>'package_id')::uuid = purchases.id
      AND sent_at IS NULL
    );
END;
$$;

-- Create cron job to run expiration check every hour
SELECT cron.schedule(
  'handle-expirations',
  '0 * * * *', -- Every hour
  'SELECT handle_expirations()'
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_expirations TO postgres;