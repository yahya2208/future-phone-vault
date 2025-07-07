-- Enable RLS on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own transactions
CREATE POLICY "Users can insert their own transactions"
ON public.transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own transactions
CREATE POLICY "Users can update their own transactions"
ON public.transactions
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow admins to view all transactions
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
USING (public.is_admin());

-- Allow admins to insert any transaction
CREATE POLICY "Admins can insert any transaction"
ON public.transactions
FOR INSERT
WITH CHECK (public.is_admin());

-- Allow admins to update any transaction
CREATE POLICY "Admins can update any transaction"
ON public.transactions
FOR UPDATE
USING (public.is_admin());

-- Allow admins to delete any transaction
CREATE POLICY "Admins can delete any transaction"
ON public.transactions
FOR DELETE
USING (public.is_admin());
