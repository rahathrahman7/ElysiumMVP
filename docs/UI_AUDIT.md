# ELYSIUM MVP — UI Audit

**Date:** February 12, 2025  
**Scope:** Visual design consistency, design tokens, typography, components, and layout

---

## Executive Summary

The ELYSIUM MVP has a strong luxury brown-and-gold aesthetic, but several inconsistencies across color tokens, typography, and component styling reduce visual cohesion and maintainability. This audit identifies issues and recommends fixes.

---

## 1. Color System Inconsistencies

### 1.1 Conflicting Brown Shades

| Location | Value | Usage |
|----------|-------|-------|
| `globals.css` `--elysium-brown` | `#6D3D0D` | Primary brown |
| `tailwind.config.ts` `elysium-brown` | `#753600` | Different brown |
| `tailwind.config.ts` `charcoal` | `#753600` | Same as above |
| `LuxuryHeader.tsx` | `#45321e` | Yet another brown |
| `ProductVariants.tsx` | `#45321e` | Same as header |
| `LuxuryProductCard.tsx` badge | `#45321e` | Same as header |
| `StickySummary.tsx` | `#753600` | Different from globals |

**Impact:** Three distinct browns appear across the site, causing visual inconsistency.

**Recommendation:** Standardize on `#6D3D0D` (from `globals.css`) as the canonical brown. Update `tailwind.config.ts` and all hardcoded hex values to use CSS variables or tokens.

### 1.2 Hardcoded Hex vs Design Tokens

Components use a mix of:
- Hardcoded hex: `#6D3D0D`, `#D4AF37`, `#E8E2DA`, `#FAF7F2`, `#45321e`
- Tailwind tokens: `elysium-brown`, `elysium-gold`, `charcoal`
- CSS variables: `var(--elysium-brown)`, `var(--gold)`

**Files with heavy hardcoded colors:**
- `CategoryShowcase.tsx` (50+ instances)
- `EducationMegaMenu.tsx`
- `ProductDetail.tsx`
- `FineJewelleryGrid.tsx`
- `CompactProductVariants.tsx`

**Recommendation:** Replace hardcoded hex values with Tailwind tokens (`text-elysium-brown`, `bg-elysium-gold`) or ensure tokens are defined in `tailwind.config.ts` and used consistently.

### 1.3 Token Mismatch (globals.css vs tailwind.config.ts)

| Token | globals.css | tailwind.config.ts |
|-------|-------------|-------------------|
| `elysium-brown` | `#6D3D0D` | `#753600` |
| `elysium-dark` | `#6D3D0D` | `#753600` |
| `charcoal` | `#6D3D0D` (legacy) | `#753600` |
| `elysium-light` | `#f4f5db` | `#f5f5dc` |
| `beige` | `#E8E2DA` | `#f5f5dc` |

**Recommendation:** Align `tailwind.config.ts` with `globals.css` so both reference the same source of truth.

### 1.4 tokens.css vs globals.css

`styles/tokens.css` defines:
- `--color-ink: #111111` (dark gray)
- `--color-charcoal: #2C2C2C` (dark gray)

`globals.css` overrides:
- `--ink: var(--elysium-brown)` (brown)
- `--color-charcoal: #6D3D0D` (brown)

**Recommendation:** Consolidate or clearly separate tokens. `tokens.css` appears to be a legacy/alternate system. Either remove it or document its purpose.

---

## 2. Typography Inconsistencies

### 2.1 Font Stack Conflict

| File | Primary Serif |
|------|---------------|
| `globals.css` | Cormorant Garamond |
| `luxury-typography.css` | Playfair Display (first), Cormorant Garamond (fallback) |
| `layout.tsx` | Cormorant_Garamond (Next.js font) |

**Impact:** `luxury-typography.css` imports Playfair Display via Google Fonts; layout uses Cormorant Garamond. Classes like `.luxury-hero` may render Playfair Display while others use Cormorant.

**Recommendation:** Use a single primary serif font across the app. If Cormorant Garamond is the brand font, remove or update `luxury-typography.css` to avoid Playfair Display.

### 2.2 Font Class Usage

- `font-serif` vs `font-heading` vs `font-serif` (from globals)
- Cart page uses `font-heading`; others use `font-serif`
- Inconsistent heading sizes: `text-2xl`, `text-3xl`, `clamp()` in various places

**Recommendation:** Define a clear hierarchy (e.g. `text-h1`, `text-h2`) and use semantic classes.

---

## 3. Component-Specific Issues

### 3.1 Button Styles

| Component | Style | Primary Color |
|-----------|-------|---------------|
| Cart page | `bg-charcoal text-ivory rounded` | `#753600` (tailwind charcoal) |
| `LuxuryButton` | `border-charcoal text-charcoal rounded-none` | `#753600` |
| `StickySummary` Add to Bag | `bg-[#753600]` | Hardcoded |
| `StickySummary` Enquire | `bg-amber-600` | Amber (off-brand) |
| `CategoryShowcase` CTA | `bg-[#6D3D0D] text-white` | `#6D3D0D` |
| `LuxuryHeader` cart | `bg-elysium-brown text-white rounded-xl` | Token |
| `Footer` Join | `border-elysium-dark text-elysium-dark` | Token |
| `MobileMenu` | `bg-gold rounded-lg` | Gold |

**Issues:**
- Amber used for Enquire (off-brand)
- Mix of `rounded`, `rounded-lg`, `rounded-xl`, `rounded-full`, `rounded-none`
- Luxury design system uses `rounded-none` for buttons; some components use `rounded` or `rounded-full`

