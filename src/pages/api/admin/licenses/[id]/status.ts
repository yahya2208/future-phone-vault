import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type PatchData = {
  is_active?: boolean;
  max_devices?: number;
  expires_at?: string | null;
  notes?: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const licenseId = params.id;
    const { is_active, max_devices, expires_at, notes } = await request.json() as PatchData;
    
    if (!licenseId) {
      return NextResponse.json(
        { error: 'License ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    if (max_devices !== undefined && (typeof max_devices !== 'number' || max_devices < 1)) {
      return NextResponse.json(
        { error: 'Maximum devices must be at least 1' },
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

    // Prepare update data
    const updateData: any = {};
    
    if (typeof is_active === 'boolean') {
      updateData.is_active = is_active;
    }
    
    if (typeof max_devices === 'number') {
      updateData.max_devices = max_devices;
    }
    
    if (expires_at !== undefined) {
      updateData.expires_at = expires_at;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the license
    const { data: updatedLicense, error: updateError } = await supabase
      .from('license_keys')
      .update(updateData)
      .eq('id', licenseId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedLicense);

  } catch (error) {
    console.error('Error updating license status:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the license' },
      { status: 500 }
    );
  }
}
