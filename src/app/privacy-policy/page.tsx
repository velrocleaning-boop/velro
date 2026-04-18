"use client";
import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main style={{ padding: '8rem 1rem 6rem', backgroundColor: '#fff' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', marginBottom: '3rem' }}>Last Updated: April 18, 2026</p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Eye size={24} color="var(--primary)" /> 1. Information We Collect
          </h2>
          <p style={{ lineHeight: 1.7, color: '#4b5563' }}>
            We collect information that you provide directly to us when you book a cleaning service, create an account, or contact us. This includes your name, phone number, physical address in Riyadh, and payment information.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={24} color="var(--primary)" /> 2. How We Use Your Information
          </h2>
          <p style={{ lineHeight: 1.7, color: '#4b5563' }}>
            Your information is used to provide our cleaning services, process payments, and communicate with you about your bookings. We also use it to improve our service efficiency across different districts in Riyadh.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={24} color="var(--primary)" /> 3. Data Protection
          </h2>
          <p style={{ lineHeight: 1.7, color: '#4b5563' }}>
            We implement high-level security measures to protect your personal data. Payment information is processed through secure, encrypted gateways and is never stored on our servers.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={24} color="var(--primary)" /> 4. Third-Party Sharing
          </h2>
          <p style={{ lineHeight: 1.7, color: '#4b5563' }}>
            We do not sell or rent your personal information to third parties. We only share necessary details (like your address) with our vetted cleaning professionals to perform the requested service.
          </p>
        </section>

        <div style={{ marginTop: '5rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
            For any questions regarding your privacy, please contact us at <strong>privacy@velro.sa</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
