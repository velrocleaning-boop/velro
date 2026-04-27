import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, serverError, paginated } from '@/lib/response';
import { logUserAction } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
  const status = searchParams.get('status');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, status, category, tags, published_at, view_count, created_at, users(first_name, last_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);

  const { data, count, error: fetchError } = await query;
  if (fetchError) return serverError('Failed to fetch posts', fetchError);
  return paginated(data || [], count || 0, page, limit);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { slug, title, titleAr, excerpt, content, contentAr, coverImageUrl, tags, category, status = 'draft', metaTitle, metaDescription, schemaMarkup, readTimeMinutes } = body;

    if (!slug || !title || !content) return badRequest('Slug, title, and content are required');

    const { data: post, error: insertError } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        slug,
        title,
        title_ar: titleAr,
        excerpt,
        content,
        content_ar: contentAr,
        cover_image_url: coverImageUrl,
        tags: tags || [],
        category,
        status,
        author_id: user.userId,
        published_at: status === 'published' ? new Date().toISOString() : null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        schema_markup: schemaMarkup,
        read_time_minutes: readTimeMinutes || Math.ceil(content.split(' ').length / 200),
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') return badRequest('Slug already exists');
      return serverError('Failed to create post', insertError);
    }

    await logUserAction(user.userId, 'admin.blog.created', 'blog_post', post.id, getIP(request));
    return created(post);
  } catch (err) {
    return serverError('Blog post creation failed', err);
  }
}
