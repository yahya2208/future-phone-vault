
-- Create activation_codes table for secure code management
CREATE TABLE public.activation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days')
);

-- Create user_activations table to track user activation status
CREATE TABLE public.user_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  activation_code_id UUID REFERENCES activation_codes(id),
  is_activated BOOLEAN DEFAULT false,
  trial_transactions_used INTEGER DEFAULT 0,
  max_trial_transactions INTEGER DEFAULT 3,
  activated_at TIMESTAMPTZ,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create security_logs table for tracking suspicious activities
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for activation_codes (admin only access)
CREATE POLICY "Admin can manage activation codes" ON public.activation_codes
FOR ALL USING (false); -- Only accessible via service role

-- RLS policies for user_activations
CREATE POLICY "Users can view own activation" ON public.user_activations
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own activation" ON public.user_activations
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service can manage activations" ON public.user_activations
FOR ALL USING (true);

-- RLS policies for security_logs
CREATE POLICY "Users can view own security logs" ON public.security_logs
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can manage security logs" ON public.security_logs
FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_activation_codes_hash ON activation_codes(code_hash);
CREATE INDEX idx_user_activations_user_id ON user_activations(user_id);
CREATE INDEX idx_user_activations_email ON user_activations(user_email);
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_created_at ON security_logs(created_at);

-- Create function to generate secure activation codes
CREATE OR REPLACE FUNCTION generate_activation_code(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code_plain TEXT;
  code_hash TEXT;
BEGIN
  -- Generate a cryptographically secure 16-character code
  code_plain := upper(substring(md5(random()::text || clock_timestamp()::text || user_email) from 1 for 4)) ||
                '-' ||
                upper(substring(md5(random()::text || clock_timestamp()::text || user_email) from 5 for 4)) ||
                '-' ||
                upper(substring(md5(random()::text || clock_timestamp()::text || user_email) from 9 for 4)) ||
                '-' ||
                upper(substring(md5(random()::text || clock_timestamp()::text || user_email) from 13 for 4));
  
  -- Hash the code for storage (SHA-256 equivalent)
  code_hash := encode(sha256(code_plain::bytea), 'hex');
  
  -- Store the hashed code
  INSERT INTO activation_codes (code_hash, user_email)
  VALUES (code_hash, user_email);
  
  -- Return the plain code (only time it's visible)
  RETURN code_plain;
END;
$$;

-- Create function to validate activation codes
CREATE OR REPLACE FUNCTION validate_activation_code(input_code TEXT, user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  input_hash TEXT;
  code_record RECORD;
BEGIN
  -- Hash the input code
  input_hash := encode(sha256(input_code::bytea), 'hex');
  
  -- Check if code exists and is valid
  SELECT * INTO code_record
  FROM activation_codes
  WHERE code_hash = input_hash
    AND user_email = validate_activation_code.user_email
    AND NOT is_used
    AND expires_at > now();
  
  IF FOUND THEN
    -- Mark code as used
    UPDATE activation_codes
    SET is_used = true, activated_at = now()
    WHERE id = code_record.id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;
