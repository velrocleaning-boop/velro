import { supabase } from '@/lib/supabase';
import BookingStatusSelect from '@/components/BookingStatusSelect';
import DeleteRecordButton from '@/components/DeleteRecordButton';
import EditBookingModal from '@/components/EditBookingModal';
import BookingsFilter from '@/components/BookingsFilter';
import { MessageCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function BookingsPage({ searchParams }: { searchParams: { search?: string; status?: string } }) {
  let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,phone.ilike.%${searchParams.search}%`);
  }
  
  if (searchParams.status && searchParams.status !== 'All') {
    query = query.eq('status', searchParams.status);
  }

  const { data: bookings, error } = await query;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>Bookings</h1>
      
      <BookingsFilter />

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Error loading bookings: {error.message}</p>}
      
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Phone</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>District</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Service</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Details</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Schedule</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking: any) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', color: '#6b7280' }}>{new Date(booking.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{booking.name}</td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>
                  <a 
                    href={`https://wa.me/${booking.phone?.replace(/\D/g,'')}?text=Hi ${encodeURIComponent(booking.name)}, regarding your ${encodeURIComponent(booking.service)} booking on ${booking.date || 'TBD'}...`}
                    target="_blank"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle size={16} />
                    {booking.phone}
                  </a>
                </td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>{booking.district}</td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    {booking.service}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {booking.rooms} R / {booking.bathrooms} B
                </td>
                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {booking.date ? `${booking.date} @ ${booking.time}` : 'TBD'}
                </td>
                <td style={{ padding: '1rem' }}>
                  <BookingStatusSelect bookingId={booking.id} initialStatus={booking.status} />
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <EditBookingModal booking={booking} />
                    <Link href={`/admin/bookings/${booking.id}/invoice`} style={{ color: '#10b981', display: 'flex', alignItems: 'center' }} title="Invoice">
                      <FileText size={16} />
                    </Link>
                    <DeleteRecordButton id={booking.id} type="bookings" />
                  </div>
                </td>
              </tr>
            ))}
            {(!bookings || bookings.length === 0) && !error && (
              <tr>
                <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
