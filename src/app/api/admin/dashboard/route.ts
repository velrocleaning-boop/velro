import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalBookings },
      { count: todayBookings },
      { count: pendingBookings },
      { count: totalUsers },
      { count: newUsersThisMonth },
      { data: revenueData },
      { data: lastMonthRevenueData },
      { data: recentBookings },
      { data: bookingsByStatus },
      { data: topServices },
      { data: openTickets },
      { count: pendingReviews },
    ] = await Promise.all([
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth).eq('role', 'customer'),
      supabaseAdmin.from('payments').select('amount').eq('status', 'completed').gte('created_at', startOfMonth),
      supabaseAdmin.from('payments').select('amount').eq('status', 'completed').gte('created_at', startOfLastMonth).lte('created_at', endOfLastMonth),
      supabaseAdmin.from('bookings').select('*').order('created_at', { ascending: false }).limit(10),
      supabaseAdmin.from('bookings').select('status').not('status', 'is', null),
      supabaseAdmin.from('bookings').select('service').not('service', 'is', null),
      supabaseAdmin.from('tickets').select('id, ticket_number, subject, status, priority, created_at').eq('status', 'open').limit(5),
      supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const monthRevenue = (revenueData || []).reduce((sum, p) => sum + p.amount, 0);
    const lastMonthRevenue = (lastMonthRevenueData || []).reduce((sum, p) => sum + p.amount, 0);
    const revenueGrowth = lastMonthRevenue
      ? Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 100;

    // Status distribution
    const statusCounts: Record<string, number> = {};
    for (const b of bookingsByStatus || []) {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    }

    // Top services
    const serviceCounts: Record<string, number> = {};
    for (const b of topServices || []) {
      if (b.service) serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
    }
    const topServicesArr = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));

    // Weekly bookings trend (last 7 days)
    const { data: weeklyBookings } = await supabaseAdmin
      .from('bookings')
      .select('created_at')
      .gte('created_at', startOfWeek);

    const weeklyTrend: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      weeklyTrend[d.toISOString().split('T')[0]] = 0;
    }
    for (const b of weeklyBookings || []) {
      const day = b.created_at.split('T')[0];
      if (weeklyTrend[day] !== undefined) weeklyTrend[day]++;
    }

    return ok({
      summary: {
        totalBookings: totalBookings || 0,
        todayBookings: todayBookings || 0,
        pendingBookings: pendingBookings || 0,
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        monthRevenue: Math.round(monthRevenue * 100) / 100,
        lastMonthRevenue: Math.round(lastMonthRevenue * 100) / 100,
        revenueGrowth,
        openTickets: openTickets?.length || 0,
        pendingReviews: pendingReviews || 0,
      },
      recentBookings: recentBookings || [],
      bookingsByStatus: statusCounts,
      topServices: topServicesArr,
      weeklyTrend: Object.entries(weeklyTrend).map(([date, count]) => ({ date, count })),
      openTickets: openTickets || [],
    });
  } catch (err) {
    return serverError('Dashboard data failed', err);
  }
}
