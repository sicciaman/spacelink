-- Drop previous admin functions since we'll use Supabase's admin API instead
DROP FUNCTION IF EXISTS admin_create_user(text, text, text, text, text);
DROP FUNCTION IF EXISTS create_customer_profile(uuid, text, text, text, text);

-- Update customers table policies
DROP POLICY IF EXISTS "Allow users and admins to view customers" ON customers;
DROP POLICY IF EXISTS "Allow admins to create customers" ON customers;
DROP POLICY IF EXISTS "Allow users and admins to update customers" ON customers;

CREATE POLICY "Enable customer access"
  ON customers FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Enable customer management"
  ON customers
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Update user_roles table policies
DROP POLICY IF EXISTS "Allow users and admins to view roles" ON user_roles;
DROP POLICY IF EXISTS "Allow admins to create roles" ON user_roles;

CREATE POLICY "Enable role access"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable role management"
  ON user_roles
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON customers TO authenticated;
GRANT ALL ON user_roles TO authenticated;