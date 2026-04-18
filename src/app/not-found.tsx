"use client";
import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfc', padding: '2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '3rem' }}>
          <div style={{ 
            fontSize: '10rem', 
            fontWeight: 900, 
            color: '#f1f5f9', 
            lineHeight: 1,
            userSelect: 'none'
          }}>
            404
          </div>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: 'var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Sparkles size={80} />
          </div>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem' }}>
          Oops! We cleaned that page away.
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem', lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has been moved. But don't worry, our cleaners are still available!
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', padding: '1.25rem 2.5rem' }}>
            <Home size={20} /> Back to Home
          </Link>
          <Link href="/book" className="btn" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', textDecoration: 'none', padding: '1.25rem 2.5rem' }}>
            Book a Cleaner
          </Link>
        </div>
      </div>
    </main>
  );
}
