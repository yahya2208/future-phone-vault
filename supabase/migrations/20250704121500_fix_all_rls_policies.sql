-- =============================================
-- Combined RLS Policies for profiles and user_activations
-- =============================================

-- Enable RLS on both tables if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create or replace admin check function
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('yahyamanouni2@gmail.com', 'y220890@gmail.com')
  );
$$;

-- =============================================
-- Drop existing policies on profiles table
-- =============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- =============================================
-- Drop existing policies on user_activations table
-- =============================================
DROP POLICY IF EXISTS "Users can view their own activation status" ON public.user_activations;
DROP POLICY IF EXISTS "Admins can view all activation statuses" ON public.user_activations;
DROP POLICY IF EXISTS "Users can update their own activation status" ON public.user_activations;
DROP POLICY IF EXISTS "Admins can update any activation status" ON public.user_activations;
DROP POLICY IF EXISTS "Admins can insert activation records" ON public.user_activations;
DROP POLICY IF EXISTS "Admins can delete activation records" ON public.user_activations;

-- =============================================
-- Profiles Table Policies
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admin policies for profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can insert any profile"
ON public.profiles
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
USING (public.is_admin());

-- =============================================
-- User Activations Table Policies
-- =============================================

-- Users can view their own activation status
CREATE POLICY "Users can view their own activation status"
ON public.user_activations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own activation status
CREATE POLICY "Users can update their own activation status"
ON public.user_activations
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all activation statuses
CREATE POLICY "Admins can view all activation statuses"
ON public.user_activations
FOR SELECT
USING (public.is_admin());

-- Admins can update any activation status
CREATE POLICY "Admins can update any activation status"
ON public.user_activations
FOR UPDATE
USING (public.is_admin());

-- Admins can insert activation records
CREATE POLICY "Admins can insert activation records"
ON public.user_activations
FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can delete activation records
CREATE POLICY "Admins can delete activation records"
ON public.user_activations
FOR DELETE
USING (public.is_admin());

-- =============================================
-- Additional policies for authenticated users
-- =============================================

-- Allow authenticated users to see their own profile data
CREATE POLICY "Enable read access for authenticated users only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile data
CREATE POLICY "Enable update for users based on user_id"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Enable insert for authenticated users only"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
