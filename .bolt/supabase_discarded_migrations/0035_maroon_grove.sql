-- Update bookings RLS policies
DROP POLICY IF EXISTS "Allow users and admins to view bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own pending bookings" ON bookings;

-- Create new policies for bookings
CREATE POLICY "enable_booking_access" ON bookings
  FOR ALL
  TO authenticated
  USING (
    -- Users can access their own bookings
    auth.uid() = user_id
    OR 
    -- Admins can access all bookings
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    -- Users can only modify their own bookings
    auth.uid() = user_id
    OR 
    -- Admins can modify all bookings
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create function for admin booking cancellation
CREATE OR REPLACE FUNCTION admin_cancel_booking(
  p_booking_id uuid,
  p_restore_post boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can cancel bookings';
  END IF;

  -- Update booking status
  UPDATE bookings 
  SET status = 'cancelled'
  WHERE id = p_booking_id;

  -- Restore post if requested
  IF p_restore_post THEN
    UPDATE purchases
    SET posts_remaining = posts_remaining + 1
    FROM bookings
    WHERE bookings.id = p_booking_id
    AND purchases.id = bookings.purchase_id;
  END IF;
END;
$$;