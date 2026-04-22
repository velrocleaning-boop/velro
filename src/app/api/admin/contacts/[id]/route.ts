import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 });
  }
}
