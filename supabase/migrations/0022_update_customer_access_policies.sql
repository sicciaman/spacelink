/*
  # Fix Customer Creation

  1. Changes
    - Add policies for customer creation
    - Add policies for user role creation
    - Simplify auth flow
  
  2. Security
    - Only admins can create customers
    - Only admins can assign roles
*/

-- Update customers table policies
DROP POLICY IF EXISTS "Enable customer access" ON customers;
DROP POLICY IF EXISTS "Enable customer updates" ON customers;
DROP POLICY IF EXISTS "Enable admin customer deletion" ON customers;

CREATE POLICY "Allow users and admins to view customers"
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

CREATE POLICY "Allow admins to create customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Allow users and admins to update customers"
  ON customers FOR UPDATE
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
DROP POLICY IF EXISTS "Allow all authenticated users to read roles" ON user_roles;

CREATE POLICY "Allow users and admins to view roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to create roles"
  ON user_roles FOR INSERT
  TO authenticated
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