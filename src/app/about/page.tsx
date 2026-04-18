import type { Metadata } from "next";
import Link from "next/link";
import {
  Award, ShieldCheck, Leaf, Headset, Clock, Star,
  Users, MapPin, CheckCircle2, Sparkles, Heart,
  Lightbulb, Handshake, Target
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Velro | Trusted Home Cleaning Service in Riyadh, Saudi Arabia",
  description:
    "Learn about Velro — Riyadh's most trusted home cleaning company. We bring vetted professionals, eco-friendly products, and a 100% satisfaction guarantee to every home in Saudi Arabia.",
  keywords: [
    "about Velro cleaning",
    "home cleaning company Riyadh",
    "professional cleaners Saudi Arabia",
    "cleaning service Riyadh",
    "best cleaning company Riyadh",
    "vetted cleaners Saudi Arabia",
  ],
  openGraph: {
    title: "About Velro | Home Cleaning Service in Riyadh",
    description:
      "Velro is Riyadh's premier home cleaning company. Discover our story, values, and commitment to spotless homes across Saudi Arabia.",
    url: "https://velro.sa/about",
    siteName: "Velro",
    locale: "en_SA",
    type: "website",
  },
};

const coreValues = [
  {
    icon: Star,
    title: "Excellence",
    desc: "We pursue perfection in every cleaning task, paying attention to the smallest details to deliver results that consistently exceed expectations.",
    pos: "left",
  },
  {
    icon: ShieldCheck,
    title: "100% Satisfaction Guaranteed",
    desc: "If you're not completely happy with our work, we'll come back and fix it — completely free of charge. No questions asked.",
    pos: "left",
  },
  {
    icon: Target,
    title: "Reliability",
    desc: "We honour our commitments. You can count on us to show up on time, every time, and deliver consistent quality at every clean.",
    pos: "left",
  },
  {
    icon: Handshake,
    title: "Teamwork",
    desc: "Our strength comes from collaboration, mutual respect, and a shared commitment to delivering exceptional service to every client.",
    pos: "right",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We continuously explore new techniques, equipment, and eco-friendly solutions to improve our service quality and efficiency.",
    pos: "right",
  },
  {
    icon: Headset,
    title: "24/7 Customer Support",
    desc: "Questions, changes, or concerns? Our friendly local team is available 7 days a week to ensure your experience is always smooth.",
    pos: "right",
  },
];

const stats = [
  { value: "5,000+", label: "Homes Cleaned" },
  { value: "4.9★", label: "Average Rating" },
  { value: "100%", label: "Satisfaction Guarantee" },
  { value: "50+", label: "Vetted Professionals" },
];

const highlights = [
  "Certified, experienced, and fully insured cleaners",
  "Customisable cleaning plans for home or villa",
  "Eco-conscious, family-safe cleaning products",
  "Friendly, trustworthy, and always on time",
  "Instant online booking — no phone calls needed",
  "Serving all major districts across Riyadh",
];

