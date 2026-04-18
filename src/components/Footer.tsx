import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col" style={{ gridColumn: "span 1" }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
              <img src="/Velro logo white.png" alt="Velro Logo" style={{ height: "45px", width: "auto" }} />
            </Link>
            <p style={{ color: "#9ca3af", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Your trusted partner for a cleaner, happier home in Riyadh, Saudi Arabia.
            </p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link href="/services/standard-cleaning">Standard Cleaning</Link></li>
              <li><Link href="/services/deep-cleaning">Deep Cleaning</Link></li>
              <li><Link href="/services/move-in-out">Move-in/out</Link></li>
              <li><Link href="/services/post-construction">Post-Construction</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/membership" style={{ color: '#fbbf24', fontWeight: 700 }}>Gold Membership 👑</Link></li>
              <li><Link href="/gift-cards">Gift Cards 🎁</Link></li>
              <li><Link href="/pricing">Pricing Plans</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/locations">Our Locations</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/testimonials">Testimonials</Link></li>
              <li><Link href="/blog">Blog & Tips</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link href="/terms-of-service">Terms of Service</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/refund-policy">Satisfaction Guarantee</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Velro. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="#">Instagram</Link>
            <Link href="#">Twitter</Link>
            <Link href="#">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
