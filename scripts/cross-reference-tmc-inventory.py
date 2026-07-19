#!/usr/bin/env python3
"""Cross-reference ELYSIUM inventory against the scraped TMC catalog.

Finds which TMC rings we already carry, via two signals:
  1. EXACT   - ELYSIUM product image path contains "tmc-import/<handle>"
  2. FUZZY   - normalised name/shape similarity between an ELYSIUM title
               and a TMC ring name (for originals reshot under our brand)

Outputs a report to stdout and writes a machine-readable match file to
exports/tmc-ring-catalog/inventory-cross-reference.json

Usage: python3 scripts/cross-reference-tmc-inventory.py
"""

import json
import re
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public/data/products.json"
CATALOG = ROOT / "exports/tmc-ring-catalog/catalog.json"
OUT = ROOT / "exports/tmc-ring-catalog/inventory-cross-reference.json"

FUZZY_STRONG = 0.72
FUZZY_MAYBE = 0.55

STOP = {
    "the", "ring", "with", "and", "a", "of", "mens", "men", "womens",
    "ceremonial", "band", "wedding", "engagement", "solitaire", "cut",
    "new", "copy", "18k", "gold", "ct", "lab", "diamond", "moissanite",
}


def norm_tokens(name: str) -> set:
    name = name.lower()
    name = re.sub(r"[™®]", "", name)
    name = re.sub(r"[^a-z0-9]+", " ", name)
    return {t for t in name.split() if t and t not in STOP and len(t) > 1}


def norm_str(name: str) -> str:
    return " ".join(sorted(norm_tokens(name)))


def similarity(a: str, b: str) -> float:
    ta, tb = norm_tokens(a), norm_tokens(b)
    if not ta or not tb:
        return 0.0
    jacc = len(ta & tb) / len(ta | tb)
    seq = SequenceMatcher(None, norm_str(a), norm_str(b)).ratio()
    return round(0.6 * jacc + 0.4 * seq, 3)


def tmc_handle_from_images(product) -> str | None:
    for img in product.get("images", []):
        m = re.search(r"tmc-import/([^/]+)/", str(img))
        if m:
            return m.group(1)
    return None


def main():
    products = json.loads(PRODUCTS.read_text())
    catalog = json.loads(CATALOG.read_text())

    # Unique TMC rings (handle -> display name)
    tmc = {}
    for row in catalog["rows"]:
        h = row["handle"]
        if h not in tmc:
            tmc[h] = row["tmcOriginalName"]

    exact, fuzzy_strong, fuzzy_maybe, no_match = [], [], [], []
    matched_handles = set()

    for p in products:
        title = p.get("title", "")
        slug = p.get("slug", "")
        handle = tmc_handle_from_images(p)

        if handle and handle in tmc:
            exact.append({"slug": slug, "title": title, "tmcHandle": handle,
                          "tmcName": tmc[handle], "score": 1.0, "method": "exact"})
            matched_handles.add(handle)
            continue

        # fuzzy: best TMC candidate
        best_h, best_s = None, 0.0
        for h, name in tmc.items():
            s = similarity(title, name)
            if s > best_s:
                best_h, best_s = h, s

        rec = {"slug": slug, "title": title, "tmcHandle": best_h,
               "tmcName": tmc.get(best_h, ""), "score": best_s,
               "method": "fuzzy"}
        if best_s >= FUZZY_STRONG:
            fuzzy_strong.append(rec)
            matched_handles.add(best_h)
        elif best_s >= FUZZY_MAYBE:
            fuzzy_maybe.append(rec)
        else:
            no_match.append(rec)

    fuzzy_strong.sort(key=lambda r: -r["score"])
    fuzzy_maybe.sort(key=lambda r: -r["score"])

    # ---- report ----
    def line(r, show_score=True):
        sc = f"  [{r['score']:.2f}]" if show_score else ""
        return f"  {r['title']:<48} ->  {r['tmcName']}{sc}"

    print("=" * 78)
    print(f"ELYSIUM products: {len(products)}   |   TMC rings: {len(tmc)}")
    print("=" * 78)

    print(f"\n■ EXACT MATCHES (already imported from TMC) — {len(exact)}")
    for r in exact:
        print(line(r, show_score=False))

    print(f"\n■ STRONG NAME MATCHES (very likely the same ring) — {len(fuzzy_strong)}")
    for r in fuzzy_strong:
        print(line(r))

    print(f"\n■ POSSIBLE MATCHES (review manually) — {len(fuzzy_maybe)}")
    for r in fuzzy_maybe:
        print(line(r))

    print(f"\n■ NO TMC MATCH (ELYSIUM-only / non-ring) — {len(no_match)}")
    for r in no_match:
        print(f"  {r['title']}")

    print("\n" + "=" * 78)
    print(f"TMC rings we already have (exact + strong): {len(matched_handles)} of {len(tmc)}")
    print(f"TMC rings NOT yet in ELYSIUM: {len(tmc) - len(matched_handles)}")
    print("=" * 78)

    OUT.write_text(json.dumps({
        "elysiumCount": len(products),
        "tmcCount": len(tmc),
        "matchedHandles": sorted(matched_handles),
        "exact": exact,
        "fuzzyStrong": fuzzy_strong,
        "fuzzyMaybe": fuzzy_maybe,
    }, indent=2), encoding="utf-8")
    print(f"\nWrote {OUT}")


if __name__ == "__main__":
    main()
