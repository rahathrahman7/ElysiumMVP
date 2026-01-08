"use client";
import Link from "next/link";
import RingSizeGuide from "@/components/ui/RingSizeGuide";

export function Footer() {
  return (
    <footer className="border-t border-elysium-dark/20 bg-elysium-light/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-serif text-2xl tracking-[0.15em] text-elysium-dark mb-4 leading-tight">ELYSIUM</div>
            <p className="text-elysium-dark/70 text-sm leading-relaxed max-w-md">
              Fine jewellery crafted with precision in our London atelier. Each piece tells a story of timeless elegance and exceptional craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg uppercase tracking-wide text-elysium-dark mb-4 leading-tight">QUICK LINKS</h3>
            <ul className="space-y-2">
              {['Shop', 'Bespoke', 'Heroes', 'Education', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-elysium-dark/70 hover:text-elysium-dark transition-all duration-300 text-sm leading-normal relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-elysium-dark transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/wishlist"
                  className="text-elysium-dark/70 hover:text-elysium-dark transition-all duration-300 text-sm leading-normal relative group"
                >
                  Wishlist
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-elysium-dark transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <RingSizeGuide />
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg uppercase tracking-wide text-elysium-dark mb-4 leading-tight">STAY UPDATED</h3>
            <p className="text-elysium-dark/70 text-sm mb-4 leading-relaxed">Be first to know about new collections and exclusive offers.</p>
            <form className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded border border-elysium-dark/30 bg-white text-sm focus:outline-none focus:border-elysium-dark transition-all duration-300 leading-normal hover:border-elysium-dark/50 focus:ring-2 focus:ring-elysium-dark/20" 
                placeholder="Email address" 
                type="email" 
                required 
              />
              <button className="px-4 py-2 border-2 border-elysium-dark text-elysium-dark text-sm uppercase tracking-wide hover:bg-elysium-dark hover:text-elysium-light transition-all duration-300 rounded leading-tight hover:scale-105 active:scale-95">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-elysium-dark/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-elysium-dark/60 leading-normal">
            © Elysium London 2025. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-elysium-dark/60 leading-normal">
            <Link href="/privacy" className="hover:text-elysium-dark transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-elysium-dark transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-elysium-dark transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
