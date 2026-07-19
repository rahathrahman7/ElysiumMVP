# TMC Ring Import Report

**Date:** 2026-07-19  
**Source:** Production `/api/tmc-review` (`keep: true`)  
**Script:** `node scripts/import-selected-rings.mjs --update`

## Summary

| Metric | Count |
|--------|------:|
| Reviews with Keep | 13 |
| Newly added products | 11 |
| Updated existing (Lumina, Evermore) | 2 |
| All new slugs shop-visible | 13 |
| Pilot rings still hidden | 10 |
| Total products in catalog | 63 |

## Imported rings

| Title | Slug | GBP | Metals | Price source |
|-------|------|----:|--------|--------------|
| Arabella | `/products/arabella` | 2300 | 4 | Provisional (AUD×1.86) |
| Lumina | `/products/lumina` | 2350 | 4 | Existing catalog |
| Evermore | `/products/evermore` | 3300 | 6 | Existing catalog |
| Vivienne | `/products/vivienne` | 2100 | 4 | Provisional (AUD×1.86) |
| Sorella | `/products/sorella` | 2100 | 4 | Provisional (AUD×1.86) |
| Noémi | `/products/noemi` | 2150 | 4 | Provisional (AUD×1.86) |
| Amarante | `/products/amarante` | 2400 | 2 (Y/R only — no white render) | Provisional (AUD×1.86) |
| Elodie | `/products/elodie` | 3200 | 4 | Provisional (AUD×1.86) |
| Anastasia | `/products/anastasia` | 2400 | 2 (Y/R only — no white render) | Provisional (AUD×1.86) |
| Isolde | `/products/isolde` | 2250 | 4 | Provisional (AUD×1.86) |
| Ophellia | `/products/ophellia` | 2100 | 4 | Provisional (AUD×1.86) |
| Nala | `/products/nala` | 1700 | 4 | Provisional (AUD×1.86) |
| Callista | `/products/callista` | 1600 | 4 | Provisional (AUD×1.86) |

## Notes for client

1. **Prices:** Review UI had `priceGbp: "Check Spreadsheet"` for all 13. Provisional GBP was derived from TMC AUD × 1.86 (calibrated to Lumina). **Confirm or replace these prices before launch marketing.**
2. **Amarante & Anastasia:** White-gold / platinum swatches omitted — no `white.jpg` render in the scrape. Add photography or re-scrape to unlock those metals.
3. **Pilot batch (10 rings):** Still `isHidden: true` (Amira, Luise, Audrey, etc.). They were **not** in the client Keep list. Unhide separately if wanted live.
4. **Configurator:** Each import has metals, origins, carat/colour/clarity tiers, UK sizes, complimentary engraving (`engravingFeeGBP: 0`), and `galleryByMetal` wired for PDP metal switching.

## Re-run

```bash
node scripts/import-selected-rings.mjs --dry-run --update
node scripts/import-selected-rings.mjs --update
```

## Deploy checklist

- [ ] Commit `public/data/products.json` + `public/products/tmc-import/**` + `scripts/import-selected-rings.mjs`
- [ ] Deploy to Vercel
- [ ] Spot-check PDP URLs above in production
- [ ] Client confirms final GBP prices
