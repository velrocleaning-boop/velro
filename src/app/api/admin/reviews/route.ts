import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, unauthorized, serverError, paginated } from '@/lib/response';
import { logUserAction } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
  const status = searchParams.get('status') || 'pending';
  const offset = (page - 1) * limit;

  const { data, count, error: fetchError } = await supabaseAdmin
    .from('reviews')
    .select('*, users(first_name, last_name, email), staff(users(first_name, last_name))', { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (fetchError) return serverError('Failed to fetch reviews', fetchError);
  return paginated(data || [], count || 0, page, limit);
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const body = await request.json();
  const { reviewId, action, adminResponse, isFeatured } = body;

  const statusMap: Record<string, string> = {
    approve: 'approved',
    reject: 'rejected',
    flag: 'flagged',
  };

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (action && statusMap[action]) updates.status = statusMap[action];
  if (adminResponse !== undefined) updates.admin_response = adminResponse;
  if (isFeatured !== undefined) updates.is_featured = isFeatured;

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single();

  if (updateError) return serverError('Failed to update review', updateError);

  await logUserAction(user.userId, `admin.review.${action}`, 'review', reviewId, getIP(request));
  return ok(updated);
}
