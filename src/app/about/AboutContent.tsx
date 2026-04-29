"use client";
import Link from "next/link";
import {
  ShieldCheck, Leaf, Headset, Clock, Star,
  MapPin, CheckCircle2, Sparkles, Heart,
  Lightbulb, Handshake, Target
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function AboutContent() {
  const { t, lang } = useTranslation();
  const ar = lang === 'ar';

  const stats = [
    { value: "5,000+", label: t('about.stat1') },
    { value: "4.9★",  label: t('about.stat2') },
    { value: "100%",  label: t('about.stat3') },
    { value: "50+",   label: t('about.stat4') },
  ];

  const highlights = ar ? [
    'عمال نظافة معتمدون وذوو خبرة ومؤمَّن عليهم بالكامل',
    'خطط تنظيف قابلة للتخصيص للمنزل أو الفيلا',
    'منتجات تنظيف صديقة للبيئة وآمنة للعائلة',
    'ودودون وجديرون بالثقة ودائمًا في الموعد',
    'حجز فوري عبر الإنترنت — بدون مكالمات هاتفية',
    'نخدم جميع الأحياء الرئيسية في الرياض',
  ] : [
    'Certified, experienced, and fully insured cleaners',
    'Customisable cleaning plans for home or villa',
    'Eco-conscious, family-safe cleaning products',
    'Friendly, trustworthy, and always on time',
    'Instant online booking — no phone calls needed',
    'Serving all major districts across Riyadh',
  ];

  const coreValues = [
    {
      icon: Star,
      title: ar ? 'التميز' : 'Excellence',
      desc: ar
        ? 'نسعى نحو الكمال في كل مهمة تنظيف، ونولي اهتمامًا لأدق التفاصيل لتقديم نتائج تتجاوز التوقعات باستمرار.'
        : 'We pursue perfection in every cleaning task, paying attention to the smallest details to deliver results that consistently exceed expectations.',
      pos: 'left',
    },
    {
      icon: ShieldCheck,
      title: ar ? 'ضمان الرضا 100%' : '100% Satisfaction Guaranteed',
      desc: ar
        ? 'إذا لم تكن راضيًا تمامًا عن عملنا، سنعود ونصلحه — مجانًا تمامًا. بدون أي أسئلة.'
        : 'If you\'re not completely happy with our work, we\'ll come back and fix it — completely free of charge. No questions asked.',
      pos: 'left',
    },
    {
      icon: Target,
      title: ar ? 'الموثوقية' : 'Reliability',
      desc: ar
        ? 'نفي بالتزاماتنا. يمكنك الاعتماد علينا للحضور في الوقت المحدد دائمًا وتقديم جودة متسقة في كل تنظيف.'
        : 'We honour our commitments. You can count on us to show up on time, every time, and deliver consistent quality at every clean.',
      pos: 'left',
    },
    {
      icon: Handshake,
      title: ar ? 'العمل الجماعي' : 'Teamwork',
      desc: ar
        ? 'قوتنا تأتي من التعاون والاحترام المتبادل والالتزام المشترك بتقديم خدمة استثنائية لكل عميل.'
        : 'Our strength comes from collaboration, mutual respect, and a shared commitment to delivering exceptional service to every client.',
      pos: 'right',
    },
    {
      icon: Lightbulb,
      title: ar ? 'الابتكار' : 'Innovation',
      desc: ar
        ? 'نستكشف باستمرار تقنيات ومعدات وحلولًا صديقة للبيئة جديدة لتحسين جودة خدمتنا وكفاءتها.'
        : 'We continuously explore new techniques, equipment, and eco-friendly solutions to improve our service quality and efficiency.',
      pos: 'right',
    },
    {
      icon: Headset,
      title: ar ? 'دعم عملاء على مدار الساعة' : '24/7 Customer Support',
      desc: ar
        ? 'أسئلة أو تغييرات أو مخاوف؟ فريقنا المحلي الودود متاح 7 أيام في الأسبوع لضمان تجربة سلسة دائمًا.'
        : 'Questions, changes, or concerns? Our friendly local team is available 7 days a week to ensure your experience is always smooth.',
      pos: 'right',
    },
  ];

  const commitmentCards = [
    { icon: Leaf,       title: ar ? 'منتجات صديقة للبيئة' : 'Eco-Friendly Products',   desc: ar ? 'آمنة لعائلتك والكوكب.' : 'Safe for your family and the planet.' },
    { icon: ShieldCheck, title: ar ? 'مؤمَّن ومعتمد بالكامل' : 'Fully Insured & Vetted', desc: ar ? 'كل عامل خضع لفحص الخلفية.' : 'Every cleaner is background-checked.' },
    { icon: Clock,       title: ar ? 'جدولة مرنة' : 'Flexible Scheduling',              desc: ar ? 'المساء والعطلات — نناسب حياتك.' : 'Evenings, weekends — we fit your life.' },
    { icon: Heart,       title: ar ? 'نهتم فعلًا' : 'We Actually Care',                 desc: ar ? 'منزلك يُعامَل كمنزلنا.' : 'Your home is treated like our own.' },
  ];

  const aboutFaqs = ar ? [
    {
      q: 'ما هي Velro؟',
      a: 'Velro هي خدمة تنظيف منزلية احترافية مقرها الرياض، المملكة العربية السعودية. نربط أصحاب المنازل بمحترفي تنظيف معتمدين ومدربين ومؤمَّن عليهم — يمكن حجزهم بالكامل عبر الإنترنت في أقل من 60 ثانية.',
    },
    {
      q: 'ما المناطق التي تغطيها Velro في الرياض؟',
      a: 'نخدم حاليًا العليا، حطين، الملقا، النرجس، الياسمين، السليمانية، الربيع، الصحافة، العقيق، الملز، المربع، وأحياء عديدة أخرى في الرياض.',
    },
    {
      q: 'هل تم فحص خلفيات عمال التنظيف في Velro؟',
      a: 'نعم. يخضع كل محترف في Velro لفحص خلفية شامل وتحقق من الهوية وبرنامج تدريب مهني قبل السماح له بالعمل في منازل عملائنا.',
    },
    {
      q: 'ما هو ضمان الرضا في Velro؟',
      a: 'إذا لم تكن راضيًا تمامًا عن تنظيفك، أخبرنا فقط خلال 24 ساعة وسنرسل فريقًا لإصلاح المشكلة — مجانًا تمامًا.',
    },
  ] : [
    {
      q: 'What is Velro?',
      a: 'Velro is a professional home cleaning service based in Riyadh, Saudi Arabia. We connect homeowners with vetted, trained, and insured cleaning professionals — bookable entirely online in under 60 seconds.',
    },
    {
      q: 'Which areas in Riyadh does Velro cover?',
      a: 'We currently serve Al Olaya, Hittin, Al Malqa, An Narjis, Al Yasmin, As Sulimaniyah, Ar Rabi, Al Sahafah, Al Aqiq, Al Malaz, Al Murabba, and many more neighbourhoods across Riyadh.',
    },
    {
      q: 'Are Velro cleaners background-checked?',
      a: 'Yes. Every single Velro professional undergoes a thorough background check, identity verification, and professional training programme before being allowed to work in our clients\' homes.',
    },
    {
      q: 'What is Velro\'s satisfaction guarantee?',
      a: 'If you are not completely satisfied with your clean, simply let us know within 24 hours and we will send a team back to fix the issue — completely free of charge.',
    },
  ];

  const leftValues  = coreValues.filter((v) => v.pos === 'left');
  const rightValues = coreValues.filter((v) => v.pos === 'right');

  return (
    <>
      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden="true" />
        <div className="container about-hero-content">
          <div className="about-hero-badge">
            <MapPin size={14} /> {t('about.hero_badge')}
          </div>
          <h1 className="about-hero-title">
            {t('about.hero_title')}<br />
            <span>{t('about.hero_title2')}</span>
          </h1>
          <p className="about-hero-subtitle">
            {t('about.hero_subtitle')}
          </p>
          <div className="about-hero-actions">
            <Link href="/#why-us" className="btn-primary about-btn">
              {t('about.hero_cta1')}
            </Link>
            <Link href="/" className="about-btn-outline">
              {t('about.hero_cta2')}
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
              <span>{t('about.badge_float')}</span>
            </div>
          </div>
          <div className="about-story-text">
            <div className="section-eyebrow">{t('about.story_eyebrow')}</div>
            <h2 id="story-heading" className="about-story-heading">
              {t('about.story_heading')}{' '}
              <em>{t('about.story_em')}</em>
            </h2>
            <p>{t('about.story_p1')}</p>
            <p>{t('about.story_p2')}</p>
            <p>{t('about.story_p3')}</p>
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

      {/* ── CORE VALUES ── */}
      <section className="about-values" aria-labelledby="values-heading">
        <div className="container">
          <div className="about-values-header">
            <div className="section-eyebrow">{t('about.values_eyebrow')}</div>
            <h2 id="values-heading">
              <em>{t('about.values_title')}</em>
            </h2>
            <div className="header-underline" />
            <p>{t('about.values_subtitle')}</p>
          </div>

          <div className="about-values-layout">
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

            <div className="about-values-center" aria-hidden="true">
              <img className="bg-img"   src="/service_1.png" alt="" />
              <img className="logo-img" src="/logo.png" alt="Velro Home Cleaning Riyadh" />
            </div>

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

      {/* ── COMMITMENT ── */}
      <section className="about-commitment" aria-labelledby="commitment-heading">
        <div className="container about-commitment-grid">
          <div className="about-commitment-text">
            <div className="section-eyebrow light">{t('about.promise_eyebrow')}</div>
            <h2 id="commitment-heading">{t('about.promise_title')}</h2>
            <p>{t('about.promise_p1')}</p>
            <p>{t('about.promise_p2')}</p>
            <Link href="/" className="btn-primary about-btn" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              {t('about.promise_cta')}
            </Link>
          </div>
          <div className="about-commitment-cards">
            {commitmentCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="commitment-card">
                <div className="commitment-icon"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="about-faq-section" aria-labelledby="about-faq-heading">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="about-values-header">
            <div className="section-eyebrow">{t('about.faq_eyebrow')}</div>
            <h2 id="about-faq-heading">{t('about.faq_title')}</h2>
            <div className="header-underline" />
          </div>
          <div className="about-faq-grid" itemScope itemType="https://schema.org/FAQPage">
            {aboutFaqs.map(({ q, a }) => (
              <div
                key={q}
                className="about-faq-item"
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
      <section className="about-cta" aria-label="Book a cleaning service">
        <div className="container about-cta-inner">
          <Sparkles size={40} className="about-cta-icon" />
          <h2>{t('about.cta_title')}</h2>
          <p>{t('about.cta_desc')}</p>
          <Link href="/" className="about-cta-btn">
            {t('about.cta_btn')}
          </Link>
        </div>
      </section>
    </>
  );
}
