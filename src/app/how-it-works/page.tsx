"use client";
import React from 'react';
import { CheckCircle2, Calendar, Sparkles, Home, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Book in 60 Seconds",
      description: "Tell us about your home and your cleaning needs. Select a date and time that fits your schedule. No upfront payment required.",
      Icon: Calendar,
      color: "#3b82f6"
    },
    {
      number: "02",
      title: "We Match You with a Pro",
      description: "Our algorithm matches you with a vetted, background-checked professional cleaner in your Riyadh neighborhood.",
      Icon: ShieldCheck,
      color: "#10b981"
    },
    {
      number: "03",
      title: "Spotless Results",
      description: "A professional arrives with all the necessary supplies and transforms your home. We follow a strict cleaning checklist.",
      Icon: Sparkles,
      color: "#f59e0b"
    },
    {
      number: "04",
      title: "Relax and Enjoy",
      description: "Come home to a fresh, clean space. You only pay after the cleaning is complete and you are satisfied.",
      Icon: Home,
      color: "#8b5cf6"
    }
  ];

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      {/* HERO SECTION */}
      <section style={{ padding: '8rem 1rem 4rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            A spotless home is <span style={{ color: 'var(--primary)' }}>3 steps away</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            We've simplified the process of finding reliable cleaners in Riyadh so you can spend your time on things that matter.
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>The Velro Difference</h2>
            <p style={{ opacity: 0.8, fontSize: '1.125rem' }}>Why thousands of Riyadh residents trust us with their keys</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { title: "Insured & Vetted", desc: "Every cleaner undergoes a rigorous background check and is fully insured for your peace of mind." },
              { title: "Transparent Pricing", desc: "No hidden fees. You see the exact price upfront before you even book." },
              { title: "Premium Supplies", desc: "We bring high-quality, eco-friendly cleaning materials that are safe for kids and pets." },
              { title: "Easy Management", desc: "Reschedule, cancel, or add instructions to your booking entirely online." }
            ].map((f, i) => (
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
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Ready to get started?</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Book your first cleaning in under 60 seconds.</p>
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
            Book Your Cleaner Now
          </Link>
        </div>
      </section>
    </main>
  );
}
