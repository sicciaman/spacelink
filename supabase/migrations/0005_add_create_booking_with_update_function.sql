/*
  # Add create_booking_with_update function

  1. New Functions
    - `create_booking_with_update`: Creates a booking and updates posts remaining atomically
      - Handles the entire booking creation process in a transaction
      - Updates posts remaining count
      - Returns the created booking ID
  
  2. Changes
    - Adds transaction safety to booking creation process
    - Ensures posts remaining is updated correctly
*/

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
  v_conflict_count int;
BEGIN
  -- Start transaction
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

    -- Check and update posts remaining
    SELECT posts_remaining
    INTO v_posts_remaining
    FROM purchases
    WHERE id = p_purchase_id
    FOR UPDATE;  -- Lock the row

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
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_booking_with_update TO authenticated;