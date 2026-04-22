"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpCircle, Plus, Minus, X, Menu, CheckCircle2, MapPin, Star, ShieldCheck, Clock, Sparkles, Droplets, Home, Activity, Leaf, Trees, Layers, Building2, BookOpenText, Award, CalendarDays, Smartphone, UserCheck, Headset, Timer } from "lucide-react";

const saudiBrands = [
  { name: "KINGDOM HOSPITAL", color: "#2d6639", Icon: Activity },
  { name: "GOLF SAUDI", color: "#3B9F2A", Icon: Leaf },
  { name: "ALARGAN", color: "#6A2C70", Icon: Trees },
  { name: "Saudi Aramco", color: "#20519a", Icon: Layers },
  { name: "KINGDOM", color: "#185634", Icon: Building2 },
  { name: "JARIR BOOKSTORE", color: "#E02020", Icon: BookOpenText },
];

const faqs = [
  { question: "What exactly does Velro clean?", answer: "We offer comprehensive cleaning across Riyadh. Our standard clean covers dusting, mopping, vacuuming, and wiping down all surfaces in your bedrooms, bathrooms, kitchen, and living areas. For deeper needs, we offer deep-cleaning and move-in/out services." },
  { question: "How do I book a cleaning service?", answer: "Simply select your district in Riyadh (e.g., Al Olaya, Hittin, Al Malqa) from our header, choose your service type, and see your instant pricing. You can book an appointment entirely online in under 60 seconds." },
  { question: "Can I book a recurring service?", answer: "Yes! While checking out, you can schedule weekly, bi-weekly, or monthly cleaning sessions. Recurring customers often receive priority booking and special rates." },
  { question: "How can I trust your professionals?", answer: "Every cleaner at Velro undergoes a rigorous background check, professional training, and continuous evaluation. We're trusted by thousands of homes in Riyadh and back our work with a 100% Satisfaction Guarantee." },
  { question: "How are your services priced?", answer: "Our standard pricing starts around 50 SAR per hour. Final pricing depends heavily on your apartment/villa size and selected add-ons. We provide exact, transparent, upfront quotes before you book — no hidden fees." },
  { question: "Do I need to provide cleaning supplies?", answer: "No, our professionals come fully equipped with high-quality, safe cleaning materials to ensure your home is spotless." },
  { question: "Where in Riyadh do you operate?", answer: "We cover almost all major neighborhoods in Riyadh, including North Riyadh (Al Malqa, Al Yasmin, An Narjis), Central (Al Olaya, As Sulimaniyah), and many more." }
];

const servicesList = [
  { name: "Bathroom cleaning", img: "/service_1.png" },
  { name: "Kitchen cleaning", img: "/service_1.png" },
  { name: "Dusting", img: "/service_1.png" },
  { name: "Floor Mopping", img: "/service_1.png" },
  { name: "Deep Cleaning", img: "/service_1.png" },
  { name: "Window Washing", img: "/service_1.png" }
];

const row1Reviews = [
  { name: "Tariq Al-Otaibi", location: "Al Malqa", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text: "Great work, my home was left spotless and fresh. They scrubbed the floors perfectly and dusted every corner. I'll definitely recommend them. 👍" },
  { name: "Fatima Al-Dosari", location: "Al Olaya", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "The cleaners did an incredible job with the kitchen grease and bathroom tiles. Really satisfied with the deep cleaning quality. Worth every riyal." },
  { name: "Youssef Al-Fayed", location: "Hittin", avatar: "https://randomuser.me/api/portraits/men/46.jpg", text: "Absolutely excellent service! The team was professional, extremely polite, and left my carpets and windows looking brand new." },
  { name: "Noura Al-Saud", location: "As Sulimaniyah", avatar: "https://randomuser.me/api/portraits/women/68.jpg", text: "Booking directly on their website was seamless. They removed stains from my sofa that I thought were permanent. Thank you Velro!" },
  { name: "Khalid Al-Sheri", location: "An Narjis", avatar: "https://randomuser.me/api/portraits/men/22.jpg", text: "Really impressive compared to other companies I've tried. They came exactly on time, brought premium supplies, and left the living room shining." },
  { name: "Sara Al-Hassan", location: "Al Yasmin", avatar: "https://randomuser.me/api/portraits/women/24.jpg", text: "Exceptional service! They managed to clean tough stains in the kitchen that I struggled with for months. Will book a bi-weekly service now." },
];

