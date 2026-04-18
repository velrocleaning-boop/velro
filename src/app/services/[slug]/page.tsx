"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { servicesData } from '@/data/services';
import { CheckCircle2, ArrowRight, ShieldCheck, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData.find(s => s.slug === slug);

  if (!service) {
    return <div className="container" style={{ padding: '10rem 1rem', textAlign: 'center' }}><h1>Service not found</h1></div>;
  }

  const { Icon } = service;

  return (
    <main>
      {/* HERO */}
      <section style={{ padding: '4rem 1rem 8rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ marginBottom: '3rem' }}>
          <Breadcrumbs />
        </div>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ width: '64px', height: '64px', borderRadius: '1.5rem', backgroundColor: service.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: `0 20px 25px -5px ${service.color}44` }}>
              <Icon size={32} />
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              {service.title}
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              {service.fullDescription}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="https://wa.me/966500000000" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1.125rem 2.5rem', borderRadius: '1rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Book Now <ArrowRight size={20} />
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '1rem', backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 800, color: '#111827' }}>{service.pricing}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[
              { label: 'Rating', val: '4.9/5', icon: Star, col: '#f59e0b' },
              { label: 'Time', val: '2-4 Hours', icon: Clock, col: '#3b82f6' },
              { label: 'Vetted', val: '100% Pros', icon: ShieldCheck, col: '#10b981' },
              { label: 'Guarantee', val: 'Included', icon: CheckCircle2, col: '#8b5cf6' }
            ].map((stat, i) => (
              <div key={i} style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <stat.icon size={28} color={stat.col} style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{stat.val}</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '6rem 1rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem' }}>What's Included?</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {service.features.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#10b981', display: 'flex', flexShrink: 0 }}><CheckCircle2 size={24} /></div>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1rem', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready for a Spotless Home?</h2>
          <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '3rem' }}>Join thousands of happy families in Riyadh.</p>
          <Link href="https://wa.me/966500000000" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1.25rem 3.5rem', borderRadius: '3rem', fontWeight: 800, textDecoration: 'none', fontSize: '1.125rem' }}>
            Book Your {service.title} Now
          </Link>
        </div>
      </section>
    </main>
  );
}