export default function AboutPage() {
  const leftValues = coreValues.filter((v) => v.pos === "left");
  const rightValues = coreValues.filter((v) => v.pos === "right");

  return (
    <>
      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden="true" />
        <div className="container about-hero-content">
          <div className="about-hero-badge">
            <MapPin size={14} /> Riyadh, Saudi Arabia
          </div>
          <h1 className="about-hero-title">
            Cleaning Riyadh&#39;s Homes,<br />
            <span>One Spotless Room at a Time</span>
          </h1>
          <p className="about-hero-subtitle">
            Velro is Riyadh&apos;s most trusted home cleaning service — built on
            professionalism, care, and the promise that your home deserves the
            very best.
          </p>
          <div className="about-hero-actions">
            <Link href="/#why-us" className="btn-primary about-btn">
              See Why Clients Love Us
            </Link>
            <Link href="/" className="about-btn-outline">
              Book a Clean
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="about-stats-bar" aria-label="Velro by the numbers">
        <div className="container about-stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="about-stat-item">
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="about-story" aria-labelledby="story-heading">
        <div className="container about-story-grid">
          <div className="about-story-image">
            <img
              src="/service_1.png"
              alt="Velro professional cleaner working in a Riyadh home"
              loading="lazy"
            />
            <div className="about-story-badge-float">
              <CheckCircle2 size={18} />
              <span>5,000+ happy homes in Riyadh</span>
            </div>
          </div>
          <div className="about-story-text">
            <div className="section-eyebrow">Our Story</div>
            <h2 id="story-heading" className="about-story-heading">
              We Started with One Simple Belief:{" "}
              <em>Every Home in Riyadh Deserves to be Spotless</em>
            </h2>
            <p>
              Velro was born out of a simple but powerful idea — families in
              Riyadh should be able to come home to a clean, fresh, welcoming
              space without the stress of doing it themselves.
            </p>
            <p>
              We built Velro from the ground up, carefully handpicking and
              training every single cleaning professional on our team. From day
              one, we have been committed to transparency, reliability, and
              results that speak for themselves.
            </p>
            <p>
              Today, we proudly serve thousands of homes across Riyadh — from
              Al&nbsp;Olaya and Hittin to Al&nbsp;Malqa, An&nbsp;Narjis, and
              beyond. Whether you need a quick standard clean or a comprehensive
              deep clean, Velro delivers consistent, high-quality results every
              single time.
            </p>
            <ul className="about-highlights-list" aria-label="What makes Velro different">
              {highlights.map((h) => (
                <li key={h}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES — LOGO IN CENTER ── */}
      <section className="about-values" aria-labelledby="values-heading">
        <div className="container">
          <div className="about-values-header">
            <div className="section-eyebrow">Our Core Values</div>
            <h2 id="values-heading">
              <em>What</em> Drives Everything We Do
            </h2>
            <div className="header-underline" />
            <p>
              These six principles shape how we hire, train, and serve — every
              single day.
            </p>
          </div>

          <div className="about-values-layout">
            {/* LEFT column */}
            <div className="about-values-col left">
              {leftValues.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="about-value-card is-left">
                  <div className="about-value-text">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                  <div className="about-value-icon">
                    <Icon size={22} />
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER logo circle */}
            <div className="about-values-center" aria-hidden="true">
              <img
                className="bg-img"
                src="/service_1.png"
                alt=""
              />
              <img
                className="logo-img"
                src="/logo.png"
                alt="Velro Home Cleaning Riyadh"
              />
            </div>

            {/* RIGHT column */}
            <div className="about-values-col right">
              {rightValues.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="about-value-card">
                  <div className="about-value-icon">
                    <Icon size={22} />
                  </div>
                  <div className="about-value-text">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMITMENT SECTION ── */}
      <section className="about-commitment" aria-labelledby="commitment-heading">
        <div className="container about-commitment-grid">
          <div className="about-commitment-text">
            <div className="section-eyebrow light">Our Promise</div>
            <h2 id="commitment-heading">
              A Cleaner Home. A Happier You.
            </h2>
            <p>
              We know inviting someone into your home requires trust. That&apos;s
              why every Velro professional is background-checked, insured, and
              trained to the highest standards before they ever set foot in a
              client&apos;s home.
            </p>
            <p>
              We use only premium, eco-friendly cleaning products that are safe
              for children, pets, and the environment. And if you&apos;re ever less
              than 100% satisfied, we&apos;ll return and make it right — free of
              charge.
            </p>
            <Link href="/" className="btn-primary about-btn" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              Book Your First Clean
            </Link>
          </div>
          <div className="about-commitment-cards">
            {[
              { icon: Leaf, title: "Eco-Friendly Products", desc: "Safe for your family and the planet." },
              { icon: ShieldCheck, title: "Fully Insured &amp; Vetted", desc: "Every cleaner is background-checked." },
              { icon: Clock, title: "Flexible Scheduling", desc: "Evenings, weekends — we fit your life." },
              { icon: Heart, title: "We Actually Care", desc: "Your home is treated like our own." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="commitment-card">
                <div className="commitment-icon"><Icon size={24} /></div>
                <h3 dangerouslySetInnerHTML={{ __html: title }} />
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ / SCHEMA-READY ── */}
      <section className="about-faq-section" aria-labelledby="about-faq-heading">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="about-values-header">
            <div className="section-eyebrow">Quick Answers</div>
            <h2 id="about-faq-heading">Common Questions About Velro</h2>
            <div className="header-underline" />
          </div>
          <div className="about-faq-grid" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                q: "What is Velro?",
                a: "Velro is a professional home cleaning service based in Riyadh, Saudi Arabia. We connect homeowners with vetted, trained, and insured cleaning professionals — bookable entirely online in under 60 seconds.",
              },
              {
                q: "Which areas in Riyadh does Velro cover?",
                a: "We currently serve Al Olaya, Hittin, Al Malqa, An Narjis, Al Yasmin, As Sulimaniyah, Ar Rabi, Al Sahafah, Al Aqiq, Al Malaz, Al Murabba, and many more neighbourhoods across Riyadh.",
              },
              {
                q: "Are Velro cleaners background-checked?",
                a: "Yes. Every single Velro professional undergoes a thorough background check, identity verification, and professional training programme before being allowed to work in our clients' homes.",
              },
              {
                q: "What is Velro's satisfaction guarantee?",
                a: "If you are not completely satisfied with your clean, simply let us know within 24 hours and we will send a team back to fix the issue — completely free of charge.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="about-faq-item"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h3 itemProp="name">{q}</h3>
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta" aria-label="Book a cleaning service">
        <div className="container about-cta-inner">
          <Sparkles size={40} className="about-cta-icon" />
          <h2>Ready to Experience the Velro Difference?</h2>
          <p>
            Join over 5,000 happy homeowners across Riyadh. Book your first
            clean online in under 60 seconds — no phone calls, no hassle.
          </p>
          <Link href="/" className="about-cta-btn">
            Book a Cleaner Now
          </Link>
        </div>
      </section>
    </>
  );
}
