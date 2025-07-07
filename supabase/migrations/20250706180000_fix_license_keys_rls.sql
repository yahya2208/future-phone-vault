-- Add INSERT policy for license_keys table
CREATE POLICY "Admins can insert license keys"
ON public.license_keys
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Add UPDATE policy for license_keys table
CREATE POLICY "Admins can update license keys"
ON public.license_keys
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Add DELETE policy for license_keys table
CREATE POLICY "Admins can delete license keys"
ON public.license_keys
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND raw_user_meta_data->>'is_admin' = 'true'
  )
);
