import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WebMCPProvider from "@/components/WebMCPProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Velro — #1 Premium Home Cleaning Service in Riyadh",
  description: "Professional home, villa, and apartment cleaning services in Riyadh. Vetted professionals, non-toxic products, and instant online booking. Trusted by thousands of households across Saudi Arabia.",
  keywords: ["cleaning service riyadh", "home cleaning saudi arabia", "villa cleaning riyadh", "deep cleaning riyadh", "best cleaner riyadh", "maid service riyadh"],
  openGraph: {
    title: "Velro — Premium Home Cleaning Riyadh",
    description: "Book your professional cleaner in Riyadh in under 60 seconds.",
    url: "https://velro.sa",
    siteName: "Velro",
    locale: "en_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velro — Premium Home Cleaning Riyadh",
    description: "Book your professional cleaner in Riyadh in under 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable} suppressHydrationWarning>
        <WebMCPProvider />
        <Header />
        {children}
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
