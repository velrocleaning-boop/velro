import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthUser } from '@/lib/auth';
import { ok, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyType = searchParams.get('propertyType') || 'apartment';
  const rooms = parseInt(searchParams.get('rooms') || '2');
  const lastService = searchParams.get('lastService');

  const user = await getAuthUser(request);

  try {
    const { data: services } = await supabaseAdmin
      .from('services_catalog')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (!services) return ok([]);

    // Rule-based recommendation engine
    let recommended = [...services];

    // Priority rules based on property type
    if (propertyType === 'villa' || rooms > 4) {
      recommended = recommended.sort((a, b) => {
        const aScore = ['deep-cleaning', 'move-in-out'].includes(a.slug) ? 1 : 0;
        const bScore = ['deep-cleaning', 'move-in-out'].includes(b.slug) ? 1 : 0;
        return bScore - aScore;
      });
    }

    // If user exists, personalize based on booking history
    if (user) {
      const { data: bookings } = await supabaseAdmin
        .from('bookings')
        .select('service')
        .eq('user_id', user.userId)
        .order('created_at', { ascending: false })
        .limit(5);

      const recentServices = (bookings || []).map((b) => b.service).filter(Boolean);
      if (recentServices.length > 0) {
        // Recommend different services from what they last booked
        const mostUsed = recentServices[0];
        recommended = [
          ...recommended.filter((s) => s.slug !== mostUsed),
          ...recommended.filter((s) => s.slug === mostUsed),
        ];
      }
    }

    // Seasonal recommendation (Riyadh dust storms Apr-Jun)
    const month = new Date().getMonth() + 1;
    if ([4, 5, 6].includes(month)) {
      const dustStorm = recommended.find((s) => s.slug === 'dust-storm-recovery');
      if (dustStorm) {
        recommended = [dustStorm, ...recommended.filter((s) => s.slug !== 'dust-storm-recovery')];
      }
    }

    return ok({
      recommendations: recommended.slice(0, 4),
      personalized: !!user,
      reason: user ? 'Based on your booking history' : 'Popular in your area',
    });
  } catch (err) {
    return serverError('Recommendation failed', err);
  }
}