const row2Reviews = [
  { name: "Abdullah Al-Ammar", location: "Ar Rabi", avatar: "https://randomuser.me/api/portraits/men/78.jpg", text: "Very convenient website and smooth service. The cleaners meticulously wiped down all my high shelves and ceiling fans without me even asking." },
  { name: "Reem Al-Qahtani", location: "Al Sahafah", avatar: "https://randomuser.me/api/portraits/women/90.jpg", text: "Booking on the web took less than a minute. They deep-cleaned the entire apartment including inside the oven and fridge in record time." },
  { name: "Faisal Al-Harbi", location: "Al Aqiq", avatar: "https://randomuser.me/api/portraits/men/62.jpg", text: "I highly recommend Velro. The cleaning staff paid attention to the smallest details, making sure the bathrooms were sanitized perfectly." },
  { name: "Layla Al-Zahrani", location: "Al Malaz", avatar: "https://randomuser.me/api/portraits/women/33.jpg", text: "My go-to service for deep cleaning before hosting guests. They never disappoint, the floor polishing is excellent, and the house smells divine!" },
  { name: "Omar Al-Shehri", location: "Al Murabba", avatar: "https://randomuser.me/api/portraits/men/91.jpg", text: "The process is straightforward. They vacuumed under all the heavy furniture and mopped beautifully. Safe, secure, and incredibly precise cleaning." },
  { name: "Hessa Al-Ghamdi", location: "Al Olaya", avatar: "https://randomuser.me/api/portraits/women/12.jpg", text: "The best cleaning service I have used in Riyadh. Finally a reliable company that handles delicate dusting and tough bathroom grime with equal care." },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    service: 'Standard Cleaning'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district) {
      alert("Please select a neighborhood");
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: 'customer@example.com' // Placeholder as it's not in the simple hero form
        })
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', district: '', service: 'Standard Cleaning' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero container">
          <div className="hero-content">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eef2ff', padding: '0.65rem 1.25rem', borderRadius: '2rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--primary)', fontSize: '0.875rem' }}>
              ⭐ Rated #1 on Google & Trustpilot by 5,000+ Riyadh Homes
            </div>
            
            <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              Come home to a spotless space. <span>100% Guaranteed.</span>
            </h1>
            
            <p className="hero-subtitle" style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#4b5563', lineHeight: 1.6 }}>
              Enjoy your free time while our vetted professionals handle the mess. <strong>Starting at 50 SAR/hour.</strong> Zero stress, zero hassle.
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.125rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={24} color="var(--primary)" /> Vetted, trained & insured professionals</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={24} color="var(--primary)" /> 100% Satisfaction guarantee or we clean again</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={24} color="var(--primary)" /> No upfront payment required</li>
            </ul>

            <div className="hero-actions" style={{ alignItems: 'center', gap: '1.25rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', position: 'relative', width: '130px', height: '48px' }}>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 1" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid white', position: 'absolute', left: 0 }} />
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 2" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid white', position: 'absolute', left: '30px', zIndex: 1 }} />
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User 3" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid white', position: 'absolute', left: '60px', zIndex: 2 }} />
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid white', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '90px', zIndex: 3, fontSize: '0.875rem', fontWeight: 800 }}>5k+</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="#f59e0b" color="#f59e0b" size={18} />
                  ))}
                </div>
                <span style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: 500 }}>
                  <strong style={{ color: 'var(--text-main)' }}>4.9/5</strong> rating. "Best deep cleaning in Riyadh!"
                </span>
              </div>
            </div>
          </div>

          <div className="hero-form">
            <div style={{ margin: '-2.5rem -2.5rem 2rem -2.5rem' }}>
              <img src="/service_1.png" alt="Professional cleaner" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '1.5rem 1.5rem 0 0' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Book in 60 seconds</h2>
            <p className="form-desc" style={{ marginBottom: '1.5rem', fontWeight: 500 }}>Trusted help in Riyadh.</p>
            
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Booking Received!</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Our team will contact you on WhatsApp shortly.</p>
                <button onClick={() => setStatus('idle')} className="btn-secondary" style={{ width: '100%' }}>Book Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    className="form-input" 
                    style={{ height: '3rem', fontSize: '0.95rem' }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Phone</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+966" 
                    className="form-input" 
                    style={{ height: '3rem', fontSize: '0.95rem' }}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>District</label>
                    <select 
                      className="form-input" 
                      style={{ height: '3rem', fontSize: '0.95rem', padding: '0 0.75rem' }} 
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      required
                    >
                      <option value="" disabled>Select...</option>
                      <option value="olaya">Al Olaya</option>
                      <option value="malqa">Al Malqa</option>
                      <option value="hittin">Hittin</option>
                      <option value="yasmin">Al Yasmin</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Service</label>
                    <select 
                      className="form-input" 
                      style={{ height: '3rem', fontSize: '0.95rem', padding: '0 0.75rem' }} 
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                    >
                      <option value="Standard Cleaning">Standard</option>
                      <option value="Deep Cleaning">Deep</option>
                      <option value="Move-in/out">Move-in</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  type="submit" 
                  disabled={status === 'loading'}
                  style={{ width: '100%', height: '3.5rem', fontSize: '1.05rem', fontWeight: 800, backgroundColor: 'var(--primary)', color: 'white', borderRadius: '0.75rem', marginTop: '0.5rem' }}
                >
                  {status === 'loading' ? 'Booking...' : 'Book Your Cleaning Now'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                   <Clock size={16} /> ⚡ Next available cleaner in 2 hours
                </div>
              </form>
            )}
          </div>
        </section>


        {/* TRUST SECTION */}
        <section className="trust-brands">
          <div className="container">
            <p>Trusted by homeowners across Riyadh, Saudi Arabia</p>
          </div>
          <div className="brands-marquee-wrapper">
            <div className="brands-track">
              {[...saudiBrands, ...saudiBrands, ...saudiBrands].map((brand, i) => {
                const Icon = brand.Icon;
                return (
                  <div key={i} className="brand-item">
                    <Icon color={brand.color} size={28} style={{ opacity: 0.9 }} />
                    <span style={{ color: brand.color }}>{brand.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <div className="features-header">
              <h2>How it works</h2>
              <p>Your spotless home is just a few clicks away</p>
            </div>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Book instantly</h3>
                <p>Select your date, time, and service level online. See clear pricing with no hidden fees.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>We clean it</h3>
                <p>A fully equipped, vetted professional arrives and makes your home sparkle.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>You relax</h3>
                <p>Enjoy your newly clean space and more free time. Pay securely only after the job is done.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES — Exact Match Layout */}
        <section className="features-circular" id="why-us">
          <div className="container">
            <div className="features-circular-header">
              <h2><em>WHY</em> CHOOSE US</h2>
              <div className="header-underline"></div>
              <p>One stop. Many solutions. Total peace of mind.</p>
            </div>

            <div className="custom-features-wrapper">
              
              {/* TOP ROW: 3 Columns */}
              <div className="features-top-row">
                
                {/* Left Column (3 items) */}
                <div className="features-col left">
                  <div className="feature-item-custom">
                    <div className="feature-text-custom">
                      <h4>Certified Professional Cleaners</h4>
                      <p>Vetted, experienced, and continuously trained experts.</p>
                    </div>
                    <div className="feature-icon-custom"><Award size={24} /></div>
                  </div>
                  <div className="feature-item-custom">
                    <div className="feature-text-custom">
                      <h4>Environmentally Friendly Cleaning</h4>
                      <p>Premium, safe products that protect your entire family.</p>
                    </div>
                    <div className="feature-icon-custom"><Leaf size={24} /></div>
                  </div>
                  <div className="feature-item-custom">
                    <div className="feature-text-custom">
                      <h4>100% Satisfaction Guaranteed</h4>
                      <p>We're not satisfied until you're absolutely thrilled.</p>
                    </div>
                    <div className="feature-icon-custom"><ShieldCheck size={24} /></div>
                  </div>
                </div>

                {/* Center Image */}
                <div className="features-center">
                  <img className="bg-img" src="/service_1.png" alt="Velro cleaning" />
                  <img className="logo-img" src="/logo.png" alt="Velro Logo" />
                </div>

                {/* Right Column (3 items) */}
                <div className="features-col right">
                  <div className="feature-item-custom">
                    <div className="feature-icon-custom"><Smartphone size={24} /></div>
                    <div className="feature-text-custom">
                      <h4>One-Stop Convenience</h4>
                      <p>Book, manage, and pay seamlessly entirely online.</p>
                    </div>
                  </div>
                  <div className="feature-item-custom">
                    <div className="feature-icon-custom"><UserCheck size={24} /></div>
                    <div className="feature-text-custom">
                      <h4>Police-Checked Professionals</h4>
                      <p>We thoroughly verify every cleaner for your peace of mind.</p>
                    </div>
                  </div>
                  <div className="feature-item-custom">
                    <div className="feature-icon-custom"><Headset size={24} /></div>
                    <div className="feature-text-custom">
                      <h4>24/7 Customer Support</h4>
                      <p>Our friendly local team is here to help you 7 days a week.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM ROW: 2 items */}
              <div className="features-bottom-row">
                <div className="feature-item-custom">
                  <div className="feature-icon-custom"><CalendarDays size={24} /></div>
                  <div className="feature-text-custom">
                    <h4>Available Evenings<br/>&amp; Weekends</h4>
                    <p>Flexible scheduling to perfectly suit your busy lifestyle.</p>
                  </div>
                </div>
                <div className="feature-item-custom">
                  <div className="feature-icon-custom"><Timer size={24} /></div>
                  <div className="feature-text-custom">
                    <h4>Book In 60 Seconds</h4>
                    <p>A streamlined online booking process so you can relax faster.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SERVICES IMAGES */}
        <section id="services" style={{ padding: '6rem 0', backgroundColor: 'var(--white)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Book trusted cleaning help
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '3.5rem' }}>
              From deep cleans to daily upkeep, Velro's got you covered
            </p>
          </div>

          <div className="marquee-wrapper" style={{ marginTop: '1rem', overflow: 'hidden' }}>
            <div className="marquee-row left" style={{ animationDuration: '45s', alignItems: 'flex-start' }}>
              {[...servicesList, ...servicesList, ...servicesList].map((service, i) => (
                <div key={i} style={{ width: '320px', flexShrink: 0, margin: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={service.img} alt={service.name} style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>{service.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="reviews-section">
          <div className="reviews-header">
            <h2>User reviews and feedback</h2>
            <p>See how Velro has transformed users' experiences through their own words</p>
          </div>
          <div className="marquee-wrapper">
            <div className="marquee-row left">
              {[...row1Reviews, ...row1Reviews].map((review, i) => (
                <div key={i} className="review-card">
                  <div className="quote-icon">”</div>
                  <div className="review-author">
                    <img src={review.avatar} alt={review.name} className="review-avatar" />
                    <div className="review-info">
                      <h4>{review.name}</h4>
                      <span>{review.location}</span>
                    </div>
                  </div>
                  <div className="review-text">{review.text}</div>
                </div>
              ))}
            </div>
            <div className="marquee-row right">
              {[...row2Reviews, ...row2Reviews].map((review, i) => (
                <div key={i} className="review-card">
                  <div className="quote-icon">”</div>
                  <div className="review-author">
                    <img src={review.avatar} alt={review.name} className="review-avatar" />
                    <div className="review-info">
                      <h4>{review.name}</h4>
                      <span>{review.location}</span>
                    </div>
                  </div>
                  <div className="review-text">{review.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section id="faqs" style={{ padding: '5rem 1rem', backgroundColor: 'var(--white)' }}>
          <div className="container" style={{ maxWidth: '850px', margin: '0 auto', padding: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e5e7eb', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                <HelpCircle size={16} /> FAQ's
              </div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Frequently Asked Questions</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {faqs.map((faq, index) => (
                <div key={index} style={{ backgroundColor: '#f8fafc', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.75rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>{faq.question}</span>
                    <div style={{ minWidth: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.2s', transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  
                  {openFaq === index && (
                    <div style={{ padding: '0 1.75rem 1.75rem 1.75rem', fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <h2>Ready for a cleaner home?</h2>
            <p>Join thousands of happy homeowners in Riyadh and reclaim your weekends. Book your first cleaning in 60 seconds.</p>
            <Link href="/book" className="btn">Book Your Cleaner Now</Link>
          </div>
        </section>

    </>
  );
}
