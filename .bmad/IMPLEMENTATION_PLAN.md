# ELYSIUM MVP - Detailed Implementation Plan
**Date:** December 7, 2025
**Status:** Plan Mode - Ready for Approval

---

## Executive Summary

This plan addresses the remaining 62 hours of work identified from client meeting notes and screenshot analysis. The implementation is structured into 3 phases with clear dependencies, focusing on high-visibility quick wins first, then complex product configurator work, and finally checkout flow logic.

**Total Estimated Effort:** ~62 hours
**Recommended Timeline:** 3-4 weeks (15-20 hours/week)
**Phase 1 (Quick Wins):** 6 hours
**Phase 2 (Product Configurator):** 18 hours
**Phase 3 (Checkout & Advanced):** 38 hours

---

## Current State Analysis

### ✅ Recently Completed (Today)
1. Color scheme migrated from black to brown (#6D3D0D)
2. All gradients removed from UI components
3. Shape icons replaced with premium SVG icons
4. Collection selector added to filters
5. Cart icon upgraded to shopping cart graphic
6. Diamond dropdown click-outside handler fixed
7. Homepage logo visibility logic implemented

### ⚠️ Critical Issues Identified
1. **Hero Section:** Missing scroll button, badges in wrong position, buttons need text-only styling
2. **Product Configurator:** Not following client specs (horizontal metal layout, combined diamond selectors)
3. **Defaults Not Set:** No default values for lab diamonds (1ct, F, VS1, IGI)
4. **Natural Diamonds:** Still showing prices (should require inquiry only)

---

## Architecture Analysis

### Current Product Data Structure
**File:** `lib/products.ts`

```typescript
export type Product = {
  slug: string;
  title: string;
  basePriceGBP: number;
  metals?: MetalOption[];
  origins?: OriginOption[];  // Natural vs Lab Grown
  carats?: CaratOption[];
  colours?: ColourOption[];  // D, E, F
  clarities?: ClarityOption[]; // IF, VVS1, VVS2, VS1
  certificates?: CertOption[];  // GIA, IGI
  // ... more fields
}
```

### Current Configurator Flow
**Files:**
- `components/products/ProductDetail.tsx` - Container component
- `components/products/ProductVariants.tsx` - Individual selectors (currently 2x2 grid for metals, separate sections for each diamond attribute)
- `components/configurator/LuxuryProductConfigurator.tsx` - Alternative premium configurator (currently not used)

**Current Issues:**
- Metal layout: 2x2 grid (should be: 3 horizontal)
- Diamond specs: Separate selectors (should be: combined dropdown)
- Defaults: Using array indices (should be: conditional logic based on origin)
- Certificate: Separate selector (should be: description asterisk only)

---

## PHASE 1: Quick Wins (6 hours)
**Goal:** High-visibility improvements with minimal complexity
**Timeline:** Week 1 (Days 1-2)

### Task 1.1: Hero Section Updates (2 hours)
**File:** `components/sections/LuxuryHero.tsx`

**Changes Required:**

1. **Modify scroll button to target Featured Collection** (30 min)
   - Current: `onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}`
   - Change to: `onClick={() => document.getElementById('featured-collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}`
   - Add `id="featured-collection"` to Featured Collection section in `app/page.tsx` line 58

2. **Move reassurance badges below buttons** (30 min)
   - Current structure: Buttons → Trust Indicators (lines 78-120)
   - New structure: Buttons → Trust Indicators below buttons
   - Move trust indicators div (lines 99-120) to appear after button container but before closing of parent div
   - Add margin-top to trust indicators for spacing

3. **Convert buttons to text-only luxury style** (1 hour)
   - **Current buttons** (lines 80-95):
     - "Explore Collection": Has border, glassmorphism background
     - "Bespoke Design": Has border, backdrop-blur
   - **New luxury text-only style:**
     ```tsx
     <Link
       href="/shop"
       className="group relative px-6 py-2 text-white text-sm font-light tracking-[0.15em] uppercase transition-all duration-300 hover:text-elysium-gold"
     >
       <span className="relative z-10">Explore Collection</span>
       <span className="absolute bottom-0 left-0 w-0 h-px bg-elysium-gold transition-all duration-500 group-hover:w-full" />
     </Link>
     ```
   - Remove all borders, backgrounds, rounded corners
   - Use only underline animation on hover
   - Keep text white, hover to gold
   - Primary CTA slightly larger font weight

**Testing Checklist:**
- [ ] Scroll button takes user to Featured Collection section
- [ ] Trust badges appear below buttons with proper spacing
- [ ] Buttons have no backgrounds/borders, only text
- [ ] Hover state shows gold underline animation
- [ ] Mobile responsive layout maintained

---

### Task 1.2: Header Consolidation (1 hour)
**Files:** `components/ui/Header.tsx`, `components/ui/LuxuryHeader.tsx`, `app/layout.tsx`

**Problem:** Two header components exist, causing inconsistency

**Decision:** Keep `Header.tsx` (simpler, already has logo visibility logic working)

**Implementation:**
1. Check which header is being used in `app/layout.tsx`
2. Remove unused header component file
3. Update imports across all pages
4. Verify navigation links match requirements
5. Ensure diamond dropdown works with chosen header

**Testing Checklist:**
- [ ] Single header used sitewide
- [ ] Logo visibility works on homepage
- [ ] Diamond dropdown functional
- [ ] All navigation links working

---

### Task 1.3: Footer Optimization (3 hours)
**File:** `components/ui/Footer.tsx` (needs to be found or created)

**Client Requirements:**
- Compress height
- Layout: Quick Links (left) | Story (center) | Stay Updated (right)
- Add social media handles
- Keep everything visually central

**Implementation:**
1. Find existing footer component
2. Redesign layout to 3-column grid
3. Reduce padding/margin to compress height
4. Add social media icon links (placeholders for now)
5. Apply brown/gold color scheme
6. Ensure mobile responsive (stack vertically)

**Testing Checklist:**
- [ ] Footer height reduced significantly
- [ ] 3-column layout on desktop
- [ ] Mobile stacks properly
- [ ] Social media placeholder links present
- [ ] Brown/gold colors applied

---

## PHASE 2: Product Configurator Overhaul (18 hours)
**Goal:** Align product pages with client specifications
**Timeline:** Week 2-3

### Task 2.1: Metal Layout Compression (3 hours)
**File:** `components/products/ProductVariants.tsx` lines 52-94

**Current:** 2x2 grid layout
```tsx
<div className="grid grid-cols-2 gap-3">
```

**New:** Horizontal layout with priority ordering
```tsx
<div className="flex flex-wrap gap-2 justify-start">
  {/* First 3 metals horizontally */}
  {/* Then two-tone */}
  {/* Then platinum last */}
</div>
```

**Implementation Details:**

1. **Reorder metals array in product data** (1 hour)
   - Engagement rings: [18k Yellow, 18k White, 18k Rose, Two-Tone, Platinum]
   - Men's bands: [Platinum, 18k White, 18k Yellow, 18k Rose, Two-Tone]

2. **Update metal selector UI** (1.5 hours)
   - Change from grid to flex layout
   - Reduce button size (smaller padding: `px-3 py-2` instead of `p-4`)
   - Show metal swatch and name inline
   - Make buttons more compact
   - Remove unnecessary text (just show metal name + swatch)

3. **Add default logic** (30 min)
   - Engagement rings: Default to 18k Yellow (index 0)
   - Men's bands: Default to Platinum (index 0)
   - Update `ProductDetail.tsx` line 24: Conditional based on product.collections

**New Component Structure:**
```tsx
<div className="flex flex-wrap gap-2">
  {product.metals.slice(0, 3).map((metal) => (
    <button className="px-3 py-2 flex items-center gap-2 ...">
      <div className="w-4 h-4 rounded-full" style={{backgroundColor: metal.hex}} />
      <span className="text-xs">{metal.name}</span>
    </button>
  ))}
  {/* Two-tone if exists */}
  {product.metals.find(m => m.name.includes('Two-Tone')) && ...}
  {/* Platinum last if not in first 3 */}
  {product.metals.find(m => m.name === 'Platinum') && ...}
</div>
```

**Testing Checklist:**
- [ ] Metals display horizontally (3 max per row)
- [ ] Engagement rings default to yellow gold
- [ ] Men's bands default to platinum
- [ ] Two-tone appears after first 3
- [ ] Platinum appears last
- [ ] Mobile wraps properly

---

### Task 2.2: Combined Diamond Specs Selector (8 hours)
**File:** `components/products/ProductVariants.tsx` lines 122-198

**Current:** Separate sections for Carat, Colour, Clarity, Certificate
**New:** Single dropdown selector combining all specs (like Taj Jewels)

**Approach:** Create new `DiamondSpecsSelector` component

**New Component:** `components/products/DiamondSpecsSelector.tsx`

```tsx
interface DiamondSpec {
  carat: string;
  colour: string;
  clarity: string;
  certificate: string;
  priceGBP: number;
  available: boolean;
}

export function DiamondSpecsSelector({
  specs,
  selected,
  onSelect,
  origin // 'Natural' or 'Lab Grown'
}: Props) {
  return (
    <div>
      <h3>Diamond Specifications</h3>
      <select className="luxury-dropdown" value={selected} onChange={onSelect}>
        {specs.map(spec => (
          <option key={spec.id} value={spec.id}>
            {spec.carat}ct | {spec.colour} | {spec.clarity} | {spec.certificate} - £{spec.priceGBP.toLocaleString()}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-2">
        * All diamonds certified by {origin === 'Natural' ? 'GIA' : 'IGI'}
      </p>
    </div>
  );
}
```

**Implementation Steps:**

1. **Create diamond combinations** (3 hours)
   - Generate all valid combinations of carat/colour/clarity for given origin
   - Filter out invalid combinations (e.g., IF for lab diamonds)
   - Calculate price for each combination
   - Create dropdown options

2. **Update product data structure** (2 hours)
   - Instead of separate arrays, create combined specs
   - Add helper function to generate specs from ranges
   - Store in product definition or generate on-the-fly

3. **Replace individual selectors** (2 hours)
   - Remove Carat, Colour, Clarity, Certificate sections from ProductVariants
   - Add new DiamondSpecsSelector component
   - Update state management in ProductDetail
   - Handle selection changes

4. **Add certificate description** (1 hour)
   - Remove certificate selector
   - Add asterisk note below dropdown showing cert type
   - Update description text based on origin

**Data Structure Change:**
```typescript
// OLD (separate arrays)
carats: [{ label: '1ct', carat: 1, priceDeltaGBP: 0 }, ...]
colours: [{ label: 'D', priceDeltaGBP: 0 }, ...]
clarities: [{ label: 'VS1', priceDeltaGBP: 0 }, ...]

// NEW (combined specs)
diamondSpecs: [
  {
    id: '1ct-F-VS1-IGI',
    carat: 1.0,
    colour: 'F',
    clarity: 'VS1',
    certificate: 'IGI',
    priceDeltaGBP: 0,
    origin: 'Lab Grown'
  },
  // ... more combinations
]
```

**Testing Checklist:**
- [ ] Single dropdown shows all diamond specs
- [ ] Format: "1.0ct | F | VS1 | IGI - £3,500"
- [ ] Certificate note appears below dropdown
- [ ] IF clarity hidden for lab diamonds
- [ ] Price updates correctly on selection
- [ ] Default selected properly

---

### Task 2.3: Set Defaults & Natural Diamond Logic (4 hours)
**Files:** `components/products/ProductDetail.tsx`, product data

**Requirements:**
- Lab diamonds: Default to 1ct, F color, VS1 clarity, IGI certificate
- Natural diamonds: Require inquiry, no prices shown, GIA certificate

**Implementation:**

1. **Update default selection logic** (1 hour)
   - File: `ProductDetail.tsx` lines 24-30
   - Current: Uses array indices `[0]`, `[1]`, `[2]`
   - New: Conditional logic based on selected origin

   ```tsx
   const getDefaultDiamondSpec = (origin: 'Natural' | 'Lab Grown') => {
     if (origin === 'Lab Grown') {
       // Find spec matching: 1.0ct, F, VS1, IGI
       return product.diamondSpecs?.find(spec =>
         spec.carat === 1.0 &&
         spec.colour === 'F' &&
         spec.clarity === 'VS1' &&
         spec.certificate === 'IGI'
       );
     } else {
       // Natural diamonds: no default, show inquiry message
       return null;
     }
   };
   ```

2. **Natural diamond inquiry flow** (2 hours)
   - Hide price display when origin is 'Natural'
   - Replace "Add to Bag" with "Request Consultation" button
   - Show message: "Natural GIA-certified diamonds available by consultation only"
   - Create inquiry modal/form (basic version)
   - Capture: name, email, desired specs

3. **Remove IF clarity for labs** (30 min)
   - Filter out IF option when generating lab diamond specs
   - Keep IF available for natural diamonds
   - Update product data generation logic

4. **Test all combinations** (30 min)
   - Lab + default → 1ct F VS1 IGI
   - Natural → No price, inquiry button
   - Switch origin → Defaults update
   - IF only shows for natural

**Testing Checklist:**
- [ ] Lab diamonds default to 1ct F VS1 IGI
- [ ] Natural diamonds show "Request Consultation"
- [ ] No prices shown for natural diamonds
- [ ] IF clarity not available for lab diamonds
- [ ] Switching origin updates defaults correctly

---

### Task 2.4: Reduce Visual Clutter (3 hours)
**Files:** `ProductVariants.tsx`, `SelectCard.tsx`, global CSS

**Requirements:**
- Make option bubbles smaller
- Reduce negative space
- Align descriptions
- Ensure font consistency

**Implementation:**

1. **Reduce button/selector sizes** (1 hour)
   - Padding: `p-4` → `px-3 py-2`
   - Font sizes: `text-sm` → `text-xs`
   - Gap spacing: `gap-3` → `gap-2`
   - Border width: `border-2` → `border`

2. **Tighten spacing between sections** (1 hour)
   - Section spacing: `space-y-8` → `space-y-6`
   - Heading margins: `mb-4` → `mb-3`
   - Overall container: review padding

3. **Align text and elements** (1 hour)
   - Ensure all labels use same font-serif
   - Standardize tracking values
   - Align button text consistently
   - Review text colors (all should be brown when active, gray when not)

**Testing Checklist:**
- [ ] Options appear more compact
- [ ] No excessive whitespace
- [ ] Text alignment consistent
- [ ] Fonts match site style
- [ ] Still readable and accessible

---

## PHASE 3: Checkout & Advanced Features (38 hours)
**Goal:** Implement "meeting in the middle" checkout and advanced features
**Timeline:** Week 3-4

### Task 3.1: "Meeting in the Middle" Checkout Flow (12 hours)

**Requirements:**
- Allow checkout for bare-minimum configuration (VS1/VS2, F color, defined carat)
- Route higher specifications to consultation
- Auto-email client within 24 hours
- Preserve retention and enable upsell

**Implementation:**

1. **Define specification thresholds** (1 hour)
   ```typescript
   const CHECKOUT_THRESHOLDS = {
     carat: { min: 0.5, max: 2.0 },      // Can checkout: 0.5-2.0ct
     colour: ['D', 'E', 'F'],             // Can checkout: D, E, F
     clarity: ['VS1', 'VS2'],             // Can checkout: VS1, VS2 only
     // Above these = consultation required
   };
   ```

2. **Create checkout eligibility checker** (2 hours)
   - File: `lib/checkoutEligibility.ts`
   - Function checks if current config meets thresholds
   - Returns: { canCheckout: boolean, reason?: string }
   - Shows modal if consultation required

3. **Build consultation request flow** (4 hours)
   - Create consultation modal component
   - Capture: customer info + desired specs + budget
   - Store in database or send email
   - Show confirmation message
   - Email notification to client

4. **Implement email automation** (3 hours)
   - Set up email service (Resend, SendGrid, or Nodemailer)
   - Create email template for consultation requests
   - Send to client email within 1 hour (not 24)
   - Include all customer details and specs
   - Add follow-up reminder system

5. **Update Add to Bag logic** (2 hours)
   - Check eligibility before adding
   - If eligible: add to cart normally
   - If not eligible: show consultation modal
   - Track in analytics

**Testing Checklist:**
- [ ] VS1/VS2 + F + 1ct can checkout directly
- [ ] VVS1 or above triggers consultation
- [ ] D/E color triggers consultation
- [ ] Above 2ct triggers consultation
- [ ] Email sent to client within 1 hour
- [ ] Customer receives confirmation

---

### Task 3.2: Ring Size Guide Enhancement (4 hours)

**Requirements:**
- Add visible "I don't know" button
- Route to guidance or contact client
- Make more prominent

**Implementation:**

1. **Update RingSizeGuide component** (2 hours)
   - Add "I Don't Know My Size" button prominently
   - Create size guide modal with measurement instructions
   - Add option to request ring sizer by mail
   - Link to contact form

2. **Create ring sizer request form** (2 hours)
   - Simple form: name, address, email
   - Store request in database
   - Email notification to client
   - Confirmation message to customer

**Testing Checklist:**
- [ ] "I Don't Know" button visible
- [ ] Size guide modal opens
- [ ] Ring sizer request form works
- [ ] Email sent to client
- [ ] User sees confirmation

---

### Task 3.3: Search & Collections Behavior (4 hours)

**Requirements:**
- Search returns: solitaire, shapes, collections
- Fix recently viewed image loading
- Fix collection display issues

**Implementation:**

1. **Enhance search functionality** (2 hours)
   - Add search to products, collections, shapes
   - Create search index
   - Implement fuzzy matching
   - Show categorized results

2. **Fix recently viewed** (1 hour)
   - Debug image loading issues
   - Ensure proper image paths
   - Add fallback images

3. **Fix collection pages** (1 hour)
   - Verify collection filtering
   - Fix any display issues
   - Test all collection routes

**Testing Checklist:**
- [ ] Search finds products by name
- [ ] Search finds shapes (round, oval, etc.)
- [ ] Search finds collections
- [ ] Recently viewed shows images
- [ ] Collection pages display properly

---

### Task 3.4: Footer Final Implementation (2 hours)

**Deferred from Phase 1 - final polish**

- Add real social media links (from client)
- Add company registration details
- Add legal links (privacy, terms)
- Final styling polish

---

### Task 3.5: Wishlist & Retention Flows (8 hours)

**Requirements:**
- Email reminders for wishlist (within 7 days)
- Abandoned cart emails
- Limited-time promotions (10% after 2 weeks)

**Implementation:**

1. **Set up email service** (2 hours)
   - Configure Resend/SendGrid
   - Create email templates
   - Set up cron jobs or background workers

2. **Wishlist reminder system** (3 hours)
   - Track wishlist items with timestamps
   - Send reminder after 7 days
   - Include product images and links
   - Track opens and clicks

3. **Abandoned cart recovery** (3 hours)
   - Detect cart abandonment (30 min inactivity)
   - Send first email after 1 hour
   - Send second email after 24 hours
   - Offer 10% discount after 2 weeks

**Testing Checklist:**
- [ ] Wishlist emails sent after 7 days
- [ ] Cart abandonment detected
- [ ] Recovery emails sent on schedule
- [ ] Discount codes work
- [ ] Email templates look good

---

### Task 3.6: Partner Discount Logic (4 hours)

**Requirements:**
- Discount code option
- Auto 10% off for partner Instagram handles
- Apply during consultation or checkout

**Implementation:**

1. **Create discount code system** (2 hours)
   - Add discount code input to checkout
   - Validate codes against database
   - Apply discount to total
   - Track usage

2. **Partner handle recognition** (2 hours)
   - List of approved partner handles
   - Auto-detect during consultation form
   - Apply 10% discount automatically
   - Store partnership source

**Testing Checklist:**
- [ ] Discount codes validate
- [ ] Partner handles recognized
- [ ] 10% discount applied correctly
- [ ] Tracking works

---

### Task 3.7: Admin Dashboard (4 hours - MVP version)

**Requirements:**
- View orders
- Track timelines
- See abandonment points

**Implementation:**

1. **Create basic admin page** (2 hours)
   - Protected route (/admin)
   - Authentication required
   - List recent orders
   - Show key metrics

2. **Add analytics** (2 hours)
   - Track page views
   - Track product views
   - Track cart additions
   - Track abandonments
   - Display in dashboard

**Testing Checklist:**
- [ ] Admin page accessible
- [ ] Orders display
- [ ] Metrics show correctly
- [ ] Data updates in real-time

---

## DEPENDENCIES & CONSTRAINTS

### Technical Dependencies
1. **Email Service** - Required for Phase 3 (consultation, retention flows)
   - Recommendation: Resend (modern, easy to use)
   - Alternative: SendGrid, AWS SES
   - Setup time: ~1 hour

2. **Database** - Currently using in-memory state
   - Need persistent storage for: orders, consultations, wishlists
   - Recommendation: PostgreSQL with Prisma
   - Migration time: ~4 hours (outside this plan)

3. **Authentication** - For admin dashboard
   - Recommendation: NextAuth.js
   - Setup time: ~2 hours (outside this plan)

### Client Dependencies
1. **Content Requirements:**
   - Social media handles
   - Company registration details
   - Partner vendor Instagram handles
   - Email preferences (which address to use)

2. **Design Assets:**
   - Ring images by shape/metal (some still missing based on client notes)
   - Corrected Radiant shape imagery
   - Brand PDFs (letter, thank you card)

3. **Business Decisions:**
   - Final pricing for all diamond specs
   - Exact thresholds for "meeting in the middle"
   - Discount percentage for partners
   - Email copy approval

---

## RISK MITIGATION

### High Risk Areas

1. **Product Configurator Overhaul (Phase 2.2)**
   - **Risk:** Breaking existing functionality
   - **Mitigation:**
     - Create feature branch
     - Keep old selectors as fallback
     - Comprehensive testing before merge
     - Deploy to staging first

2. **Checkout Flow Logic (Phase 3.1)**
   - **Risk:** Complex business rules, edge cases
   - **Mitigation:**
     - Document all rules clearly
     - Create decision tree diagram
     - Write comprehensive tests
     - Get client approval on thresholds first

3. **Email Automation (Phase 3)**
   - **Risk:** Emails to spam, deliverability issues
   - **Mitigation:**
     - Use reputable email service
     - Set up SPF, DKIM, DMARC records
     - Test thoroughly before going live
     - Start with small batch

### Medium Risk Areas

1. **Data Migration**
   - Current product data needs restructuring
   - Create migration scripts
   - Backup all data first

2. **Performance**
   - Combined diamond specs = large dropdown
   - Implement virtualization if >100 options
   - Consider pagination or search

3. **Mobile Responsiveness**
   - Horizontal metal layout may wrap awkwardly
   - Test on multiple screen sizes
   - Adjust breakpoints as needed

---

## TESTING STRATEGY

### Unit Tests
- Product data transformation functions
- Checkout eligibility checker
- Price calculation logic
- Discount code validation

### Integration Tests
- Full configurator flow
- Add to cart flow
- Checkout to consultation flow
- Email sending

### E2E Tests (Playwright)
- Homepage to product to cart
- Configure ring and checkout
- Consultation request flow
- Search and filter

### Manual Testing Checklist
- [ ] All pages render correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cross-browser (Chrome, Safari, Firefox)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Performance (Lighthouse score >90)

---

## DEPLOYMENT STRATEGY

### Phase 1 Deployment
- Low risk, visual changes only
- Can deploy independently
- Deploy to production immediately after testing

### Phase 2 Deployment
- Medium risk, significant changes
- Deploy to staging first
- Get client approval
- Deploy to production after 48hr soak test

### Phase 3 Deployment
- High risk, business logic changes
- Phased rollout:
  1. Deploy consultation flow only
  2. Test for 1 week
  3. Deploy email automation
  4. Test for 1 week
  5. Deploy retention flows

### Rollback Plan
- Keep previous version tagged
- Monitor error rates after each deployment
- Have one-click rollback prepared
- Document rollback procedures

---

## SUCCESS METRICS

### Phase 1 Metrics
- [ ] Hero scroll button click rate >20%
- [ ] Button click-through rate maintained or improved
- [ ] No increase in bounce rate
- [ ] Page load time <2s

### Phase 2 Metrics
- [ ] Configuration completion rate >70%
- [ ] Add to cart rate >15%
- [ ] Time to configure <3 minutes
- [ ] Mobile configuration rate >40%

### Phase 3 Metrics
- [ ] Consultation request rate >5%
- [ ] Email open rate >25%
- [ ] Cart recovery rate >10%
- [ ] Wishlist conversion rate >8%

---

## NEXT STEPS

### Immediate Actions (Before Starting Implementation)

1. **Get Client Approval** on this plan
2. **Prioritize** any features they want sooner
3. **Confirm** all business rules and thresholds
4. **Collect** all missing content (social media, partner handles, etc.)
5. **Set up** development environment (branch strategy, staging environment)

### Phase 1 Kickoff (When Ready)
1. Create feature branch: `feature/hero-improvements`
2. Start with Task 1.1 (Hero Section)
3. Test locally with Playwright
4. Get client review
5. Deploy to staging
6. Deploy to production

### Communication Plan
- **Daily:** Update client on progress via Slack/email
- **Weekly:** Demo session showing completed work
- **After each phase:** Get formal approval before proceeding
- **Issues:** Flag blockers immediately, don't wait

---

## APPENDIX

### A. File Structure Changes
```
components/
├── products/
│   ├── ProductDetail.tsx (modify)
│   ├── ProductVariants.tsx (major refactor)
│   └── DiamondSpecsSelector.tsx (NEW)
├── checkout/
│   ├── CheckoutEligibility.tsx (NEW)
│   └── ConsultationModal.tsx (NEW)
├── sections/
│   └── LuxuryHero.tsx (modify)
└── ui/
    ├── Header.tsx (keep)
    ├── LuxuryHeader.tsx (DELETE)
    └── Footer.tsx (modify)

lib/
├── checkoutEligibility.ts (NEW)
├── emailService.ts (NEW)
└── products.ts (modify data structure)
```

### B. Environment Variables Needed
```env
# Email Service
RESEND_API_KEY=
FROM_EMAIL=

# Admin
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=

# Stripe (if not already set)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# Database (if migrating)
DATABASE_URL=
```

### C. Client Approval Checklist
Before starting implementation, get client approval on:
- [ ] 3-phase timeline (3-4 weeks)
- [ ] Phase 1 priorities (hero, header, footer)
- [ ] Phase 2 configurator changes (horizontal metals, combined dropdown)
- [ ] Phase 3 checkout thresholds (VS1/VS2, F, 0.5-2ct)
- [ ] Email automation approach
- [ ] Budget for email service (~$10-50/month)
- [ ] Staging environment access for testing

---

**END OF PLAN**

Ready for approval and implementation. Awaiting client feedback and green light to proceed.
