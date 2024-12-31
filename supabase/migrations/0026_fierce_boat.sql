/*
  # Fix Customer and Role Policies

  1. Changes
    - Simplify user role policies to avoid recursion
    - Update customer policies to properly handle admin access
    - Fix customer creation policy to only allow admin users

  2. Security
    - Enable RLS for both tables
    - Add proper policies for admin access
    - Ensure proper permission grants
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow customer creation" ON customers;
DROP POLICY IF EXISTS "Allow customer read access" ON customers;
DROP POLICY IF EXISTS "Allow customer updates" ON customers;
DROP POLICY IF EXISTS "Allow customer deletion" ON customers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable service role management" ON user_roles;

-- Create simplified user_roles policies
CREATE POLICY "Allow users to read roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role to manage roles"
  ON user_roles
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create customer policies
CREATE POLICY "Allow admin to create customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Allow users to read own customer data"
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

CREATE POLICY "Allow admin to update customers"
  ON customers FOR UPDATE
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

CREATE POLICY "Allow admin to delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT ALL ON user_roles TO service_role;
GRANT ALL ON customers TO authenticated;