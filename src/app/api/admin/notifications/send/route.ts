import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/response';
import { createNotification, NotificationType } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { userIds, segment, title, body: notifBody, type = 'system', data } = body;

    if (!title || !notifBody) return badRequest('Title and body are required');

    let targetUserIds: string[] = [];

    if (userIds?.length) {
      targetUserIds = userIds;
    } else if (segment) {
      // Segment targeting
      let query = supabaseAdmin.from('users').select('id').eq('is_active', true);

      if (segment === 'all') query = supabaseAdmin.from('users').select('id').eq('role', 'customer');
      else if (segment === 'vip') query = query.neq('vip_level', 'none');
      else if (segment === 'inactive') {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        query = query.lt('last_login_at', thirtyDaysAgo);
      }

      const { data: users } = await query.limit(1000);
      targetUserIds = (users || []).map((u) => u.id);
    }

    if (!targetUserIds.length) return badRequest('No target users found');

    // Batch insert notifications
    const notifications = targetUserIds.map((userId) => ({
      user_id: userId,
      type: type as NotificationType,
      title,
      body: notifBody,
      data: data || {},
      channel: ['inapp'],
      sent_at: new Date().toISOString(),
    }));

    const batchSize = 100;
    let sent = 0;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      const { error: insertError } = await supabaseAdmin.from('notifications').insert(batch);
      if (!insertError) sent += batch.length;
    }

    return ok({ sent, total: targetUserIds.length });
  } catch (err) {
    return serverError('Notification send failed', err);
  }
}
