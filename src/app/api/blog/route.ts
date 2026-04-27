import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ok, serverError, paginated } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(20, parseInt(searchParams.get('limit') || '9'));
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  const offset = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, title_ar, excerpt, cover_image_url, tags, category, published_at, read_time_minutes, view_count, users(first_name, last_name)', { count: 'exact' })
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) query = query.eq('category', category);
    if (tag) query = query.contains('tags', [tag]);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, count, error } = await query;
    if (error) return serverError('Failed to fetch posts', error);

    return paginated(data || [], count || 0, page, limit);
  } catch (err) {
    return serverError('Blog fetch failed', err);
  }
}
