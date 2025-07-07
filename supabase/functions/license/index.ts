import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface ActivationRequest {
  licenseKey: string
  deviceFingerprint: string
  deviceName?: string
}

interface LicenseKey {
  id: string
  license_key: string
  user_id: string
  is_active: boolean
  max_devices: number
  expires_at: string | null
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { licenseKey, deviceFingerprint, deviceName } = await req.json() as ActivationRequest
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if license key exists and is valid
    const { data: license, error: licenseError } = await supabase
      .from('license_keys')
      .select('*')
      .eq('license_key', licenseKey)
      .single()

    if (licenseError || !license) {
      return new Response(
        JSON.stringify({ error: 'Invalid license key' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if license is active
    if (!license.is_active) {
      return new Response(
        JSON.stringify({ error: 'This license key has been deactivated' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if license has expired
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This license key has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if device is already activated
    const { data: existingDevice, error: deviceError } = await supabase
      .from('activated_devices')
      .select('*')
      .eq('license_key_id', license.id)
      .eq('device_id', deviceFingerprint)
      .single()

    if (existingDevice) {
      // Update last seen timestamp
      await supabase
        .from('activated_devices')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', existingDevice.id)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Device already activated',
          license: {
            key: license.license_key,
            maxDevices: license.max_devices,
            expiresAt: license.expires_at
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check number of activated devices
    const { count } = await supabase
      .from('activated_devices')
      .select('*', { count: 'exact', head: true })
      .eq('license_key_id', license.id)
      .eq('is_active', true)

    if (count !== null && count >= license.max_devices) {
      return new Response(
        JSON.stringify({ error: 'Maximum number of devices reached for this license' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Activate new device
    const { data: newDevice, error: activationError } = await supabase
      .from('activated_devices')
      .insert([{
        license_key_id: license.id,
        device_id: deviceFingerprint,
        device_name: deviceName || 'Unknown Device',
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        is_active: true
      }])
      .select()
      .single()

    if (activationError) {
      throw activationError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Device activated successfully',
        license: {
          key: license.license_key,
          maxDevices: license.max_devices,
          expiresAt: license.expires_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Activation error:', error)
    return new Response(
      JSON.stringify({ error: 'An error occurred during activation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
