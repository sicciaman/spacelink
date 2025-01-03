-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable service role management" ON user_roles;
DROP POLICY IF EXISTS "Enable purchase access" ON purchases;
DROP POLICY IF EXISTS "Enable booking access" ON bookings;

-- Create simplified user_roles policies
CREATE POLICY "Allow all authenticated users to read roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

-- Update purchases policies
CREATE POLICY "Allow users and admins to view purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Update bookings policies
CREATE POLICY "Allow users and admins to view bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT ON purchases TO authenticated;
GRANT SELECT ON bookings TO authenticated;