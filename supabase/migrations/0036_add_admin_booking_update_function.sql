-- Create function for admin booking updates
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
  -- Validate prices
  IF p_discount_price >= p_start_price THEN
    RAISE EXCEPTION 'Discount price must be less than start price';
  END IF;

  -- Update booking
  UPDATE bookings 
  SET 
    product_link = p_product_link,
    coupon = p_coupon,
    start_price = p_start_price,
    discount_price = p_discount_price,
    updated_at = now()
  WHERE id = p_booking_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_update_booking TO authenticated;