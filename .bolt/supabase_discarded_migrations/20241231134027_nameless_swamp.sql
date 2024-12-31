-- Add requires_subscription column to packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS requires_subscription BOOLEAN DEFAULT false;

-- Update existing packages to set requires_subscription for bundles
UPDATE packages 
SET requires_subscription = true 
WHERE post_count > 1;

-- Create function to check package access
CREATE OR REPLACE FUNCTION can_purchase_package(p_user_id UUID, p_package_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_requires_subscription BOOLEAN;
  v_has_valid_subscription BOOLEAN;
BEGIN
  -- Get package subscription requirement
  SELECT requires_subscription INTO v_requires_subscription
  FROM packages
  WHERE id = p_package_id;

  -- If package doesn't require subscription, allow purchase
  IF NOT v_requires_subscription THEN
    RETURN true;
  END IF;

  -- Check if user has valid subscription period
  SELECT EXISTS (
    SELECT 1
    FROM subscriptions
    WHERE user_id = p_user_id
    AND current_period_end > now()
  ) INTO v_has_valid_subscription;

  RETURN v_has_valid_subscription;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION can_purchase_package TO authenticated;