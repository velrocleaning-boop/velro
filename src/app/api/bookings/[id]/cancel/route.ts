import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/response';
import { notifyBookingStatusChange } from '@/lib/notifications';
import { sendBookingStatusUpdate } from '@/lib/email';
import { logAudit } from '@/lib/audit';

const CANCELLATION_FEE_PERCENTAGE = 0.20;
const FREE_CANCELLATION_HOURS = 24;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (!booking) return notFound('Booking not found');
  if (user.role === 'customer' && booking.user_id !== user.userId) return forbidden();

  if (['Cancelled', 'Completed', 'In Progress'].includes(booking.status)) {
    return badRequest(`Cannot cancel a booking with status: ${booking.status}`);
  }

  const body = await request.json().catch(() => ({}));
  const { reason } = body;

  // Calculate cancellation fee
  let cancellationFee = 0;
  if (booking.date && booking.time && booking.total_price) {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
    const hoursUntilBooking = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilBooking < FREE_CANCELLATION_HOURS && booking.status !== 'Pending') {
      cancellationFee = Math.round(booking.total_price * CANCELLATION_FEE_PERCENTAGE * 100) / 100;
    }
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({
      status: 'Cancelled',
      cancellation_reason: reason || 'Customer requested cancellation',
      cancellation_fee: cancellationFee,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) return serverError('Failed to cancel booking', updateError);

  if (booking.user_id) {
    notifyBookingStatusChange(booking.user_id, id, 'Cancelled').catch(() => {});
  }
  if (booking.email) {
    sendBookingStatusUpdate(booking.email, booking.name || 'Customer', 'Cancelled', id).catch(() => {});
  }

  await logAudit({
    userId: user.userId,
    action: 'booking.cancelled',
    resourceType: 'booking',
    resourceId: id,
    ipAddress: getIP(request),
    newValues: { reason, cancellationFee },
  });

  return ok({ booking: updated, cancellationFee });
}
