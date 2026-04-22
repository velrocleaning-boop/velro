"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <main style={{ padding: '8rem 1rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Get in <span style={{ color: 'var(--primary)' }}>Touch</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
            Have questions about our services or need a custom quote? We're here to help you 24/7 in Riyadh.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          {/* CONTACT INFO */}
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>Contact Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: '#eef2ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Phone</h4>
                  <p style={{ color: '#6b7280' }}>+966 50 000 0000</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Email</h4>
                  <p style={{ color: '#6b7280' }}>hello@velro.sa</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Head Office</h4>
                  <p style={{ color: '#6b7280' }}>King Fahd Branch Rd, Al Olaya, Riyadh 12212, Saudi Arabia</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Working Hours</h4>
                  <p style={{ color: '#6b7280' }}>Open 24/7 for Bookings<br/>Office: 8 AM - 10 PM</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1.5rem', backgroundColor: '#111827', color: 'white' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={20} /> Instant Support
              </h3>
              <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>Chat with us on WhatsApp for a faster response.</p>
              <a href="https://wa.me/966500000000" style={{ display: 'block', textAlign: 'center', backgroundColor: '#25D366', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* FORM */}
          <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Send us a message</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', outline: 'none' }} 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>Phone</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+966"
                    style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', outline: 'none' }} 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="john@example.com"
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', outline: 'none' }} 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>Message</label>
                <textarea 
                  required 
                  placeholder="How can we help you?"
                  rows={4}
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', outline: 'none', resize: 'none' }} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={status !== 'idle'}
                style={{ 
                  backgroundColor: status === 'sent' ? '#10b981' : 'var(--primary)', 
                  color: 'white', 
                  padding: '1.125rem', 
                  borderRadius: '1rem', 
                  fontWeight: 700, 
                  border: 'none', 
                  cursor: status === 'idle' ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {status === 'idle' && <><Send size={20} /> Send Message</>}
                {status === 'sending' && 'Sending...'}
                {status === 'sent' && <><CheckCircle2 size={20} /> Sent Successfully!</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
