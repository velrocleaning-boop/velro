"use client";
import React from 'react';

export default function RefundPolicy() {
  return (
    <main className="container" style={{ padding: '8rem 1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-main)' }}>Refund & Satisfaction Policy</h1>
      
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>100% Satisfaction Guarantee</h2>
        <p>
          At Velro, we take pride in our work. If you are not satisfied with the quality of the cleaning, please notify us within 24 hours of the service completion.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Re-cleaning Policy</h2>
        <p>
          If any area was missed or not cleaned to our standards, we will send a team back to re-clean those specific areas at <strong>no additional cost</strong> to you.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Refunds</h2>
        <p>
          Since cleaning is a service, we generally do not offer monetary refunds. However, if a re-clean does not resolve the issue, or in exceptional circumstances (e.g., service not performed), a partial or full refund may be issued at the discretion of Velro management.
        </p>
      </section>
    </main>
  );
}
