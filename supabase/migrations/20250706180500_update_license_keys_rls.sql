-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert license keys" ON public.license_keys;
DROP POLICY IF EXISTS "Admins can update license keys" ON public.license_keys;
DROP POLICY IF EXISTS "Admins can delete license keys" ON public.license_keys;
DROP POLICY IF EXISTS "Admins can manage all license keys" ON public.license_keys;

-- Create new policies that check for is_admin in user_metadata
CREATE POLICY "Admins can manage all license keys" 
ON public.license_keys 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND (raw_user_meta_data->>'is_admin')::boolean = true
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND (raw_user_meta_data->>'is_admin')::boolean = true
  )
);

-- Update activated_devices policy to match
DROP POLICY IF EXISTS "Admins can manage all activated devices" ON public.activated_devices;

CREATE POLICY "Admins can manage all activated devices" 
ON public.activated_devices 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND (raw_user_meta_data->>'is_admin')::boolean = true
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND (raw_user_meta_data->>'is_admin')::boolean = true
  )
);
