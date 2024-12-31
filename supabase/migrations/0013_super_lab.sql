/*
  # Create User Profiles View with Cascade Deletion

  1. Creates a secure view to access user data
  2. Adds policies for data access
  3. Grants necessary permissions
  4. Ensures dependencies can be dropped with cascade deletion
*/

-- Drop the view if it already exists to allow re-creation
DROP VIEW IF EXISTS user_profiles CASCADE;

-- Create a secure view to access user data
CREATE VIEW user_profiles AS
SELECT 
  id AS user_id,
  email,
  created_at
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON user_profiles TO authenticated;

-- Drop the policy if it exists before recreating
DROP POLICY IF EXISTS "Allow view access through user_profiles" ON auth.users;

-- Create policy for the underlying auth.users table to allow the view to work
CREATE POLICY "Allow view access through user_profiles"
  ON auth.users FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
