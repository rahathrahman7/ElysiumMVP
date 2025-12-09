# AI Context File for ELYSIUM MVP
*Generated for AI agents (Claude, Codex, etc.) to understand the complete project context*

**Last Updated:** January 2025  
**Project Version:** 0.1.0  
**Status:** Active Development

---

## 🎯 Project Overview

**ELYSIUM** is a luxury jewelry e-commerce platform specializing in high-end engagement rings and men's wedding bands. Built as an MVP for a premium jewelry brand targeting affluent customers seeking bespoke and customizable jewelry pieces.

### Business Model
- **B2C E-commerce:** Direct-to-consumer luxury jewelry sales
- **Product Categories:** Engagement rings, men's wedding bands, traditional collections
- **Key Features:** Product customization, bespoke consultations, premium UX
- **Target Market:** High-value customers ($3,000-$15,000+ per purchase)

### Current Product Catalog
- **14 Engagement Rings:** Solitaire, trilogy, toi-et-moi styles  
- **8 Men's Wedding Bands:** Contemporary designs (Arden, Bastion, etc.)
- **6 Traditional Men's Bands:** Classic styles with traditional finishes
- **Customization Options:** Metals, diamonds, sizes, widths, engraving

---

## 🛠 Technology Stack & Versions

### Core Framework
```json
{
  "framework": "Next.js 15.0.0",
  "runtime": "Node.js",
  "language": "TypeScript 5.5.4",
  "packageManager": "pnpm"
}
```

Pricing units and Stripe
- UI and SEO treat prices as GBP (pounds).
- Stripe requires pence; convert server-side in `/api/checkout` when sending `unit_amount` (e.g., `Math.round(priceGBP * 100)`).

### Frontend Stack
```json
{
  "styling": "Tailwind CSS 3.4.17",
  "stateManagement": "Zustand 4.5.4",
  "dataFetching": "SWR 2.2.5",
  "animations": "GSAP 3.13.0",
  "icons": "Lucide React 0.542.0",
  "forms": "Native HTML forms (no external library)",
  "utilities": "clsx 2.1.1"
}
```

### Backend & Services
```json
{
  "cms": "Sanity (headless CMS)",
  "payments": "Stripe 16.0.0",
  "email": "Resend 4.0.0",
  "imageOptimization": "Next.js Image + Sanity CDN",
  "seo": "next-seo 6.5.0"
}
```

### Development Tools
```json
{
  "testing": "Playwright 1.47.0",
  "linting": "ESLint 8.57.0",
  "typeChecking": "TypeScript strict mode",
  "analytics": "Plausible Analytics",
  "node": ">=18.18.0",
  "packageManager": "pnpm"
}
```

---

## 📁 Project Structure

```
ELYSIUM MVP/
├── app/                    # Next.js App Router (main application)
│   ├── api/               # Server-side API routes
│   │   ├── products/      # Product catalog API
│   │   ├── checkout/      # Payment processing
│   │   └── bespoke/       # Custom jewelry requests
│   ├── products/[slug]/   # Dynamic product pages
│   ├── collection/[handle]/ # Category/collection pages  
│   ├── shop/              # Main product listing
│   ├── education/         # Content marketing pages
│   └── bespoke/           # Custom jewelry consultation
├── components/            # Reusable React components
│   ├── ui/               # Core UI primitives
│   ├── sections/         # Page-level sections
│   ├── filters/          # Product filtering system
│   ├── pdp/             # Product Detail Page components
│   └── configurator/    # Product configurator components
├── lib/                  # Utility functions and business logic
│   ├── products.ts       # Product data and types (CRITICAL FILE)
│   ├── stripe/          # Payment processing logic
│   ├── sanity/          # CMS queries and schemas
│   └── utils/           # Shared utilities
├── docs/                # Comprehensive project documentation
│   ├── architecture/    # System architecture docs
│   └── business-analysis/ # Business requirements
├── types/              # TypeScript type definitions
└── public/products/    # Product images and assets (served by Next.js)
```

Notes:
- Static assets directory is `public/` (lowercase) to match Next.js and case-sensitive deployments.
- Normalized slugs used in paths:
  - `public/products/vow-and-veil/` (was `Vow and Veil`)
  - `public/products/mens-rings/` (was `mens rings`)
