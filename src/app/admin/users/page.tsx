import { supabaseAdmin } from '@/lib/supabase-admin';

export const revalidate = 0;

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ search?: string; role?: string }> }) {
  const { search, role } = await searchParams;

  let query = supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (search) query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`);
  if (role) query = query.eq('role', role);

  const { data: users, error } = await query;

  const VIP_COLORS: Record<string, { bg: string; color: string }> = {
    none:     { bg: '#f1f5f9', color: '#64748b' },
    silver:   { bg: '#f1f5f9', color: '#374151' },
    gold:     { bg: '#fef9c3', color: '#854d0e' },
    platinum: { bg: '#ede9fe', color: '#6d28d9' },
  };

  const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
    customer:    { bg: '#eff6ff', color: '#1d4ed8' },
    staff:       { bg: '#f0fdf4', color: '#166534' },
    admin:       { bg: '#fef3c7', color: '#92400e' },
    super_admin: { bg: '#fce7f3', color: '#9d174d' },
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Customers</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>{users?.length ?? 0} users found</p>
        </div>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input name="search" defaultValue={search} placeholder="Search name, email, phone..."
          style={{ flex: '1 1 200px', padding: '0.65rem 1rem', borderRadius: '0.6rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
        <select name="role" defaultValue={role}
          style={{ padding: '0.65rem 1rem', borderRadius: '0.6rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: 'white' }}>
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ padding: '0.65rem 1.25rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
          Filter
        </button>
        <a href="/admin/users" style={{ padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.875rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
          Reset
        </a>
      </form>

      {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>Error: {error.message}</p>}

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Customer', 'Contact', 'Role', 'VIP', 'Points', 'Joined', 'Status'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => {
              const vip = VIP_COLORS[u.vip_level] ?? VIP_COLORS.none;
              const roleC = ROLE_COLORS[u.role] ?? ROLE_COLORS.customer;
              const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || '—';
              return (
                <tr key={u.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                        {(u.first_name?.[0] || u.email?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {u.phone ? (
                      <a href={`https://wa.me/${u.phone.replace(/\D/g, '')}`} target="_blank"
                        style={{ fontSize: '0.8rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                        {u.phone}
                      </a>
                    ) : <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 700, background: roleC.bg, color: roleC.color }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 700, background: vip.bg, color: vip.color, textTransform: 'capitalize' }}>
                      {u.vip_level || 'none'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: '#6366f1' }}>
                    {u.loyalty_points?.toLocaleString() ?? 0}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(u.created_at).toLocaleDateString('en-SA', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: u.is_active ? '#10b981' : '#ef4444', marginRight: '0.4rem' }} />
                    <span style={{ fontSize: '0.78rem', color: u.is_active ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!users?.length && (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No customers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
