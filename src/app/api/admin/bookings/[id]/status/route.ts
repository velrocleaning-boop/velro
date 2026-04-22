import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    // Basic auth check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    const id = params.id;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Status updated successfully', data });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update status' }, { status: 500 });
  }
}
