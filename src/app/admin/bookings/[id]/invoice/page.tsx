import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !booking) {
    return notFound();
  }

  // Calculate pricing based on service and rooms
  const baseRate = booking.service === 'Deep Cleaning' ? 70 : 50;
  const estimatedHours = booking.rooms * 1.5 + booking.bathrooms * 1;
  const subtotal = baseRate * estimatedHours;
  const vat = subtotal * 0.15; // 15% VAT in KSA
  const total = subtotal + vat;

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
      <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={20} /> Back to Bookings
        </Link>
        <button 
          onClick={() => window.print()}
          style={{ backgroundColor: '#111827', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <Printer size={18} /> Print Invoice (PDF)
        </button>
      </div>

      <div className="invoice-container" style={{ backgroundColor: 'white', maxWidth: '800px', margin: '0 auto', padding: '4rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body { background: white; }
            .no-print { display: none !important; }
            .invoice-container { box-shadow: none !important; padding: 0 !important; }
          }
        `}} />
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f3f4f6', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>VELRO</h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Cleaning Services - Riyadh, KSA</p>
            <p style={{ color: '#6b7280' }}>VAT No: 300000000000003</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#e5e7eb', margin: 0, textTransform: 'uppercase' }}>Invoice</h2>
            <p style={{ color: '#111827', fontWeight: 600, marginTop: '0.5rem' }}>INV-{booking.id.split('-')[0].toUpperCase()}</p>
            <p style={{ color: '#6b7280' }}>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bill To:</h3>
            <p style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', margin: 0 }}>{booking.name}</p>
            <p style={{ color: '#4b5563', margin: '0.25rem 0 0 0' }}>{booking.phone}</p>
            <p style={{ color: '#4b5563', margin: '0.25rem 0 0 0' }}>{booking.email}</p>
            <p style={{ color: '#4b5563', margin: '0.25rem 0 0 0' }}>District: {booking.district}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Service Schedule:</h3>
            <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>Date: {booking.date || 'TBD'}</p>
            <p style={{ fontWeight: 600, color: '#111827', margin: '0.25rem 0 0 0' }}>Time: {booking.time || 'TBD'}</p>
            <p style={{ fontWeight: 600, margin: '0.25rem 0 0 0', backgroundColor: '#ecfdf5', color: '#10b981', display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '1rem', marginTop: '0.5rem' }}>
              Status: {booking.status}
            </p>
          </div>
        </div>

        {/* Invoice Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>Description</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#374151' }}>Qty</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>Rate (SAR)</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>Amount (SAR)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '1.5rem 1rem' }}>
                <p style={{ fontWeight: 600, margin: 0, color: '#111827' }}>{booking.service}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Property: {booking.rooms} Rooms, {booking.bathrooms} Bathrooms
                </p>
              </td>
              <td style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#4b5563' }}>{estimatedHours} hrs</td>
              <td style={{ padding: '1.5rem 1rem', textAlign: 'right', color: '#4b5563' }}>{baseRate}.00</td>
              <td style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', marginBottom: '0.75rem', color: '#4b5563' }}>
              <span>Subtotal</span>
              <span>SAR {subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '2px solid #111827', marginBottom: '0.75rem', color: '#4b5563' }}>
              <span>VAT (15%)</span>
              <span>SAR {vat.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', color: '#111827' }}>
              <span>Total</span>
              <span>SAR {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '5rem', borderTop: '2px solid #f3f4f6', paddingTop: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          <p>Thank you for choosing Velro Cleaning Services.</p>
          <p>Payment is due upon completion of the service.</p>
        </div>
      </div>
    </div>
  );
}
