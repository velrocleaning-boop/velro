import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Cleaning Services in Riyadh | Velro — Home & Villa Cleaning",
  description:
    "Explore Velro's full range of professional cleaning services in Riyadh. Standard cleaning, deep cleaning, move-in/out, sofa, carpet, kitchen, and more — all backed by our 100% satisfaction guarantee.",
  keywords: [
    "cleaning services Riyadh",
    "home cleaning Riyadh",
    "deep cleaning Riyadh",
    "villa cleaning Saudi Arabia",
    "sofa cleaning Riyadh",
    "kitchen cleaning Riyadh",
    "move in out cleaning Riyadh",
  ],
  openGraph: {
    title: "Professional Cleaning Services in Riyadh | Velro",
    description:
      "From standard weekly cleans to full deep cleans — Velro delivers spotless results across Riyadh. Book in 60 seconds.",
    url: "https://velro.sa/services",
    siteName: "Velro",
    type: "website",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
