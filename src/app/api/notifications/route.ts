import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, unauthorized, serverError, paginated } from '@/lib/response';
import { markAllNotificationsRead } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
  const unreadOnly = searchParams.get('unread') === 'true';
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', user.userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (unreadOnly) query = query.eq('is_read', false);

  const { data, count, error: fetchError } = await query;
  if (fetchError) return serverError('Failed to fetch notifications', fetchError);

  // Get unread count
  const { count: unreadCount } = await supabaseAdmin
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.userId)
    .eq('is_read', false);

  return ok({ notifications: data || [], unreadCount: unreadCount || 0, total: count || 0, page, limit });
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const body = await request.json().catch(() => ({}));
  const { notificationIds, markAll } = body;

  if (markAll) {
    await markAllNotificationsRead(user.userId);
    return ok({ markedRead: 'all' });
  }

  if (notificationIds?.length) {
    await supabaseAdmin
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.userId)
      .in('id', notificationIds);
    return ok({ markedRead: notificationIds.length });
  }

  return ok({ markedRead: 0 });
}
