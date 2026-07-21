# TMC Image Replacement Report

**Date:** 2026-07-21  
**Source:** Production `/api/tmc-review` Keep notes (client image-replacement instructions)  
**Script:** `python3 scripts/apply-tmc-image-replacements.py`

## Applied

| Product | Slug | TMC source | Changes |
|---------|------|------------|---------|
| Unity | `unity-engagement-ring` | `the-amira-ring-1` | Y/R images replaced; hidden-halo removed; blurb updated. White/Plat kept old renders (no white TMC file). |
| Aura | `aura-engagement-ring` | `the-avery-ring-oval-with-marquise-and-round-brilliant-band` | Y/R/W images replaced (two-tone maps to rose/yellow). |
| Aveline | `aveline-radiant-solitaire` | `the-eloise-ring-radiant-antique-halo` | Y/R/W images replaced; blurb updated. |
| Eterna | `eterna-oval-solitaire-hidden-halo` | `the-luise-ring-oval-halo` | Y/R/W images replaced; hidden-halo removed from styles/collections; blurb updated. Slug unchanged (URL stability). |
| Ovalis | `ovalis-oval-solitaire` | `the-luise-ring-oval-solitaire` | Y/R/W images replaced. |
| Lumea | `lumea-engagement-ring` | `the-luise-ring-oval-toi-et-moi` | Y/R/W images replaced; blurb updated. |
| Orabella | `orabella-toi-et-moi` | `the-noa-ring-radiant-and-trilliant-trilogy` | Y/R/W images replaced; blurb updated; **base price £2689 → £1689** (−£1k; carat deltas unchanged so every size is £1k less). |
| Clarion | `clarion-engagement-ring` | `the-vienna-ring-radiant-solitaire` | Y/R/W images replaced (preferred Clarion source per client note). |

## Homepage / nav

- `CategoryShowcase` cards for Eterna, Aura, Unity, Lumea, Orabella updated to new image paths.
- Collections mega-menu Toi et Moi thumbnail → Orabella TMC yellow.

## Not done (needs client confirmation)

- **Vesper** band (`the-ava-ring-pave-wedding-band`) — named + £935 but Keep still false.
- **Unity white/platinum** — no white render in TMC scrape; still using previous silver images.
- Eterna product slug still contains `hidden-halo` for URL stability.
