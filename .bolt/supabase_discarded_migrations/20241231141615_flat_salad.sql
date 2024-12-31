-- Create function to handle package expirations
CREATE OR REPLACE FUNCTION handle_package_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update purchases table to expire packages
  UPDATE purchases
  SET posts_remaining = 0
  WHERE expires_at < now()
    AND posts_remaining > 0;

  -- Create notifications for expired packages
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
    AND posts_remaining > 0;
END;
$$;

-- Create cron job to run expiration check every hour
SELECT cron.schedule(
  'handle-package-expiration',
  '0 * * * *', -- Every hour
  'SELECT handle_package_expiration()'
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
      AND expires_at < now()
  );
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_package_expiration TO postgres;
GRANT EXECUTE ON FUNCTION is_package_expired TO authenticated;