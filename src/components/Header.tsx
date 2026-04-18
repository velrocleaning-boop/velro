"use client";
import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="custom-header">
      <nav className="navbar-pill">
        <div className="nav-group">
          <Link href="/why-us">Why us</Link>
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <Link href="/" className="logo-container" style={{ display: "flex", alignItems: "center", margin: "0 1rem" }}>
          <img src="/logo.png" alt="Velro — Home Cleaning Service Riyadh" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
        </Link>
        <div className="nav-group">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/about">About Us</Link>
        </div>
        <button
          className="mobile-menu-btn"
          style={{ display: "none" }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu-dropdown">
            <Link href="/why-us" onClick={() => setIsMobileMenuOpen(false)}>Why us</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/book" className="btn-primary" style={{ marginTop: "1.5rem", width: "100%", padding: "1.125rem", textAlign: "center", textDecoration: "none" }}>
              Book a Cleaner
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
