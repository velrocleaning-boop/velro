import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';
  const type = searchParams.get('type') || 'overview';

  const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '365d' ? 365 : 30;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  try {
    if (type === 'revenue') {
      const { data: payments } = await supabaseAdmin
        .from('payments')
        .select('amount, created_at, gateway')
        .eq('status', 'completed')
        .gte('created_at', startDate)
        .order('created_at');

      // Group by date
      const byDate: Record<string, number> = {};
      const byGateway: Record<string, number> = {};
      let total = 0;

      for (const p of payments || []) {
        const day = p.created_at.split('T')[0];
        byDate[day] = (byDate[day] || 0) + p.amount;
        byGateway[p.gateway] = (byGateway[p.gateway] || 0) + p.amount;
        total += p.amount;
      }

      return ok({
        total: Math.round(total * 100) / 100,
        byDate: Object.entries(byDate).map(([date, amount]) => ({ date, amount })),
        byGateway: Object.entries(byGateway).map(([gateway, amount]) => ({ gateway, amount })),
        transactionCount: payments?.length || 0,
        avgOrderValue: payments?.length ? Math.round((total / payments.length) * 100) / 100 : 0,
      });
    }

    if (type === 'bookings') {
      const { data: bookings } = await supabaseAdmin
        .from('bookings')
        .select('status, service, district, tier, created_at, total_price')
        .gte('created_at', startDate);

      const byStatus: Record<string, number> = {};
      const byService: Record<string, number> = {};
      const byDistrict: Record<string, number> = {};
      const byTier: Record<string, number> = {};
      const byDate: Record<string, number> = {};

      for (const b of bookings || []) {
        if (b.status) byStatus[b.status] = (byStatus[b.status] || 0) + 1;
        if (b.service) byService[b.service] = (byService[b.service] || 0) + 1;
        if (b.district) byDistrict[b.district] = (byDistrict[b.district] || 0) + 1;
        if (b.tier) byTier[b.tier] = (byTier[b.tier] || 0) + 1;
        const day = b.created_at.split('T')[0];
        byDate[day] = (byDate[day] || 0) + 1;
      }

      const completionRate = bookings?.length
        ? Math.round(((byStatus['Completed'] || 0) / bookings.length) * 100)
        : 0;
      const cancellationRate = bookings?.length
        ? Math.round(((byStatus['Cancelled'] || 0) / bookings.length) * 100)
        : 0;

      return ok({
        total: bookings?.length || 0,
        completionRate,
        cancellationRate,
        byStatus,
        byService: Object.entries(byService).sort((a, b) => b[1] - a[1]).slice(0, 10),
        byDistrict: Object.entries(byDistrict).sort((a, b) => b[1] - a[1]),
        byTier,
        trend: Object.entries(byDate).map(([date, count]) => ({ date, count })),
      });
    }

    if (type === 'users') {
      const { data: users } = await supabaseAdmin
        .from('users')
        .select('created_at, vip_level, customer_segment')
        .eq('role', 'customer')
        .gte('created_at', startDate);

      const byDate: Record<string, number> = {};
      const byVip: Record<string, number> = {};
      for (const u of users || []) {
        const day = u.created_at.split('T')[0];
        byDate[day] = (byDate[day] || 0) + 1;
        byVip[u.vip_level || 'none'] = (byVip[u.vip_level || 'none'] || 0) + 1;
      }

      // Retention: users with 2+ bookings
      const { data: repeatUsers } = await supabaseAdmin
        .rpc('get_repeat_customers', { min_bookings: 2 })
        .limit(1);

      return ok({
        newUsers: users?.length || 0,
        byDate: Object.entries(byDate).map(([date, count]) => ({ date, count })),
        byVipLevel: byVip,
      });
    }

    // Overview
    const [
      { count: totalBookings },
      { data: revenue },
      { count: totalUsers },
      { data: reviews },
    ] = await Promise.all([
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', startDate),
      supabaseAdmin.from('payments').select('amount').eq('status', 'completed').gte('created_at', startDate),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).gte('created_at', startDate),
      supabaseAdmin.from('reviews').select('overall_rating').eq('status', 'approved').gte('created_at', startDate),
    ]);

    const totalRevenue = (revenue || []).reduce((s, p) => s + p.amount, 0);
    const avgRating = reviews?.length
      ? reviews.reduce((s, r) => s + r.overall_rating, 0) / reviews.length
      : null;

    return ok({
      period,
      totalBookings: totalBookings || 0,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      newUsers: totalUsers || 0,
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      reviewCount: reviews?.length || 0,
    });
  } catch (err) {
    return serverError('Analytics failed', err);
  }
}
