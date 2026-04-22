"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navLinkStyle = (path: string) => ({
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    display: 'block',
    textDecoration: 'none',
    color: pathname === path ? 'white' : '#9ca3af',
    backgroundColor: pathname === path ? '#1f2937' : 'transparent',
    fontWeight: pathname === path ? 600 : 400,
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <aside style={{ width: '250px', backgroundColor: '#111827', color: 'white', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', paddingLeft: '1rem' }}>Velro Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin" style={navLinkStyle('/admin')}>Dashboard</Link>
          <Link href="/admin/bookings" style={navLinkStyle('/admin/bookings')}>Bookings</Link>
          <Link href="/admin/contacts" style={navLinkStyle('/admin/contacts')}>Contacts</Link>
          <Link href="/" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'block', textDecoration: 'none', color: '#9ca3af', marginTop: '2rem' }}>&larr; Back to Site</Link>
        </nav>
        <button onClick={handleLogout} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'block', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}>
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
