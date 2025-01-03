/*
  # Fix User Creation Using Supabase Auth API

  1. Changes
    - Remove direct auth table manipulation
    - Create function to handle customer profile creation
    - Simplify admin user creation flow
  
  2. Security
    - Admin-only access
    - Proper error handling
*/

-- Drop the old function
DROP FUNCTION IF EXISTS admin_create_user(text, text, text, text, text);

-- Create a simpler function to handle customer profile creation
CREATE OR REPLACE FUNCTION create_customer_profile(
  p_user_id uuid,
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
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can create customer profiles';
  END IF;

  -- Create customer profile
  INSERT INTO customers (
    user_id,
    first_name,
    last_name,
    company,
    telegram_username
  )
  VALUES (
    p_user_id,
    p_first_name,
    p_last_name,
    p_company,
    p_telegram_username
  );

  -- Create user role
  INSERT INTO user_roles (user_id, role)
  VALUES (p_user_id, 'customer');

  RETURN json_build_object(
    'user_id', p_user_id,
    'profile_created', true
  );
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in create_customer_profile: %', SQLERRM;
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_customer_profile TO authenticated;