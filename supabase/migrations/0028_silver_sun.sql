/*
  # Fix Customer Policies and Trigger

  1. Changes
    - Drop and recreate handle_new_user trigger with proper error handling
    - Update RLS policies for customers table
    - Ensure proper role-based access for admins and regular users

  2. Security
    - Maintain RLS
    - Proper permission grants
    - Clear separation between admin and user access
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function for handling new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create customer profile using service role privileges
  INSERT INTO public.customers (user_id)
  VALUES (NEW.id);
  
  -- Create user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
EXCEPTION 
  WHEN others THEN
    -- Log error but don't prevent user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Drop existing customer policies
DROP POLICY IF EXISTS "Enable service role access" ON customers;
DROP POLICY IF EXISTS "Allow admin customer management" ON customers;
DROP POLICY IF EXISTS "Allow users to read own customer data" ON customers;

-- Create new customer policies
CREATE POLICY "admin_full_access" ON customers
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

CREATE POLICY "user_read_own" ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON customers TO authenticated;
GRANT ALL ON customers TO service_role;

-- Ensure handle_new_user has necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, service_role;