"use client";
import React from 'react';
import { Star, Quote, CheckCircle2, MapPin } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Al-Fahad",
    location: "Al Olaya, Riyadh",
    content: "Velro is by far the most professional cleaning service I've used in Riyadh. The attention to detail is incredible. My villa was spotless, and the cleaners were very polite and punctual.",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    name: "Mohammad Khalid",
    location: "Al Malqa, Riyadh",
    content: "I booked a deep clean after a renovation, and they exceeded my expectations. They removed all the fine dust from places I hadn't even thought of. Highly recommended for post-construction cleaning.",
    rating: 5,
    date: "1 month ago"
  },
  {
    name: "Reema Yusuf",
    location: "Hittin, Riyadh",
    content: "The best part about Velro is their reliability. I have a weekly standard clean, and I never have to worry about the quality. It's consistently high every single time.",
    rating: 5,
    date: "3 days ago"
  },
  {
    name: "Abdullah Otaibi",
    location: "As Sulimaniyah, Riyadh",
    content: "Transparent pricing and easy booking. I love that I can just chat on WhatsApp and get everything sorted in minutes. The 100% guarantee is a great peace of mind.",
    rating: 4,
    date: "2 months ago"
  },
  {
    name: "Laila Mansour",
    location: "Al Yasmin, Riyadh",
    content: "Moved into a new apartment and used their move-in service. It was sanitized and smelled fresh when we arrived. Made our move so much easier!",
    rating: 5,
    date: "3 weeks ago"
  }
];

export default function TestimonialsPage() {
  return (
    <main style={{ padding: '8rem 1rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            What Our <span style={{ color: 'var(--primary)' }}>Clients</span> Say
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
            Trust is earned. Read what families across Riyadh have to say about their experience with Velro.
          </p>
        </div>

        <div style={{ columns: '1 350px', gap: '2rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ 
              breakInside: 'avoid', 
              marginBottom: '2rem', 
              backgroundColor: '#fff', 
              padding: '2.5rem', 
              borderRadius: '2rem', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ color: '#f59e0b', display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
              </div>
              
              <div style={{ position: 'relative' }}>
                <Quote size={40} color="var(--primary)" style={{ opacity: 0.1, position: 'absolute', top: '-10px', left: '-10px' }} />
                <p style={{ fontSize: '1.125rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                  "{t.content}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>{t.name} <CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginLeft: '4px' }} /></h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                    <MapPin size={14} /> {t.location}
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
