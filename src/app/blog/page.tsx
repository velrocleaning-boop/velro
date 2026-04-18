"use client";
import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    title: "How to Keep Your Villa Dust-Free in Riyadh's Summer",
    excerpt: "Sand and dust are inevitable in Saudi Arabia, but these professional tips will help you maintain a pristine home even during dust storms.",
    category: "Cleaning Tips",
    author: "Fatima S.",
    date: "April 15, 2026",
    readTime: "5 min read",
    slug: "villa-dust-free-tips"
  },
  {
    title: "Deep Cleaning vs. Standard Cleaning: Which Do You Need?",
    excerpt: "Confused about which service to book? We break down the differences to help you choose the best option for your home and budget.",
    category: "Guides",
    author: "Admin",
    date: "April 10, 2026",
    readTime: "4 min read",
    slug: "deep-vs-standard-cleaning"
  },
  {
    title: "5 Benefits of Regular Professional Cleaning for Your Health",
    excerpt: "Beyond aesthetics, regular professional cleaning removes allergens and bacteria that can impact your family's respiratory health.",
    category: "Health",
    author: "Dr. Ahmed",
    date: "April 5, 2026",
    readTime: "6 min read",
    slug: "cleaning-health-benefits"
  },
  {
    title: "Expats' Guide to Hiring a Reliable Cleaner in Riyadh",
    excerpt: "Moving to Riyadh? Here is everything you need to know about the local cleaning market, pricing, and what to expect from professional services.",
    category: "Expat Life",
    author: "James L.",
    date: "April 1, 2026",
    readTime: "7 min read",
    slug: "expat-cleaning-guide-riyadh"
  }
];

export default function BlogPage() {
  return (
    <main style={{ padding: '8rem 1rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Cleaning <span style={{ color: 'var(--primary)' }}>Insights</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
            Expert advice, home maintenance tips, and the latest from Velro.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
          {posts.map((post, i) => (
            <article key={i} style={{ 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: '#fff',
              borderRadius: '2rem',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ height: '240px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: '1.5rem' }}>Velro Insights</span>
              </div>
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ backgroundColor: '#eef2ff', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 700 }}>
                    {post.category}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>{post.excerpt}</p>
                
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Calendar size={14} /> {post.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Clock size={14} /> {post.readTime}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
