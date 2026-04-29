"use client";
import React from 'react';
import { CheckCircle2, Calendar, Sparkles, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useTranslation } from '@/hooks/useTranslation';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      title: t('hiw.step1_title'),
      description: t('hiw.step1_desc'),
      Icon: Calendar,
      color: "#3b82f6"
    },
    {
      number: "02",
      title: t('hiw.step2_title'),
      description: t('hiw.step2_desc'),
      Icon: ShieldCheck,
      color: "#10b981"
    },
    {
      number: "03",
      title: t('hiw.step3_title'),
      description: t('hiw.step3_desc'),
      Icon: Sparkles,
      color: "#f59e0b"
    },
    {
      number: "04",
      title: t('hiw.step4_title'),
      description: t('hiw.step4_desc'),
      Icon: Home,
      color: "#8b5cf6"
    }
  ];

  const features = [
    { title: t('hiw.f1_title'), desc: t('hiw.f1_desc') },
    { title: t('hiw.f2_title'), desc: t('hiw.f2_desc') },
    { title: t('hiw.f3_title'), desc: t('hiw.f3_desc') },
    { title: t('hiw.f4_title'), desc: t('hiw.f4_desc') },
  ];

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      {/* HERO SECTION */}
      <section style={{ padding: '8rem 1rem 4rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            {t('hiw.hero_title_pre')}<span style={{ color: 'var(--primary)' }}>{t('hiw.hero_title_highlight')}</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {t('hiw.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section style={{ padding: '6rem 1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
            {steps.map((step, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '2.5rem',
                alignItems: 'flex-start',
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                textAlign: index % 2 === 0 ? 'left' : 'right'
              }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '5rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1, display: 'block', marginBottom: '-1rem' }}>
                    {step.number}
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
                    {step.title}
                  </h2>
                  <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                </div>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '2rem',
                  backgroundColor: `${step.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transform: 'rotate(5deg)'
                }}>
                  <step.Icon size={48} color={step.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'var(--text-main)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{t('hiw.diff_title')}</h2>
            <p style={{ opacity: 0.8, fontSize: '1.125rem' }}>{t('hiw.diff_subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CheckCircle2 size={32} color="var(--primary)" style={{ marginBottom: '1.25rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>{t('hiw.cta_title')}</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>{t('hiw.cta_subtitle')}</p>
          <Link href="/" style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '1.25rem 3rem',
            borderRadius: '3rem',
            fontSize: '1.25rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)'
          }}>
            {t('hiw.cta_btn')}
          </Link>
        </div>
      </section>
    </main>
  );
}
