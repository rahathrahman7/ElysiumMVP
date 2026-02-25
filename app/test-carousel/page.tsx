import { HorizontalProductCarousel } from "@/components/sections/HorizontalProductCarousel";

export default function TestCarouselPage() {
  return (
    <main>
      <div className="py-12 text-center bg-[#FAF7F2]">
        <h1 className="font-serif text-2xl md:text-3xl text-[#6D3D0D] mb-2">Horizontal Carousel Test</h1>
        <p className="text-[#6D3D0D]/70 text-sm">Scroll down to see the carousel reveal</p>
      </div>
      <HorizontalProductCarousel />
    </main>
  );
}
