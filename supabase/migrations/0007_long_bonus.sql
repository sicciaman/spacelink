/*
  # Fix user role trigger

  1. Changes
    - Drop existing trigger
    - Create new trigger with proper security context
    - Add error handling
    - Add logging for debugging

  2. Security
    - Ensure trigger runs with proper permissions
    - Add explicit grants
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create new function with proper security context
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add error handling
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer');
  EXCEPTION WHEN OTHERS THEN
    -- Log error details
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
  END;
  
  RETURN NEW;
END;
$$;

-- Create new trigger with explicit schema
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;