- Other existing product folders remain as-is (e.g., `Aveline`, `Elara`, `Seraphina`, and subfolders under `public/products/mens-rings/traditional/`). When changing any folder/file names, update all references in `lib/products.ts` and `data/products/*.images.json`.

---

## 🎨 Design System & Styling

### Brand Colors
```css
/* Luxury color palette */
--elysium-ivory: #FAF9F6
--elysium-beige: #E8E2DA  
--elysium-sand: #D6C7B4
--elysium-charcoal: #2C2C2C
--elysium-gold: #D4AF37
--elysium-pearl: #F8F6F0
--elysium-champagne: #F7F3E9
--elysium-whisper: #FEFCFA
```

### Typography
```css
/* Font system */
--font-heading: 'Cormorant Garamond', serif
--font-body: 'Inter', sans-serif
```

### Component Patterns
- **Luxury aesthetics:** Premium materials, subtle animations, elegant spacing
- **Mobile-first:** Responsive design with touch-optimized interactions
- **Performance-focused:** Optimized images, lazy loading, code splitting

---

## 💎 Product Data Structure

### Core Product Type
```typescript
// lib/products.ts - CRITICAL FILE FOR PRODUCT LOGIC
export type Product = {
  slug: string;
  title: string;
  blurb: string;           // Short description for cards
  description: string;     // Full description for PDP
  images: string[];        // Product images array
  basePriceGBP: number;   // Base price in GBP (pounds)
  metals?: MetalOption[];  // Available metals
  widths?: WidthOption[];  // For men's rings only
  origins?: OriginOption[]; // Natural/Lab Grown (engagement rings)
  carats?: CaratOption[];  // Diamond sizes
  colours?: ColourOption[]; // Diamond colors (D/E/F)
  clarities?: ClarityOption[]; // Diamond clarity
  certificates?: CertOption[]; // GIA/IGI
  sizes?: string[];        // Ring sizes
  collections?: string[];  // Product categorization
  shape?: string;          // Diamond/ring shape
  styles?: string[];       // Style attributes
  galleryByMetal?: Record<string, string[]>; // Metal-specific images
}
```

### Product Categories

#### Engagement Rings Configuration:
- **Options:** Metal, Origin, Carat, Color, Clarity, Certificate, Size
- **Price Range:** £3,200-£4,050 base price
- **Customization:** Full diamond and metal selection

#### Men's Wedding Bands Configuration:  
- **Options:** Width (3mm-8mm), Metal, Size
- **Price Range:** £1,050-£1,400 base price
- **Width Pricing:** 3mm (-£100), 4mm (-£50), 5mm (base), 6mm (+£50), 7mm (+£100), 8mm (+£150)

---

## 🔧 Key Business Logic

### Pricing Logic
```typescript
// Dynamic pricing calculation
const finalPrice = basePriceGBP + metalDelta + caratDelta + colorDelta + clarityDelta + widthDelta;
```

### Product Filtering
- **Shape-based:** Round, oval, radiant, toi-et-moi
- **Style-based:** Solitaire, trilogy, hidden-halo, vintage
- **Collection-based:** Engagement-rings, mens-rings, traditional
- **Metal-based:** Yellow gold, white gold, rose gold, platinum

### Image Management
- **Primary Images:** First image in array shown on collection pages
- **Metal-specific Images:** `galleryByMetal` object for product configurator
- **Image Optimization:** Next.js Image component with Sanity CDN

---

## 🛒 E-commerce Features

### Cart & Checkout
- **State Management:** Zustand store for cart persistence (persist to localStorage and hydrate on load)
- **Payment Processing:** Stripe Checkout integration
- **Order Flow:** Cart → Checkout → Payment → Confirmation → Email

### Product Customization
- **Real-time Pricing:** Updates as options change
- **URL State:** Shareable product configurations
- **Visual Updates:** Images change based on metal selection

### Customer Features
- **Wishlist:** Persistent across sessions
- **Recently Viewed:** Track product browsing
- **Bespoke Consultations:** Custom jewelry request form

---

## 🎯 Current Development State

### Recently Completed Features (January 2025)
1. **Product Card Hover System:** 
   - Removed test hover descriptions
   - Added concise descriptions that appear on hover
   - Ring names always visible, descriptions on hover only

2. **Men's Ring Collection Updates:**
   - Added 6 Traditional men's rings with images
   - Standardized all men's rings to 3 options: Width, Metal, Size
   - Updated image order to show silver/white gold first

