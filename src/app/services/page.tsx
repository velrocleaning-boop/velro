import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles, CheckCircle2, ArrowRight, MapPin, Star, ShieldCheck, Leaf, Clock
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const WA_NUMBER = '966594847866';

function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
export const metadata: Metadata = {
  title: "Cleaning Services in Riyadh | Velro — Home & Villa Cleaning",
  description:
    "Explore Velro's full range of professional cleaning services in Riyadh. Standard cleaning, deep cleaning, move-in/out, sofa, carpet, kitchen, and more — all backed by our 100% satisfaction guarantee.",
  keywords: [
    "cleaning services Riyadh",
    "home cleaning Riyadh",
    "deep cleaning Riyadh",
    "villa cleaning Saudi Arabia",
    "sofa cleaning Riyadh",
    "kitchen cleaning Riyadh",
    "move in out cleaning Riyadh",
  ],
  openGraph: {
    title: "Professional Cleaning Services in Riyadh | Velro",
    description:
      "From standard weekly cleans to full deep cleans — Velro delivers spotless results across Riyadh. Book in 60 seconds.",
    url: "https://velro.sa/services",
    siteName: "Velro",
    type: "website",
  },
};

const residentialServices = [
  {
    image: "/services/sweeping-dusting.webp",
    title: "Standard House Cleaning",
    badge: "Most Popular",
    badgeColor: "#253bbd",
    description:
      "A thorough top-to-bottom clean of all living areas, bedrooms, bathrooms, and kitchen. Perfect for weekly or fortnightly maintenance.",
    includes: ["Dusting all surfaces", "Mopping & vacuuming floors", "Bathroom scrubbing", "Kitchen wipe-down"],
    price: "From 50 SAR/hr",
  },
  {
    image: "/services/bathroom-cleaning.webp",
    title: "Deep Cleaning",
    badge: "Best Value",
    badgeColor: "#059669",
    description:
      "A comprehensive, intensive clean designed to reach every corner. Ideal for seasonal cleans, ensuring a healthier and more pristine home.",
    includes: ["Inside oven & fridge", "Grout & tile scrubbing", "Skirting boards", "Cabinet interiors"],
    price: "From 80 SAR/hr",
  },
  {
    image: "/services/floor-mopping.webp",
    title: "End of Lease Cleaning",
    badge: null,
    badgeColor: null,
    description:
      "Leave your old property spotless or arrive at a perfectly clean new home. Designed to meet landlord expectations so you get your deposit back.",
    includes: ["Walls & skirting boards", "Inside all cabinets", "Appliances & fixtures", "Window sills & tracks"],
    price: "Fixed precise quote",
  },
  {
    image: "/services/sofa-cleaning.webp",
    title: "Upholstery & Sofa Cleaning",
    badge: null,
    badgeColor: null,
    description:
      "Professional steam and dry cleaning of sofas, armchairs, and upholstered furniture to remove stains, dust mites, and allergens safely.",
    includes: ["Fabric & leather sofas", "Stain treatment", "Odour neutralisation", "Same-day dry time"],
    price: "From 120 SAR/piece",
  },
  {
    image: "/services/laundry-cleaning.webp",
    title: "Carpet & Rug Cleaning",
    badge: null,
    badgeColor: null,
    description:
      "Deep-clean your carpets and rugs with advanced steam techniques that kill bacteria and extract deep-rooted dirt for a fresher feel.",
    includes: ["Steam sanitisation", "Deep stain removal", "Odour treatment", "Safe for kids & pets"],
    price: "From 90 SAR/piece",
  },
  {
    image: "/services/kitchen-cleaning.webp",
    title: "Kitchen Deep Clean",
    badge: null,
    badgeColor: null,
    description:
      "A focused, intensive clean of your kitchen — including degreasing cooktops, ovens, rangehoods, and surfaces to restaurant-grade standards.",
    includes: ["Oven & stovetop degreasing", "Rangehood filter clean", "Appliance clean", "Sink & tap polish"],
    price: "From 150 SAR",
  },
];

