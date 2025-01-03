/*
  # Fix User Creation Function

  1. Changes
    - Simplify password generation
    - Use proper auth.users fields
    - Add proper error handling
  
  2. Security
    - Secure password handling
    - Admin-only access
    - Proper error handling
*/

-- Create admin function to create users with proper password handling
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

  -- Generate a simple but secure random password
  v_password := encode(gen_random_bytes(12), 'base64');
  
  -- Create metadata
  v_result := json_build_object(
    'first_name', p_first_name,
    'last_name', p_last_name
  );

  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(v_password, gen_salt('bf')),
    now(),
    v_result,
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
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