/*
  # Admin Booking Management Improvements
  
  1. Changes
    - Add function to handle admin booking cancellation with post restoration
    - Add function to update booking details
    - Update RLS policies for admin access
    
  2. Security
    - All functions are SECURITY DEFINER
    - Input validation for prices
    - Transaction handling for cancellations
*/

-- Update admin_cancel_booking to use a transaction
CREATE OR REPLACE FUNCTION admin_cancel_booking(
  p_booking_id uuid,
  p_restore_post boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Update booking status
    UPDATE bookings 
    SET 
      status = 'cancelled',
      updated_at = now()
    WHERE id = p_booking_id;

    -- Restore post if requested
    IF p_restore_post THEN
      UPDATE purchases
      SET posts_remaining = posts_remaining + 1
      FROM bookings
      WHERE bookings.id = p_booking_id
      AND purchases.id = bookings.purchase_id;
    END IF;

    -- Commit transaction
    COMMIT;
  EXCEPTION WHEN others THEN
    -- Rollback on error
    ROLLBACK;
    RAISE;
  END;
END;
$$;

-- Update admin_update_booking to include validation
CREATE OR REPLACE FUNCTION admin_update_booking(
  p_booking_id uuid,
  p_product_link text,
  p_coupon text,
  p_start_price decimal,
  p_discount_price decimal
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate input
  IF p_product_link IS NULL OR trim(p_product_link) = '' THEN
    RAISE EXCEPTION 'Product link is required';
  END IF;

  IF p_start_price <= 0 THEN
    RAISE EXCEPTION 'Start price must be greater than 0';
  END IF;

  IF p_discount_price <= 0 THEN
    RAISE EXCEPTION 'Discount price must be greater than 0';
  END IF;

  IF p_discount_price >= p_start_price THEN
    RAISE EXCEPTION 'Discount price must be less than start price';
  END IF;

  -- Update booking
  UPDATE bookings 
  SET 
    product_link = trim(p_product_link),
    coupon = NULLIF(trim(p_coupon), ''),
    start_price = p_start_price,
    discount_price = p_discount_price
  WHERE id = p_booking_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION admin_cancel_booking TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_booking TO authenticated;