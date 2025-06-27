
-- Drop the existing function first
DROP FUNCTION IF EXISTS validate_activation_code(text, text);

-- Add code types and admin features to activation_codes table
ALTER TABLE public.activation_codes 
ADD COLUMN IF NOT EXISTS code_type TEXT DEFAULT 'trial' CHECK (code_type IN ('owner', 'gift', 'lifetime', 'subscription')),
ADD COLUMN IF NOT EXISTS subscription_duration_months INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_admin_code BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL;

-- Update user_activations table to support different activation types
ALTER TABLE public.user_activations 
ADD COLUMN IF NOT EXISTS activation_type TEXT DEFAULT 'trial' CHECK (activation_type IN ('trial', 'owner', 'gift', 'lifetime', 'subscription')),
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create function to generate owner code (special admin access)
CREATE OR REPLACE FUNCTION generate_owner_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code_plain TEXT;
  code_hash TEXT;
BEGIN
  -- Generate owner code with special prefix
  code_plain := 'OWNER-' ||
                upper(substring(md5(random()::text || clock_timestamp()::text || 'OWNER') from 1 for 4)) ||
                '-' ||
                upper(substring(md5(random()::text || clock_timestamp()::text || 'ADMIN') from 5 for 4)) ||
                '-' ||
                upper(substring(md5(random()::text || clock_timestamp()::text || 'MASTER') from 9 for 4));
  
  -- Hash the code for storage
  code_hash := encode(sha256(code_plain::bytea), 'hex');
  
  -- Store the hashed code
  INSERT INTO activation_codes (code_hash, user_email, code_type, is_admin_code, created_by_admin, notes, expires_at)
  VALUES (code_hash, 'owner@app.com', 'owner', true, true, 'Owner/Admin master code', now() + interval '10 years');
  
  RETURN code_plain;
END;
$$;

-- Create function to generate gift codes (10 codes)
CREATE OR REPLACE FUNCTION generate_gift_codes()
RETURNS TABLE(gift_code TEXT, code_number INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  i INTEGER;
  code_plain TEXT;
  code_hash TEXT;
BEGIN
  FOR i IN 1..10 LOOP
    -- Generate gift code
    code_plain := 'GIFT-' ||
                  upper(substring(md5(random()::text || clock_timestamp()::text || i::text) from 1 for 4)) ||
                  '-' ||
                  upper(substring(md5(random()::text || clock_timestamp()::text || 'GIFT') from 5 for 4)) ||
                  '-' ||
                  upper(substring(md5(random()::text || clock_timestamp()::text || 'FREE') from 9 for 4));
    
    -- Hash the code for storage
    code_hash := encode(sha256(code_plain::bytea), 'hex');
    
    -- Store the hashed code
    INSERT INTO activation_codes (code_hash, user_email, code_type, created_by_admin, notes, expires_at)
    VALUES (code_hash, 'gift@app.com', 'gift', true, 'Gift code #' || i, now() + interval '1 year');
    
    -- Return the code
    gift_code := code_plain;
    code_number := i;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Create function to generate lifetime codes (100 codes)
CREATE OR REPLACE FUNCTION generate_lifetime_codes()
RETURNS TABLE(lifetime_code TEXT, code_number INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  i INTEGER;
  code_plain TEXT;
  code_hash TEXT;
BEGIN
  FOR i IN 1..100 LOOP
    -- Generate lifetime code
    code_plain := 'LIFE-' ||
                  upper(substring(md5(random()::text || clock_timestamp()::text || i::text) from 1 for 4)) ||
                  '-' ||
                  upper(substring(md5(random()::text || clock_timestamp()::text || 'LIFE') from 5 for 4)) ||
                  '-' ||
                  upper(substring(md5(random()::text || clock_timestamp()::text || 'TIME') from 9 for 4));
    
    -- Hash the code for storage
    code_hash := encode(sha256(code_plain::bytea), 'hex');
    
    -- Store the hashed code
    INSERT INTO activation_codes (code_hash, user_email, code_type, created_by_admin, notes, expires_at)
    VALUES (code_hash, 'lifetime@app.com', 'lifetime', true, 'Lifetime code #' || i, now() + interval '50 years');
    
    -- Return the code
    lifetime_code := code_plain;
    code_number := i;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Create the new validation function with JSONB return type
CREATE OR REPLACE FUNCTION validate_activation_code(input_code TEXT, user_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  input_hash TEXT;
  code_record RECORD;
  result JSONB;
BEGIN
  -- Hash the input code
  input_hash := encode(sha256(input_code::bytea), 'hex');
  
  -- Check if code exists and is valid
  SELECT * INTO code_record
  FROM activation_codes
  WHERE code_hash = input_hash
    AND NOT is_used
    AND expires_at > now();
  
  IF FOUND THEN
    -- Mark code as used
    UPDATE activation_codes
    SET is_used = true, activated_at = now()
    WHERE id = code_record.id;
    
    -- Return success with code details
    result := jsonb_build_object(
      'success', true,
      'code_type', code_record.code_type,
      'is_admin', code_record.is_admin_code,
      'subscription_duration', code_record.subscription_duration_months,
      'message', CASE 
        WHEN code_record.code_type = 'owner' THEN 'تم تفعيل حساب المالك بنجاح!'
        WHEN code_record.code_type = 'gift' THEN 'تم تفعيل الكود المجاني بنجاح!'
        WHEN code_record.code_type = 'lifetime' THEN 'تم تفعيل النسخة الأبدية بنجاح!'
        WHEN code_record.code_type = 'subscription' THEN 'تم تفعيل الاشتراك بنجاح!'
        ELSE 'تم التفعيل بنجاح!'
      END
    );
    
    RETURN result;
  END IF;
  
  -- Return failure
  RETURN jsonb_build_object('success', false, 'message', 'كود غير صحيح أو منتهي الصلاحية');
END;
$$;
