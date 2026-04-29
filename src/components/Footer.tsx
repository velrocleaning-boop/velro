"use client";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col" style={{ gridColumn: "span 1" }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
              <img src="/Velro logo white.png" alt="Velro Logo" style={{ height: "45px", width: "auto" }} />
            </Link>
            <p style={{ color: "#9ca3af", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {t('footer.tagline')}
            </p>
          </div>
          <div className="footer-col">
            <h4>{t('footer.services')}</h4>
            <ul className="footer-links">
              <li><Link href="/services/standard-cleaning">{t('footer.standard')}</Link></li>
              <li><Link href="/services/deep-cleaning">{t('footer.deep')}</Link></li>
              <li><Link href="/services/move-in-out">{t('footer.moveinout')}</Link></li>
              <li><Link href="/services/post-construction">{t('footer.postconstruction')}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.company')}</h4>
            <ul className="footer-links">
              <li><Link href="/about">{t('footer.about')}</Link></li>
              <li><Link href="/pricing">{t('footer.pricing')}</Link></li>
              <li><Link href="/faqs">{t('footer.faqs')}</Link></li>
              <li><Link href="/locations">{t('footer.locations')}</Link></li>
              <li><Link href="/how-it-works">{t('footer.how')}</Link></li>
              <li><Link href="/testimonials">{t('footer.testimonials')}</Link></li>
              <li><Link href="/blog">{t('footer.blog')}</Link></li>
              <li><Link href="/contact">{t('footer.contact')}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.legal')}</h4>
            <ul className="footer-links">
              <li><Link href="/terms-of-service">{t('footer.terms')}</Link></li>
              <li><Link href="/privacy-policy">{t('footer.privacy')}</Link></li>
              <li><Link href="/refund-policy">{t('footer.refund')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="#">{t('footer.instagram')}</Link>
            <Link href="#">{t('footer.twitter')}</Link>
            <Link href="#">{t('footer.facebook')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
