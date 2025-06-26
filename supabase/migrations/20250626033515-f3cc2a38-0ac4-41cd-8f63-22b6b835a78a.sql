
-- Add seller_phone column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS seller_phone text;
