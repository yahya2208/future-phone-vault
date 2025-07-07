import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deviceId = params.id;
    
    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
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

    // First, get the device to verify it exists
    const { data: device, error: deviceError } = await supabase
      .from('activated_devices')
      .select('*')
      .eq('id', deviceId)
      .single();

    if (deviceError || !device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    // Deactivate the device
    const { error: updateError } = await supabase
      .from('activated_devices')
      .update({ 
        is_active: false,
        last_seen: new Date().toISOString()
      })
      .eq('id', deviceId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Device deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating device:', error);
    return NextResponse.json(
      { error: 'An error occurred while deactivating the device' },
      { status: 500 }
    );
  }
}