3. **Image Optimization:**
   - All men's rings show silver photos first on collection pages
   - Proper image paths for traditional ring collection

### Active Patterns
- **Hover Interactions:** Product cards show name + price by default, description appears on hover
- **Metal Hierarchy:** Silver/White gold → Gold → Rose gold for display order
- **Collection Grouping:** All men's rings grouped under "mens-rings" collection

---

## 🚀 API Endpoints

### Product API
```typescript
GET /api/products
// Query params: shape, style, metal, origin, carat, color, clarity, certificate
// Returns: Filtered product array with pagination
```

### Checkout API
```typescript
POST /api/checkout
// Body: cart items, customer info
// Returns: Stripe checkout session URL
```

### Bespoke API
```typescript
POST /api/bespoke  
// Body: customer details, project requirements
// Returns: consultation request confirmation
```

---

## 🎨 Development Conventions

### File Naming
- **Components:** PascalCase (e.g., `LuxuryProductCard.tsx`)
- **Pages:** lowercase with hyphens (e.g., `[slug]/page.tsx`)
- **Utilities:** camelCase (e.g., `formatPrice.ts`)

### Component Structure
```typescript
// Standard component pattern
interface Props {
  // Props with clear types
}

export default function ComponentName({ prop }: Props) {
  // Component logic
  return (
    <div className="luxury-specific-styles">
      {/* Component JSX */}
    </div>
  );
}
```

### State Management
- **Client State:** Zustand for cart, wishlist, UI state
- **Server State:** SWR for API data caching
- **URL State:** Next.js router for shareable states

### Environment & Tooling
- **Node version:** `>=18.18.0` (pinned via `.nvmrc` / `.node-version` and `package.json engines`)
- **Package manager:** `pnpm` (use `pnpm dev`, `pnpm build`, etc.)
- **TypeScript:** `sanity/**` is excluded from typechecking unless the `sanity` package is installed.

### Assets & Paths
- **Static directory:** `public/` (lowercase). Do not use `Public/`.
- **Normalized slugs:** `vow-and-veil/`, `mens-rings/` under `public/products/`.
- **Existing traditional subfolders** keep spaces (e.g., `Traditional Flat Bevel`) and are referenced in code; update references if you change them.

### Service Worker
- Registered in production only via `components/ServiceWorkerRegistration`.
- `public/sw.js` currently avoids caching a manifest/icons until they are added; when adding a web manifest and icons, update both the SW and the app `<head>`.

---

## 🔍 AI Development Guidelines

### When Working with Products:
1. **Always check `lib/products.ts`** - Contains all product data and types
2. **Understand product categories** - Engagement rings vs men's bands have different options
3. **Respect pricing structure** - Base price + option deltas
4. **Consider mobile experience** - Luxury mobile interactions are crucial

### When Working with Components:
1. **Follow luxury design principles** - Subtle animations, premium feel
2. **Optimize for performance** - Images, lazy loading, code splitting
3. **Maintain accessibility** - WCAG 2.1 compliance
4. **Use design system** - Consistent colors, typography, spacing

### When Working with Business Logic:
1. **Test thoroughly** - High-value transactions require reliability  
2. **Consider edge cases** - Out of stock, pricing errors, payment failures
3. **Maintain data integrity** - Product configurations must be valid
4. **Follow security best practices** - PCI compliance, data protection

---

## 📞 Key Integration Points

### Stripe Integration
- **Checkout Sessions:** Server-side session creation
- **Webhooks:** Order confirmation handling
- **Error Handling:** Payment failure scenarios

### Sanity CMS
- **Product Content:** Rich text, images, SEO data
- **Schema Management:** Structured product data
- **Asset Optimization:** CDN-delivered images

### Email System (Resend)
- **Transactional Emails:** Order confirmations, bespoke inquiries
- **Template Management:** Branded email templates
- **Delivery Tracking:** Email success/failure monitoring

---

## 🚨 Critical Files for AI Agents

### Essential Files to Understand
1. **`lib/products.ts`** - All product data, types, and business logic
2. **`components/ui/LuxuryProductCard.tsx`** - Main product display component
3. **`app/products/[slug]/page.tsx`** - Product detail page structure
4. **`lib/stripe/client.ts`** - Payment processing logic
5. **`tailwind.config.ts`** - Design system configuration

