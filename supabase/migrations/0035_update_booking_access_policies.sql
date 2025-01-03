-- Drop existing policies
DROP POLICY IF EXISTS "Allow users and admins to view bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own pending bookings" ON bookings;

-- Create simplified policy for authenticated users
CREATE POLICY "enable_booking_access" ON bookings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_cancel_booking TO authenticated;