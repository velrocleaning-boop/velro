import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import { sendInvoiceEmail } from '@/lib/email';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    const id = params.id;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Auto-send invoice email when booking is marked Completed
    if (status === 'Completed' && data?.email) {
      const booking = data;
      const total = Number(booking.total_price) || 0;
      const vat = total ? total * 0.15 / 1.15 : 0;
      const subtotal = total - vat;
      const discount = Number(booking.discount_amount) || 0;

      const items = [{
        description: `${booking.service || 'Cleaning Service'} — ${booking.rooms || 1} room(s), ${booking.bathrooms || 1} bathroom(s)`,
        qty: 1,
        unitPrice: subtotal,
      }];
      const totals = { subtotal, vat, discount, total };

      sendInvoiceEmail(booking.email, booking, items, totals, booking.notes || '').catch(() => {});
    }

    return NextResponse.json({ message: 'Status updated', data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update status' }, { status: 500 });
  }
}
