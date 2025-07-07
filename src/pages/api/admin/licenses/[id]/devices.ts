import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const licenseId = params.id;
    
    if (!licenseId) {
      return NextResponse.json(
        { error: 'License ID is required' },
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

    // Get all devices for this license
    const { data: devices, error } = await supabase
      .from('activated_devices')
      .select('*')
      .eq('license_key_id', licenseId)
      .order('last_seen', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(devices || []);

  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching devices' },
      { status: 500 }
    );
  }
}
