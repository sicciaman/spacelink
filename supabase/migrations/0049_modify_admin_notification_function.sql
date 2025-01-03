/*
  # Fix Notifications System

  1. Changes
    - Remove HTTP call dependency
    - Simplify notification creation
    - Fix schema issues

  2. Security
    - Maintain RLS policies
*/

-- Modify create_admin_notification to remove HTTP call
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