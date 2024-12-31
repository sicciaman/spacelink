-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Update policies for purchases table
DROP POLICY IF EXISTS "Users can view their own purchases" ON purchases;
CREATE POLICY "Enable purchase access"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own purchases
    auth.uid() = user_id
    OR 
    -- Admins can view all purchases
    is_admin()
  );

-- Update policies for bookings table
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Enable booking access"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own bookings
    auth.uid() = user_id
    OR 
    -- Admins can view all bookings
    is_admin()
  );

-- Grant execute permission on is_admin function
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;