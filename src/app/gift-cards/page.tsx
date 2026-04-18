"use client";
import React from 'react';
import { Gift, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const giftValues = [150, 250, 500, 1000];

export default function GiftCardsPage() {
  return (
    <main style={{ padding: '8rem 1rem 6rem', backgroundColor: '#fff5f5' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <Gift size={18} /> VELRO GIFTS
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem' }}>Give the Gift of a <span style={{ color: '#dc2626' }}>Clean Home</span></h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
            The perfect gift for new parents, busy professionals, or a thoughtful surprise for your family in Riyadh.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          {giftValues.map((value) => (
            <div key={value} style={{ 
              padding: '2rem', 
              backgroundColor: 'white', 
              borderRadius: '2rem', 
              border: '2px solid #fee2e2', 
              textAlign: 'center',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: '#fee2e2', borderRadius: '50%', opacity: 0.5 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#64748b', marginBottom: '1rem' }}>GIFT CARD</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#dc2626', marginBottom: '2rem' }}>{value} <span style={{ fontSize: '1rem' }}>SAR</span></div>
              <Link href={`https://wa.me/966500000000?text=I'd like to purchase a ${value} SAR Gift Card.`} style={{ display: 'block', padding: '1rem', backgroundColor: '#dc2626', color: 'white', borderRadius: '1rem', fontWeight: 700, textDecoration: 'none' }}>
                Buy Now
              </Link>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div style={{ backgroundColor: 'white', padding: '4rem', borderRadius: '3rem', border: '1px solid #fee2e2' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', textAlign: 'center' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {[
              { title: "Select Value", desc: "Choose a gift card amount that fits your budget.", icon: Gift },
              { title: "Personal Message", desc: "Add a custom note for your loved one in Riyadh.", icon: Heart },
              { title: "Instant Delivery", desc: "We send the digital gift card via WhatsApp or Email.", icon: Sparkles }
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <step.icon size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
