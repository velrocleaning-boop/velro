import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/response';
import { logAudit } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let query = supabaseAdmin.from('system_settings').select('key, value, category, description, updated_at');
  if (category) query = query.eq('category', category);

  const { data, error: fetchError } = await query.order('category').order('key');
  if (fetchError) return serverError('Failed to fetch settings', fetchError);

  // Transform to key-value map
  const settings: Record<string, { value: unknown; category: string; description: string }> = {};
  for (const s of data || []) {
    settings[s.key] = { value: s.value, category: s.category, description: s.description };
  }

  return ok(settings);
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'super_admin');
  if (error || !user) return unauthorized(error || 'Unauthorized — Super admin required');

  try {
    const body = await request.json();
    const { updates } = body; // { key: value, ... }

    if (!updates || typeof updates !== 'object') return badRequest('Updates object required');

    const results = [];
    for (const [key, value] of Object.entries(updates)) {
      const { data, error: upsertError } = await supabaseAdmin
        .from('system_settings')
        .upsert(
          { key, value: value as never, updated_at: new Date().toISOString(), updated_by: user.userId },
          { onConflict: 'key' }
        )
        .select()
        .single();

      if (!upsertError) results.push(data);
    }

    await logAudit({
      userId: user.userId,
      action: 'admin.settings.updated',
      resourceType: 'settings',
      ipAddress: getIP(request),
      newValues: updates,
    });

    return ok({ updated: results.length, keys: Object.keys(updates) });
  } catch (err) {
    return serverError('Settings update failed', err);
  }
}
