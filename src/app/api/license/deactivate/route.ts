import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the request body
    const { licenseKey, deviceFingerprint } = await request.json();

    if (!licenseKey || !deviceFingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the license for this user
    const { data: license, error: licenseError } = await supabase
      .from('license_keys')
      .select('id, user_id')
      .eq('license_key', licenseKey)
      .eq('user_id', user.id)
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { error: 'License not found or access denied' },
        { status: 404 }
      );
    }

    // Deactivate the device
    const { error: deactivateError } = await supabase
      .from('activated_devices')
      .update({ 
        is_active: false,
        deactivated_at: new Date().toISOString()
      })
      .eq('license_key_id', license.id)
      .eq('device_id', deviceFingerprint);

    if (deactivateError) {
      console.error('Error deactivating device:', deactivateError);
      return NextResponse.json(
        { error: 'Failed to deactivate device' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Device deactivated successfully' 
    });

  } catch (error) {
    console.error('Error in deactivate device endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
// This is necessary for the Edge Function to work with CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
