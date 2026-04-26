"use client";
import React from 'react';
import { Check, Info, Sparkles, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Home, Building2 } from 'lucide-react';

const WA_NUMBER = '966594847866';

// Official WhatsApp SVG icon
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.347.638 4.638 1.847 6.64L2.667 29.333l6.88-1.813A13.293 13.293 0 0016.003 29.333c7.363 0 13.33-5.97 13.33-13.333 0-7.363-5.967-13.333-13.33-13.333zm0 24.24a11.04 11.04 0 01-5.627-1.546l-.403-.24-4.08 1.073 1.093-3.973-.264-.413A11.013 11.013 0 014.987 16c0-6.076 4.94-11.013 11.016-11.013 6.077 0 11.014 4.937 11.014 11.013 0 6.08-4.937 11.014-11.014 11.014v.906l.001-.906v.906l-.001-.906z"/>
      <path d="M21.693 18.56c-.307-.153-1.813-.893-2.093-.993-.28-.107-.48-.16-.68.16-.2.32-.773.987-.947 1.187-.173.2-.347.227-.64.08-.307-.153-1.293-.48-2.46-1.52-.907-.813-1.52-1.813-1.7-2.12-.173-.307-.013-.467.133-.613.133-.133.307-.347.453-.52.147-.173.2-.307.307-.507.107-.2.053-.373-.027-.52-.08-.147-.68-1.653-.933-2.267-.24-.587-.493-.507-.68-.52H12.2c-.2 0-.52.08-.8.4-.28.32-1.053 1.027-1.053 2.507s1.08 2.907 1.227 3.107c.147.2 2.12 3.24 5.147 4.547.72.307 1.28.493 1.72.627.72.227 1.373.2 1.893.12.573-.093 1.813-.747 2.067-1.467.253-.72.253-1.333.173-1.467-.08-.133-.28-.2-.587-.347z"/>
    </svg>
  );
}

function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface Plan {
  size: string;
  price: string;
  badge: string | null;
  features: string[];
  waMsg: string;
  image: string;
}

interface PricingCategory {
  type: string;
  icon: LucideIcon;
  color: string;
  lightBg: string;
  plans: Plan[];
}

const pricingPlans: PricingCategory[] = [
  {
    type: 'Apartment',
    icon: Home,
    color: '#253bbd',
    lightBg: '#eef2ff',
    plans: [
      {
        size: 'Studio / 1-BR',
        price: '150 SAR',
        badge: null,
        features: ['1 Cleaner', '2-3 Hours', 'Basic Supplies Incl.', 'Kitchen & Bathroom'],
        waMsg: "Hi! I'd like to book a Studio/1-BR apartment clean for 150 SAR. Can you confirm availability?",
        image: '/services/sweeping-dusting.webp'
      },
      {
        size: '2-BR Apartment',
        price: '250 SAR',
        badge: 'Most Popular',
        features: ['1-2 Cleaners', '3-4 Hours', 'Basic Supplies Incl.', 'All Rooms + Kitchen & Bathrooms'],
        waMsg: "Hi! I'd like to book a 2-BR apartment clean for 250 SAR. Can you confirm availability?",
        image: '/services/floor-mopping.webp'
      },
      {
        size: '3-BR Apartment',
        price: '350 SAR',
        badge: null,
        features: ['2 Cleaners', '4-5 Hours', 'Basic Supplies Incl.', 'Full Deep Clean Option Available'],
        waMsg: "Hi! I'd like to book a 3-BR apartment clean for 350 SAR. Can you confirm availability?",
        image: '/services/bathroom-cleaning.webp'
      },
    ],
  },
  {
    type: 'Villa',
    icon: Building2,
    color: '#0d7fba',
    lightBg: '#e0f4ff',
    plans: [
      {
        size: 'Small Villa',
        price: '500 SAR',
        badge: null,
        features: ['2 Cleaners', '5-6 Hours', 'Full Equipment Incl.', 'All Floors & Bathrooms'],
        waMsg: "Hi! I'd like to book a Small Villa clean for 500 SAR. Can you confirm availability?",
        image: '/services/laundry-cleaning.webp'
      },
      {
        size: 'Medium Villa',
        price: '800 SAR',
        badge: 'Best Value',
        features: ['3 Cleaners', '6-7 Hours', 'Full Equipment Incl.', 'Majlis & Outdoor Areas'],
        waMsg: "Hi! I'd like to book a Medium Villa clean for 800 SAR. Can you confirm availability?",
        image: '/services/kitchen-cleaning.webp'
      },
      {
        size: 'Large Villa',
        price: '1,200+ SAR',
        badge: null,
        features: ['4+ Cleaners', 'Full Day', 'Deep Sanitization', 'Custom Quote Available'],
        waMsg: "Hi! I'm interested in a Large Villa clean (1,200+ SAR). Can I get a custom quote?",
        image: '/services/sofa-cleaning.webp'
      },
    ],
  },
];

interface AddOn {
  name: string;
  price: string;
  image: string;
}

