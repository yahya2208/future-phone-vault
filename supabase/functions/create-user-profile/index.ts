import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const requestData = await req.json()
    const { user_id, email, username, is_admin, updated_at } = requestData
    
    if (!user_id) {
      throw { message: 'user_id is required', status: 400 }
    }
    
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Prepare profile data
    const profileData: any = {
      updated_at: new Date().toISOString()
    }
    
    // Only include fields that are provided
    if (email) profileData.email = email
    if (username) profileData.username = username
    if (typeof is_admin !== 'undefined') profileData.is_admin = is_admin
    if (updated_at) profileData.updated_at = updated_at

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .maybeSingle()

    if (fetchError) throw fetchError

    let result
    let statusCode = 200
    let message = 'Profile updated successfully'

    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update(profileData)
        .eq('id', user_id)
        .select()
        .single()

      if (updateError) throw updateError
      result = updatedProfile
    } else {
      // Create new profile
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: user_id,
          email: email || `${user_id}@user.com`,
          username: username || `user_${user_id.substring(0, 8)}`,
          is_admin: is_admin || false,
          max_transactions: 3,
          plan_type: 'trial',
          created_at: new Date().toISOString(),
          ...profileData
        }])
        .select()
        .single()

      if (createError) throw createError
      result = newProfile
      statusCode = 201
      message = 'Profile created successfully'
    }

    return new Response(
      JSON.stringify({ 
        message,
        profile: result 
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: statusCode
      }
    )
  } catch (error) {
    console.error('Error in profile function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        details: error.details || null
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: error.status || 500 
      }
    )
  }
})
