
-- Add missing columns to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS seller_email text,
ADD COLUMN IF NOT EXISTS buyer_email text,
ADD COLUMN IF NOT EXISTS buyer_id_photo text,
ADD COLUMN IF NOT EXISTS signature text,
ADD COLUMN IF NOT EXISTS rating integer DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);
