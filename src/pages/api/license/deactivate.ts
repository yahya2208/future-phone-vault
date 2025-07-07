import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { licenseKey, deviceFingerprint } = await request.json();
    
    if (!licenseKey || !deviceFingerprint) {
      return NextResponse.json(
        { error: 'License key and device fingerprint are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the license
    const { data: license, error: licenseError } = await supabase
      .from('license_keys')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { error: 'Invalid license key' },
        { status: 404 }
      );
    }

    // Check if user owns the license or is admin
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.user_metadata?.is_admin;
    
    if (license.user_id !== user?.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to deactivate this license' },
        { status: 403 }
      );
    }

    // Find and deactivate the device
    const { data: device, error: deviceError } = await supabase
      .from('activated_devices')
      .select('*')
      .eq('license_key_id', license.id)
      .eq('device_id', deviceFingerprint)
      .eq('is_active', true)
      .single();

    if (deviceError || !device) {
      return NextResponse.json(
        { error: 'No active device found with this fingerprint' },
        { status: 404 }
      );
    }

    // Deactivate the device
    const { error: updateError } = await supabase
      .from('activated_devices')
      .update({ is_active: false, last_seen: new Date().toISOString() })
      .eq('id', device.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Device deactivated successfully'
    });

  } catch (error) {
    console.error('Device deactivation error:', error);
    return NextResponse.json(
      { error: 'An error occurred during device deactivation' },
      { status: 500 }
    );
  }
}
