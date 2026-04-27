import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PrintButton from './PrintButton';

export const revalidate = 0;

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !booking) return notFound();

  // Use real pricing from DB if available, else estimate
  const hasRealPricing = booking.total_price && booking.total_price > 0;
  const subtotal = hasRealPricing
    ? (booking.total_price - (booking.total_price * 0.15 / 1.15))
    : (() => {
        const baseRate = booking.service?.toLowerCase().includes('deep') ? 70 : 50;
        const hours = (booking.rooms || 1) * 1.5 + (booking.bathrooms || 1) * 1;
        return baseRate * hours;
      })();
  const vat = hasRealPricing ? (booking.total_price * 0.15 / 1.15) : subtotal * 0.15;
  const discount = booking.discount_amount || 0;
  const total = hasRealPricing ? booking.total_price : subtotal + vat;

  const invoiceNumber = `INV-${booking.id.split('-')[0].toUpperCase()}`;
  const issueDate = new Date(booking.created_at).toLocaleDateString('en-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>

      {/* Toolbar - hidden on print */}
      <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={20} /> Back to Bookings
        </Link>
        <PrintButton />
      </div>

      {/* Invoice */}
      <div className="invoice-container" style={{ backgroundColor: 'white', maxWidth: '800px', margin: '0 auto', padding: '4rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body { background: white; margin: 0; }
            .no-print { display: none !important; }
            .invoice-container { box-shadow: none !important; padding: 2rem !important; border-radius: 0 !important; }
          }
        ` }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #f3f4f6', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.03em' }}>VELRO</h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '0.9rem' }}>Cleaning Services · Riyadh, KSA</p>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>VAT Reg: 300000000000003</p>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>velrocleaning@gmail.com</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Tax Invoice</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>{invoiceNumber}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>Issued: {issueDate}</div>
            <div style={{ marginTop: '0.75rem' }}>
              <span style={{ padding: '0.3rem 0.9rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, backgroundColor: booking.payment_status === 'paid' ? '#ecfdf5' : '#fff7ed', color: booking.payment_status === 'paid' ? '#10b981' : '#f59e0b' }}>
                {(booking.payment_status || 'Unpaid').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Billing details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Bill To</div>
            <p style={{ fontWeight: 700, fontSize: '1.15rem', color: '#111827', margin: 0 }}>{booking.name}</p>
            {booking.phone && <p style={{ color: '#4b5563', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>{booking.phone}</p>}
            {booking.email && <p style={{ color: '#4b5563', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>{booking.email}</p>}
            {booking.district && <p style={{ color: '#4b5563', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>{booking.district}, Riyadh</p>}
            {booking.address && <p style={{ color: '#4b5563', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>{booking.address}</p>}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Service Details</div>
            <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>Date: {booking.date || 'TBD'}</p>
            <p style={{ fontWeight: 600, color: '#111827', margin: '0.3rem 0 0' }}>Time: {booking.time || 'TBD'}</p>
            <p style={{ color: '#4b5563', margin: '0.3rem 0 0', fontSize: '0.9rem', textTransform: 'capitalize' }}>Tier: {booking.tier || 'Standard'}</p>
            <div style={{ marginTop: '0.6rem' }}>
              <span style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, backgroundColor: booking.status === 'Completed' ? '#ecfdf5' : '#eff6ff', color: booking.status === 'Completed' ? '#10b981' : 'var(--primary)' }}>
                {booking.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Line items */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'left', color: '#374151', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'center', color: '#374151', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right', color: '#374151', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Price</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right', color: '#374151', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '1.25rem 1rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{booking.service}</p>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                  {booking.rooms || 1} Room{(booking.rooms || 1) > 1 ? 's' : ''} · {booking.bathrooms || 1} Bathroom{(booking.bathrooms || 1) > 1 ? 's' : ''}
                  {booking.tier && booking.tier !== 'standard' ? ` · ${booking.tier} tier` : ''}
                </p>
              </td>
              <td style={{ padding: '1.25rem 1rem', textAlign: 'center', color: '#4b5563' }}>1</td>
              <td style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#4b5563' }}>SAR {subtotal.toFixed(2)}</td>
              <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: 600, color: '#111827' }}>SAR {subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
              <span>Subtotal</span>
              <span>SAR {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#10b981', fontSize: '0.9rem' }}>
                <span>Discount {booking.coupon_code ? `(${booking.coupon_code})` : ''}</span>
                <span>−SAR {discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4b5563', fontSize: '0.9rem', borderBottom: '2px solid #111827', marginBottom: '0.75rem' }}>
              <span>VAT (15%)</span>
              <span>SAR {vat.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.3rem', color: '#111827' }}>
              <span>Total</span>
              <span>SAR {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Notes</div>
            <p style={{ color: '#4b5563', margin: 0, fontSize: '0.9rem' }}>{booking.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '4rem', borderTop: '2px solid #f3f4f6', paddingTop: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
          <p style={{ margin: '0 0 0.25rem' }}>Thank you for choosing Velro Cleaning Services.</p>
          <p style={{ margin: 0 }}>Payment due upon completion · velro.services</p>
        </div>
      </div>
    </div>
  );
}
