/*
  # Fix user roles system
  
  1. Changes
    - Drop existing policies and functions with CASCADE
    - Create new admin check function
    - Recreate policies with proper dependencies
    - Update existing policies that depend on admin check
  
  2. Security
    - Maintain proper access control
    - Prevent infinite recursion
    - Handle dependencies correctly
*/

-- First drop existing policies and functions with CASCADE
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles CASCADE;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles CASCADE;
DROP POLICY IF EXISTS "Enable read access for users" ON user_roles CASCADE;
DROP POLICY IF EXISTS "Enable insert for service role" ON user_roles CASCADE;
DROP POLICY IF EXISTS "Enable admin updates" ON user_roles CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Create new admin check function with unique name
CREATE OR REPLACE FUNCTION check_admin_status(user_uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = user_uid
    AND role = 'admin'
  );
$$;

-- Create simplified policies for user_roles
CREATE POLICY "Enable read access for users"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    -- Users can read their own role
    auth.uid() = user_id
    OR 
    -- Admins can read all roles
    check_admin_status(auth.uid())
  );

CREATE POLICY "Enable insert for service role only"
  ON user_roles FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Enable admin updates"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (check_admin_status(auth.uid()))
  WITH CHECK (true);

-- Update existing table policies to use new admin check
ALTER POLICY "Users can view their own purchases" ON purchases
  USING (
    auth.uid() = user_id 
    OR check_admin_status(auth.uid())
  );

ALTER POLICY "Users can view their own bookings" ON bookings
  USING (
    auth.uid() = user_id 
    OR check_admin_status(auth.uid())
  );

-- Update function permissions
REVOKE ALL ON FUNCTION check_admin_status FROM PUBLIC;
GRANT EXECUTE ON FUNCTION check_admin_status TO authenticated;

-- Ensure proper table permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT INSERT ON user_roles TO service_role;
GRANT UPDATE ON user_roles TO authenticated;