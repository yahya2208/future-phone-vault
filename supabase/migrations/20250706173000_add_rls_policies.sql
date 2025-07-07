-- Enable Row Level Security
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE activated_devices ENABLE ROW LEVEL SECURITY;

-- Policy for admins to do everything with license_keys
CREATE POLICY "Enable all for admins on license_keys"
ON public.license_keys
FOR ALL
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'admin'
));

-- Policy for users to read their own license keys
CREATE POLICY "Enable read access for users on their license_keys"
ON public.license_keys
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for admins to do everything with activated_devices
CREATE POLICY "Enable all for admins on activated_devices"
ON public.activated_devices
FOR ALL
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'admin'
));

-- Policy for users to manage their own devices
CREATE POLICY "Enable all for users on their activated_devices"
ON public.activated_devices
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
