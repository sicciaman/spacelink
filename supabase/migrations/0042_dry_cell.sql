/*
  # Fix Booking Slots Migration

  1. Changes
    - Drop existing unique constraint
    - Create new unique index for active bookings
    - Create booking_slots view
    - Update booking creation function

  2. Security
    - Grant SELECT access to authenticated users on booking_slots view
*/

-- Drop existing index if it exists
DROP INDEX IF EXISTS bookings_active_slot_idx;

-- Create new unique index only for active bookings
CREATE UNIQUE INDEX IF NOT EXISTS bookings_active_slot_idx ON bookings (channel_id, booking_date) 
WHERE status != 'cancelled';

-- Create or replace booking_slots view
DROP VIEW IF EXISTS booking_slots;
CREATE VIEW booking_slots AS
SELECT 
  channel_id,
  booking_date
FROM bookings
WHERE status != 'cancelled';

-- Grant access to the view
GRANT SELECT ON booking_slots TO authenticated;

-- Update create_booking_with_update function
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
  -- Check if slot is already booked
  IF EXISTS (
    SELECT 1 FROM booking_slots 
    WHERE channel_id = p_channel_id 
    AND booking_date = p_booking_date
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_booking_with_update TO authenticated;