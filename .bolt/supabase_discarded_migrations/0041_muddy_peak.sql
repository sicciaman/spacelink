-- Create edge function for sending emails
CREATE OR REPLACE FUNCTION process_admin_notification(notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification admin_notifications;
  v_user_email text;
  v_channel_name text;
  v_package_name text;
BEGIN
  -- Get notification
  SELECT * INTO v_notification
  FROM admin_notifications
  WHERE id = notification_id
  AND sent_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Get user email
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = (v_notification.data->>'user_id')::uuid;

  -- Get channel name if channel_id exists
  IF v_notification.data ? 'channel_id' THEN
    SELECT name INTO v_channel_name
    FROM channels
    WHERE id = (v_notification.data->>'channel_id')::uuid;
  END IF;

  -- Get package name if package_id exists
  IF v_notification.data ? 'package_id' THEN
    SELECT name INTO v_package_name
    FROM packages
    WHERE id = (v_notification.data->>'package_id')::uuid;
  END IF;

  -- Send email based on notification type
  BEGIN
    CASE v_notification.type
      WHEN 'booking_created' THEN
        -- Call edge function to send booking created email
        SELECT http.post(
          url := 'https://your-edge-function-url/send-admin-email',
          headers := '{"Content-Type": "application/json"}',
          body := json_build_object(
            'type', 'booking_created',
            'data', json_build_object(
              'user_email', v_user_email,
              'channel_name', v_channel_name,
              'booking_date', v_notification.data->>'booking_date',
              'product_link', v_notification.data->>'product_link',
              'coupon', v_notification.data->>'coupon',
              'start_price', v_notification.data->>'start_price',
              'discount_price', v_notification.data->>'discount_price'
            )
          )::text
        );

      WHEN 'booking_cancelled' THEN
        -- Call edge function to send booking cancelled email
        SELECT http.post(
          url := 'https://your-edge-function-url/send-admin-email',
          headers := '{"Content-Type": "application/json"}',
          body := json_build_object(
            'type', 'booking_cancelled',
            'data', json_build_object(
              'user_email', v_user_email,
              'channel_name', v_channel_name,
              'booking_date', v_notification.data->>'booking_date',
              'cancelled_at', v_notification.data->>'cancelled_at'
            )
          )::text
        );

      WHEN 'booking_updated' THEN
        -- Call edge function to send booking updated email
        SELECT http.post(
          url := 'https://your-edge-function-url/send-admin-email',
          headers := '{"Content-Type": "application/json"}',
          body := json_build_object(
            'type', 'booking_updated',
            'data', json_build_object(
              'user_email', v_user_email,
              'channel_name', v_channel_name,
              'booking_date', v_notification.data->>'booking_date',
              'changes', v_notification.data->'changes'
            )
          )::text
        );

      WHEN 'package_purchased' THEN
        -- Call edge function to send package purchased email
        SELECT http.post(
          url := 'https://your-edge-function-url/send-admin-email',
          headers := '{"Content-Type": "application/json"}',
          body := json_build_object(
            'type', 'package_purchased',
            'data', json_build_object(
              'user_email', v_user_email,
              'package_name', v_package_name,
              'amount_paid', v_notification.data->>'amount_paid',
              'posts_remaining', v_notification.data->>'posts_remaining'
            )
          )::text
        );
    END CASE;

    -- Mark notification as sent
    UPDATE admin_notifications
    SET sent_at = now()
    WHERE id = notification_id;

  EXCEPTION WHEN others THEN
    -- Update notification with error
    UPDATE admin_notifications
    SET error = SQLERRM
    WHERE id = notification_id;
    
    RAISE;
  END;
END;
$$;