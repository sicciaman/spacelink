/*
  # Booking Management Functions

  1. Functions
    - cancel_booking: Cancel a booking and return post to package
    - create_booking: Create a new booking with conflict checks
    - update_completed_bookings: Mark past bookings as completed

  2. Security
    - All functions are SECURITY DEFINER
    - Execute permissions granted to authenticated users
*/

-- Cancel booking function
CREATE OR REPLACE FUNCTION cancel_booking(booking_id uuid, purchase_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update booking status
  UPDATE bookings 
  SET status = 'cancelled'
  WHERE id = booking_id;

  -- Increment posts_remaining
  UPDATE purchases
  SET posts_remaining = posts_remaining + 1
  WHERE id = purchase_id;
END;
$$;

-- Create booking function
CREATE OR REPLACE FUNCTION create_booking(
  p_user_id uuid,
  p_purchase_id uuid,
  p_channel_id uuid,
  p_booking_date timestamptz,
  p_product_link text,
  p_coupon text,
  p_start_price decimal,
  p_discount_price decimal
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_id uuid;
  v_conflict_count int;
  v_posts_remaining int;
BEGIN
  -- Check if slot is available
  SELECT count(*)
  INTO v_conflict_count
  FROM bookings
  WHERE channel_id = p_channel_id
    AND booking_date = p_booking_date
    AND status != 'cancelled';
    
  IF v_conflict_count > 0 THEN
    RAISE EXCEPTION 'This time slot is no longer available';
  END IF;

  -- Check if purchase has remaining posts
  SELECT posts_remaining
  INTO v_posts_remaining
  FROM purchases
  WHERE id = p_purchase_id;

  IF v_posts_remaining <= 0 THEN
    RAISE EXCEPTION 'No posts remaining in this package';
  END IF;

  -- Create booking
  INSERT INTO bookings (
    id,
    user_id,
    purchase_id,
    channel_id,
    booking_date,
    status,
    product_link,
    coupon,
    start_price,
    discount_price
  )
  VALUES (
    gen_random_uuid(),
    p_user_id,
    p_purchase_id,
    p_channel_id,
    p_booking_date,
    'pending',
    p_product_link,
    p_coupon,
    p_start_price,
    p_discount_price
  )
  RETURNING id INTO v_booking_id;

  -- Update posts remaining
  UPDATE purchases
  SET posts_remaining = posts_remaining - 1
  WHERE id = p_purchase_id;

  RETURN v_booking_id;
END;
$$;

-- Update completed bookings function
CREATE OR REPLACE FUNCTION update_completed_bookings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE bookings
  SET status = 'completed'
  WHERE status = 'pending'
    AND booking_date < now();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cancel_booking(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION create_booking(uuid, uuid, uuid, timestamptz, text, text, decimal, decimal) TO authenticated;
GRANT EXECUTE ON FUNCTION update_completed_bookings() TO authenticated;