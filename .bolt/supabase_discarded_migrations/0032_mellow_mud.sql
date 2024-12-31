/*
  # Fix Customer Creation Flow

  1. Changes
    - Drop existing policies
    - Create new policies for proper customer management
    - Ensure admin access through user_roles
    - Allow users to read their own customer data

  2. Security
    - Admins can manage all customers
    - Users can only read their own customer data
    - Service role maintains full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "authenticated_full_access" ON public.customers;
DROP POLICY IF EXISTS "service_role_access" ON public.customers;

-- Create admin management policy
CREATE POLICY "admin_manage_customers" ON public.customers
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create user read policy
CREATE POLICY "users_read_own_customer" ON public.customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure service role access
CREATE POLICY "service_role_manage" ON public.customers
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.customers TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;