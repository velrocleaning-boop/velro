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

  const { data: customer } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (!customer) return notFound('User not found');

  const [
    { data: bookings, count: bookingCount },
    { data: reviews },
    { data: tickets },
    { data: notes },
    { data: interactions },
  ] = await Promise.all([
    supabaseAdmin.from('bookings').select('*', { count: 'exact' }).eq('user_id', id).order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('reviews').select('*').eq('user_id', id).limit(5),
    supabaseAdmin.from('tickets').select('*').eq('user_id', id).limit(5),
    supabaseAdmin.from('crm_notes').select('*, author:author_id(first_name, last_name)').eq('user_id', id).order('created_at', { ascending: false }),
    supabaseAdmin.from('crm_interactions').select('*, logged_by:logged_by(first_name, last_name)').eq('user_id', id).order('created_at', { ascending: false }).limit(10),
  ]);

  return ok({ customer, bookingCount, recentBookings: bookings, reviews, tickets, crmNotes: notes, interactions });
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
    const allowed = ['is_active', 'role', 'vip_level', 'customer_segment', 'fraud_flags', 'wallet_balance', 'loyalty_points'];
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 1) return badRequest('No valid fields to update');

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) return serverError('Failed to update user', updateError);

    // Add CRM note if provided
    if (body.note) {
      await supabaseAdmin.from('crm_notes').insert({
        user_id: id,
        author_id: user.userId,
        note: body.note,
        is_private: true,
      });
    }

    await logAudit({
      userId: user.userId,
      action: 'admin.user.updated',
      resourceType: 'user',
      resourceId: id,
      ipAddress: getIP(request),
      newValues: updates,
    });

    return ok(updated);
  } catch (err) {
    return serverError('User update failed', err);
  }
}
