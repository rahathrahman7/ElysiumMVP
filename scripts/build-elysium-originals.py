#!/usr/bin/env python3
"""Slim list of ELYSIUM ring products for the visual TMC matcher.

Outputs public/data/elysium-originals.json with the fields the matcher UI
needs (slug, title, blurb, image, search hint). Excludes earrings/bracelets
and the rings already linked to TMC via tmc-import image paths.

Usage: python3 scripts/build-elysium-originals.py
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public/data/products.json"
OUT = ROOT / "public/data/elysium-originals.json"

NON_RING = ("earring", "bracelet", "tennis")

SHAPE_WORDS = [
    "toi et moi", "hidden halo", "trilogy", "three stone", "three-stone",
    "solitaire", "round", "oval", "pear", "marquise", "emerald", "radiant",
    "cushion", "asscher", "princess", "halo", "signet", "comfort", "domed",
    "milgrain", "flat", "court", "bevel", "chevron", "beaded", "twist",
    "split shank", "east west", "braided",
]


def search_hint(title: str, blurb: str) -> str:
    text = f"{title} {blurb}".lower()
    hits = [w for w in SHAPE_WORDS if w in text]
    # de-dupe while keeping order, cap to keep the query tight
    seen, out = set(), []
    for w in hits:
        if w not in seen:
            seen.add(w)
            out.append(w)
    return " ".join(out[:3])


def main():
    products = json.loads(PRODUCTS.read_text())
    rows = []
    for p in products:
        slug = p.get("slug", "")
        title = p.get("title", "")
        if any(k in slug.lower() or k in title.lower() for k in NON_RING):
            continue
        images = p.get("images", [])
        if any("tmc-import" in str(i) for i in images):
            continue  # already linked
        blurb = p.get("blurb", "")
        rows.append({
            "slug": slug,
            "title": title,
            "blurb": blurb,
            "image": images[0] if images else "",
            "hint": search_hint(title, blurb),
            "isMensBand": "mens-ring" in slug or "Men" in title,
        })

    rows.sort(key=lambda r: (r["isMensBand"], r["title"].lower()))
    OUT.write_text(json.dumps(rows, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"Wrote {OUT}  ({len(rows)} originals to match)")
    for r in rows:
        print(f"  {r['title']:<44} hint: {r['hint']}")


if __name__ == "__main__":
    main()
