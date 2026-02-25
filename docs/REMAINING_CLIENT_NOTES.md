# Remaining Work from Client Notes

**Source:** IMPLEMENTATION_PLAN, IMPLEMENTATION_STATUS, planning docs  
**Last updated:** Jan 2025

---

## ✅ Already done (recent + plan)

- **Design system:** Brown (#6D3D0D), gold hovers, no gradients, cart icon, etc.
- **Meet in the middle:** Buy Now (entry-level) / Enquire (upgrades + natural), defaults 1ct/F/VS1/Lab, no IF for labs, no certificate selector, natural = inquiry only.
- **Engraving:** "Complimentary Engraving" copy in place (CompactProductVariants). *Note: £15 fee still in product data; plan says remove fee.*
- **Ring size:** "I don't know my size" exists; RingSizeGuide linked. *Plan also wants it to route to contact/consultation.*
- **Hero:** Scroll-down "Discover" → `#featured-collection` exists (LuxuryHero).
- **Filters:** Category, Shape, Collection, Metal in Shop. Earrings/Bracelets groups, QuickShopChips.
- **Earrings:** Crown, Essence, Eternal, Heirloom, Icon, Legacy, Pure, Refined, Timeless; Fine Jewellery mix on homepage.
- **Classic 4 Claw Tennis Bracelet:** Carat 2–7ct, Length 6"–7.5", metals 18k Y/R/W; PDP shows "Length" for bracelets.
- **Product defaults:** Engagement → Yellow Gold; Men's → Platinum (ProductDetail).
- **Legal, education, etc.:** Per acceptance criteria.

---

## 🔴 High priority (client notes – we can do)

### 1. Inquiry system (Week 2)

- [ ] **Inquiry form** for upgrades/natural: product slug, carat/colour/clarity/metal, contact, engraving if applicable.
- [ ] **Automated email** to client within 24h on submit.
- [ ] **Save to DB:** use BespokeLead (or similar); add to admin for tracking.
- [ ] **Enquire** currently links to `/contact`. Form should either live on PDP or pre-fill context (product + config) when coming from "Enquire".

### 2. Product page compression (Week 2)

- [ ] **Metal layout:** Horizontal — Row 1: 18k Yellow | White | Rose; Row 2: Two-Tone; Row 3: Platinum.
- [ ] **Single diamond selector:** Combine carat/colour/clarity (Taj-style) instead of separate controls.
- [ ] **Reduce** bubble sizes, negative space; **uniform** fonts.

### 3. Engraving update (Week 2)

- [ ] **Remove £15 engraving fee** from product data (or force to 0 for "Complimentary").
- [ ] **Keep** "Complimentary Engraving (Optional)" and character limit.

### 4. Ring sizing (Week 2)

- [ ] **"I don't know"** explicitly **link to Ring Size Guide** and/or **route to contact** / consultation (per plan).
- [ ] Confirm behaviour with client.

---

## 🟠 Medium priority (client notes)

### 5. Homepage hero (Week 1)

- [ ] **Remove top-left logo** (if still present).
- [ ] **Keep** logo centered above hands.
- [ ] **Single scroll-down** → featured collection (partially done; verify placement and UX).
- [ ] **Move** reassurance badges **below** "Discover" (or primary CTA).
- [ ] **Convert** hero buttons to **text-only** luxury style (no solid backgrounds).

### 6. Catalog & taxonomy (Week 3)

- [ ] **Shape filter:** Ensure all shapes covered; multi-shape products in all relevant shape filters.
- [ ] **Collection filter:** Taxonomy (Signature, Trilogy, etc.) and link to collection pages.
- [ ] **Shape icons:** Correct Radiant / Marquise; client to provide final icons if needed.
- [ ] **Search:** Shapes, collections, "Solitaire", product names; fix "Recently Viewed" images if broken; fix collection display issues.

### 7. Footer (Phase 3)

- [ ] **Compress** height.
- [ ] **Layout:** Quick Links (left) | Story (center) | Stay Updated (right).
- [ ] **Add** social handles, registered company details.

### 8. Education & content

- [ ] **Ring size guide** with clear **"I don't know"** entry point (and link to contact if agreed).
- [ ] **Replace** emoji placeholders with professional icons where still used.
- [ ] **Story / About, NHS Heroes, warranty, resizing, lifetime care:** client to provide copy; we integrate.

---

## 🟡 Client / external dependency

### 9. Payments & checkout

- [ ] **Stripe:** Client creates account, provides API keys; we complete integration and webhooks.
- [ ] **Klarna** (high priority).
- [ ] **Apple Pay** (high priority).
- [ ] **Discount codes:** field at checkout; 10% partner codes; track by partner handle.

### 10. Admin dashboard

- [ ] **Orders:** Filters (status, date, value), order detail, timeline, CRM-style view.
- [ ] **Inquiries:** List and track upgrade/natural inquiries (from new form + BespokeLead).
- [ ] **Analytics:** Page views, conversions; abandonment (cart, wishlist).

### 11. Domain & launch

- [ ] **GoDaddy** credentials; link dev → domain for preview.
- [ ] **Pre-launch:** Full checkout test (£1), all key flows, email and discount checks.

---

## 🔵 Phase 2+ (later)

- **Abandoned cart emails** (Day 1, 7, 14).
- **Wishlist reminders.**
- **Post-purchase emails** (confirmation, shipping, delivery, review).
- **Packaging** choice at checkout (branded vs discreet).
- **SEO** strategy, schema, technical audit.
- **Performance:** WebP, lazy loading, Lighthouse > 90.
- **Mobile:** Touch targets, configurator optimisation, payment testing on devices.

---

## Suggested order to tackle next

1. **Engraving:** Remove fee, keep "Complimentary" + limit (quick).
2. **Inquiry form + email + DB:** Enquire from PDP → form → 24h email → admin (unblocks launch).
3. **Product page:** Metal rows + single diamond selector + reduce clutter (big UX win).
4. **Ring size "I don't know":** Link to guide + contact/consultation.
5. **Hero:** Logo, badges, text-only buttons (align with client visuals).
6. **Footer:** Layout, links, company details, social.

---

*Sync with `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_STATUS.md` as you complete items.*
