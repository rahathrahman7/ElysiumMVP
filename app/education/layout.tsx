import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diamond Education & Jewelry Guide | Learn About the 4Cs | ELYSIUM",
  description: "Comprehensive diamond education guide covering the 4Cs (Cut, Color, Clarity, Carat), 18k gold vs platinum comparison, ring settings explained, and expert jewelry care tips. GIA-certified expertise.",
  keywords: [
    "diamond education",
    "4Cs of diamonds",
    "diamond clarity chart",
    "diamond color scale",
    "diamond cut grades",
    "diamond carat weight",
    "18k gold vs platinum",
    "engagement ring guide",
    "diamond buying guide",
    "GIA certified diamonds",
    "diamond ring settings",
    "jewelry care tips",
    "how to clean diamond ring",
    "best diamond clarity",
    "diamond sparkle",
    "precious metals guide"
  ],
  openGraph: {
    title: "Diamond Education & Jewelry Guide | ELYSIUM Fine Jewellery",
    description: "Learn about diamond quality, the 4Cs, precious metals, and jewelry care from GIA-certified experts. Your complete guide to buying diamonds with confidence.",
    type: "website",
    locale: "en_GB",
    siteName: "ELYSIUM Fine Jewellery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diamond Education Guide | Learn the 4Cs | ELYSIUM",
    description: "Comprehensive guide to diamond quality: Cut, Color, Clarity & Carat. Expert tips from GIA-certified gemologists.",
  },
  alternates: {
    canonical: "/education",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
