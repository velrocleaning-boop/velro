import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/response';
import { logAudit } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { data: staff } = await supabaseAdmin
    .from('staff')
    .select('*, users(id, email, first_name, last_name, phone, is_active)')
    .eq('id', id)
    .single();

  if (!staff) return notFound('Staff member not found');

  // Get bookings assigned to this staff
  const { data: assignedBookings, count: bookingCount } = await supabaseAdmin
    .from('bookings')
    .select('id, status, service, date, time, name', { count: 'exact' })
    .eq('staff_id', id)
    .order('date', { ascending: false })
    .limit(10);

  // Performance metrics
  const { data: completedBookings } = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('staff_id', id)
    .eq('status', 'Completed');

  const { data: ratings } = await supabaseAdmin
    .from('reviews')
    .select('overall_rating, cleanliness_rating, punctuality_rating, professionalism_rating')
    .eq('staff_id', id)
    .eq('status', 'approved');

  const avgRating = ratings?.length
    ? ratings.reduce((s, r) => s + r.overall_rating, 0) / ratings.length
    : null;

  return ok({
    staff,
    totalAssigned: bookingCount || 0,
    completedJobs: completedBookings?.length || 0,
    recentBookings: assignedBookings || [],
    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    totalReviews: ratings?.length || 0,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const allowed = ['specializations', 'availability_zones', 'is_available', 'hourly_rate', 'bio'];
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) return serverError('Failed to update staff', updateError);

    await logAudit({
      userId: user.userId,
      action: 'admin.staff.updated',
      resourceType: 'staff',
      resourceId: id,
      ipAddress: getIP(request),
      newValues: updates,
    });

    return ok(updated);
  } catch (err) {
    return serverError('Staff update failed', err);
  }
}
