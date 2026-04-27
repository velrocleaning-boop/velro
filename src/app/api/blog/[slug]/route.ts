import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ok, notFound, serverError } from '@/lib/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*, users(first_name, last_name, avatar_url)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) return notFound('Post not found');

    // Increment view count (non-blocking)
    void supabaseAdmin
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id);

    // Fetch related posts
    const { data: related } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, published_at, read_time_minutes')
      .eq('status', 'published')
      .eq('category', post.category)
      .neq('id', post.id)
      .limit(3);

    return ok({ ...post, related: related || [] });
  } catch (err) {
    return serverError('Failed to fetch post', err);
  }
}
