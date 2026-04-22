"use client";
import React, { useState } from 'react';
import { Home, Sparkles, Building2, MapPin, Calendar, Clock, User, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const steps = [
  { id: 1, title: 'Service', icon: Sparkles },
  { id: 2, title: 'Details', icon: Home },
  { id: 3, title: 'Time', icon: Calendar },
  { id: 4, title: 'Contact', icon: User }
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [booking, setBooking] = useState({
    service: 'Standard Cleaning',
    rooms: 1,
    bathrooms: 1,
    date: '',
    time: '',
    district: '',
    name: '',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleConfirm = async () => {
    if (!booking.name || !booking.phone) {
      alert("Please enter your name and phone number");
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...booking,
          email: 'customer@example.com' // Placeholder
        })
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const totalStep = 4;

  if (status === 'success') {
    return (
      <main style={{ padding: '8rem 1rem', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '2rem', padding: '4rem 2rem', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <CheckCircle2 size={40} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Booking Successful!</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Your booking for {booking.service} has been received. Our team will contact you shortly to confirm the details.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a 
              href={`https://wa.me/966500000000?text=I'd like to confirm my booking for ${booking.service}. My name is ${booking.name}.`}
              target="_blank"
              style={{ backgroundColor: '#10b981', color: 'white', padding: '1.25rem', borderRadius: '1rem', fontWeight: 800, textDecoration: 'none' }}
            >
              Chat on WhatsApp
            </a>
            <button onClick={() => window.location.href = '/'} style={{ border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '1rem', fontWeight: 700, backgroundColor: 'white' }}>
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '8rem 1rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>Book Your Cleaner</h1>
          <p style={{ color: '#64748b' }}>Complete these 4 steps to book your professional cleaner in Riyadh.</p>
        </div>

        {/* STEP PROGRESS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '24px', left: '0', width: `${((currentStep - 1) / (totalStep - 1)) * 100}%`, height: '2px', backgroundColor: 'var(--primary)', zIndex: 0, transition: 'all 0.3s ease' }} />
          
          {steps.map((step) => (
            <div key={step.id} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: currentStep >= step.id ? 'var(--primary)' : 'white', 
                color: currentStep >= step.id ? 'white' : '#94a3b8',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                border: `2px solid ${currentStep >= step.id ? 'var(--primary)' : '#e2e8f0'}`,
                transition: 'all 0.3s ease'
              }}>
                <step.icon size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: currentStep >= step.id ? '#111827' : '#94a3b8' }}>{step.title}</span>
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div style={{ backgroundColor: 'white', borderRadius: '2rem', padding: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Select your service</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {['Standard Cleaning', 'Deep Cleaning', 'Move-in/out'].map(s => (
                  <div 
                    key={s} 
                    onClick={() => setBooking({...booking, service: s})}
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '1rem', 
                      border: `2px solid ${booking.service === s ? 'var(--primary)' : '#e2e8f0'}`, 
                      backgroundColor: booking.service === s ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s}</span>
                    {booking.service === s && <CheckCircle2 color="var(--primary)" size={24} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Property Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Number of Rooms</label>
                  <select 
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}
                    value={booking.rooms}
                    onChange={(e) => setBooking({...booking, rooms: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Room{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Number of Bathrooms</label>
                  <select 
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}
                    value={booking.bathrooms}
                    onChange={(e) => setBooking({...booking, bathrooms: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n} Bathroom{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>District</label>
                  <input 
                    type="text" 
                    placeholder="Enter neighborhood (e.g. Al Olaya)"
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }} 
                    value={booking.district}
                    onChange={(e) => setBooking({...booking, district: e.target.value})}
                  />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Schedule</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Preferred Date</label>
                  <input 
                    type="date" 
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }} 
                    value={booking.date}
                    onChange={(e) => setBooking({...booking, date: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Preferred Time</label>
                  <select 
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}
                    value={booking.time}
                    onChange={(e) => setBooking({...booking, time: e.target.value})}
                  >
                    <option value="">Select a time</option>
                    <option value="08:00">08:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Contact Information</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }} 
                    value={booking.name}
                    onChange={(e) => setBooking({...booking, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+966"
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }} 
                    value={booking.phone}
                    onChange={(e) => setBooking({...booking, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
            {currentStep > 1 ? (
              <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', backgroundColor: 'white' }}>
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div />}
            
            {currentStep < 4 ? (
              <button onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', border: 'none' }}>
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handleConfirm}
                disabled={status === 'loading'}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b981', color: 'white', padding: '1rem 2.5rem', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', border: 'none' }}
              >
                {status === 'loading' ? 'Confirming...' : 'Confirm Booking'} <CheckCircle2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
