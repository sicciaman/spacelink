/*
  # Fix Admin User Creation

  1. Changes
    - Replace gen_random_bytes with gen_random_uuid for password generation
    - Add proper password hashing
    - Improve error handling
  
  2. Security
    - Secure password generation
    - Proper error handling
    - Maintain admin-only access
*/

-- Create admin function to create users with proper password generation
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
  v_password text;
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can create users';
  END IF;

  -- Generate a random password using UUID
  SELECT replace(gen_random_uuid()::text, '-', '')
  INTO v_password;
  
  -- Create metadata
  v_result := json_build_object(
    'first_name', p_first_name,
    'last_name', p_last_name
  );

  -- Create user in auth.users
  INSERT INTO auth.users (
    email,
    email_confirmed_at,
    raw_user_meta_data,
    encrypted_password
  )
  VALUES (
    p_email,
    now(),
    v_result,
    crypt(v_password, gen_salt('bf'))
  )
  RETURNING id INTO v_user_id;

  -- Create customer profile
  INSERT INTO customers (
    user_id,
    first_name,
    last_name,
    company,
    telegram_username
  )
  VALUES (
    v_user_id,
    p_first_name,
    p_last_name,
    p_company,
    p_telegram_username
  );

  -- Create user role
  INSERT INTO user_roles (user_id, role)
  VALUES (v_user_id, 'customer');

  RETURN json_build_object(
    'user_id', v_user_id,
    'email', p_email,
    'temp_password', v_password
  );
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in admin_create_user: %', SQLERRM;
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_create_user TO authenticated;