"use client";
import React from 'react';
import { Crown, Star, CheckCircle2, ShieldCheck, Zap, UserCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  { title: "Priority Booking", desc: "Get guaranteed slots even during peak times and holidays in Riyadh.", icon: Zap },
  { title: "The Same Team", desc: "Enjoy the comfort of having the same trusted cleaners who know your home.", icon: UserCheck },
  { title: "20% Off All Services", desc: "Flat discount on every booking, deep clean, or specialized service.", icon: Star },
  { title: "Free Monthly Add-on", desc: "One free oven, fridge, or balcony clean every single month.", icon: CheckCircle2 },
  { title: "Dedicated Manager", desc: "A personal concierge for all your scheduling and specialized needs.", icon: Crown },
  { title: "Emergency Priority", desc: "Post-storm or emergency cleaning within 4 hours, guaranteed.", icon: ShieldCheck },
];

export default function MembershipPage() {
  return (
    <main style={{ padding: '8rem 1rem 6rem', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#fbbf24', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2rem', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
            <Crown size={20} /> VELRO GOLD MEMBERSHIP
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Elevate Your <span style={{ color: 'var(--primary)' }}>Home Care</span>
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            Join our exclusive membership program designed for villas and luxury apartments in Riyadh. Total peace of mind, starting from 99 SAR/month.
          </p>
        </div>

        {/* BENEFITS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{ padding: '2.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.3s ease' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <benefit.icon size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>{benefit.title}</h3>
              <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* PRICING CARD */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '3rem', border: '2px solid #fbbf24', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Membership Fee</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', fontWeight: 900, color: '#fbbf24' }}>99</span>
            <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>SAR / month</span>
          </div>
          <p style={{ opacity: 0.8, marginBottom: '2.5rem' }}>The membership fee is separate from service costs and unlocks all premium benefits and discounts.</p>
          <Link href="/book" className="btn-primary" style={{ display: 'block', padding: '1.5rem', fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none', backgroundColor: '#fbbf24', color: '#0f172a' }}>
            Become a Gold Member
          </Link>
          <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '1.5rem' }}>Cancel anytime. No long-term contracts.</p>
        </div>
      </div>
    </main>
  );
}