const addOns: AddOn[] = [
  { name: 'Oven Deep Clean', price: '50 SAR', image: '/services/utensils-cleaning.webp' },
  { name: 'Fridge Interior', price: '40 SAR', image: '/services/kitchen-cleaning.webp' },
  { name: 'Interior Windows', price: '100 SAR', image: '/services/sweeping-dusting.webp' },
  { name: 'Carpet Steam (Per Rm)', price: '150 SAR', image: '/services/floor-mopping.webp' },
  { name: 'Sofa Steam (3-Seater)', price: '200 SAR', image: '/services/sofa-cleaning.webp' },
  { name: 'Balcony / Patio', price: '75 SAR', image: '/services/balcony-cleaning.webp' },
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      {/* HERO */}
      <section className="pricing-hero">
        <div className="pricing-hero-bg" aria-hidden="true" />
        <div className="container pricing-hero-content">
          <div className="section-eyebrow">Transparent Pricing</div>
          <h1 className="pricing-hero-title">
            Simple, Honest <span>Pricing</span>
          </h1>
          <p className="pricing-hero-sub">
            No hidden fees. No surprises. Pick your plan and book directly on WhatsApp in seconds.
          </p>
          <div className="pricing-trust-row">
            {['100% Satisfaction Guarantee', 'No Upfront Payment', 'Instant WhatsApp Booking'].map(t => (
              <span key={t} className="pricing-trust-pill">
                <Check size={14} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container pricing-body">

        {/* PLANS */}
        {pricingPlans.map((category) => {
          const Icon = category.icon;
          return (
            <section key={category.type} className="pricing-category">
              <div className="pricing-category-header">
                <div className="pricing-cat-icon" style={{ background: category.lightBg, color: category.color }}>
                  <Icon size={26} />
                </div>
                <h2 className="pricing-cat-title">{category.type} Cleaning</h2>
              </div>

              <div className="pricing-cards-row">
                {category.plans.map((plan) => (
                  <div key={plan.size} className={`pricing-card${plan.badge ? ' pricing-card--featured' : ''}`}>
                    {plan.badge && (
                      <div className="pricing-card-badge">
                        <Star size={12} fill="currentColor" /> {plan.badge}
                      </div>
                    )}
                    <div className="pricing-card-img-wrap">
                      <img src={plan.image} alt={plan.size} className="pricing-card-img" />
                      <div className="pricing-card-img-overlay" />
                    </div>
                    <div className="pricing-card-content">
                      <div className="pricing-card-top">
                        <span className="pricing-card-size">{plan.size}</span>
                        <span className="pricing-card-price">{plan.price}</span>
                      </div>
                      <ul className="pricing-card-features">
                        {plan.features.map((f) => (
                          <li key={f}>
                            <Check size={15} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={waLink(plan.waMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`pricing-wa-btn${plan.badge ? ' pricing-wa-btn--primary' : ''}`}
                      >
                        <WhatsAppIcon size={18} />
                        Book on WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* ADD-ONS (Redesigned to be clean and professional) */}
        <section className="pricing-category">
          <div className="pricing-category-header">
            <div className="pricing-cat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
              <Sparkles size={26} />
            </div>
            <div>
              <h2 className="pricing-cat-title">Add-On Services</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Customize your clean. Mention these when booking on WhatsApp.
              </p>
            </div>
          </div>

          <div className="pricing-cards-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {addOns.map((item) => (
              <div key={item.name} className="pricing-card">
                <div className="pricing-card-img-wrap pricing-card-img-wrap--addon">
                  <img src={item.image} alt={item.name} className="pricing-card-img" />
                  <div className="pricing-card-img-overlay" />
                </div>
                <div className="pricing-card-content" style={{ paddingBottom: '1.5rem', paddingTop: '1rem' }}>
                  <div className="pricing-card-top" style={{ marginBottom: '1rem' }}>
                    <span className="pricing-card-size" style={{ fontSize: '1.05rem' }}>{item.name}</span>
                    <span className="pricing-card-price" style={{ fontSize: '1.25rem' }}>{item.price}</span>
                  </div>
                  <a
                    href={waLink(`Hi! I'd like to add "${item.name}" (${item.price}) to my cleaning booking. Is that possible?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pricing-wa-btn"
                    style={{ marginTop: 'auto', padding: '0.65rem 1rem' }}
                  >
                    <WhatsAppIcon size={16} />
                    Add to Booking
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INFO ALERT */}
        <div className="pricing-info-alert">
          <Info color="#f97316" size={28} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h3>Need a Custom Quote?</h3>
            <p>
              For mansions, commercial properties, post-construction, or estates larger than 500 sqm — contact us
              for a free on-site inspection and tailored quote.
            </p>
            <a
              href={waLink("Hi! I need a custom quote for a large/commercial property. Can you help?")}
              target="_blank"
              rel="noopener noreferrer"
              className="pricing-info-wa"
            >
              <WhatsAppIcon size={15} />
              Get a Custom Quote
            </a>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="pricing-bottom-cta">
          <div className="pricing-cta-wa-icon-wrap">
            <WhatsAppIcon size={36} />
          </div>
          <h2>Ready to Book?</h2>
          <p>Chat with our team on WhatsApp — we&apos;ll confirm your slot in minutes.</p>
          <a
            href={waLink("Hi! I'd like to book a cleaning service in Riyadh. Can you help me?")}
            target="_blank"
            rel="noopener noreferrer"
            className="pricing-cta-wa"
          >
            <WhatsAppIcon size={20} />
            Start on WhatsApp
          </a>
          <p className="pricing-cta-number">+966 59 484 7866</p>
        </div>

      </div>
    </main>
  );
}
