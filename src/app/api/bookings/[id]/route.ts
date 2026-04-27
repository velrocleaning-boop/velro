import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/response';
import { notifyBookingStatusChange } from '@/lib/notifications';
import { sendBookingStatusUpdate } from '@/lib/email';
import { logAudit, logUserAction } from '@/lib/audit';
import { getIP } from '@/lib/auth';

export async function GET(
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

  // Customers can only see their own bookings
  if (user.role === 'customer' && booking.user_id !== user.userId) {
    return forbidden('Access denied');
  }

  return ok(booking);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { data: booking } = await supabaseAdmin.from('bookings').select('*').eq('id', id).single();
  if (!booking) return notFound('Booking not found');

  if (user.role === 'customer' && booking.user_id !== user.userId) {
    return forbidden('Access denied');
  }

  try {
    const body = await request.json();
    const oldStatus = booking.status;

    // Customers can only update notes
    const updates: Record<string, unknown> = {};
    if (user.role === 'customer') {
      if (body.notes !== undefined) updates.notes = body.notes;
    } else {
      // Admin/staff can update more fields
      const allowed = ['status', 'staff_id', 'notes', 'internal_notes', 'total_price', 'proof_images'];
      for (const key of allowed) {
        if (body[key] !== undefined) updates[key] = body[key];
      }
      if (body.status) {
        const statusTimestamps: Record<string, string> = {
          Confirmed: 'confirmed_at',
          Assigned: 'assigned_at',
          'In Progress': 'started_at',
          Completed: 'completed_at',
          Cancelled: 'cancelled_at',
        };
        const tsField = statusTimestamps[body.status];
        if (tsField) updates[tsField] = new Date().toISOString();
      }
    }

    if (Object.keys(updates).length === 0) return badRequest('No valid fields to update');

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) return serverError('Failed to update booking', updateError);

    // Notify on status change
    if (body.status && body.status !== oldStatus && booking.user_id) {
      notifyBookingStatusChange(booking.user_id, id, body.status).catch(() => {});
      if (booking.email) {
        sendBookingStatusUpdate(booking.email, booking.name || 'Customer', body.status, id).catch(() => {});
      }
    }

    await logAudit({
      userId: user.userId,
      action: 'booking.updated',
      resourceType: 'booking',
      resourceId: id,
      ipAddress: getIP(request),
      oldValues: { status: oldStatus },
      newValues: updates,
    });

    return ok(updated);
  } catch (err) {
    return serverError('Update failed', err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { error: deleteError } = await supabaseAdmin.from('bookings').delete().eq('id', id);
  if (deleteError) return serverError('Failed to delete booking', deleteError);

  await logUserAction(user.userId, 'booking.deleted', 'booking', id, getIP(request));
  return ok({ deleted: true });
}
