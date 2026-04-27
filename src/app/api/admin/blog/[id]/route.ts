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
  const allowed = ['title', 'title_ar', 'excerpt', 'content', 'content_ar', 'cover_image_url',
    'tags', 'category', 'status', 'meta_title', 'meta_description', 'schema_markup', 'read_time_minutes'];

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    const bodyKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (body[bodyKey] !== undefined) updates[key] = body[bodyKey];
    else if (body[key] !== undefined) updates[key] = body[key];
  }

  if (body.status === 'published' && !body.publishedAt) {
    const { data: existing } = await supabaseAdmin.from('blog_posts').select('published_at').eq('id', id).single();
    if (!existing?.published_at) updates.published_at = new Date().toISOString();
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (updateError) return serverError('Failed to update post', updateError);
  await logUserAction(user.userId, 'admin.blog.updated', 'blog_post', id, getIP(request));
  return ok(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { error: deleteError } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
  if (deleteError) return serverError('Failed to delete post', deleteError);

  await logUserAction(user.userId, 'admin.blog.deleted', 'blog_post', id, getIP(request));
  return ok({ deleted: true });
}
