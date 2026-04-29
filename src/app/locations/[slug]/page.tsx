"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { locations } from '@/data/locations';
import { MapPin, Star, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LocationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const location = locations.find(l => l.slug === slug);

  if (!location) {
    return (
      <div className="container" style={{ padding: '10rem 1rem', textAlign: 'center' }}>
        <h1>Location not found</h1>
        <Link href="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <main>
      {/* HERO */}
      <section style={{ 
        padding: '8rem 1rem 5rem', 
        background: 'linear-gradient(to bottom, #eff6ff, #fff)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dbeafe', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
            <MapPin size={16} /> Cleaning Services in {location.name}
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Trusted Home Cleaning in <br/><span style={{ color: 'var(--primary)' }}>{location.name} ({location.nameAr})</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {location.description} Book a vetted professional cleaner for your home in {location.name} in under 60 seconds.
          </p>
          
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Star fill="#f59e0b" color="#f59e0b" size={20} /> 4.9/5 Rating
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <ShieldCheck color="#10b981" size={20} /> Vetted Pros
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Clock color="var(--primary)" size={20} /> 2hr Arrival
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: '6rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Why {location.name} Residents Choose Velro</h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
                We understand the specific needs of homes in {location.name}. Whether you live in a modern apartment or a luxury villa, our cleaners are trained to handle every detail with care.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  "Police-checked professionals",
                  "Deep cleaning & standard upkeep",
                  "Eco-friendly supplies included",
                  "Flexible slots (Evenings & Weekends)",
                  "No hidden fees or travel costs"
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>
                    <CheckCircle2 color="#10b981" size={22} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Available Today in {location.name}</h3>
              <p style={{ marginBottom: '2rem', color: '#64748b' }}>Check instant pricing and availability for {location.name} neighborhood.</p>
              <Link href="https://wa.me/966594847866" style={{ 
                display: 'block', 
                textAlign: 'center', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                fontWeight: 700, 
                textDecoration: 'none',
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
              }}>
                Book a Cleaner Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: '6rem 1rem', backgroundColor: '#111827', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Join 5,000+ Happy Riyadh Homes</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '3rem' }}>Experience the most reliable cleaning service in {location.name}.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
             <Link href="/" style={{ border: '2px solid white', color: 'white', padding: '1rem 2.5rem', borderRadius: '3rem', fontWeight: 700, textDecoration: 'none' }}>Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
