/*
  # Slot Locking System

  1. Tables
    - slot_locks: Temporary locks for booking slots

  2. Functions
    - clean_expired_locks: Remove expired locks
    - create_slot_lock: Create a new slot lock
    - get_active_lock: Get active lock for a slot
    - release_slot_lock: Release a slot lock

  3. Security
    - RLS enabled
    - Only authenticated users can manage locks
*/

-- Create slot_locks table
CREATE TABLE slot_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  channel_id UUID REFERENCES channels(id),
  booking_date TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE slot_locks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view slot locks"
  ON slot_locks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own locks"
  ON slot_locks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own locks"
  ON slot_locks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION clean_expired_locks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM slot_locks
  WHERE expires_at < now();
END;
$$;

CREATE OR REPLACE FUNCTION create_slot_lock(
  p_channel_id uuid,
  p_booking_date timestamptz,
  p_expires_at timestamptz
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_lock_id uuid;
BEGIN
  -- Clean expired locks first
  PERFORM clean_expired_locks();

  -- Check for existing active lock
  IF EXISTS (
    SELECT 1 FROM slot_locks
    WHERE channel_id = p_channel_id
      AND booking_date = p_booking_date
      AND expires_at > now()
  ) THEN
    RAISE EXCEPTION 'Slot is already locked';
  END IF;

  -- Create new lock
  INSERT INTO slot_locks (
    id,
    user_id,
    channel_id,
    booking_date,
    expires_at
  )
  VALUES (
    gen_random_uuid(),
    auth.uid(),
    p_channel_id,
    p_booking_date,
    p_expires_at
  )
  RETURNING id INTO v_lock_id;

  RETURN v_lock_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_active_lock(
  p_channel_id uuid,
  p_booking_date timestamptz
)
RETURNS slot_locks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_lock slot_locks;
BEGIN
  SELECT *
  INTO v_lock
  FROM slot_locks
  WHERE channel_id = p_channel_id
    AND booking_date = p_booking_date
    AND expires_at > now()
  LIMIT 1;

  RETURN v_lock;
END;
$$;

CREATE OR REPLACE FUNCTION release_slot_lock(p_lock_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM slot_locks
  WHERE id = p_lock_id
    AND user_id = auth.uid();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION clean_expired_locks() TO authenticated;
GRANT EXECUTE ON FUNCTION create_slot_lock(uuid, timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_lock(uuid, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION release_slot_lock(uuid) TO authenticated;