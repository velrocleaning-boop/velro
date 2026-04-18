"use client";
import React from 'react';

export default function TermsOfService() {
  return (
    <main className="container" style={{ padding: '8rem 1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-main)' }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last Updated: April 19, 2026</p>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>1. Scope of Service</h2>
        <p>
          Velro provides professional residential and commercial cleaning services in Riyadh. By booking a service through our platform, you agree to these terms.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>2. Booking & Cancellations</h2>
        <p>
          Bookings must be made at least 2 hours in advance. You may cancel or reschedule your booking up to 12 hours before the scheduled time without any penalty. Cancellations made within less than 12 hours may be subject to a cancellation fee of 50 SAR.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>3. Access to Property</h2>
        <p>
          The client must ensure that the cleaning professional has access to the property at the scheduled time. If the professional is unable to enter the property, the full service fee may still apply.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>4. Liability</h2>
        <p>
          While our cleaners are highly trained, Velro is not liable for damage to items that are already broken, poorly installed, or wear and tear. We recommend securing valuable jewelry or fragile items before the service.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>5. Governing Law</h2>
        <p>
          These terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes shall be settled in the courts of Riyadh.
        </p>
      </section>
    </main>
  );
}
