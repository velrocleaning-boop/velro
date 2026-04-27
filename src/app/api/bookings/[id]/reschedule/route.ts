import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/response';
import { getAvailableSlots } from '@/lib/slots';
import { notifyBookingStatusChange } from '@/lib/notifications';
import { logAudit } from '@/lib/audit';

const MAX_RESCHEDULES = 3;

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
    return badRequest(`Cannot reschedule a booking with status: ${booking.status}`);
  }
  if ((booking.reschedule_count || 0) >= MAX_RESCHEDULES) {
    return badRequest('Maximum reschedule limit (3) reached. Please contact support.');
  }

  const body = await request.json();
  const { newDate, newTime } = body;
  if (!newDate || !newTime) return badRequest('New date and time are required');

  if (new Date(`${newDate}T${newTime}:00`) <= new Date()) {
    return badRequest('Reschedule date must be in the future');
  }

  // Check slot availability
  const slots = await getAvailableSlots(newDate);
  const slot = slots.find((s) => s.time === newTime);
  if (!slot?.available) {
    return badRequest('Selected time slot is not available');
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({
      date: newDate,
      time: newTime,
      reschedule_count: (booking.reschedule_count || 0) + 1,
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) return serverError('Failed to reschedule', updateError);

  if (booking.user_id) {
    notifyBookingStatusChange(booking.user_id, id, 'Rescheduled' as never).catch(() => {});
  }

  await logAudit({
    userId: user.userId,
    action: 'booking.rescheduled',
    resourceType: 'booking',
    resourceId: id,
    ipAddress: getIP(request),
    oldValues: { date: booking.date, time: booking.time },
    newValues: { date: newDate, time: newTime },
  });

  return ok(updated);
}
