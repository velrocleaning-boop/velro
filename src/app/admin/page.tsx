import { supabaseAdmin } from '@/lib/supabase-admin';
import BookingStatusSelect from '@/components/BookingStatusSelect';
import Link from 'next/link';
import { FileText, MessageCircle, TrendingUp, TrendingDown, Users, CalendarCheck, Clock, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';

export const revalidate = 0;

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; trend?: { value: number; label: string };
}) {
  const positive = (trend?.value ?? 0) >= 0;
  return (
    <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ width: '36px', height: '36px', borderRadius: '0.6rem', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {trend && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.78rem', fontWeight: 700, color: positive ? '#10b981' : '#ef4444' }}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend.value)}%
          </span>
        )}
        {sub && <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{sub}</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Pending:    { bg: '#fef9c3', color: '#854d0e' },
    Confirmed:  { bg: '#dbeafe', color: '#1d4ed8' },
    Assigned:   { bg: '#ede9fe', color: '#6d28d9' },
    'In Progress': { bg: '#fce7f3', color: '#9d174d' },
    Completed:  { bg: '#dcfce7', color: '#166534' },
    Cancelled:  { bg: '#fee2e2', color: '#991b1b' },
  };
  const s = map[status] ?? { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

export default async function AdminDashboard() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfWeek = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalBookings },
    { count: todayBookings },
    { count: pendingBookings },
    { count: totalUsers },
    { count: completedThisMonth },
    { count: contacts },
    { data: recentBookings },
    { data: allStatuses },
    { data: allServices },
    { data: weeklyRaw },
  ] = await Promise.all([
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Completed').gte('created_at', startOfMonth),
    supabaseAdmin.from('contacts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('bookings').select('id,name,phone,service,status,date,time,total_price,created_at').order('created_at', { ascending: false }).limit(8),
    supabaseAdmin.from('bookings').select('status'),
    supabaseAdmin.from('bookings').select('service'),
    supabaseAdmin.from('bookings').select('created_at').gte('created_at', startOfWeek),
  ]);

  // Status breakdown
  const statusMap: Record<string, number> = {};
  for (const b of allStatuses || []) statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  const total = Object.values(statusMap).reduce((a, b) => a + b, 0) || 1;

  // Top services
  const svcMap: Record<string, number> = {};
  for (const b of allServices || []) if (b.service) svcMap[b.service] = (svcMap[b.service] || 0) + 1;
  const topServices = Object.entries(svcMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSvc = topServices[0]?.[1] || 1;

  // Weekly trend (last 7 days)
  const weeklyTrend: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    weeklyTrend[d.toISOString().split('T')[0]] = 0;
  }
  for (const b of weeklyRaw || []) {
    const day = (b.created_at as string).split('T')[0];
    if (weeklyTrend[day] !== undefined) weeklyTrend[day]++;
  }
  const weeklyEntries = Object.entries(weeklyTrend);
  const maxWeekly = Math.max(...weeklyEntries.map(e => e[1]), 1);

  const STATUS_ORDER = ['Pending', 'Confirmed', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];
  const STATUS_COLORS: Record<string, string> = {
    Pending: '#f59e0b', Confirmed: '#3b82f6', Assigned: '#8b5cf6',
    'In Progress': '#ec4899', Completed: '#10b981', Cancelled: '#ef4444',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          {now.toLocaleDateString('en-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Bookings" value={totalBookings || 0} icon={CalendarCheck} color="#6366f1" sub="all time" />
        <StatCard label="Today" value={todayBookings || 0} icon={Clock} color="#f59e0b" sub="new bookings" />
        <StatCard label="Pending" value={pendingBookings || 0} icon={AlertCircle} color="#ef4444" sub="need action" />
        <StatCard label="Completed" value={completedThisMonth || 0} icon={CheckCircle} color="#10b981" sub="this month" />
        <StatCard label="Customers" value={totalUsers || 0} icon={Users} color="#8b5cf6" sub="registered" />
        <StatCard label="Inquiries" value={contacts || 0} icon={MessageCircle} color="#0ea5e9" sub="contact messages" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem', marginBottom: '1rem' }}>

        {/* Weekly trend bar chart */}
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Bookings — Last 7 Days</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Daily booking volume</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '120px' }}>
            {weeklyEntries.map(([date, count]) => {
              const barH = Math.max(8, (count / maxWeekly) * 100);
              const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });
              return (
                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f172a' }}>{count || ''}</div>
                  <div style={{ width: '100%', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', borderRadius: '4px 4px 0 0', height: `${barH}%`, transition: 'height 0.3s' }} />
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{dayName}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Status Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STATUS_ORDER.filter(s => statusMap[s]).map(s => (
              <div key={s}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{s}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{statusMap[s] || 0}</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ background: STATUS_COLORS[s] || '#94a3b8', borderRadius: '4px', height: '100%', width: `${((statusMap[s] || 0) / total) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Recent bookings */}
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Recent Bookings</div>
            <Link href="/admin/bookings" style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Customer', 'Service', 'Date', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(recentBookings || []).map((b: any) => (
                  <tr key={b.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{b.name || '—'}</div>
                      <a href={`https://wa.me/${b.phone?.replace(/\D/g,'')}`} target="_blank"
                        style={{ fontSize: '0.75rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                        {b.phone}
                      </a>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                      {b.service?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {b.date ? `${b.date} ${b.time || ''}` : new Date(b.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                      {b.total_price ? `SAR ${Number(b.total_price).toFixed(0)}` : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <BookingStatusSelect bookingId={b.id} initialStatus={b.status} />
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <Link href={`/admin/bookings/${b.id}/invoice`} style={{ color: '#6366f1', display: 'inline-flex' }} title="Invoice">
                        <FileText size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {!recentBookings?.length && (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>No bookings yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top services */}
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Top Services</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topServices.length ? topServices.map(([svc, cnt], i) => (
              <div key={svc}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                    {svc.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{cnt}</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '6px' }}>
                  <div style={{ background: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'][i], borderRadius: '4px', height: '100%', width: `${(cnt / maxSvc) * 100}%` }} />
                </div>
              </div>
            )) : <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No data yet</p>}
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/admin/bookings" style={{ padding: '0.625rem 0.875rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                View All Bookings
              </Link>
              <Link href="/admin/contacts" style={{ padding: '0.625rem 0.875rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                View Inquiries
              </Link>
              <Link href="/admin/analytics" style={{ padding: '0.625rem 0.875rem', background: '#fdf4ff', color: '#9333ea', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                Analytics Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
