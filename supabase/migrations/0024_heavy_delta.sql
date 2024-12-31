-- Drop existing policies
DROP POLICY IF EXISTS "Enable role access" ON user_roles;
DROP POLICY IF EXISTS "Enable role management" ON user_roles;
DROP POLICY IF EXISTS "Allow all authenticated users to read roles" ON user_roles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
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