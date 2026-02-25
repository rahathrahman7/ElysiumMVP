import './globals.css'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { PlausibleAnalytics } from "@/components/PlausibleAnalytics";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { Header } from "@/components/ui/Header";
import LuxuryHeader from "@/components/ui/LuxuryHeader";
import { Footer } from "@/components/Footer";
import { SkipLinks } from "@/components/ui/SkipLinks";
import { AccessibilityProvider } from "@/components/ui/AccessibilityProvider";
import ConciergeWidget from "@/components/concierge/ConciergeWidget";
import { ReactNode } from 'react';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { LenisProvider } from "@/components/providers/LenisProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata = {
  title: "ELYSIUM — Fine Jewellery",
  description: "Luxury jewellery crafted in our London atelier.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#45321e" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} bg-white text-black antialiased`}>
        <LenisProvider>
        <AccessibilityProvider>
          <PlausibleAnalytics />
          <ServiceWorkerRegistration />
          <SkipLinks />
          
          <div id="app-root">
            <ConditionalLayout>{children}</ConditionalLayout>
            <Footer id="footer" />
          </div>
          
          <ConciergeWidget />
          
          {/* Accessibility announcements */}
          <div 
            id="aria-announcements" 
            aria-live="polite" 
            aria-atomic="true" 
            className="sr-only"
          />
        </AccessibilityProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
