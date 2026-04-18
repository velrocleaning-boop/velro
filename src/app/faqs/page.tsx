"use client";
import React, { useState } from 'react';
import { Plus, Minus, Search, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
  {
    name: 'Booking & Payments',
    questions: [
      { q: "How do I book a cleaner in Riyadh?", a: "You can book directly through our website by selecting your district and choosing a service. Alternatively, you can message our CleanBot AI on WhatsApp for an instant quote and booking." },
      { q: "What payment methods do you accept?", a: "We accept all major credit cards, Mada cards, and Apple Pay. Cash on delivery is also available for certain services." },
      { q: "Can I cancel or reschedule my booking?", a: "Yes, you can cancel or reschedule for free up to 24 hours before your appointment. Cancellations within 24 hours may incur a small fee." }
    ]
  },
  {
    name: 'The Cleaning Process',
    questions: [
      { q: "Do I need to be home during the cleaning?", a: "It is not necessary for you to be home, as long as our team has access to the property. Many of our regular clients in Riyadh provide a spare key or access code." },
      { q: "Do you bring your own cleaning supplies?", a: "Yes, our team comes fully equipped with premium, non-toxic cleaning agents, industrial vacuums, and specialized tools. You don't need to provide anything." },
      { q: "How long does a standard clean take?", a: "A standard apartment clean usually takes 2-4 hours, while a large villa deep clean can take 6-10 hours depending on the size and condition." }
    ]
  },
  {
    name: 'Trust & Safety',
    questions: [
      { q: "Are your cleaners trained and background-checked?", a: "Absolutely. Every Velro professional undergoes a rigorous background check, police clearance, and intensive hospitality training before they ever enter a client's home." },
      { q: "What happens if something is damaged?", a: "We take extreme care, but in the rare event of accidental damage, we are fully insured. We will handle the repair or replacement costs immediately." },
      { q: "Do you respect prayer times?", a: "Yes, our cleaners are trained to be culturally sensitive and will respect prayer times and local customs while working in your home." }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <main style={{ padding: '8rem 1rem 6rem', backgroundColor: '#fff' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', backgroundColor: '#f0f9ff', color: 'var(--primary)', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <HelpCircle size={18} /> Help Center
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Frequently Asked Questions</h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Everything you need to know about our services in Riyadh.</p>
        </div>

        {faqCategories.map((category, catIdx) => (
          <div key={catIdx} style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #f1f5f9' }}>{category.name}</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {category.questions.map((faq, qIdx) => {
                const id = `${catIdx}-${qIdx}`;
                const isOpen = openIndex === id;
                return (
                  <div key={qIdx} style={{ border: '1px solid #f1f5f9', borderRadius: '1.25rem', overflow: 'hidden', backgroundColor: isOpen ? '#f8fafc' : 'white', transition: 'all 0.2s ease' }}>
                    <button 
                      onClick={() => toggleFAQ(id)}
                      style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{faq.q}</span>
                      {isOpen ? <Minus size={20} color="var(--primary)" /> : <Plus size={20} color="#94a3b8" />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.6 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '6rem', padding: '4rem', backgroundColor: '#f0f9ff', borderRadius: '2.5rem', textAlign: 'center' }}>
          <MessageCircle size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Still have questions?</h2>
          <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Our team in Riyadh is ready to help you 7 days a week.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>Contact Us</Link>
            <Link href="https://wa.me/966500000000" className="btn" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', textDecoration: 'none' }}>Chat via WhatsApp</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
