"use client";
import Link from "next/link";
import {
  Sparkles, CheckCircle2, ArrowRight, MapPin, Star, ShieldCheck, Leaf, Clock
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const WA_NUMBER = '966594847866';

function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function WhatsAppSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

export default function ServicesContent() {
  const { t, lang } = useTranslation();
  const ar = lang === 'ar';

  const residentialServices = ar ? [
    {
      image: "/services/sweeping-dusting.webp",
      title: "تنظيف المنزل المعياري",
      slug: "standard-cleaning",
      badge: "الأكثر طلبًا",
      badgeColor: "#253bbd",
      description: "تنظيف شامل من الأعلى إلى الأسفل لجميع مناطق المعيشة وغرف النوم والحمامات والمطبخ. مثالي للصيانة الأسبوعية أو نصف الشهرية.",
      includes: ["إزالة الغبار من جميع الأسطح", "مسح الأرضيات وتكنيسها", "تنظيف الحمامات", "تنظيف المطبخ"],
    },
    {
      image: "/services/bathroom-cleaning.webp",
      title: "التنظيف العميق",
      slug: "deep-cleaning",
      badge: "أفضل قيمة",
      badgeColor: "#059669",
      description: "تنظيف شامل ومكثف مصمم للوصول إلى كل زاوية. مثالي للتنظيفات الموسمية لضمان منزل أكثر صحة وجمالًا.",
      includes: ["داخل الفرن والثلاجة", "تنظيف المرزام والبلاط", "قواعد الجدران", "داخل الخزائن"],
    },
    {
      image: "/services/floor-mopping.webp",
      title: "تنظيف نهاية الإيجار",
      slug: "move-in-out",
      badge: null,
      badgeColor: null,
      description: "اترك عقارك القديم نظيفًا تمامًا أو احضر إلى منزل جديد نظيف تمامًا. مصمم لتلبية توقعات الملاك حتى تسترد وديعتك.",
      includes: ["الجدران وقواعدها", "داخل جميع الخزائن", "الأجهزة والتجهيزات", "حافات النوافذ والأطر"],
    },
    {
      image: "/services/sofa-cleaning.webp",
      title: "تنظيف الأرائك والمفروشات",
      slug: "sofa-steam",
      badge: null,
      badgeColor: null,
      description: "تنظيف بخاري وجاف احترافي للأرائك والكراسي والأثاث المنجد لإزالة البقع وعث الغبار والمواد المسببة للحساسية بأمان.",
      includes: ["أرائك القماش والجلد", "معالجة البقع", "تحييد الروائح", "وقت تجفيف في نفس اليوم"],
    },
    {
      image: "/services/laundry-cleaning.webp",
      title: "تنظيف السجاد والبسط",
      slug: "sofa-steam",
      badge: null,
      badgeColor: null,
      description: "نظّف سجادك وبسطك بعمق بتقنيات البخار المتقدمة التي تقضي على البكتيريا وتستخرج الأوساخ العميقة للحصول على إحساس أكثر انتعاشًا.",
      includes: ["تعقيم بالبخار", "إزالة عميقة للبقع", "معالجة الروائح", "آمن للأطفال والحيوانات"],
    },
    {
      image: "/services/kitchen-cleaning.webp",
      title: "تنظيف المطبخ العميق",
      slug: "deep-cleaning",
      badge: null,
      badgeColor: null,
      description: "تنظيف مكثف ومركّز لمطبخك — يشمل إزالة الدهون من الموقد والأفران والشفاطات والأسطح بمعايير المطاعم.",
      includes: ["إزالة دهون الفرن والموقد", "تنظيف فلتر الشفاط", "تنظيف الأجهزة", "تلميع الحوض والصنابير"],
    },
  ] : [
    {
      image: "/services/sweeping-dusting.webp",
      title: "Standard House Cleaning",
      slug: "standard-cleaning",
      badge: "Most Popular",
      badgeColor: "#253bbd",
      description: "A thorough top-to-bottom clean of all living areas, bedrooms, bathrooms, and kitchen. Perfect for weekly or fortnightly maintenance.",
      includes: ["Dusting all surfaces", "Mopping & vacuuming floors", "Bathroom scrubbing", "Kitchen wipe-down"],
    },
    {
      image: "/services/bathroom-cleaning.webp",
      title: "Deep Cleaning",
      slug: "deep-cleaning",
      badge: "Best Value",
      badgeColor: "#059669",
      description: "A comprehensive, intensive clean designed to reach every corner. Ideal for seasonal cleans, ensuring a healthier and more pristine home.",
      includes: ["Inside oven & fridge", "Grout & tile scrubbing", "Skirting boards", "Cabinet interiors"],
    },
    {
      image: "/services/floor-mopping.webp",
      title: "End of Lease Cleaning",
      slug: "move-in-out",
      badge: null,
      badgeColor: null,
      description: "Leave your old property spotless or arrive at a perfectly clean new home. Designed to meet landlord expectations so you get your deposit back.",
      includes: ["Walls & skirting boards", "Inside all cabinets", "Appliances & fixtures", "Window sills & tracks"],
    },
    {
      image: "/services/sofa-cleaning.webp",
      title: "Upholstery & Sofa Cleaning",
      slug: "sofa-steam",
      badge: null,
      badgeColor: null,
      description: "Professional steam and dry cleaning of sofas, armchairs, and upholstered furniture to remove stains, dust mites, and allergens safely.",
      includes: ["Fabric & leather sofas", "Stain treatment", "Odour neutralisation", "Same-day dry time"],
    },
    {
      image: "/services/laundry-cleaning.webp",
      title: "Carpet & Rug Cleaning",
      slug: "sofa-steam",
      badge: null,
      badgeColor: null,
      description: "Deep-clean your carpets and rugs with advanced steam techniques that kill bacteria and extract deep-rooted dirt for a fresher feel.",
      includes: ["Steam sanitisation", "Deep stain removal", "Odour treatment", "Safe for kids & pets"],
    },
    {
      image: "/services/kitchen-cleaning.webp",
      title: "Kitchen Deep Clean",
      slug: "deep-cleaning",
      badge: null,
      badgeColor: null,
      description: "A focused, intensive clean of your kitchen — including degreasing cooktops, ovens, rangehoods, and surfaces to restaurant-grade standards.",
      includes: ["Oven & stovetop degreasing", "Rangehood filter clean", "Appliance clean", "Sink & tap polish"],
    },
  ];

  const commercialServices = ar ? [
    {
      image: "/services/utensils-cleaning.webp",
      title: "تنظيف المكاتب",
      slug: "standard-cleaning",
      description: "تنظيف مكاتب يومي أو أسبوعي أو شهري موثوق في جميع أنحاء الرياض. حافظ على مساحة عمل نظيفة ومهنية وصحية لفريقك.",
      includes: ["تنظيف محطات العمل", "صيانة المناطق المشتركة", "تعقيم دورات المياه", "جمع النفايات"],
    },
    {
      image: "/services/kitchen-cleaning.webp",
      title: "تنظيف المطاعم والمقاهي",
      slug: "deep-cleaning",
      description: "تنظيف عميق للمطابخ التجارية وفقًا لمعايير سلامة الغذاء السعودية الصارمة. حافظ على نظافة المصائد الدهنية والشفاطات والمعدات والأرضيات.",
      includes: ["معدات المطبخ التجاري", "تنظيف مصائد الدهون", "تعقيم مناطق تحضير الطعام", "الأرضيات والبالوعات"],
    },
    {
      image: "/services/balcony-cleaning.webp",
      title: "تنظيف الفلل والمجمعات",
      slug: "move-in-out",
      description: "تنظيف كامل للعقارات للفلل والمجمعات السكنية المسوّرة — يشمل طوابق متعددة ومناطق المجالس والمساحات الخارجية وغرف الخادمة.",
      includes: ["تنظيف متعدد الطوابق", "مناطق المجلس والاستقبال", "البلكونات الخارجية", "تردد تنظيف مخصص"],
    },
  ] : [
    {
      image: "/services/utensils-cleaning.webp",
      title: "Office Cleaning",
      slug: "standard-cleaning",
      description: "Reliable daily, weekly, or monthly office cleaning across Riyadh. Keep your workspace spotless, professional, and healthy for your team.",
      includes: ["Workstation cleaning", "Common area maintenance", "Restroom sanitisation", "Bin collection"],
    },
    {
      image: "/services/kitchen-cleaning.webp",
      title: "Restaurant & Café Cleaning",
      slug: "deep-cleaning",
      description: "Commercial kitchen deep cleans meeting strict Saudi food safety standards. Keep grease traps, hoods, equipment, and floors sanitized.",
      includes: ["Commercial kitchen equipment", "Grease trap cleaning", "Food prep area sanitisation", "Floors & drains"],
    },
    {
      image: "/services/balcony-cleaning.webp",
      title: "Villa & Compound Cleaning",
      slug: "move-in-out",
      description: "Full-property cleaning for villas and gated compounds — including multiple floors, majlis areas, exterior spaces, and maid quarters.",
      includes: ["Multi-floor cleaning", "Majlis & reception areas", "Exterior balconies", "Custom clean frequency"],
    },
  ];

  const topRiyadhDistricts = ["Al Olaya", "Hittin", "Al Malqa", "An Narjis"];

  const whyChooseItems = [
    { icon: ShieldCheck, title: ar ? 'محترفون خبراء' : 'Expert Professionals', desc: ar ? 'كل عامل يتمتع بسنوات من الخبرة والتدريب المتخصص.' : 'Every cleaner brings years of experience and specialized training.' },
    { icon: Leaf,        title: ar ? 'حلول صديقة للبيئة' : 'Eco-Friendly Solutions', desc: ar ? 'منتجات آمنة وغير سامة تحمي عائلتك والبيئة.' : 'Safe, non-toxic products that protect your family and the environment.' },
    { icon: Clock,       title: ar ? 'جدولة مرنة' : 'Flexible Scheduling', desc: ar ? 'نعمل وفق جدولك بما في ذلك المساء وعطلات نهاية الأسبوع.' : 'We work around your schedule including evenings and weekends.' },
    { icon: Star,        title: ar ? 'رضا 100%' : '100% Satisfaction', desc: ar ? 'إذا لم تكن راضيًا تمامًا، سنعود لإصلاح الأمر مجانًا.' : "If you're not completely happy, we'll return to make it right for free." },
  ];

  const servicesFaqs = ar ? [
    {
      q: 'كيف أختار خدمة التنظيف المناسبة لاحتياجاتي؟',
      a: 'نقدم خدمات تنظيف شاملة مصممة لاحتياجات مختلفة. للعقارات السكنية، توفر خدمة تنظيف المنزل لدينا الصيانة الدورية. كما نقدم خدمات متخصصة مثل تنظيف السجاد والتنظيف العميق. تواصل معنا للحصول على استشارة مجانية لتحديد أفضل خدمة لمساحتك.',
    },
    {
      q: 'ماذا أتوقع خلال أول خدمة تنظيف لي؟',
      a: 'خلال خدمتك الأولى، سيصل فريقنا في الوقت المحدد بجميع المعدات والمستلزمات اللازمة. سنجري جولة سريعة لفهم احتياجاتك المحددة. ثم سنعمل بشكل منهجي في جميع أنحاء عقارك باستخدام منتجات صديقة للبيئة وتقنيات متقدمة.',
    },
    {
      q: 'هل منتجات التنظيف لديكم آمنة للحيوانات الأليفة والأطفال؟',
      a: 'بالتأكيد! نحن نعطي الأولوية لسلامة عائلتك وحيواناتك الأليفة باستخدام منتجات تنظيف صديقة للبيئة وغير سامة فقط. وهي قابلة للتحلل الحيوي وخالية من المواد الكيميائية القاسية وآمنة للأطفال والحيوانات وأصحاب الحساسية.',
    },
    {
      q: 'ماذا لو احتجت إعادة جدولة موعد التنظيف أو إلغائه؟',
      a: 'نتفهم أن المواعيد قد تتغير، لذا نحن مرنون في إعادة الجدولة والإلغاء. ما عليك سوى إخطارنا قبل 24 ساعة على الأقل لتجنب أي رسوم.',
    },
  ] : [
    {
      q: 'How do I choose the right cleaning service for my needs?',
      a: 'We offer comprehensive cleaning services tailored to different needs. For residential properties, our house cleaning service provides regular maintenance. We also offer specialized services like carpet cleaning and deep cleaning. Contact us for a free consultation to determine the best service for your requested space.',
    },
    {
      q: 'What should I expect during my first cleaning service?',
      a: "During your first service, our team will arrive on time with all necessary equipment and supplies. We'll conduct a brief walkthrough to understand your specific needs. Then we will work systematically through your property, using eco-friendly products and advanced techniques.",
    },
    {
      q: 'Are your cleaning products safe for pets and children?',
      a: 'Absolutely! We prioritize the safety of your family and pets by using only eco-friendly, non-toxic cleaning products. They are biodegradable, free from harsh chemicals, and safe for children, pets, and people with allergies.',
    },
    {
      q: 'What if I need to reschedule or cancel my cleaning appointment?',
      a: "We understand that schedules can change, so we're flexible with rescheduling and cancellations. Simply give us at least 24 hours notice to avoid any fees.",
    },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="services-hero">
        <div className="services-hero-bg" aria-hidden="true" />
        <div className="container services-hero-content" style={{ paddingTop: '2rem' }}>
          <div className="services-hero-badge">
            <MapPin size={14} />{t('svc.hero_badge')}
          </div>
          <h1 className="services-hero-title">
            {t('svc.hero_title')}<br />
            <span>{t('svc.hero_title2')}</span>
          </h1>
          <p className="services-hero-subtitle">
            {t('svc.hero_subtitle')}
          </p>
          <div className="services-hero-actions">
            <Link href="/#why-us" className="btn-primary about-btn">
              {t('svc.hero_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="services-how" aria-labelledby="how-heading">
        <div className="container">
          <div className="services-section-header">
            <div className="section-eyebrow">{t('svc.how_eyebrow')}</div>
            <h2 id="how-heading">{t('svc.how_title')} <em>{t('svc.how_title_em')}</em></h2>
            <div className="header-underline" />
          </div>
          <div className="services-how-grid">
            {(ar ? [
              { n: "01", title: "احصل على عرض", desc: "تواصل معنا للحصول على عرض سعر مجاني بدون التزام مخصص لاحتياجاتك." },
              { n: "02", title: "احجز الخدمة", desc: "حدد موعد التنظيف في الوقت الذي يناسبك." },
              { n: "03", title: "نحن ننظف", desc: "يصل فريقنا المحترف في الوقت المحدد ويقدم تنظيفًا استثنائيًا." },
              { n: "04", title: "استمتع أنت", desc: "استرخِ واستمتع بمساحتك النظيفة. ضمان الرضا 100%!" },
            ] : [
              { n: "01", title: "Get Quote", desc: "Contact us for a free, no-obligation quote tailored to your specific needs." },
              { n: "02", title: "Book Service", desc: "Schedule your cleaning at a time that's convenient for you." },
              { n: "03", title: "We Clean", desc: "Our professional team arrives on time and delivers exceptional cleaning." },
              { n: "04", title: "You Enjoy", desc: "Relax and enjoy your sparkling clean space. 100% satisfaction guaranteed!" },
            ]).map(step => (
              <div key={step.n} className="how-step">
                <div className="how-step-num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESIDENTIAL ── */}
      <section className="services-section" id="residential" aria-labelledby="residential-heading">
        <div className="container">
          <div className="services-section-header">
            <div className="section-eyebrow">{t('svc.residential_eyebrow')}</div>
            <h2 id="residential-heading">
              {t('svc.residential_title1')} <em>{t('svc.residential_title2')}</em>
            </h2>
            <div className="header-underline" />
            <p>{t('svc.residential_subtitle')}</p>
          </div>

          <div className="services-img-grid">
            {residentialServices.map(({ image, title, slug, badge, badgeColor, description, includes }) => (
              <article key={title} className="service-img-card" itemScope itemType="https://schema.org/Service">
                <div className="service-card-image-wrap">
                  <img src={image} alt={title} className="service-card-image" />
                  {badge && (
                    <div className="service-card-badge" style={{ background: badgeColor ?? undefined }}>
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
                  <div className="service-card-footer" style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/book?service=${slug}`} className="service-card-cta" style={{ flex: 1, justifyContent: 'center' }}>
                      {t('svc.get_quote')} <ArrowRight size={15} />
                    </Link>
                    <a
                      href={waLink(`Hi! I'm interested in "${title}" from your website. Can you give me a quote?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-card-cta"
                      style={{ padding: '0.5rem 0.75rem', backgroundColor: '#25d366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label={`WhatsApp for ${title}`}
                    >
                      <WhatsAppSVG />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMERCIAL ── */}
      <section className="services-commercial" id="commercial" aria-labelledby="commercial-heading">
        <div className="container">
          <div className="services-section-header">
            <div className="section-eyebrow">{t('svc.commercial_eyebrow')}</div>
            <h2 id="commercial-heading">
              {t('svc.commercial_title1')} <em>{t('svc.commercial_title2')}</em>
            </h2>
            <div className="header-underline" />
            <p>{t('svc.commercial_subtitle')}</p>
          </div>

          <div className="services-img-grid">
            {commercialServices.map(({ image, title, slug, description, includes }) => (
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
                  <div className="service-card-footer" style={{ borderTop: 'none', paddingTop: 0, display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/book?service=${slug}`} className="service-card-cta" style={{ flex: 1, justifyContent: 'center' }}>
                      {t('svc.get_quote')} <ArrowRight size={15} />
                    </Link>
                    <a
                      href={waLink(`Hi! I'm interested in commercial "${title}" from your website. Can you give me a quote?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-card-cta"
                      style={{ padding: '0.5rem 0.75rem', backgroundColor: '#25d366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label={`WhatsApp for ${title}`}
                    >
                      <WhatsAppSVG />
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
            <div className="section-eyebrow light">{t('svc.why_eyebrow')}</div>
            <h2 id="why-heading" style={{ color: 'white' }}>{t('svc.why_title')} <em style={{ color: '#a5b4fc' }}>{t('svc.why_title_em')}</em></h2>
            <div className="header-underline" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>{t('svc.why_subtitle')}</p>
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
            <div className="section-eyebrow">{t('svc.areas_eyebrow')}</div>
            <h2 id="areas-heading">{t('svc.areas_title1')} <em>{t('svc.areas_title2')}</em></h2>
            <div className="header-underline" />
            <p>{t('svc.areas_subtitle')}</p>
          </div>
          <div className="areas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1000px' }}>
            {topRiyadhDistricts.map(district => (
              <div key={district} className="area-card">
                <div className="area-card-img-wrap">
                  <img src="/services/sweeping-dusting.webp" alt={district} />
                </div>
                <div className="area-card-content">
                  <h3>{district}</h3>
                  <Link href="/" className="area-link">{t('svc.areas_learn')} <ArrowRight size={14}/></Link>
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
            <div className="section-eyebrow">{t('svc.faq_eyebrow')}</div>
            <h2 id="faq-heading">{t('svc.faq_title1')} <em>{t('svc.faq_title2')}</em></h2>
            <div className="header-underline" />
          </div>
          <div className="services-faq-list" itemScope itemType="https://schema.org/FAQPage">
            {servicesFaqs.map(({ q, a }) => (
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
          <h2>{t('svc.cta_title')}</h2>
          <p>{t('svc.cta_desc')}</p>
          <div className="services-cta-btns">
            <Link href="/" className="services-cta-primary">
              {t('svc.cta_btn')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
