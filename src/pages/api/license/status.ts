import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get('key');
    
    if (!licenseKey) {
      return NextResponse.json(
        { error: 'License key is required' },
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

    // Get license details
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

    // Check if license belongs to user or user is admin
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.user_metadata?.is_admin;
    
    if (license.user_id !== user?.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to view this license' },
        { status: 403 }
      );
    }

    // Get device count
    const { count: deviceCount } = await supabase
      .from('activated_devices')
      .select('*', { count: 'exact', head: true })
      .eq('license_key_id', license.id)
      .eq('is_active', true);

    return NextResponse.json({
      isActive: license.is_active,
      licenseKey: license.license_key,
      deviceLimit: license.max_devices,
      devicesUsed: deviceCount || 0,
      expiresAt: license.expires_at,
      isExpired: license.expires_at ? new Date(license.expires_at) < new Date() : false
    });

  } catch (error) {
    console.error('License status error:', error);
    return NextResponse.json(
      { error: 'An error occurred while checking license status' },
      { status: 500 }
    );
  }
}
