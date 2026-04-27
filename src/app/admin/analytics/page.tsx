import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';

export const revalidate = 0;

export default async function AnalyticsPage() {
  const now = new Date();
  const days = 30;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  const prevStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: bookingsRaw },
    { data: prevBookings },
    { data: servicesAll },
    { data: usersRaw },
    { data: reviewsRaw },
  ] = await Promise.all([
    supabaseAdmin.from('bookings').select('created_at,status,service,total_price,district').gte('created_at', start),
    supabaseAdmin.from('bookings').select('id', { count: 'exact' }).gte('created_at', prevStart).lte('created_at', start),
    supabaseAdmin.from('bookings').select('service'),
    supabaseAdmin.from('users').select('created_at,role').gte('created_at', start),
    supabaseAdmin.from('reviews').select('rating,created_at').gte('created_at', start),
  ]);

  const total = bookingsRaw?.length ?? 0;
  const prevTotal = prevBookings?.length ?? 0;
  const growthPct = prevTotal ? Math.round(((total - prevTotal) / prevTotal) * 100) : 0;

  const completed = bookingsRaw?.filter(b => b.status === 'Completed').length ?? 0;
  const convRate = total ? Math.round((completed / total) * 100) : 0;

  const revenue = bookingsRaw?.reduce((s, b) => s + (Number(b.total_price) || 0), 0) ?? 0;

  const avgRating = reviewsRaw?.length
    ? (reviewsRaw.reduce((s, r) => s + r.rating, 0) / reviewsRaw.length).toFixed(1)
    : '—';

  // Daily bookings for last 30 days
  const dailyMap: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dailyMap[d] = 0;
  }
  for (const b of bookingsRaw || []) {
    const d = (b.created_at as string).split('T')[0];
    if (dailyMap[d] !== undefined) dailyMap[d]++;
  }
  const dailyEntries = Object.entries(dailyMap);
  const maxDaily = Math.max(...dailyEntries.map(e => e[1]), 1);

  // Service breakdown
  const svcMap: Record<string, number> = {};
  for (const b of servicesAll || []) if (b.service) svcMap[b.service] = (svcMap[b.service] || 0) + 1;
  const svcTotal = Object.values(svcMap).reduce((a, b) => a + b, 0) || 1;
  const svcEntries = Object.entries(svcMap).sort((a, b) => b[1] - a[1]);

  // District breakdown
  const distMap: Record<string, number> = {};
  for (const b of bookingsRaw || []) if (b.district) distMap[b.district] = (distMap[b.district] || 0) + 1;
  const topDistricts = Object.entries(distMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxDist = topDistricts[0]?.[1] || 1;

  // Rating distribution
  const ratingDist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviewsRaw || []) ratingDist[r.rating] = (ratingDist[r.rating] || 0) + 1;
  const totalReviews = reviewsRaw?.length || 0;

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

  return (
    <div>
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Analytics</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>Last 30 days performance overview</p>
        </div>
        <Link href="/admin" style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>← Dashboard</Link>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Bookings', value: total, sub: `${growthPct >= 0 ? '+' : ''}${growthPct}% vs prev period`, color: '#6366f1' },
          { label: 'Completed', value: completed, sub: `${convRate}% completion rate`, color: '#10b981' },
          { label: 'Revenue (SAR)', value: `${revenue.toLocaleString()}`, sub: 'from paid bookings', color: '#f59e0b' },
          { label: 'Avg Rating', value: avgRating, sub: `from ${totalReviews} reviews`, color: '#ec4899' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* 30-day chart */}
      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', fontSize: '0.95rem' }}>Daily Bookings — Last 30 Days</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100px', overflowX: 'auto' }}>
          {dailyEntries.map(([date, count]) => {
            const h = Math.max(4, (count / maxDaily) * 90);
            const isToday = date === now.toISOString().split('T')[0];
            return (
              <div key={date} title={`${date}: ${count} bookings`} style={{ flex: '0 0 calc(100% / 30 - 3px)', minWidth: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{ width: '100%', background: isToday ? '#f59e0b' : '#6366f1', borderRadius: '3px 3px 0 0', height: `${h}px`, opacity: count ? 1 : 0.2 }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{dailyEntries[0]?.[0]}</span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Today</span>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

        {/* Service breakdown */}
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '1.25rem' }}>By Service</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {svcEntries.map(([svc, cnt], i) => (
              <div key={svc}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                    {svc.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                    {cnt} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({Math.round((cnt / svcTotal) * 100)}%)</span>
                  </span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '5px' }}>
                  <div style={{ background: COLORS[i % COLORS.length], borderRadius: '4px', height: '100%', width: `${(cnt / svcTotal) * 100}%` }} />
                </div>
              </div>
            ))}
            {!svcEntries.length && <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No data</p>}
          </div>
        </div>

        {/* District heatmap */}
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Top Districts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topDistricts.map(([dist, cnt], i) => (
              <div key={dist} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '20px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>{dist}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{cnt}</span>
                  </div>
                  <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '5px' }}>
                    <div style={{ background: `hsl(${220 + i * 20}, 80%, 55%)`, borderRadius: '4px', height: '100%', width: `${(cnt / maxDist) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {!topDistricts.length && <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No district data</p>}
          </div>
        </div>

        {/* Ratings */}
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Rating Distribution
            {totalReviews > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8', marginLeft: '0.5rem' }}>({totalReviews} reviews)</span>}
          </div>
          {totalReviews > 0 ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b' }}>{avgRating}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>average rating</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', width: '12px' }}>{star}</span>
                    <span style={{ fontSize: '0.7rem' }}>★</span>
                    <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '4px', height: '6px' }}>
                      <div style={{ background: '#f59e0b', borderRadius: '4px', height: '100%', width: totalReviews ? `${((ratingDist[star] || 0) / totalReviews) * 100}%` : '0%' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', width: '20px', textAlign: 'right' }}>{ratingDist[star] || 0}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>No reviews yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
