import './globals.css'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { PlausibleAnalytics } from "@/components/PlausibleAnalytics";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/Footer";
import { SkipLinks } from "@/components/ui/SkipLinks";
import { AccessibilityProvider } from "@/components/ui/AccessibilityProvider";
import ConciergeWidget from "@/components/concierge/ConciergeWidget";
import { ReactNode } from 'react';

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
        <meta name="theme-color" content="#D4AF37" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} bg-white text-black antialiased`}>
        <AccessibilityProvider>
          <PlausibleAnalytics />
          <SkipLinks />
          
          <div id="app-root">
            <Header id="navigation" />
            <main id="main-content" className="min-h-[70vh] fade-in" tabIndex={-1}>
              {children}
            </main>
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
      </body>
    </html>
  );
}
