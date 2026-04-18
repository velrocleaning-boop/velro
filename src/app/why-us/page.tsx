"use client";
import React from 'react';
import { Award, Leaf, ShieldCheck, Smartphone, UserCheck, Headset, CalendarDays, Timer, Sparkles, Building2 } from "lucide-react";

export default function WhyUs() {
  const reasons = [
    { title: "Filipino & International Experts", desc: "Our team consists of highly trained, polite, and English-speaking professionals specializing in premium home care.", icon: UserCheck },
    { title: "Hospital-Grade Equipment", desc: "We use industrial-strength steam cleaners and HEPA-filter vacuums for superior results.", icon: Sparkles },
    { title: "Non-Toxic & Pet-Safe", desc: "We use 100% biodegradable and child-safe cleaning agents for a healthy home environment.", icon: Leaf },
    { title: "100% Satisfaction Guarantee", desc: "Not happy with the result? We will re-clean your home for free, no questions asked.", icon: ShieldCheck },
    { title: "Cultural Respect & Privacy", desc: "Our professionals respect prayer times, local customs, and maintain absolute privacy for your family.", icon: Building2 },
    { title: "Vetted & Background Checked", desc: "Every professional undergoes a rigorous screening process and police check for your safety.", icon: UserCheck },
    { title: "Dedicated Support", desc: "Our local Riyadh support team is available 7 days a week to assist you with any questions.", icon: Headset },
    { title: "Flexible Scheduling", desc: "We offer evening and weekend slots to fit around your busy lifestyle perfectly.", icon: CalendarDays },
    { title: "Fast Service", desc: "Need a cleaner quickly? Our streamlined process gets a pro to your door in record time.", icon: Timer }
  ];

  return (
    <main style={{ backgroundColor: '#fff' }}>
      <section style={{ padding: '8rem 1rem 4rem', textAlign: 'center', background: 'linear-gradient(to bottom, #f0f7ff, #fff)' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Why Riyadh Chooses <span style={{ color: 'var(--primary)' }}>Velro</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            We aren't just another cleaning company. We are a technology-driven service dedicated to bringing premium quality and absolute trust to every home in Saudi Arabia.
          </p>
        </div>
      </section>

      <section style={{ padding: '6rem 1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {reasons.map((reason, index) => (
              <div key={index} style={{ padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', backgroundColor: '#fcfcfc', transition: 'transform 0.3s ease' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                  <reason.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>{reason.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '1.1rem' }}>{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 1rem', backgroundColor: '#0f172a', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.5rem', lineHeight: 1.6, opacity: 0.9, fontStyle: 'italic' }}>
            "To provide every household in Saudi Arabia with a safe, reliable, and premium cleaning experience, powered by technology and delivered by people who care."
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>5,000+</div>
              <div style={{ opacity: 0.7 }}>Homes Cleaned</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>4.9/5</div>
              <div style={{ opacity: 0.7 }}>Average Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>100%</div>
              <div style={{ opacity: 0.7 }}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
