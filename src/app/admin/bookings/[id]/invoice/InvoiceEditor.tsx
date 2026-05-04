"use client";
import { useState } from 'react';

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

interface Props {
  booking: any;
  type: 'invoice' | 'quote';
  vatNumber?: string;
}

function uid() { return Math.random().toString(36).slice(2); }

export default function InvoiceEditor({ booking, type, vatNumber = '314418368500003' }: Props) {
  const isQuote = type === 'quote';
  const docNumber = isQuote
    ? `QTE-${booking.id.split('-')[0].toUpperCase()}`
    : `INV-${booking.id.split('-')[0].toUpperCase()}`;

  // Initialise line items from saved metadata or derive from booking
  const savedData = isQuote ? booking.metadata?.quote_data : booking.metadata?.invoice_data;
  const initItems: LineItem[] = savedData?.items ?? (() => {
    const total = Number(booking.total_price) || 0;
    const vat = total ? total * 0.15 / 1.15 : 0;
    const sub = total - vat;
    const base = sub || 100;
    return [{
      id: uid(),
      description: `${booking.service || 'Cleaning Service'} — ${booking.rooms || 1} room(s), ${booking.bathrooms || 1} bathroom(s)${booking.tier && booking.tier !== 'standard' ? ` · ${booking.tier} tier` : ''}`,
      qty: 1,
      unitPrice: Number(base.toFixed(2)),
    }];
  })();

  const validUntilDefault = (() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })();

  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<LineItem[]>(initItems);
  const [notes, setNotes] = useState<string>(savedData?.notes ?? booking.notes ?? '');
  const [discount, setDiscount] = useState<number>(savedData?.discount ?? (Number(booking.discount_amount) || 0));
  const [dueDate, setDueDate] = useState<string>(savedData?.dueDate ?? '');
  const [validUntil, setValidUntil] = useState<string>(savedData?.validUntil ?? validUntilDefault);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [emailMsg, setEmailMsg] = useState('');

  // Compute totals
  const lineSubtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const afterDiscount = Math.max(0, lineSubtotal - discount);
  const vat = afterDiscount * 0.15;
  const total = afterDiscount + vat;

  const totals = { subtotal: lineSubtotal, vat, discount, total };

  // Line item helpers
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const addItem = () => setItems(prev => [...prev, { id: uid(), description: '', qty: 1, unitPrice: 0 }]);
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  // Save to DB
  const handleSave = async () => {
    setSaving(true);
    const key = isQuote ? 'quote_data' : 'invoice_data';
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes,
        discount_amount: discount,
        metadata: { ...(booking.metadata || {}), [key]: { items, notes, discount, dueDate, validUntil } },
      }),
    });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  // Send email
  const handleSendEmail = async () => {
    if (!booking.email) {
      setEmailMsg('No email address on this booking.');
      setEmailStatus('error');
      return;
    }
    setSending(true);
    setEmailStatus('idle');
    const res = await fetch(`/api/admin/bookings/${booking.id}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, items, totals, notes, validUntil }),
    });
    const data = await res.json();
    setSending(false);
    if (res.ok) {
      setEmailStatus('sent');
      setEmailMsg(`${isQuote ? 'Quotation' : 'Invoice'} sent to ${booking.email}`);
    } else {
      setEmailStatus('error');
      setEmailMsg(data.error || 'Send failed');
    }
  };

  const issueDate = new Date(booking.created_at).toLocaleDateString('en-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  const inputStyle: React.CSSProperties = {
    border: '1px solid #e2e8f0', borderRadius: '0.4rem', padding: '0.4rem 0.6rem',
    fontSize: '0.875rem', outline: 'none', background: '#fafafa', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `@media print { .no-print { display:none!important; } body { background:white; } .invoice-wrap { box-shadow:none!important; border-radius:0!important; } }` }} />

      {/* Toolbar */}
      <div className="no-print" style={{ maxWidth: '820px', margin: '0 auto 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a href="/admin/bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4b5563', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
          ← Bookings
        </a>
        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <a href={`/admin/bookings/${booking.id}/invoice`}
            style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', background: !isQuote ? '#0f172a' : '#e2e8f0', color: !isQuote ? '#fff' : '#374151' }}>
            Invoice
          </a>
          <a href={`/admin/bookings/${booking.id}/quote`}
            style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', background: isQuote ? '#1e3a5f' : '#e2e8f0', color: isQuote ? '#fff' : '#374151' }}>
            Quotation
          </a>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', color: '#374151' }}>
              ✏️ Edit
            </button>
          ) : (
            <>
              <button onClick={() => setEditing(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: saved ? '#10b981' : '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
              </button>
            </>
          )}
          <button onClick={handleSendEmail} disabled={sending}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: emailStatus === 'sent' ? '#10b981' : '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
            {sending ? 'Sending…' : emailStatus === 'sent' ? '✓ Sent!' : `📧 Email ${isQuote ? 'Quote' : 'Invoice'}`}
          </button>
          <button onClick={() => window.print()}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
            🖨 Print / PDF
          </button>
        </div>
      </div>

      {/* Email status message */}
      {emailStatus !== 'idle' && (
        <div className="no-print" style={{ maxWidth: '820px', margin: '0 auto 1rem', padding: '0.75rem 1rem', borderRadius: '0.6rem', background: emailStatus === 'sent' ? '#dcfce7' : '#fee2e2', color: emailStatus === 'sent' ? '#166534' : '#991b1b', fontWeight: 600, fontSize: '0.85rem' }}>
          {emailMsg}
        </div>
      )}

      {/* Invoice / Quote document */}
      <div className="invoice-wrap" style={{ backgroundColor: 'white', maxWidth: '820px', margin: '0 auto', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: isQuote ? '#1e3a5f' : '#0f172a', padding: '3rem 3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>VELRO</div>
            <div style={{ color: isQuote ? '#93c5fd' : '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Cleaning Services · Riyadh, KSA</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>VAT Reg: {vatNumber}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>velrocleaning@gmail.com</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isQuote ? '#93c5fd' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {isQuote ? 'Quotation' : 'Tax Invoice'}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{docNumber}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '4px' }}>
              {isQuote ? 'Date:' : 'Issued:'} {issueDate}
            </div>
            {isQuote ? (
              <div style={{ marginTop: '6px', color: isQuote ? '#93c5fd' : '#9ca3af', fontSize: '0.8rem' }}>
                Valid until:{' '}
                {editing
                  ? <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ ...inputStyle, width: '140px', display: 'inline-block' }} />
                  : <strong style={{ color: '#fff' }}>{validUntil}</strong>
                }
              </div>
            ) : (
              !isQuote && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, background: booking.payment_status === 'paid' ? '#10b981' : '#f59e0b', color: '#fff' }}>
                    {(booking.payment_status || 'UNPAID').toUpperCase()}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <div style={{ padding: '2.5rem 3.5rem' }}>

          {/* Bill To / Service Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
                {isQuote ? 'Prepared For' : 'Bill To'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>{booking.name}</div>
              {booking.phone && <div style={{ color: '#4b5563', marginTop: '4px', fontSize: '0.9rem' }}>{booking.phone}</div>}
              {booking.email && <div style={{ color: '#4b5563', marginTop: '2px', fontSize: '0.875rem' }}>{booking.email}</div>}
              {booking.district && <div style={{ color: '#4b5563', marginTop: '2px', fontSize: '0.875rem' }}>{booking.district}, Riyadh</div>}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Service Details</div>
              <div style={{ color: '#111827', fontWeight: 600 }}>{booking.date || 'TBD'}</div>
              <div style={{ color: '#4b5563', marginTop: '2px', fontSize: '0.9rem' }}>{booking.time || 'TBD'}</div>
              {!isQuote && !editing && dueDate && <div style={{ color: '#4b5563', fontSize: '0.875rem', marginTop: '4px' }}>Due: {dueDate}</div>}
              {!isQuote && editing && (
                <div style={{ marginTop: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Payment Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Line items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '60px' }}>Qty</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '120px' }}>Unit Price</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '120px' }}>Amount</th>
                {editing && <th style={{ width: '40px' }} />}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem' }}>
                    {editing
                      ? <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} style={inputStyle} placeholder="Service description" />
                      : <span style={{ fontWeight: idx === 0 ? 600 : 400, color: '#111827' }}>{item.description}</span>
                    }
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {editing
                      ? <input type="number" min="1" value={item.qty} onChange={e => updateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))} style={{ ...inputStyle, width: '60px', textAlign: 'center' }} />
                      : <span style={{ color: '#4b5563' }}>{item.qty}</span>
                    }
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {editing
                      ? <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))} style={{ ...inputStyle, width: '100px', textAlign: 'right' }} />
                      : <span style={{ color: '#4b5563' }}>SAR {item.unitPrice.toFixed(2)}</span>
                    }
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                    SAR {(item.qty * item.unitPrice).toFixed(2)}
                  </td>
                  {editing && (
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, padding: '0 4px' }}>×</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {editing && (
            <button onClick={addItem} style={{ padding: '0.5rem 1rem', border: '1px dashed #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              + Add Line Item
            </button>
          )}

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ width: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
                <span>Subtotal</span><span>SAR {lineSubtotal.toFixed(2)}</span>
              </div>
              {editing ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: '#10b981' }}>Discount (SAR)</span>
                  <input type="number" min="0" step="0.01" value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} style={{ ...inputStyle, width: '100px', textAlign: 'right' }} />
                </div>
              ) : discount > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#10b981', fontSize: '0.9rem' }}>
                  <span>Discount {booking.coupon_code ? `(${booking.coupon_code})` : ''}</span>
                  <span>−SAR {discount.toFixed(2)}</span>
                </div>
              ) : null}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4b5563', fontSize: '0.9rem', borderBottom: '2px solid #111827', marginBottom: '0.75rem' }}>
                <span>VAT (15%)</span><span>SAR {vat.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.3rem', color: '#111827' }}>
                <span>Total</span><span>SAR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {editing ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="Additional notes, terms, payment instructions..." />
            </div>
          ) : notes ? (
            <div style={{ marginBottom: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Notes</div>
              <p style={{ color: '#4b5563', margin: 0, fontSize: '0.9rem' }}>{notes}</p>
            </div>
          ) : null}

          {/* Quote acceptance note */}
          {isQuote && !editing && (
            <div style={{ padding: '1rem 1.25rem', background: '#eff6ff', borderRadius: '0.75rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: '#1e3a5f', fontSize: '0.9rem' }}>To accept this quotation, reply by email or WhatsApp.</div>
              <div style={{ color: '#3b82f6', fontSize: '0.8rem', marginTop: '4px' }}>Valid until {validUntil}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem 3.5rem', background: '#f8fafc', borderTop: '2px solid #f3f4f6', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>Thank you for choosing Velro Cleaning Services.</p>
          <p style={{ color: '#9ca3af', margin: '4px 0 0', fontSize: '0.8rem' }}>
            {isQuote ? 'This quotation is valid for 7 days from issue date.' : 'Payment due upon completion · velro.services'}
          </p>
        </div>
      </div>
    </div>
  );
}
