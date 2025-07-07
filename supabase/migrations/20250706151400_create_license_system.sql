-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION public.table_exists(table_name text)
RETURNS boolean AS $$
DECLARE
    result boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = table_exists.table_name
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create license_keys table
CREATE TABLE IF NOT EXISTS public.license_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_key TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    max_devices INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    notes TEXT
);

-- Create activated_devices table
CREATE TABLE IF NOT EXISTS public.activated_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_key_id UUID REFERENCES public.license_keys(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    device_name TEXT,
    ip_address TEXT,
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_license_keys_key ON public.license_keys(license_key);
CREATE INDEX IF NOT EXISTS idx_activated_devices_license ON public.activated_devices(license_key_id);
CREATE INDEX IF NOT EXISTS idx_activated_devices_device ON public.activated_devices(device_id);

-- Enable RLS on tables
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activated_devices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own license keys
CREATE POLICY "Users can view their own license keys" 
ON public.license_keys 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can manage all license keys
CREATE POLICY "Admins can manage all license keys" 
ON public.license_keys 
USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id AND raw_user_meta_data->>'is_admin' = 'true'
));

-- Users can view their activated devices
CREATE POLICY "Users can view their activated devices" 
ON public.activated_devices 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.license_keys 
    WHERE id = license_key_id AND user_id = auth.uid()
));

-- Admins can manage all activated devices
CREATE POLICY "Admins can manage all activated devices" 
ON public.activated_devices 
USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id AND raw_user_meta_data->>'is_admin' = 'true'
));

-- Function to generate a random license key
CREATE OR REPLACE FUNCTION public.generate_license_key(length INTEGER) 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
        IF i % 4 = 0 AND i < length THEN
            result := result || '-';
        END IF;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
