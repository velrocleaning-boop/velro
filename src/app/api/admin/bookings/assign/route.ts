import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/response';
import { notifyBookingStatusChange } from '@/lib/notifications';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { bookingId, staffId, auto = false } = body;

    if (!bookingId) return badRequest('Booking ID required');

    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (!booking) return notFound('Booking not found');

    let assignedStaffId = staffId;

    if (auto || !staffId) {
      // Auto-assign: find available staff for the booking date/time
      const { data: availableStaff } = await supabaseAdmin
        .from('staff')
        .select('id, rating, total_jobs, availability_zones')
        .eq('is_available', true)
        .order('rating', { ascending: false })
        .limit(10);

      // Filter by zone if booking has district
      const filtered = (availableStaff || []).filter((s) => {
        if (!booking.district || !s.availability_zones?.length) return true;
        return s.availability_zones.includes(booking.district);
      });

      if (!filtered.length) return badRequest('No available staff for this booking');

      // Pick highest-rated available staff
      assignedStaffId = filtered[0].id;
    }

    if (!assignedStaffId) return badRequest('No staff selected or available');

    // Verify staff exists
    const { data: staff } = await supabaseAdmin
      .from('staff')
      .select('id, users(first_name, last_name)')
      .eq('id', assignedStaffId)
      .single();

    if (!staff) return notFound('Staff member not found');

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        staff_id: assignedStaffId,
        status: 'Assigned',
        assigned_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) return serverError('Failed to assign staff', updateError);

    if (booking.user_id) {
      notifyBookingStatusChange(booking.user_id, bookingId, 'Assigned').catch(() => {});
    }

    await logAudit({
      userId: user.userId,
      action: 'booking.assigned',
      resourceType: 'booking',
      resourceId: bookingId,
      ipAddress: getIP(request),
      newValues: { staffId: assignedStaffId, autoAssigned: auto },
    });

    return ok({ booking: updated, staff, autoAssigned: auto });
  } catch (err) {
    return serverError('Assignment failed', err);
  }
}
