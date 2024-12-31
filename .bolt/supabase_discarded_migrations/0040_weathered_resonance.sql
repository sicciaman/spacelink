/*
  # Email Notifications System

  1. New Tables
    - `admin_notifications`
      - `id` (uuid, primary key)
      - `type` (text) - Type of notification (booking_created, booking_cancelled, etc.)
      - `data` (jsonb) - Notification data
      - `created_at` (timestamptz)
      - `sent_at` (timestamptz)
      - `error` (text)

  2. Security
    - Enable RLS on `admin_notifications` table
    - Create open policy for authenticated users
*/

-- Create notifications table
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('booking_created', 'booking_cancelled', 'booking_updated', 'package_purchased')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  error TEXT
);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create open policy for authenticated users
CREATE POLICY "Enable notification access for authenticated users"
  ON admin_notifications
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_admin_notification(
  p_type TEXT,
  p_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO admin_notifications (type, data)
  VALUES (p_type, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Grant necessary permissions
GRANT ALL ON admin_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_notification TO authenticated;