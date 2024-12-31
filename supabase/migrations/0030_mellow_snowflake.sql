/*
  # Update Customer Policies with Schema Qualifiers

  1. Changes
    - Add explicit schema qualifiers
    - Improve policy definitions
    - Update permissions

  2. Security
    - Maintain strict RLS enforcement
    - Clear separation between admin and user access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_manage_customers" ON public.customers;
DROP POLICY IF EXISTS "users_read_own_customer" ON public.customers;

-- Create new policies with explicit schema references
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

CREATE POLICY "users_read_own_customer" ON public.customers
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Ensure proper schema permissions
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Grant explicit schema permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant table permissions
GRANT ALL ON public.customers TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;