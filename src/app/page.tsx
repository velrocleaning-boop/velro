"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpCircle, Plus, Minus, X, Menu, CheckCircle2, MapPin, Star, ShieldCheck, Clock, Sparkles, Droplets, Home, Activity, Leaf, Trees, Layers, Building2, BookOpenText, Award, CalendarDays, Smartphone, UserCheck, Headset, Timer } from "lucide-react";
import "./animations.css";
import { useScrollAnimations } from "@/hooks/useAnimations";

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
  { name: "Bathroom Cleaning", img: "/services/bathroom-cleaning.webp" },
  { name: "Kitchen Cleaning", img: "/services/kitchen-cleaning.webp" },
  { name: "Dusting & Sweeping", img: "/services/sweeping-dusting.webp" },
  { name: "Floor Mopping", img: "/services/floor-mopping.webp" },
  { name: "Sofa & Upholstery", img: "/services/sofa-cleaning.webp" },
  { name: "Balcony Cleaning", img: "/services/balcony-cleaning.webp" },
  { name: "Laundry Service", img: "/services/laundry-cleaning.webp" },
  { name: "Utensils & Dishes", img: "/services/utensils-cleaning.webp" }
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

const FLOATING_CIRCLES = [
  { left: "12%", delay: "2.5s", size: "8px" },
  { left: "85%", delay: "1.2s", size: "6px" },
  { left: "45%", delay: "5.8s", size: "9px" },
  { left: "68%", delay: "0.5s", size: "7px" },
  { left: "22%", delay: "7.1s", size: "10px" },
  { left: "5%", delay: "3.9s", size: "6px" },
  { left: "92%", delay: "8.4s", size: "8px" },
  { left: "55%", delay: "4.2s", size: "7px" },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    district: '',
    service: 'Standard Cleaning',
    workers: '1 Cleaner',
    date: '',
    time: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useScrollAnimations();

  const SERVICE_SLUGS: Record<string, string> = {
    'Standard Cleaning': 'standard-cleaning',
    'Deep Cleaning': 'deep-cleaning',
    'Move-in/out': 'move-in-out',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      alert("Please fill all required fields (Name, Phone, Date, Time)");
      return;
    }
    if (!formData.district) {
      alert("Please select a neighborhood");
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          district: formData.district,
          service: SERVICE_SLUGS[formData.service] || 'standard-cleaning',
          date: formData.date,
          time: formData.time,
          notes: `Workers requested: ${formData.workers}`
        }),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', district: '', service: 'Standard Cleaning', workers: '1 Cleaner', date: '', time: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(145deg, #eef0ff 0%, #f5f3ff 50%, #eef4ff 100%)" }}>
          {/* Blobs */}
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(59,79,216,0.05)", pointerEvents: "none", zIndex: 0 }}></div>
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(26,31,94,0.04)", pointerEvents: "none", zIndex: 0 }}></div>
          {/* Floating Circles */}
          {FLOATING_CIRCLES.map((circle, i) => (
            <div key={i} className="floating-circle" style={{ left: circle.left, animationDelay: circle.delay, width: circle.size, height: circle.size }} />
          ))}
          <div className="hero container" style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-content" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #eef0ff, #e0e4ff)', padding: '0.65rem 1.25rem', borderRadius: '2rem', marginBottom: '1rem', fontWeight: 600, color: '#1a1f5e', fontSize: '0.875rem', border: '1px solid #a5aeff', boxShadow: '0 0 0 4px rgba(59,79,216,0.08)', animation: 'slideDown 0.5s ease-out both' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
              Rated #1 on Google & Trustpilot by 5,000+ Riyadh Homes
            </div>
            
            <h1 className="hero-title" style={{ fontSize: '3.1rem', lineHeight: 1.15, marginBottom: '0.75rem', letterSpacing: '-0.5px', fontWeight: 900 }}>
              <span style={{ display: 'block', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>Come home to a spotless space.</span>
              <span style={{ display: 'block', animation: 'fadeInUp 0.5s ease-out 0.45s both', color: '#3b4fd8' }}>100% Guaranteed.</span>
            </h1>
            
            <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#4b5563', lineHeight: 1.6 }}>
              Enjoy your free time while our vetted professionals handle the mess. <strong>Starting at 50 SAR/hour.</strong> Zero stress, zero hassle.
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.125rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <li style={{ background: '#ffffff', border: '1px solid #e8eaff', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideInLeft 0.5s ease-out 0.85s both' }}>
                <div style={{ width: '20px', height: '20px', background: '#3b4fd8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                Vetted, trained & insured professionals
              </li>
              <li style={{ background: '#ffffff', border: '1px solid #e8eaff', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideInLeft 0.5s ease-out 1.0s both' }}>
                <div style={{ width: '20px', height: '20px', background: '#3b4fd8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                100% Satisfaction guarantee or we clean again
              </li>
              <li style={{ background: '#ffffff', border: '1px solid #e8eaff', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideInLeft 0.5s ease-out 1.15s both' }}>
                <div style={{ width: '20px', height: '20px', background: '#3b4fd8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                No upfront payment required
              </li>
            </ul>

            <div style={{ background: '#ffffff', border: '1px solid #e8eaff', borderRadius: '12px', padding: '10px 14px', display: 'inline-flex', alignItems: 'center', gap: '1.25rem', marginTop: '18px', animation: 'fadeInScale 0.6s ease-out 1.3s both' }}>
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

          <div className="premium-booking-card" id="booking-form">
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #3b4fd8, #7c8bff)', borderRadius: '12px 12px 0 0', margin: '-1.5rem -2rem 16px -2rem' }}></div>
            <span style={{ background: '#eef0ff', color: '#1a1f5e', padding: '3px 10px', borderRadius: '6px', fontSize: '10px', display: 'inline-block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Instant Booking</span>
            <h2>Reserve Your Cleaner</h2>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', marginBottom: '14px' }}>Next available in Riyadh: today in 2 hours</p>
            
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Booking Received!</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Our team will contact you on WhatsApp shortly.</p>
                <button onClick={() => setStatus('idle')} className="btn-success-large">Book Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="dark-form-grid">
                  <div className="dark-form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Enter your name" 
                      className="dark-form-input" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="dark-form-group">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+966" 
                      className="dark-form-input" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="dark-form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      placeholder="Optional" 
                      className="dark-form-input" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="dark-form-group">
                    <label>District</label>
                    <select 
                      className="dark-form-input dark-form-select" 
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      required
                    >
                      <option value="" disabled>Select District...</option>
                      <option value="olaya">Al Olaya</option>
                      <option value="malqa">Al Malqa</option>
                      <option value="hittin">Hittin</option>
                      <option value="yasmin">Al Yasmin</option>
                      <option value="narjis">An Narjis</option>
                      <option value="sulimaniyah">As Sulimaniyah</option>
                      <option value="rabi">Ar Rabi</option>
                      <option value="sahafah">Al Sahafah</option>
                      <option value="aqiq">Al Aqiq</option>
                      <option value="malaz">Al Malaz</option>
                      <option value="murabba">Al Murabba</option>
                      <option value="qurtubah">Qurtubah</option>
                      <option value="izdihar">Al Izdihar</option>
                      <option value="munsiyah">Al Munsiyah</option>
                      <option value="qirawan">Al Qirawan</option>
                      <option value="nakheel">Al Nakheel</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="dark-form-group">
                    <label>Service</label>
                    <select 
                      className="dark-form-input dark-form-select" 
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                    >
                      <option value="Standard Cleaning">Standard</option>
                      <option value="Deep Cleaning">Deep</option>
                      <option value="Move-in/out">Move-in/out</option>
                    </select>
                  </div>
                  <div className="dark-form-group">
                    <label>Workers</label>
                    <select 
                      className="dark-form-input dark-form-select" 
                      value={formData.workers}
                      onChange={(e) => setFormData({...formData, workers: e.target.value})}
                    >
                      <option value="1 Cleaner">1 Cleaner</option>
                      <option value="2 Cleaners">2 Cleaners</option>
                      <option value="3 Cleaners">3 Cleaners</option>
                      <option value="4+ Cleaners">4+ Cleaners</option>
                    </select>
                  </div>

                  <div className="dark-form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      required 
                      className="dark-form-input" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="dark-form-group">
                    <label>Time</label>
                    <input 
                      type="time" 
                      required 
                      className="dark-form-input" 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '0.5rem', color: '#fca5a5', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  className="btn-success-large"
                  type="submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Processing...' : 'Get Quote Instantly'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                    No upfront payment
                  </span>
                  <span style={{ fontSize: '10px', color: '#d1d5db' }}>·</span>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>Free cancellation</span>
                </div>
              </form>
            )}
          </div>
          </div>
        </section>


        {/* TRUST SECTION */}
        <section className="trust-brands">
          <div className="container obs-hide brands-wrapper">
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
              <div className="step-card obs-hide" style={{ animationDelay: "0s" }}>
                <div className="step-number">1</div>
                <h3>Book instantly</h3>
                <p>Select your date, time, and service level online. See clear pricing with no hidden fees.</p>
              </div>
              <div className="step-card obs-hide" style={{ animationDelay: "0.2s" }}>
                <div className="step-number">2</div>
                <h3>We clean it</h3>
                <p>A fully equipped, vetted professional arrives and makes your home sparkle.</p>
              </div>
              <div className="step-card obs-hide" style={{ animationDelay: "0.4s" }}>
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
                  <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.0s' }}>
                    <div className="feature-text-custom">
                      <h4>Certified Professional Cleaners</h4>
                      <p>Vetted, experienced, and continuously trained experts.</p>
                    </div>
                    <div className="feature-icon-custom"><Award size={24} /></div>
                  </div>
                  <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.1s' }}>
                    <div className="feature-text-custom">
                      <h4>Environmentally Friendly Cleaning</h4>
                      <p>Premium, safe products that protect your entire family.</p>
                    </div>
                    <div className="feature-icon-custom"><Leaf size={24} /></div>
                  </div>
                  <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.2s' }}>
                    <div className="feature-text-custom">
                      <h4>100% Satisfaction Guaranteed</h4>
                      <p>We're not satisfied until you're absolutely thrilled.</p>
                    </div>
                    <div className="feature-icon-custom"><ShieldCheck size={24} /></div>
                  </div>
                </div>

                {/* Center Image */}
                <div className="features-center">
                  <img className="bg-img" src="/services/sofa-cleaning.webp" alt="Velro cleaning" />
                  <img className="logo-img" src="/logo.png" alt="Velro Logo" />
                </div>

                {/* Right Column (3 items) */}
                <div className="features-col right">
                  <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.3s' }}>
                    <div className="feature-icon-custom"><Smartphone size={24} /></div>
                    <div className="feature-text-custom">
                      <h4>One-Stop Convenience</h4>
                      <p>Book, manage, and pay seamlessly entirely online.</p>
                    </div>
                  </div>
                  <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.4s' }}>
                    <div className="feature-icon-custom"><UserCheck size={24} /></div>
                    <div className="feature-text-custom">
                      <h4>Police-Checked Professionals</h4>
                      <p>We thoroughly verify every cleaner for your peace of mind.</p>
                    </div>
                  </div>
                  <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.5s' }}>
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
                <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.6s' }}>
                  <div className="feature-icon-custom"><CalendarDays size={24} /></div>
                  <div className="feature-text-custom">
                    <h4>Available Evenings<br/>&amp; Weekends</h4>
                    <p>Flexible scheduling to perfectly suit your busy lifestyle.</p>
                  </div>
                </div>
                <div className="feature-item-custom obs-hide" style={{ animationDelay: '0.7s' }}>
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

        {/* SERVICES MARQUEE */}
        <section id="services" className="services-marquee-section">
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow">What We Clean</div>
            <h2 className="services-marquee-title">
              Book trusted <span>cleaning help</span>
            </h2>
            <p className="services-marquee-subtitle">
              From deep cleans to daily upkeep, Velro&apos;s got you covered
            </p>
          </div>

          <div className="services-marquee-track-wrapper">
            <div className="services-marquee-track">
              {/* Two identical copies for seamless infinite loop */}
              {[...servicesList, ...servicesList].map((service, i) => (
                <div key={i} className="services-marquee-card obs-hide" style={{ animationDelay: `${(i % 8) * 0.08}s` }}>
                  <div className="services-marquee-img-wrap">
                    <img src={service.img} alt={service.name} className="services-marquee-img" />
                    <div className="services-marquee-overlay">
                      <span className="services-marquee-label">{service.name}</span>
                    </div>
                  </div>
                  <h3 className="services-marquee-name">{service.name}</h3>
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
                <div key={i} className="review-card obs-hide" style={{ animationDelay: `${(i % 6) * 0.12}s` }}>
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
                <div key={i} className="review-card obs-hide" style={{ animationDelay: `${(i % 6) * 0.12}s` }}>
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
            <div className="obs-hide faq-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
                  
                  <div className={`faq-answer ${openFaq === index ? "open" : ""}`}>
                    <div className="faq-answer-inner" style={{ padding: "0 1.75rem 1.75rem 1.75rem", fontSize: "1.05rem", color: "#4b5563", lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container obs-hide cta-header">
            <h2>Ready for a cleaner home?</h2>
            <p>Join thousands of happy homeowners in Riyadh and reclaim your weekends. Book your first cleaning in 60 seconds.</p>
            <Link href="/book" className="btn cta-shimmer-btn">Book Your Cleaner Now</Link>
          </div>
        </section>

    </>
  );
}
