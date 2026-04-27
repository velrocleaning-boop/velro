import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';

export const revalidate = 0;

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ search?: string; available?: string }> }) {
  const { search, available } = await searchParams;

  let query = supabaseAdmin
    .from('staff')
    .select('*, users(id, email, first_name, last_name, phone, is_active, created_at)')
    .order('rating', { ascending: false })
    .limit(50);

  if (available === 'true') query = query.eq('is_available', true);
  if (available === 'false') query = query.eq('is_available', false);

  const { data: staffList, error } = await query;

  // Filter by search client-side after join
  const filtered = search
    ? (staffList || []).filter((s: any) => {
        const u = s.users;
        const name = `${u?.first_name ?? ''} ${u?.last_name ?? ''}`.toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || u?.email?.toLowerCase().includes(q) || s.employee_id?.toLowerCase().includes(q);
      })
    : (staffList || []);

  const totalStaff = filtered.length;
  const availableCount = filtered.filter((s: any) => s.is_available).length;
  const avgRating = filtered.length
    ? (filtered.reduce((sum: number, s: any) => sum + (Number(s.rating) || 0), 0) / filtered.length).toFixed(1)
    : '—';
  const totalJobs = filtered.reduce((sum: number, s: any) => sum + (s.total_jobs || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Staff</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>{totalStaff} team members</p>
        </div>
        <button style={{ padding: '0.65rem 1.25rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
          + Add Staff
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Staff', value: totalStaff, color: '#6366f1' },
          { label: 'Available Now', value: availableCount, color: '#10b981' },
          { label: 'Avg Rating', value: avgRating, color: '#f59e0b' },
          { label: 'Total Jobs Done', value: totalJobs.toLocaleString(), color: '#8b5cf6' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>{label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input name="search" defaultValue={search} placeholder="Search name, email, employee ID..."
          style={{ flex: '1 1 220px', padding: '0.65rem 1rem', borderRadius: '0.6rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
        <select name="available" defaultValue={available}
          style={{ padding: '0.65rem 1rem', borderRadius: '0.6rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: 'white' }}>
          <option value="">All availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <button type="submit" style={{ padding: '0.65rem 1.25rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
          Filter
        </button>
        <a href="/admin/staff" style={{ padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.875rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
          Reset
        </a>
      </form>

      {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>Error: {error.message}</p>}

      {/* Staff grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((s: any) => {
          const u = s.users;
          const name = [u?.first_name, u?.last_name].filter(Boolean).join(' ') || '—';
          const initials = (u?.first_name?.[0] || u?.email?.[0] || '?').toUpperCase();
          const rating = Number(s.rating) || 0;
          const stars = Math.round(rating);
          return (
            <div key={s.id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Top: avatar + status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u?.email}</div>
                    {s.employee_id && (
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{s.employee_id}</div>
                    )}
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.65rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 700,
                  background: s.is_available ? '#dcfce7' : '#f1f5f9',
                  color: s.is_available ? '#166534' : '#64748b',
                }}>
                  {s.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ fontSize: '0.85rem', color: i <= stars ? '#f59e0b' : '#e2e8f0' }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>{rating.toFixed(1)}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>· {s.total_jobs || 0} jobs</span>
              </div>

              {/* Specializations */}
              {s.specializations?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {s.specializations.map((spec: string) => (
                    <span key={spec} style={{ padding: '0.2rem 0.55rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '2rem', fontSize: '0.68rem', fontWeight: 600 }}>
                      {spec.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rate/hr</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                    {s.hourly_rate ? `SAR ${Number(s.hourly_rate).toFixed(0)}` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Earnings</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#6366f1' }}>
                    SAR {Number(s.total_earnings || 0).toLocaleString()}
                  </div>
                </div>
                {u?.phone && (
                  <div style={{ marginLeft: 'auto' }}>
                    <a href={`https://wa.me/${u.phone.replace(/\D/g, '')}`} target="_blank"
                      style={{ padding: '0.4rem 0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {!filtered.length && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            No staff members found
          </div>
        )}
      </div>
    </div>
  );
}
