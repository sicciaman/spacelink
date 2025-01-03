/*
  # Open Customer RLS to All Authenticated Users

  1. Changes
    - Drop existing restrictive policies
    - Create new open policy for authenticated users
    - Maintain service role access

  2. Security
    - Temporary open access for testing
    - Service role maintains full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_manage_customers" ON public.customers;
DROP POLICY IF EXISTS "users_read_own_customer" ON public.customers;

-- Create open policy for authenticated users
CREATE POLICY "authenticated_full_access" ON public.customers
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure service role access
CREATE POLICY "service_role_access" ON public.customers
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Maintain necessary permissions
GRANT ALL ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;