import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify admin status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabase.auth.getUser();
    const isAdmin = userData.user?.email === 'yahyamanouni2@gmail.com';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get all license keys with user email and device count
    const { data: licenses, error } = await supabase
      .from('license_keys')
      .select(`
        *,
        user:profiles(
          email
        ),
        device_count:activated_devices(
          count
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Format the response
    const formattedLicenses = licenses.map(license => ({
      ...license,
      user_email: license.user?.email || null,
      device_count: Array.isArray(license.device_count) ? 
        license.device_count[0]?.count || 0 : 0
    }));

    return NextResponse.json(formattedLicenses);

  } catch (error) {
    console.error('Error fetching licenses:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching licenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { max_devices, expires_in_days, notes, user_email } = await request.json();
    
    if (!max_devices || max_devices < 1) {
      return NextResponse.json(
        { error: 'Invalid number of devices' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify admin status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabase.auth.getUser();
    const isAdmin = userData.user?.email === 'yahyamanouni2@gmail.com';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Generate a new license key
    const { data: licenseKey, error: keyError } = await supabase
      .rpc('generate_license_key', { 
        key_length: 16,
        key_segments: 4 
      });

    if (keyError) {
      throw keyError;
    }

    // Calculate expiration date if provided
    const expires_at = expires_in_days > 0 
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // If user_email is provided, get the user_id
    let user_id = null;
    if (user_email) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user_email)
        .single();

      if (!userError && userData) {
        user_id = userData.id;
      }
    }

    // Insert the new license
    const { data: newLicense, error: insertError } = await supabase
      .from('license_keys')
      .insert([{
        license_key: licenseKey,
        user_id: user_id,
        max_devices: max_devices,
        expires_at: expires_at,
        notes: notes || null,
        is_active: true
      }])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      ...newLicense,
      user_email: user_email || null,
      device_count: 0
    });

  } catch (error) {
    console.error('Error generating license:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the license' },
      { status: 500 }
    );
  }
}
