"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const navLinks = [
    { href: "/why-us", labelKey: "nav.why_us" },
    { href: "/services", labelKey: "nav.services" },
    { href: "/pricing", labelKey: "nav.pricing" },
    { href: "/how-it-works", labelKey: "nav.how_it_works" },
    { href: "/about", labelKey: "nav.about" },
  ];

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes menuItemSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-overlay-inner {
          animation: overlayFadeIn 0.25s ease-out both;
        }
        .mobile-nav-item {
          opacity: 0;
          animation: menuItemSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mobile-nav-item:nth-child(1) { animation-delay: 0.05s; }
        .mobile-nav-item:nth-child(2) { animation-delay: 0.10s; }
        .mobile-nav-item:nth-child(3) { animation-delay: 0.15s; }
        .mobile-nav-item:nth-child(4) { animation-delay: 0.20s; }
        .mobile-nav-item:nth-child(5) { animation-delay: 0.25s; }
        .mobile-cta-section {
          opacity: 0;
          animation: menuItemSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.30s both;
        }
        .mobile-book-btn {
          width: 100%;
          background: #3b4fd8;
          color: #ffffff;
          border-radius: 16px;
          padding: 18px;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: block;
          transition: all 0.15s ease;
        }
        .mobile-book-btn:active {
          transform: scale(0.97);
          background: #1a1f5e;
        }
        .mobile-nav-link {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #1a1f5e;
          padding: 14px 0;
          border-bottom: 1px solid rgba(59,79,216,0.08);
          letter-spacing: -0.3px;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .mobile-nav-link:hover, .mobile-nav-link:active {
          color: #3b4fd8;
        }
      `}</style>

      {/* Full-screen overlay */}
      <div
        ref={overlayRef}
        className="mobile-overlay-inner"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        {/* Decorative background element */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "#3b4fd8",
          opacity: 0.04,
          pointerEvents: "none",
        }} />

        {/* Overlay Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: "80px",
          borderBottom: "1px solid rgba(59,79,216,0.1)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}>
          {/* Logo */}
          <Link href="/" onClick={onClose}>
            <img
              src="/logo.png"
              alt="Velro"
              style={{ height: "34px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: "44px",
              height: "44px",
              background: "rgba(59,79,216,0.08)",
              border: "1px solid rgba(59,79,216,0.15)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="2" y1="2" x2="16" y2="16" stroke="#1a1f5e" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="16" y1="2" x2="2" y2="16" stroke="#1a1f5e" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: "40px 32px", position: "relative", zIndex: 1 }}>
          {navLinks.map((link) => (
            <div key={link.href} className="mobile-nav-item">
              <Link
                href={link.href}
                className="mobile-nav-link"
                onClick={onClose}
              >
                {t(link.labelKey)}
              </Link>
            </div>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div
          className="mobile-cta-section"
          style={{
            padding: "32px",
            marginTop: "auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Link href="/book" className="mobile-book-btn" onClick={onClose}>
            {t('nav.book')}
          </Link>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "12px",
          }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              <span style={{ color: "#3b4fd8", fontWeight: 700 }}>✓</span> {t('mobile.no_upfront')}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              <span style={{ color: "#3b4fd8", fontWeight: 700 }}>✓</span> {t('mobile.free_cancel')}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
