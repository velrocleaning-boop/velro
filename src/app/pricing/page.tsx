"use client";
import React from 'react';
import { Check, Info, Calculator, Sparkles, Home, Building2 } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    type: 'Apartment',
    icon: Home,
    plans: [
      { size: 'Studio / 1-BR', price: '150 SAR', features: ['1 Cleaner', '2-3 Hours', 'Basic Supplies Incl.'] },
      { size: '2-BR Apartment', price: '250 SAR', features: ['1-2 Cleaners', '3-4 Hours', 'Basic Supplies Incl.'] },
      { size: '3-BR Apartment', price: '350 SAR', features: ['2 Cleaners', '4-5 Hours', 'Basic Supplies Incl.'] },
    ]
  },
  {
    type: 'Villa',
    icon: Building2,
    plans: [
      { size: 'Small Villa', price: '500 SAR', features: ['2 Cleaners', '5-6 Hours', 'Full Equipment Incl.'] },
      { size: 'Medium Villa', price: '800 SAR', features: ['3 Cleaners', '6-7 Hours', 'Full Equipment Incl.'] },
      { size: 'Large Villa', price: '1,200+ SAR', features: ['4+ Cleaners', 'Full Day', 'Deep Sanitization'] },
    ]
  }
];

const addOns = [
  { name: 'Oven Deep Clean', price: '50 SAR' },
  { name: 'Fridge Interior', price: '40 SAR' },
  { name: 'Interior Windows', price: '100 SAR' },
  { name: 'Carpet Steam (Per Room)', price: '150 SAR' },
  { name: 'Sofa Steam (3-Seater)', price: '200 SAR' },
  { name: 'Balcony/Patio', price: '75 SAR' },
];

export default function PricingPage() {
  return (
    <main style={{ padding: '8rem 1rem 6rem', backgroundColor: '#fcfcfc' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Transparent Pricing</h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
            No hidden fees. No surprises. Choose the plan that fits your Riyadh home.
          </p>
        </div>

        {/* PRICING GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem', marginBottom: '6rem' }}>
          {pricingPlans.map((category, idx) => (
            <div key={idx} style={{ backgroundColor: 'white', borderRadius: '2rem', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '1rem', color: 'var(--primary)' }}>
                  <category.icon size={28} />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{category.type}</h2>
              </div>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {category.plans.map((plan, i) => (
                  <div key={i} style={{ padding: '1.5rem', borderRadius: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{plan.size}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.25rem' }}>{plan.price}</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
                      {plan.features.map((f, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                          <Check size={16} color="#10b981" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ADD-ONS SECTION */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '2.5rem', padding: '4rem', color: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>Customize Your Clean</h2>
            <p style={{ opacity: 0.8 }}>Add extra care to specific areas of your home.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {addOns.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INFO ALERT */}
        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem', padding: '2rem', backgroundColor: '#fff7ed', borderRadius: '1.5rem', border: '1px solid #ffedd5' }}>
          <Info color="#f97316" size={32} style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontWeight: 700, color: '#9a3412', marginBottom: '0.5rem' }}>Custom Quote for Large Estates</h3>
            <p style={{ color: '#c2410c', fontSize: '0.95rem' }}>
              For mansions, commercial buildings, or post-construction projects larger than 500 sqm, please contact our support team for a personalized site inspection and quote.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <Link href="/book" className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', textDecoration: 'none' }}>
            Start Your Booking Now
          </Link>
        </div>
      </div>
    </main>
  );
}
