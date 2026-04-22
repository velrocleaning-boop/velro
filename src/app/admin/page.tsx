import { supabase } from '@/lib/supabase';
import BookingStatusSelect from '@/components/BookingStatusSelect';
import DeleteRecordButton from '@/components/DeleteRecordButton';
import EditBookingModal from '@/components/EditBookingModal';
import { MessageCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboard() {
  const { count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
  const { count: contactsCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
  const { data: recentBookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5);

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827', letterSpacing: '-0.02em' }}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Overview of your cleaning service operations.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Bookings</h3>
          <p style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.5rem' }}>{bookingsCount || 0}</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inquiries</h3>
          <p style={{ fontSize: '3.5rem', fontWeight: 900, color: '#10b981', marginTop: '0.5rem' }}>{contactsCount || 0}</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Recent Bookings</h2>
          <Link href="/admin/bookings" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Customer</th>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Phone</th>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Service</th>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings?.map((b: any) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>{b.name}</td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>
                    <a 
                      href={`https://wa.me/${b.phone?.replace(/\D/g,'')}?text=Hi ${encodeURIComponent(b.name)}, regarding your ${encodeURIComponent(b.service)} booking...`}
                      target="_blank"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#25D366', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle size={16} />
                      {b.phone}
                    </a>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>{b.service}</td>
                  <td style={{ padding: '1rem' }}>
                    <BookingStatusSelect bookingId={b.id} initialStatus={b.status} />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <EditBookingModal booking={b} />
                      <Link href={`/admin/bookings/${b.id}/invoice`} style={{ color: '#10b981', display: 'flex', alignItems: 'center' }} title="Invoice">
                        <FileText size={16} />
                      </Link>
                      <DeleteRecordButton id={b.id} type="bookings" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
