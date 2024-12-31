/*
  # Notification Triggers

  1. New Triggers
    - `notify_booking_created` - Fires when a new booking is created
    - `notify_booking_cancelled` - Fires when a booking is cancelled
    - `notify_booking_updated` - Fires when a booking is updated
    - `notify_package_purchased` - Fires when a package is purchased

  2. Changes
    - Add triggers to respective tables
    - Include all relevant data in notifications
*/

-- Function to handle booking creation notification
CREATE OR REPLACE FUNCTION notify_booking_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM create_admin_notification(
    'booking_created',
    jsonb_build_object(
      'booking_id', NEW.id,
      'user_id', NEW.user_id,
      'channel_id', NEW.channel_id,
      'booking_date', NEW.booking_date,
      'product_link', NEW.product_link,
      'coupon', NEW.coupon,
      'start_price', NEW.start_price,
      'discount_price', NEW.discount_price
    )
  );
  
  RETURN NEW;
END;
$$;

-- Function to handle booking cancellation notification
CREATE OR REPLACE FUNCTION notify_booking_cancelled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    PERFORM create_admin_notification(
      'booking_cancelled',
      jsonb_build_object(
        'booking_id', NEW.id,
        'user_id', NEW.user_id,
        'channel_id', NEW.channel_id,
        'booking_date', NEW.booking_date,
        'cancelled_at', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to handle booking update notification
CREATE OR REPLACE FUNCTION notify_booking_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = OLD.status AND (
    NEW.product_link != OLD.product_link OR
    NEW.coupon IS DISTINCT FROM OLD.coupon OR
    NEW.start_price != OLD.start_price OR
    NEW.discount_price != OLD.discount_price
  ) THEN
    PERFORM create_admin_notification(
      'booking_updated',
      jsonb_build_object(
        'booking_id', NEW.id,
        'user_id', NEW.user_id,
        'channel_id', NEW.channel_id,
        'booking_date', NEW.booking_date,
        'changes', jsonb_build_object(
          'product_link', jsonb_build_object('old', OLD.product_link, 'new', NEW.product_link),
          'coupon', jsonb_build_object('old', OLD.coupon, 'new', NEW.coupon),
          'start_price', jsonb_build_object('old', OLD.start_price, 'new', NEW.start_price),
          'discount_price', jsonb_build_object('old', OLD.discount_price, 'new', NEW.discount_price)
        )
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to handle package purchase notification
CREATE OR REPLACE FUNCTION notify_package_purchased()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM create_admin_notification(
    'package_purchased',
    jsonb_build_object(
      'purchase_id', NEW.id,
      'user_id', NEW.user_id,
      'package_id', NEW.package_id,
      'amount_paid', NEW.amount_paid,
      'posts_remaining', NEW.posts_remaining
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_created();

CREATE TRIGGER on_booking_cancelled
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_cancelled();

CREATE TRIGGER on_booking_updated
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_updated();

CREATE TRIGGER on_package_purchased
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION notify_package_purchased();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION notify_booking_created TO authenticated;
GRANT EXECUTE ON FUNCTION notify_booking_cancelled TO authenticated;
GRANT EXECUTE ON FUNCTION notify_booking_updated TO authenticated;
GRANT EXECUTE ON FUNCTION notify_package_purchased TO authenticated;