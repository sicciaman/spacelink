-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Service role can insert" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for users" ON user_roles;
DROP POLICY IF EXISTS "Enable insert for service role" ON user_roles;
DROP POLICY IF EXISTS "Enable admin updates" ON user_roles;

-- Create simple direct policies without recursion
CREATE POLICY "Allow users to read own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow service role full access"
  ON user_roles
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT ALL ON user_roles TO service_role;