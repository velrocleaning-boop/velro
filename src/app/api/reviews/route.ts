import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getAuthUser } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, forbidden, serverError, paginated } from '@/lib/response';
import { logAudit, logUserAction } from '@/lib/audit';
import { getIP } from '@/lib/auth';

function analyzeSentiment(text: string): number {
  const positive = ['great', 'excellent', 'amazing', 'perfect', 'wonderful', 'fantastic', 'love', 'best', 'clean', 'professional', 'on time', 'recommend'];
  const negative = ['bad', 'terrible', 'awful', 'dirty', 'late', 'rude', 'disappointed', 'never', 'worst', 'poor', 'horrible'];
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  for (const w of words) {
    if (positive.some((p) => w.includes(p))) score += 0.2;
    if (negative.some((n) => w.includes(n))) score -= 0.2;
  }
  return Math.max(-1, Math.min(1, Math.round(score * 100) / 100));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
  const serviceSlug = searchParams.get('service');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('reviews')
    .select('*, users(first_name, last_name)', { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (serviceSlug) {
    const { data: svc } = await supabaseAdmin.from('services_catalog').select('id').eq('slug', serviceSlug).single();
    if (svc) query = query.eq('service_id', svc.id);
  }

  const { data, count, error } = await query;
  if (error) return serverError('Failed to fetch reviews', error);

  return paginated(data || [], count || 0, page, limit);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { bookingId, overallRating, cleanlinessRating, punctualityRating, professionalismRating, comment, mediaUrls } = body;

    if (!bookingId || !overallRating) return badRequest('Booking ID and rating are required');
    if (overallRating < 1 || overallRating > 5) return badRequest('Rating must be 1-5');

    // Verify booking belongs to user and is completed
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('id, user_id, status, service_id, staff_id')
      .eq('id', bookingId)
      .single();

    if (!booking) return badRequest('Booking not found');
    if (booking.user_id !== user.userId) return forbidden('This booking does not belong to you');
    if (booking.status !== 'Completed') return badRequest('Can only review completed bookings');

    // Check for existing review
    const { data: existing } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();
    if (existing) return badRequest('You have already reviewed this booking');

    const sentimentScore = comment ? analyzeSentiment(comment) : null;

    const { data: review, error: insertError } = await supabaseAdmin
      .from('reviews')
      .insert({
        booking_id: bookingId,
        user_id: user.userId,
        staff_id: booking.staff_id,
        service_id: booking.service_id,
        overall_rating: overallRating,
        cleanliness_rating: cleanlinessRating,
        punctuality_rating: punctualityRating,
        professionalism_rating: professionalismRating,
        comment,
        sentiment_score: sentimentScore,
        media_urls: mediaUrls || [],
        status: 'pending',
        is_verified: true,
      })
      .select()
      .single();

    if (insertError) return serverError('Failed to submit review', insertError);

    await logUserAction(user.userId, 'review.created', 'review', review.id, getIP(request));
    return created(review);
  } catch (err) {
    return serverError('Review submission failed', err);
  }
}