**Recommendation:** Create a shared button component with variants (primary, secondary, outline) and consistent radius.

### 3.2 Form Inputs

| Location | Style |
|----------|-------|
| Cart page | `border rounded` (minimal) |
| Footer newsletter | `border-elysium-dark/30 rounded` (luxury) |
| `FineJewelleryGrid` filters | `border-[#6D3D0D]/10 focus:ring-[#D4AF37]` |
| `CompactProductVariants` | `border-[#6D3D0D]/15 focus:border-[#D4AF37]` |

**Recommendation:** Standardize input styling with `focus:ring-2 focus:ring-elysium-gold/20` and consistent border colors.

### 3.3 Card Styling

- `LuxuryProductCard`: `rounded-sm`, `rounded-lg` (shadow div)
- `CategoryShowcase` cards: `rounded-sm` for images
- `FineJewelleryGrid` filters: `rounded` (default)
- `ProductDetail` badges: `rounded-full`

**Recommendation:** Define card radius tokens (e.g. `--radius-card: 0.125rem`) and use consistently.

### 3.4 StickySummary

- Uses `neutral-*` colors (gray scale) instead of elysium palette
- Enquire button uses `amber-600` instead of brown/gold
- Add to Bag uses `#753600` (tailwind brown) instead of `#6D3D0D`

**Recommendation:** Align with elysium palette; use `elysium-brown` for primary CTA.

---

## 4. Layout & Body Override

### 4.1 Body Background

`layout.tsx`:
```tsx
<body className={`... bg-white text-black antialiased`}>
```

`globals.css`:
```css
body {
  background: var(--page-bg);  /* --elysium-pearl */
  color: var(--ink);          /* --elysium-brown */
}
```

**Impact:** Layout's `bg-white text-black` overrides globals. The intended warm ivory/pearl background is replaced by pure white.

**Recommendation:** Remove `bg-white text-black` from layout or use `bg-[var(--page-bg)] text-[var(--ink)]` to respect design tokens.

---

## 5. Mobile Menu

- Uses `border-gray-100`, `bg-gray-50`, `border-gray-200` instead of elysium palette
- Wishlist button: `border-gray-200`; Book Consultation: `bg-gold`
- Inconsistent with overall brown/gold theme

**Recommendation:** Use `border-elysium-whisper`, `bg-elysium-pearl` for consistency.

---

## 6. Cart Page

- Minimal styling; feels like a placeholder
- Uses `text-charcoal/70` (Tailwind charcoal = `#753600`)
- Plain `border rounded` inputs
- No luxury styling compared to other pages

**Recommendation:** Apply luxury styling to match ProductDetail and Footer: serif headings, elysium colors, refined inputs.

---

## 7. Neutral vs Elysium Palette

- `StickySummary`, `ProductDetail` (badges), `MobileGallery` use `neutral-*` and `gray-*`
- Rest of app uses elysium brown/gold/ivory

**Recommendation:** Use elysium tokens for text and borders instead of neutral/gray where possible to maintain warmth.

---

## 8. Priority Fixes

### High Priority
1. **Unify brown** — Pick `#6D3D0D` or `#753600` as canonical; update tailwind + all components
2. **Fix StickySummary** — Replace amber with elysium; use `#6D3D0D` for Add to Bag
3. **Body background** — Remove layout override or use design tokens
4. **Tailwind vs globals** — Align `tailwind.config.ts` with `globals.css` tokens

### Medium Priority
5. Remove / reconcile `luxury-typography.css` (Playfair vs Cormorant)
6. Standardize button variants and radius
7. Replace hardcoded hex in high-traffic components (CategoryShowcase, ProductDetail)

### Low Priority
8. Replace `neutral-*` / `gray-*` with elysium palette where appropriate
9. Cart page luxury styling
10. Mobile menu styling alignment

---

## 9. Design Token Reference (Proposed)

```css
/* Primary */
--elysium-brown: #6D3D0D;
--elysium-gold: #D4AF37;
--elysium-ivory: #FEFDFB;
--elysium-pearl: #F8F6F2;
--elysium-champagne: #F5F1EB;
--elysium-beige: #E8E2DA;

/* Surface */
--page-bg: var(--elysium-pearl);
--card-bg: var(--elysium-ivory);
--ink: var(--elysium-brown);
```

Ensure `tailwind.config.ts` extends these so `text-elysium-brown`, `bg-elysium-gold`, etc. resolve correctly.

---

## 10. Files to Update

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Align elysium-brown, charcoal, elysium-dark with globals.css |
| `app/layout.tsx` | Remove or adjust body bg/text override |
| `components/pdp/StickySummary.tsx` | Replace #753600, amber with elysium tokens |
| `components/Footer.tsx` | Already uses tokens; verify elysium-dark value |
| `components/navigation/MobileMenu.tsx` | Replace gray-* with elysium equivalents |
| `app/cart/page.tsx` | Luxury styling pass |
| `components/ui/LuxuryHeader.tsx` | Replace #45321e with elysium-brown |
| `components/products/ProductVariants.tsx` | Replace #45321e with elysium-brown |
| `components/ui/LuxuryProductCard.tsx` | Replace #45321e with elysium-brown |
| `styles/luxury-typography.css` | Remove Playfair or document as optional |
| `styles/tokens.css` | Reconcile or remove if unused |

---

*End of UI Audit*