const commercialServices = [
  {
    image: "/services/utensils-cleaning.webp",
    title: "Office Cleaning",
    description:
      "Reliable daily, weekly, or monthly office cleaning across Riyadh. Keep your workspace spotless, professional, and healthy for your team.",
    includes: ["Workstation cleaning", "Common area maintenance", "Restroom sanitisation", "Bin collection"],
  },
  {
    image: "/services/kitchen-cleaning.webp",
    title: "Restaurant & Café Cleaning",
    description:
      "Commercial kitchen deep cleans meeting strict Saudi food safety standards. Keep grease traps, hoods, equipment, and floors sanitized.",
    includes: ["Commercial kitchen equipment", "Grease trap cleaning", "Food prep area sanitisation", "Floors & drains"],
  },
  {
    image: "/services/balcony-cleaning.webp",
    title: "Villa & Compound Cleaning",
    description:
      "Full-property cleaning for villas and gated compounds — including multiple floors, majlis areas, exterior spaces, and maid quarters.",
    includes: ["Multi-floor cleaning", "Majlis & reception areas", "Exterior balconies", "Custom clean frequency"],
  },
];

const topRiyadhDistricts = [
  "Al Olaya", "Hittin", "Al Malqa", "An Narjis"
];

const whyChooseItems = [
  { icon: ShieldCheck, title: "Expert Professionals", desc: "Every cleaner brings years of experience and specialized training." },
  { icon: Leaf, title: "Eco-Friendly Solutions", desc: "Safe, non-toxic products that protect your family and the environment." },
  { icon: Clock, title: "Flexible Scheduling", desc: "We work around your schedule including evenings and weekends." },
  { icon: Star, title: "100% Satisfaction", desc: "If you're not completely happy, we'll return to make it right for free." }
];

