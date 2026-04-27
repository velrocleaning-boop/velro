import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ok, notFound, serverError } from '@/lib/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { data, error } = await supabaseAdmin
      .from('services_catalog')
      .select('*, service_addons(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) return notFound('Service not found');

    // Fetch average rating for this service
    const { data: ratingData } = await supabaseAdmin
      .from('reviews')
      .select('overall_rating')
      .eq('service_id', data.id)
      .eq('status', 'approved');

    const ratings = ratingData || [];
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.overall_rating, 0) / ratings.length
      : null;

    return ok({ ...data, averageRating: avgRating, reviewCount: ratings.length });
  } catch (err) {
    return serverError('Failed to fetch service', err);
  }
}
