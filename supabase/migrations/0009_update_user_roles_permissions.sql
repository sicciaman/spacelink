-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow users to read own role" ON user_roles;
DROP POLICY IF EXISTS "Allow service role full access" ON user_roles;
DROP POLICY IF EXISTS "Allow admins to read all roles" ON user_roles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for all authenticated users"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage roles
CREATE POLICY "Enable service role management"
  ON user_roles
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT ALL ON user_roles TO service_role;