export default function ServicesPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="services-hero">
        <div className="services-hero-bg" aria-hidden="true" />
        <div className="container services-hero-content" style={{ paddingTop: '2rem' }}>
          <Breadcrumbs color="#94a3b8" />
          <div className="services-hero-badge">
            <MapPin size={14} />Riyadh, Saudi Arabia
          </div>
          <h1 className="services-hero-title">
            Professional Cleaning Services<br />
            <span>Tailored to Your Needs</span>
          </h1>
          <p className="services-hero-subtitle">
            From sparkling homes to pristine commercial spaces, we deliver exceptional cleaning solutions. 
            Our professional team uses eco-friendly products to ensure outstanding results.
          </p>
          <div className="services-hero-actions">
            <Link href="/#why-us" className="btn-primary about-btn">
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS / HOW IT WORKS ── */}
      <section className="services-how" aria-labelledby="how-heading">
        <div className="container">
          <div className="services-section-header">
            <div className="section-eyebrow">How It Works</div>
            <h2 id="how-heading">Getting Professional Cleaning is <em>Easy</em></h2>
            <div className="header-underline" />
          </div>
          <div className="services-how-grid">
            {[
              { n: "01", title: "Get Quote", desc: "Contact us for a free, no-obligation quote tailored to your specific needs." },
              { n: "02", title: "Book Service", desc: "Schedule your cleaning at a time that's convenient for you." },
              { n: "03", title: "We Clean", desc: "Our professional team arrives on time and delivers exceptional cleaning." },
              { n: "04", title: "You Enjoy", desc: "Relax and enjoy your sparkling clean space. 100% satisfaction guaranteed!" },
            ].map(step => (
              <div key={step.n} className="how-step">
                <div className="how-step-num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESIDENTIAL SERVICES ── */}
      <section className="services-section" id="residential" aria-labelledby="residential-heading">
        <div className="container">
          <div className="services-section-header">
            <div className="section-eyebrow">Residential</div>
            <h2 id="residential-heading">
              Our Comprehensive <em>Home Cleaning</em>
            </h2>
            <div className="header-underline" />
            <p>
              From quick standard cleans to specialized deep cleans, we keep your home exactly how you love it.
            </p>
          </div>

          <div className="services-img-grid">
            {residentialServices.map(({ image, title, badge, badgeColor, description, includes, price }) => (
              <article key={title} className="service-img-card" itemScope itemType="https://schema.org/Service">
                <div className="service-card-image-wrap">
                  <img src={image} alt={title} className="service-card-image" />
                  {badge && (
                    <div className="service-card-badge" style={{ background: badgeColor }}>
                      {badge}
                    </div>
                  )}
                </div>
                <div className="service-card-content">
                  <h3 itemProp="name">{title}</h3>
                  <p className="service-card-desc" itemProp="description">{description}</p>
                  <ul className="service-card-includes">
                    {includes.map(item => (
                      <li key={item}>
                        <CheckCircle2 size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="service-card-footer">
                    <span className="service-card-price">{price}</span>
                    <a
                      href={waLink(`Hi! I would like to get a quote for "${title}". Can you help me?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-card-cta"
                    >
                      Get A Quote <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMERCIAL SERVICES ── */}
      <section className="services-commercial" id="commercial" aria-labelledby="commercial-heading">
        <div className="container">
          <div className="services-section-header">
            <div className="section-eyebrow">Commercial</div>
            <h2 id="commercial-heading">
              Business &amp; <em>Commercial Cleaning</em>
            </h2>
            <div className="header-underline" />
            <p>
              We maintain professional spaces with the highest standard of hygiene and care.
            </p>
          </div>

          <div className="services-img-grid">
            {commercialServices.map(({ image, title, description, includes }) => (
              <article key={title} className="service-img-card" itemScope itemType="https://schema.org/Service">
                <div className="service-card-image-wrap">
                  <img src={image} alt={title} className="service-card-image" />
                </div>
                <div className="service-card-content">
                  <h3 itemProp="name">{title}</h3>
                  <p className="service-card-desc" itemProp="description">{description}</p>
                  <ul className="service-card-includes">
                    {includes.map(item => (
                      <li key={item}>
                        <CheckCircle2 size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="service-card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <a
                      href={waLink(`Hi! I would like to get a quote for commercial "${title}". Can you help me?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-card-cta"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Get A Quote <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY VELRO ── */}
      <section className="services-why" aria-labelledby="why-heading">
        <div className="container">
          <div className="services-section-header light">
            <div className="section-eyebrow light">Why Choose Velro</div>
            <h2 id="why-heading" style={{ color: 'white' }}>Experience the <em style={{ color: '#a5b4fc' }}>Difference</em></h2>
            <div className="header-underline" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>
              Professional expertise, eco-friendly practices, and focused customer service.
            </p>
          </div>
          <div className="services-why-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {whyChooseItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="why-card">
                <div className="why-card-icon"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AREAS WE SERVE ── */}
      <section className="services-areas" aria-labelledby="areas-heading">
        <div className="container">
          <div className="services-section-header">
            <div className="section-eyebrow">Locations</div>
            <h2 id="areas-heading">Areas <em>We Serve</em></h2>
            <div className="header-underline" />
            <p>
              We provide professional cleaning services across top locations in Riyadh with plans to expand further.
            </p>
          </div>
          <div className="areas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1000px' }}>
            {topRiyadhDistricts.map(district => (
              <div key={district} className="area-card">
                <div className="area-card-img-wrap">
                 <img src="/services/sweeping-dusting.webp" alt={district} />
                </div>
                <div className="area-card-content">
                  <h3>{district}</h3>
                  <Link href="/" className="area-link">Learn More <ArrowRight size={14}/></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="services-faq" aria-labelledby="faq-heading">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="services-section-header">
            <div className="section-eyebrow">FAQ</div>
            <h2 id="faq-heading">Common Questions About Our <em>Services</em></h2>
            <div className="header-underline" />
          </div>
          <div className="services-faq-list" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                q: "How do I choose the right cleaning service for my needs?",
                a: "We offer comprehensive cleaning services tailored to different needs. For residential properties, our house cleaning service provides regular maintenance. We also offer specialized services like carpet cleaning and deep cleaning. Contact us for a free consultation to determine the best service for your requested space.",
              },
              {
                q: "What should I expect during my first cleaning service?",
                a: "During your first service, our team will arrive on time with all necessary equipment and supplies. We'll conduct a brief walkthrough to understand your specific needs. Then we will work systematically through your property, using eco-friendly products and advanced techniques.",
              },
              {
                q: "Are your cleaning products safe for pets and children?",
                a: "Absolutely! We prioritize the safety of your family and pets by using only eco-friendly, non-toxic cleaning products. They are biodegradable, free from harsh chemicals, and safe for children, pets, and people with allergies.",
              },
              {
                q: "What if I need to reschedule or cancel my cleaning appointment?",
                a: "We understand that schedules can change, so we're flexible with rescheduling and cancellations. Simply give us at least 24 hours notice to avoid any fees.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="services-faq-item"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h3 itemProp="name">{q}</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="services-cta" aria-label="Book a cleaning service in Riyadh">
        <div className="container services-cta-inner">
          <h2>Ready for a Spotless Space?</h2>
          <p>
            Experience the difference that professional expertise, eco-friendly practices, and customer-focused service makes.
          </p>
          <div className="services-cta-btns">
            <Link href="/" className="services-cta-primary">
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