### Business Logic Locations
- **Product Filtering:** `lib/applyFilters.ts`
- **Price Calculation:** Inline in product components
- **Cart Management:** Zustand stores in `lib/state/`
- **URL State Management:** `lib/urlState.ts`

---

## 🎯 Common AI Tasks & Guidance

### Adding New Products
1. Update `lib/products.ts` with new product object
2. Add product images to `public/products/` directory
3. Ensure proper collection tags and categorization
4. Test product page rendering and configurator

### Modifying Product Options
1. Update product type definitions if needed
2. Modify individual product objects in products array
3. Update filtering logic if new option types added
4. Test price calculations with new options

### UI/UX Changes
1. Maintain luxury brand aesthetic
2. Ensure mobile responsiveness
3. Test hover states and interactions
4. Validate accessibility compliance

### Performance Optimization
1. Check image optimization and lazy loading
2. Verify code splitting and bundle size
3. Monitor Core Web Vitals impact
4. Test on mobile devices

---

## 📚 Additional Documentation

For more detailed information, refer to:
- **`docs/architecture/system-architecture.md`** - Complete technical architecture
- **`docs/architecture/api-documentation.md`** - Detailed API specifications  
- **`docs/business-analysis/`** - Business requirements and analysis
- **`README.md`** - Quick setup and development guide

---

*This AI context file should be updated whenever significant changes are made to the project structure, business logic, or development patterns.*

---

## ⚠️ Data Model Alignment (Important for Agents)

There are two product models in the repo used by different layers:

- `lib/products.ts` (authoritative for the current frontend)
  - `images: string[]` (file paths under `public/`)
  - `basePriceGBP: number` in pounds (e.g., 3350 = £3,350)
  - Rich option fields (metals/origins/carat/clarity/etc.)

- `types/product.ts` (legacy/future CMS shape)
  - `images: { url: string; alt?: string }[]`
  - `basePriceGBP` comment suggests pence; this is not used by the current UI

Guidelines:
- Do not mix the two models in a single component. Prefer `lib/products.Product` for UI and PDP.
- When adding SEO JSON‑LD or search features, map from `lib/products` and resolve image URLs directly.
- Treat UI pricing as GBP (pounds). Only convert to pence at Stripe boundaries.

---

## 🧭 Frontend Implementation Notes (MVP Blocking)

### Cart Store Conventions
- Store prices in the cart as pence (integer) to avoid float errors.
- Compose a stable `id` for line items from `slug + serialized options` so duplicate selections increment quantity.
- Persist cart state to `localStorage`; hydrate in a client effect. Example pattern:
  - On init: read `localStorage['ely:cart']` → `set({ items })`
  - On change: subscribe to store and write back to `localStorage`

### PDP Add‑to‑Cart Wiring
- Implement `handleAddToBag` in `components/products/ProductDetail.tsx` to push a normalized `CartItem` to the store with:
  - `id`, `title`, `price` (in pence), `variantLabel` (metal/carat/size), `quantity`
- Wire the Premium Configurator “Add to Cart” to the same action.

### Header Cart Badge
- Replace hardcoded counts with `useCartStore((s)=>s.items.length)` in `components/ui/LuxuryHeader.tsx`.

### SEO JSON‑LD Conventions
- Use `lib/products.Product` as source:
  - `image`: array of image URLs (strings)
  - `offers.priceCurrency`: `GBP`, `offers.price`: `basePriceGBP.toFixed(2)`
- Breadcrumbs: `/products` → `/products/[slug]` (not `/shop` or `/product`)

### Search Field Alignment
- `components/ui/SearchBar.tsx` should reference `lib/products` fields:
  - Use `title`, `description`, `styles`, `shape`, `metals` (names) instead of `product.metal/style` single strings.

### Bespoke Form Hardening
- Add client‑side validation (name min length, email pattern, file size/type guards) and error UI.
- Add anti‑spam (e.g., Cloudflare Turnstile) and include token in `/api/bespoke` requests.

---

## 🧾 Currency & Units

- Display and UI logic: GBP (pounds) everywhere in the frontend.
- Cart state: store `price` per line in pence (integer).
- Stripe: send `unit_amount` in pence; convert server‑side in `/api/checkout`.

These rules avoid contradictions across UI, cart, and payment layers.
