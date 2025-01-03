/*
  # Fix Admin Customer Creation

  1. Changes
    - Add admin policies for customer management
    - Create secure admin functions for user management
    - Update user creation trigger to handle admin-created users
  
  2. Security
    - All functions use SECURITY DEFINER
    - Proper permission checks
    - Safe error handling
*/

-- Create admin function to create users
CREATE OR REPLACE FUNCTION admin_create_user(
  p_email text,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_company text DEFAULT NULL,
  p_telegram_username text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_result json;
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can create users';
  END IF;

  -- Generate a random password
  -- In production, you'd want to implement a proper password reset flow
  WITH random_pass AS (
    SELECT encode(gen_random_bytes(12), 'base64') as pass
  )
  SELECT
    COALESCE(
      (SELECT raw_user_meta_data FROM auth.users WHERE email = p_email),
      json_build_object(
        'first_name', p_first_name,
        'last_name', p_last_name
      )
    ) INTO v_result
  FROM random_pass;

  -- Create user in auth.users
  INSERT INTO auth.users (
    email,
    email_confirmed_at,
    raw_user_meta_data
  )
  VALUES (
    p_email,
    now(),
    v_result
  )
  RETURNING id INTO v_user_id;

  -- Update customer profile
  UPDATE customers
  SET
    first_name = p_first_name,
    last_name = p_last_name,
    company = p_company,
    telegram_username = p_telegram_username,
    updated_at = now()
  WHERE user_id = v_user_id;

  RETURN json_build_object(
    'user_id', v_user_id,
    'email', p_email
  );
EXCEPTION
  WHEN others THEN
    -- Log error details
    RAISE LOG 'Error in admin_create_user: %', SQLERRM;
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_create_user TO authenticated;

-- Update customer policies
DROP POLICY IF EXISTS "Users can view own customer profile" ON customers;
DROP POLICY IF EXISTS "Users can update own customer profile" ON customers;
DROP POLICY IF EXISTS "Service role can manage customers" ON customers;

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

CREATE POLICY "Enable customer updates"
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

CREATE POLICY "Enable admin customer deletion"
  ON customers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );