"use client";
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Home, Sparkles, Calendar, User, CheckCircle2, ChevronRight, ChevronLeft, Tag, Loader2, AlertCircle } from 'lucide-react';

const SERVICES = [
  { slug: 'standard-cleaning', name: 'Standard Cleaning', desc: 'Regular home cleaning', from: '150' },
  { slug: 'deep-cleaning', name: 'Deep Cleaning', desc: 'Thorough deep clean', from: '250' },
  { slug: 'move-in-out', name: 'Move-in / Move-out', desc: 'Full property clean', from: '400' },
  { slug: 'sofa-steam', name: 'Sofa & Carpet Steam', desc: 'Steam cleaning for furniture', from: '150' },
  { slug: 'ac-duct-cleaning', name: 'AC Duct Cleaning', desc: 'Air duct & vent cleaning', from: '200' },
  { slug: 'post-construction', name: 'Post-Construction', desc: 'After-build deep clean', from: '500' },
];

const DISTRICTS = [
  'Al Olaya', 'Al Malaz', 'Al Murabba', 'Al Wurud', 'Al Nakheel',
  'Al Rawdah', 'Al Sulimaniyah', 'Al Sahafa', 'Al Yasmin', 'Al Qirawan',
  'Hittin', 'Al Hamra', 'Al Aqiq', 'Al Bawadi', 'Other',
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const steps = [
  { id: 1, title: 'Service', icon: Sparkles },
  { id: 2, title: 'Details', icon: Home },
  { id: 3, title: 'Schedule', icon: Calendar },
  { id: 4, title: 'Contact', icon: User },
];

type Pricing = {
  basePrice: number;
  addonsTotal: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  tierMultiplier: number;
  zoneMultiplier: number;
};

type BookingResult = {
  id: string;
  service: string;
  name: string;
  date: string;
  time: string;
  district: string;
  total: number | null;
};

type SlotInfo = { time: string; available: boolean; remaining: number };

// Default export wraps in Suspense (required by Next.js for useSearchParams)
export default function BookingPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /></main>}>
      <BookingForm />
    </Suspense>
  );
}

function BookingForm() {
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get('service') || 'standard-cleaning';

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    service: preSelectedService,
    rooms: 1,
    bathrooms: 1,
    tier: 'standard' as 'standard' | 'premium' | 'deep',
    district: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    couponCode: '',
  });
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Get today's date as min date
  const today = new Date().toISOString().split('T')[0];

  // Fetch available slots when date changes
  useEffect(() => {
    if (!form.date) { setAvailableSlots([]); return; }
    setSlotsLoading(true);
    const zone = form.district ? form.district.toLowerCase().replace(/\s+/g, '-') : undefined;
    const params = new URLSearchParams({ date: form.date, ...(zone ? { zone } : {}) });
    fetch(`/api/bookings/slots?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setAvailableSlots(data.data.slots || []);
      })
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
  }, [form.date, form.district]);

  // Fetch pricing whenever key fields change
  const fetchPricing = useCallback(async () => {
    if (!form.service) return;
    setPricingLoading(true);
    try {
      const params = new URLSearchParams({
        service: form.service,
        rooms: String(form.rooms),
        bathrooms: String(form.bathrooms),
        tier: form.tier,
        ...(form.district ? { zoneSlug: form.district.toLowerCase().replace(/\s+/g, '-') } : {}),
        ...(form.date ? { date: form.date } : {}),
        ...(form.time ? { time: form.time } : {}),
      });
      const res = await fetch(`/api/bookings/pricing?${params}`);
      const data = await res.json();
      if (data.success) setPricing(data.data);
    } catch {
      // silent
    } finally {
      setPricingLoading(false);
    }
  }, [form.service, form.rooms, form.bathrooms, form.tier, form.district, form.date, form.time]);

  useEffect(() => {
    if (step >= 2) fetchPricing();
  }, [fetchPricing, step]);

  const validateCoupon = async () => {
    if (!form.couponCode.trim()) return;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.couponCode,
          total: pricing?.total ?? 0,
          serviceSlug: form.service,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.valid) {
        setCouponDiscount(data.data.discountAmount ?? 0);
        setCouponMsg(`✅ ${data.data.message || 'Coupon applied!'}`);
      } else {
        setCouponDiscount(0);
        setCouponMsg(`❌ ${data.data?.message || 'Invalid coupon'}`);
      }
    } catch {
      setCouponMsg('❌ Could not validate coupon');
    }
  };

  const handleSubmit = async () => {
    if (!form.phone) { setErrorMsg('Phone number is required'); return; }
    if (!form.name) { setErrorMsg('Name is required'); return; }
    setErrorMsg('');
    setStatus('loading');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone,
          service: form.service,
          district: form.district,
          rooms: form.rooms,
          bathrooms: form.bathrooms,
          date: form.date,
          time: form.time,
          tier: form.tier,
          notes: form.notes || undefined,
          couponCode: form.couponCode || undefined,
          zoneSlug: form.district.toLowerCase().replace(/\s+/g, '-'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBooking({
          id: data.data.booking.id,
          service: SERVICES.find(s => s.slug === form.service)?.name ?? form.service,
          name: form.name,
          date: form.date,
          time: form.time,
          district: form.district,
          total: data.data.pricing?.total ?? null,
        });
        setStatus('success');
      } else {
        setErrorMsg(data.error || 'Booking failed. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  const finalTotal = pricing ? Math.max(0, pricing.total - couponDiscount) : null;
  const selectedService = SERVICES.find(s => s.slug === form.service);

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (status === 'success' && booking) {
    return (
      <main style={{ padding: '8rem 1rem', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '2rem', padding: '3rem 2rem', textAlign: 'center', maxWidth: '520px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={40} color="#10b981" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem', color: '#111827' }}>Booking Confirmed!</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your booking has been received. Our team will confirm shortly.
          </p>

          <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#6b7280' }}>Booking ID</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>#{booking.id.split('-')[0].toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#6b7280' }}>Service</span>
                <span style={{ fontWeight: 600 }}>{booking.service}</span>
              </div>
              {booking.date && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#6b7280' }}>Date & Time</span>
                  <span style={{ fontWeight: 600 }}>{booking.date} @ {booking.time}</span>
                </div>
              )}
              {booking.district && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#6b7280' }}>District</span>
                  <span style={{ fontWeight: 600 }}>{booking.district}</span>
                </div>
              )}
              {booking.total !== null && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <span style={{ color: '#6b7280' }}>Estimated Total</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>SAR {booking.total?.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={`https://wa.me/966594847866?text=Hi Velro! My booking ID is %23${booking.id.split('-')[0].toUpperCase()} for ${encodeURIComponent(booking.service)} on ${booking.date}.`}
              target="_blank"
              style={{ background: '#25D366', color: 'white', padding: '1rem', borderRadius: '1rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Confirm via WhatsApp
            </a>
            <button onClick={() => window.location.href = '/'} style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '1rem', fontWeight: 700, background: 'white', cursor: 'pointer' }}>
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── Main Form ─────────────────────────────────────────────────────────────
  return (
    <main style={{ padding: '8rem 1rem 4rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>Book Your Cleaner</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Professional cleaning in Riyadh — booked in 60 seconds.</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', left: 0, right: 0, height: '2px', background: '#e2e8f0', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '24px', left: 0, width: `${((step - 1) / 3) * 100}%`, height: '2px', background: 'var(--primary)', zIndex: 0, transition: 'width 0.3s ease' }} />
          {steps.map(s => (
            <div key={s.id} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: step >= s.id ? 'var(--primary)' : 'white', color: step >= s.id ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', border: `2px solid ${step >= s.id ? 'var(--primary)' : '#e2e8f0'}`, transition: 'all 0.3s' }}>
                <s.icon size={20} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: step >= s.id ? '#111827' : '#94a3b8' }}>{s.title}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: step >= 2 ? '1fr 320px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Form Card */}
          <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>

            {/* STEP 1: Service */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>Select a service</h2>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {SERVICES.map(s => (
                    <div key={s.slug} onClick={() => setForm(f => ({ ...f, service: s.slug }))}
                      style={{ padding: '1.25rem 1.5rem', borderRadius: '1rem', border: `2px solid ${form.service === s.slug ? 'var(--primary)' : '#e2e8f0'}`, background: form.service === s.slug ? '#eff6ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#111827' }}>{s.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>{s.desc}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>from SAR {s.from}</span>
                        {form.service === s.slug && <CheckCircle2 size={20} color="var(--primary)" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>Property details</h2>
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Bedrooms</label>
                      <select value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: +e.target.value }))} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }}>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n > 1 ? 'Rooms' : 'Room'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Bathrooms</label>
                      <select value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: +e.target.value }))} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }}>
                        {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n > 1 ? 'Bathrooms' : 'Bathroom'}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Service Tier</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      {(['standard', 'premium', 'deep'] as const).map(t => (
                        <div key={t} onClick={() => setForm(f => ({ ...f, tier: t }))}
                          style={{ padding: '0.75rem', textAlign: 'center', borderRadius: '0.75rem', border: `2px solid ${form.tier === t ? 'var(--primary)' : '#e2e8f0'}`, background: form.tier === t ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: form.tier === t ? 'var(--primary)' : '#374151', textTransform: 'capitalize' }}>{t}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t === 'standard' ? '1.0x' : t === 'premium' ? '1.4x' : '1.8x'}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>District</label>
                    <select value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }}>
                      <option value="">Select district...</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Schedule */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>Pick a date & time</h2>
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Date</label>
                    <input type="date" min={today} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Time</label>
                    {slotsLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', padding: '0.5rem 0' }}>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: '0.9rem' }}>Loading available slots...</span>
                      </div>
                    ) : !form.date ? (
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Select a date first to see available times.</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                        {(availableSlots.length > 0 ? availableSlots : TIME_SLOTS.map(t => ({ time: t, available: true, remaining: 5 }))).map(slot => (
                          <div key={slot.time}
                            onClick={() => slot.available && setForm(f => ({ ...f, time: slot.time }))}
                            title={!slot.available ? 'This slot is fully booked' : `${slot.remaining} spots left`}
                            style={{
                              padding: '0.6rem',
                              textAlign: 'center',
                              borderRadius: '0.6rem',
                              border: `2px solid ${form.time === slot.time ? 'var(--primary)' : slot.available ? '#e2e8f0' : '#f3f4f6'}`,
                              background: form.time === slot.time ? '#eff6ff' : slot.available ? 'white' : '#f9fafb',
                              cursor: slot.available ? 'pointer' : 'not-allowed',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: form.time === slot.time ? 'var(--primary)' : slot.available ? '#374151' : '#d1d5db',
                              transition: 'all 0.2s',
                              position: 'relative',
                            }}>
                            {slot.time}
                            {!slot.available && (
                              <div style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>Full</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Special Notes (optional)</label>
                    <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any special instructions for our team..."
                      style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical' }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Contact */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>Your contact details</h2>
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name *</label>
                    <input type="text" placeholder="e.g. Ahmed Al-Rashid" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number * (WhatsApp)</label>
                    <input type="tel" placeholder="+966 5X XXX XXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email (optional)</label>
                    <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                  </div>

                  {/* Coupon code */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <Tag size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />
                      Coupon Code (optional)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" placeholder="Enter coupon" value={form.couponCode} onChange={e => { setForm(f => ({ ...f, couponCode: e.target.value })); setCouponMsg(''); }}
                        style={{ flex: 1, padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                      <button onClick={validateCoupon} type="button"
                        style={{ padding: '0.875rem 1.25rem', background: '#f1f5f9', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                        Apply
                      </button>
                    </div>
                    {couponMsg && <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: couponMsg.startsWith('✅') ? '#10b981' : '#ef4444' }}>{couponMsg}</p>}
                  </div>

                  {errorMsg && (
                    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.875rem', background: '#fef2f2', borderRadius: '0.75rem', border: '1px solid #fecaca' }}>
                      <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                      <span style={{ color: '#dc2626', fontSize: '0.9rem' }}>{errorMsg}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', padding: '0.875rem 1.75rem', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', background: 'white' }}>
                  <ChevronLeft size={18} /> Back
                </button>
              ) : <div />}

              {step < 4 ? (
                <button onClick={() => setStep(s => s + 1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', border: 'none' }}>
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={status === 'loading'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer', border: 'none', opacity: status === 'loading' ? 0.8 : 1 }}>
                  {status === 'loading' ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Confirming...</> : <><CheckCircle2 size={18} /> Confirm Booking</>}
                </button>
              )}
            </div>
          </div>

          {/* Pricing Sidebar */}
          {step >= 2 && (
            <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'sticky', top: '6rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', color: '#111827', fontSize: '1.1rem' }}>Price Estimate</h3>

              <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{selectedService?.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {form.rooms} room{form.rooms > 1 ? 's' : ''} · {form.bathrooms} bath{form.bathrooms > 1 ? 's' : ''} · {form.tier}
                  {form.district ? ` · ${form.district}` : ''}
                </div>
              </div>

              {pricingLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', padding: '1rem 0' }}>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.9rem' }}>Calculating...</span>
                </div>
              ) : pricing ? (
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#6b7280' }}>Base price</span>
                    <span>SAR {pricing.basePrice.toFixed(2)}</span>
                  </div>
                  {pricing.tierMultiplier !== 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: '#6b7280' }}>Tier ({form.tier})</span>
                      <span>×{pricing.tierMultiplier}</span>
                    </div>
                  )}
                  {pricing.zoneMultiplier !== 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: '#6b7280' }}>Zone adjustment</span>
                      <span>×{pricing.zoneMultiplier.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#6b7280' }}>VAT (15%)</span>
                    <span>SAR {pricing.tax.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#10b981' }}>
                      <span>Coupon discount</span>
                      <span>−SAR {couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>SAR {(finalTotal ?? pricing.total).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Fill in the details to see pricing.</p>
              )}

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ecfdf5', borderRadius: '0.75rem', fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5 }}>
                ✅ Vetted professionals<br />
                ✅ Satisfaction guarantee<br />
                ✅ Pay after service
              </div>
            </div>
          )}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </main>
  );
}
