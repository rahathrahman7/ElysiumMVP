import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heroes Discount | 40% Off for NHS, Police, Fire & Paramedics — ELYSIUM",
  description: "Exclusive 40% discount on engagement rings and wedding bands for UK emergency services. NHS, Police, Fire & Rescue, Paramedics. Blue Light Card accepted.",
  keywords: ["heroes discount", "NHS discount jewelry", "blue light card discount", "emergency services discount", "police discount engagement ring", "firefighter discount rings"],
  openGraph: {
    title: "Heroes Discount | 40% Off for Emergency Services — ELYSIUM",
    description: "Exclusive 40% discount on engagement rings and wedding bands for UK emergency services.",
    images: ["/images/heroeshero.png"],
  },
};

export default function HeroesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
