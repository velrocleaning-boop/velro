import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import { sendInvoiceEmail, sendQuotationEmail } from '@/lib/email';

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!cookieStore.get('admin_token')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await props.params;
  const body = await request.json();
  const { type, items, totals, notes, validUntil } = body;

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const to = booking.email;
  if (!to) {
    return NextResponse.json({ error: 'This booking has no email address' }, { status: 400 });
  }

  const { data: vatSetting } = await supabaseAdmin
    .from('system_settings')
    .select('value')
    .eq('key', 'vat_number')
    .single();
  const vatNumber = (vatSetting?.value as string) || '314418368500003';

  let ok = false;
  if (type === 'quote') {
    ok = await sendQuotationEmail(to, booking, items, totals, validUntil, notes);
  } else {
    ok = await sendInvoiceEmail(to, booking, items, totals, notes, vatNumber);
  }

  if (!ok) {
    return NextResponse.json({ error: 'Failed to send email. Check Resend API key.' }, { status: 500 });
  }

  // Log sent timestamp in metadata
  await supabaseAdmin
    .from('bookings')
    .update({
      metadata: {
        ...(booking.metadata || {}),
        [`${type}_sent_at`]: new Date().toISOString(),
      },
    })
    .eq('id', id);

  return NextResponse.json({ ok: true, to, type });
}
