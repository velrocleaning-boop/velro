import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Velro | Trusted Home Cleaning Service in Riyadh, Saudi Arabia",
  description:
    "Learn about Velro — Riyadh's most trusted home cleaning company. We bring vetted professionals, eco-friendly products, and a 100% satisfaction guarantee to every home in Saudi Arabia.",
  keywords: [
    "about Velro cleaning",
    "home cleaning company Riyadh",
    "professional cleaners Saudi Arabia",
    "cleaning service Riyadh",
    "best cleaning company Riyadh",
    "vetted cleaners Saudi Arabia",
  ],
  openGraph: {
    title: "About Velro | Home Cleaning Service in Riyadh",
    description:
      "Velro is Riyadh's premier home cleaning company. Discover our story, values, and commitment to spotless homes across Saudi Arabia.",
    url: "https://velro.sa/about",
    siteName: "Velro",
    locale: "en_SA",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
