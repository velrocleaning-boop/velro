import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, notFound, serverError } from '@/lib/response';
import { notifyPaymentReceived } from '@/lib/notifications';
import { awardLoyaltyPoints } from '@/lib/loyalty';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { bookingId, gateway = 'manual', amount, currency = 'SAR', gatewayTransactionId, gatewayResponse } = body;

    if (!bookingId || !amount) return badRequest('Booking ID and amount are required');

    // Verify booking
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (!booking) return notFound('Booking not found');
    if (booking.user_id !== user.userId && user.role === 'customer') {
      return badRequest('Booking does not belong to you');
    }
    if (booking.payment_status === 'paid') return badRequest('Booking is already paid');

    const taxAmount = Math.round(amount * 0.15 * 100) / 100;
    const netAmount = amount - taxAmount;

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        booking_id: bookingId,
        user_id: user.userId,
        amount,
        currency,
        status: 'completed',
        gateway,
        gateway_transaction_id: gatewayTransactionId,
        gateway_response: gatewayResponse,
        tax_amount: taxAmount,
        net_amount: netAmount,
      })
      .select()
      .single();

    if (paymentError) return serverError('Failed to record payment', paymentError);

    // Update booking payment status
    await supabaseAdmin
      .from('bookings')
      .update({
        payment_status: 'paid',
        payment_method: gateway,
        payment_id: payment.id,
        status: booking.status === 'Pending' ? 'Confirmed' : booking.status,
        confirmed_at: booking.status === 'Pending' ? new Date().toISOString() : booking.confirmed_at,
      })
      .eq('id', bookingId);

    // Update user lifetime value
    await supabaseAdmin
      .from('users')
      .update({ lifetime_value: supabaseAdmin.rpc('increment_decimal', { x: amount }) as unknown as number })
      .eq('id', user.userId);

    // Award loyalty points (non-blocking)
    awardLoyaltyPoints(user.userId, amount, bookingId, `Booking #${bookingId.slice(0, 8)}`).then(
      (points) => notifyPaymentReceived(user.userId, amount, bookingId)
    ).catch(() => {});

    await logAudit({
      userId: user.userId,
      action: 'payment.created',
      resourceType: 'payment',
      resourceId: payment.id,
      ipAddress: getIP(request),
      newValues: { amount, gateway, bookingId },
    });

    return created({ payment, bookingUpdated: true });
  } catch (err) {
    return serverError('Payment processing failed', err);
  }
}

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');

  let query = supabaseAdmin
    .from('payments')
    .select('*')
    .eq('user_id', user.userId)
    .order('created_at', { ascending: false });

  if (bookingId) query = query.eq('booking_id', bookingId);

  const { data, error: fetchError } = await query;
  if (fetchError) return serverError('Failed to fetch payments', fetchError);

  return ok(data || []);
}
