"use client";
import React from 'react';
import { Leaf, ShieldCheck, Smartphone, UserCheck, Headset, CalendarDays, Timer, Sparkles, Building2 } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export default function WhyUs() {
  const { t, lang } = useTranslation();
  const ar = lang === 'ar';

  const reasons = [
    {
      title: ar ? 'خبراء فلبينيون ودوليون' : 'Filipino & International Experts',
      desc: ar ? 'يتكون فريقنا من محترفين مدربين تدريبًا عاليًا ومهذبين ويتحدثون الإنجليزية ومتخصصين في رعاية المنازل الراقية.' : 'Our team consists of highly trained, polite, and English-speaking professionals specializing in premium home care.',
      icon: UserCheck
    },
    {
      title: ar ? 'معدات بمستوى المستشفيات' : 'Hospital-Grade Equipment',
      desc: ar ? 'نستخدم منظفات بخارية صناعية ومكانس كهربائية بفلتر HEPA للحصول على نتائج متفوقة.' : 'We use industrial-strength steam cleaners and HEPA-filter vacuums for superior results.',
      icon: Sparkles
    },
    {
      title: ar ? 'غير سام وآمن للحيوانات الأليفة' : 'Non-Toxic & Pet-Safe',
      desc: ar ? 'نستخدم مواد تنظيف قابلة للتحلل الحيوي بنسبة 100% وآمنة للأطفال لبيئة منزلية صحية.' : 'We use 100% biodegradable and child-safe cleaning agents for a healthy home environment.',
      icon: Leaf
    },
    {
      title: ar ? 'ضمان الرضا 100%' : '100% Satisfaction Guarantee',
      desc: ar ? 'غير راضٍ عن النتيجة؟ سنعيد تنظيف منزلك مجانًا بدون أي أسئلة.' : 'Not happy with the result? We will re-clean your home for free, no questions asked.',
      icon: ShieldCheck
    },
    {
      title: ar ? 'احترام الثقافة والخصوصية' : 'Cultural Respect & Privacy',
      desc: ar ? 'يحترم محترفونا أوقات الصلاة والعادات المحلية ويحافظون على الخصوصية التامة لعائلتك.' : 'Our professionals respect prayer times, local customs, and maintain absolute privacy for your family.',
      icon: Building2
    },
    {
      title: ar ? 'معتمدون وفحصوا خلفياتهم' : 'Vetted & Background Checked',
      desc: ar ? 'يخضع كل محترف لعملية فحص صارمة وفحص أمني لضمان سلامتك.' : 'Every professional undergoes a rigorous screening process and police check for your safety.',
      icon: UserCheck
    },
    {
      title: ar ? 'دعم مخصص' : 'Dedicated Support',
      desc: ar ? 'فريق الدعم المحلي في الرياض متاح 7 أيام في الأسبوع لمساعدتك في أي استفسار.' : 'Our local Riyadh support team is available 7 days a week to assist you with any questions.',
      icon: Headset
    },
    {
      title: ar ? 'جدولة مرنة' : 'Flexible Scheduling',
      desc: ar ? 'نقدم مواعيد في المساء وعطلة نهاية الأسبوع لتناسب أسلوب حياتك المزدحم تمامًا.' : 'We offer evening and weekend slots to fit around your busy lifestyle perfectly.',
      icon: CalendarDays
    },
    {
      title: ar ? 'خدمة سريعة' : 'Fast Service',
      desc: ar ? 'تحتاج عاملة تنظيف بسرعة؟ عمليتنا المبسطة توصل محترفًا إلى بابك في وقت قياسي.' : 'Need a cleaner quickly? Our streamlined process gets a pro to your door in record time.',
      icon: Timer
    }
  ];

  return (
    <main style={{ backgroundColor: '#fff' }}>
      <section style={{ padding: '8rem 1rem 4rem', textAlign: 'center', background: 'linear-gradient(to bottom, #f0f7ff, #fff)' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {t('whyus.hero_title_pre')}<span style={{ color: 'var(--primary)' }}>Velro</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            {t('whyus.hero_subtitle')}
          </p>
        </div>
      </section>

      <section style={{ padding: '6rem 1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {reasons.map((reason, index) => (
              <div key={index} style={{ padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', backgroundColor: '#fcfcfc', transition: 'transform 0.3s ease' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                  <reason.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>{reason.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '1.1rem' }}>{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 1rem', backgroundColor: '#0f172a', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>{t('whyus.mission_title')}</h2>
          <p style={{ fontSize: '1.5rem', lineHeight: 1.6, opacity: 0.9, fontStyle: 'italic' }}>
            {t('whyus.mission_quote')}
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>5,000+</div>
              <div style={{ opacity: 0.7 }}>{t('whyus.stat1_label')}</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>4.9/5</div>
              <div style={{ opacity: 0.7 }}>{t('whyus.stat2_label')}</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>100%</div>
              <div style={{ opacity: 0.7 }}>{t('whyus.stat3_label')}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
