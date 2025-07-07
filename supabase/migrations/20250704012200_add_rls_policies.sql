-- Enable Row Level Security on user_activations table
ALTER TABLE public.user_activations ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own activation status
CREATE POLICY "Users can view their own activation status"
ON public.user_activations
FOR SELECT
USING (auth.uid() = user_id);

-- Policy to allow admins to view all activation statuses
CREATE POLICY "Admins can view all activation statuses"
ON public.user_activations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid() 
  AND (email = 'yahyamanouni2@gmail.com' OR email = 'y220890@gmail.com')
));

-- Policy to allow users to update their own activation status
CREATE POLICY "Users can update their own activation status"
ON public.user_activations
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy to allow admins to update any activation status
CREATE POLICY "Admins can update any activation status"
ON public.user_activations
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid() 
  AND (email = 'yahyamanouni2@gmail.com' OR email = 'y220890@gmail.com')
));

-- Policy to allow admins to insert new activation records
CREATE POLICY "Admins can insert activation records"
ON public.user_activations
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid() 
  AND (email = 'yahyamanouni2@gmail.com' OR email = 'y220890@gmail.com')
));

-- Policy to allow admins to delete activation records
CREATE POLICY "Admins can delete activation records"
ON public.user_activations
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid() 
  AND (email = 'yahyamanouni2@gmail.com' OR email = 'y220890@gmail.com')
));
