import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, unauthorized, notFound, serverError } from '@/lib/response';
import { logUserAction } from '@/lib/audit';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const body = await request.json();
  const allowed = ['name', 'description', 'value', 'min_order_amount', 'max_discount_amount',
    'usage_limit', 'user_limit', 'valid_from', 'valid_until', 'applicable_services', 'is_active',
    'is_first_order_only'];

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    const bodyKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (body[bodyKey] !== undefined) updates[key] = body[bodyKey];
    else if (body[key] !== undefined) updates[key] = body[key];
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (updateError) return serverError('Failed to update coupon', updateError);
  await logUserAction(user.userId, 'admin.coupon.updated', 'coupon', id, getIP(request));
  return ok(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { error: deleteError } = await supabaseAdmin.from('coupons').delete().eq('id', id);
  if (deleteError) return serverError('Failed to delete coupon', deleteError);

  await logUserAction(user.userId, 'admin.coupon.deleted', 'coupon', id, getIP(request));
  return ok({ deleted: true });
}
