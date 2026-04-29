"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { useTranslation } from "@/hooks/useTranslation";
import type { Lang } from "@/context/LanguageContext";

function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <>
      <style>{`
        .lang-switcher {
          display: flex;
          flex-direction: row !important;
          direction: ltr !important;
          align-items: center;
          background: rgba(59,79,216,0.07);
          border-radius: 100px;
          padding: 3px;
          border: 1px solid rgba(59,79,216,0.15);
          flex-shrink: 0;
          gap: 2px;
        }
        .lang-btn {
          min-width: 40px;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          background: transparent;
          color: #6b7280;
          line-height: 1;
          font-family: inherit;
          text-align: center;
        }
        .lang-btn:hover {
          color: #1a1f5e;
          background: rgba(59,79,216,0.05);
        }
        .lang-btn.lang-active {
          background: #3b4fd8;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(59,79,216,0.35);
        }
        [dir="rtl"] .lang-btn {
          font-family: 'Tajawal', system-ui, sans-serif;
        }
      `}</style>
      <div className="lang-switcher" aria-label="Language switcher">
        {(["en", "ar"] as Lang[]).map((l) => (
          <button
            key={l}
            className={`lang-btn${lang === l ? " lang-active" : ""}`}
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
          >
            {l === "en" ? "EN" : "ع"}
          </button>
        ))}
      </div>
    </>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const close = useCallback(() => setIsMobileMenuOpen(false), []);
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        /* Hamburger button — only visible on mobile */
        .hamburger-btn {
          display: none;
          width: 44px;
          height: 44px;
          background: rgba(59,79,216,0.08);
          border: 1px solid rgba(59,79,216,0.15);
          border-radius: 10px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          transition: background 0.2s ease;
        }
        .hamburger-btn:hover {
          background: rgba(59,79,216,0.13);
        }
        .hamburger-line {
          width: 18px;
          height: 2px;
          background: #1a1f5e;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        .hamburger-btn.open .hamburger-line:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .hamburger-btn.open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger-btn.open .hamburger-line:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .hamburger-btn {
            display: flex;
          }
          .nav-group {
            display: none !important;
          }
          .lang-switcher {
            /* always visible on mobile */
          }
        }
      `}</style>

      <header className="custom-header">
        <nav className="navbar-pill">
          <div className="nav-group">
            <Link href="/why-us">{t('nav.why_us')}</Link>
            <Link href="/services">{t('nav.services')}</Link>
            <Link href="/pricing">{t('nav.pricing')}</Link>
          </div>

          <Link href="/" className="logo-container" style={{ display: "flex", alignItems: "center", margin: "0 1rem" }}>
            <img
              src="/logo.png"
              alt="Velro — Home Cleaning Service Riyadh"
              style={{ height: "38px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          <div className="nav-group">
            <Link href="/how-it-works">{t('nav.how_it_works')}</Link>
            <Link href="/about">{t('nav.about')}</Link>
          </div>

          {/* Language switcher — always visible */}
          <div className="lang-switcher-wrap" style={{ marginInlineStart: "0.75rem" }}>
            <LanguageSwitcher />
          </div>

          {/* Premium animated hamburger — mobile only */}
          <button
            className={`hamburger-btn${isMobileMenuOpen ? " open" : ""}`}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            style={{ marginInlineStart: "0.5rem" }}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </nav>
      </header>

      {/* Full-screen overlay menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={close} />
    </>
  );
}
