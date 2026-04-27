"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const close = useCallback(() => setIsMobileMenuOpen(false), []);

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
        }
      `}</style>

      <header className="custom-header">
        <nav className="navbar-pill">
          <div className="nav-group">
            <Link href="/why-us">Why us</Link>
            <Link href="/services">Services</Link>
            <Link href="/pricing">Pricing</Link>
          </div>

          <Link href="/" className="logo-container" style={{ display: "flex", alignItems: "center", margin: "0 1rem" }}>
            <img
              src="/logo.png"
              alt="Velro — Home Cleaning Service Riyadh"
              style={{ height: "38px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          <div className="nav-group">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/about">About Us</Link>
          </div>

          {/* Premium animated hamburger — mobile only */}
          <button
            className={`hamburger-btn${isMobileMenuOpen ? " open" : ""}`}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
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
