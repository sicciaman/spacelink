-- Update create_booking_with_update function to properly handle unique timeslots
CREATE OR REPLACE FUNCTION create_booking_with_update(
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
  v_posts_remaining int;
BEGIN
  -- Check if slot is already booked (including a small buffer for concurrent transactions)
  PERFORM pg_advisory_xact_lock(hashtext(p_channel_id::text || p_booking_date::text));
  
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE channel_id = p_channel_id 
    AND booking_date = p_booking_date 
    AND status != 'cancelled'
  ) THEN
    RAISE EXCEPTION 'This time slot is already booked';
  END IF;

  -- Check and update posts remaining
  SELECT posts_remaining
  INTO v_posts_remaining
  FROM purchases
  WHERE id = p_purchase_id
  FOR UPDATE;

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