/*
  # Fix Customer Creation Policies

  1. Changes
    - Update customer creation policy to allow service role access
    - Add policy for admin customer creation
    - Ensure proper role-based access control

  2. Security
    - Maintain RLS
    - Proper permission grants
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin to create customers" ON customers;
DROP POLICY IF EXISTS "Allow users to read own customer data" ON customers;
DROP POLICY IF EXISTS "Allow admin to update customers" ON customers;
DROP POLICY IF EXISTS "Allow admin to delete customers" ON customers;

-- Create new policies
CREATE POLICY "Enable service role access"
  ON customers
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin customer management"
  ON customers
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

-- Grant necessary permissions
GRANT ALL ON customers TO service_role;
GRANT ALL ON customers TO authenticated;