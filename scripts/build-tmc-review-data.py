#!/usr/bin/env python3
"""Build the hosted review catalog JSON consumed by /tmc-review.

Groups exports/tmc-ring-catalog/catalog.json rows by ring and uses the
original Shopify CDN image URLs (sourceUrl) so the hosted page needs no
local images. Output: public/data/tmc-review-catalog.json

Usage: python3 scripts/build-tmc-review-data.py
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "exports/tmc-ring-catalog/catalog.json"
XREF_PATH = ROOT / "exports/tmc-ring-catalog/inventory-cross-reference.json"
OUT_PATH = ROOT / "public/data/tmc-review-catalog.json"

METAL_ORDER = ["yellow", "white", "rose"]


def suggested_name(tmc_name: str) -> str:
    name = re.sub(r"[™®]", "", tmc_name)
    name = re.sub(r"\bThe\b", "", name)
    name = re.sub(r"\bRing\b", "", name)
    name = name.replace(" - ", " — ")
    name = re.sub(r"\s+", " ", name).strip(" —-")
    return name.strip()


def sized(url: str, width: int = 800) -> str:
    if not url:
        return url
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}width={width}"


# Size/carat re-listings of designs we already stock. Each rule:
#   (required terms ALL present, excluded terms NONE present, ELYSIUM title)
# Exclusions keep genuinely different variants (low-set, knife-edge,
# toi-et-moi, split-shank) reviewable rather than wrongly hidden.
BASE_RULES = [
    (["vienna", "radiant solitaire"], ["split shank", "east-west", "east west"], "Vienna — Radiant Solitaire"),
    (["luise", "oval solitaire"], ["low set", "low-set", "knife", "toi et moi", "east-west", "east west"], "Luise — Oval Solitaire"),
    (["isla", "round solitaire"], ["split shank"], "Isla — Round Solitaire"),
    (["amira", "oval with marquise"], [], "Amira — Oval with Marquise Accents"),
    (["avery"], [], "Avery — Oval with Marquise & Round Brilliant Band"),
    (["florence", "oval and pear"], [], "Florence — Oval & Pear Trilogy"),
    (["sophia", "pear solitaire"], ["toi et moi"], "Sophia — Pear Solitaire"),
    (["ophelia"], [], "Ophelia — Elongated Cushion Solitaire"),
    (["arie", "marquise solitaire"], ["toi et moi"], "Arie — Marquise Solitaire"),
    (["audrey", "emerald solitaire"], ["toi et moi"], "Audrey — Emerald Solitaire"),
]


def base_rule_title(name: str) -> str:
    n = name.lower()
    for req, exc, title in BASE_RULES:
        if all(t in n for t in req) and not any(t in n for t in exc):
            return title
    return ""


def load_owned(catalog):
    """Map TMC handle -> ELYSIUM product title for rings we already stock.

    Combines: (1) exact/strong matches from the cross-reference file, and
    (2) carat/size re-listings of base designs we stock (BASE_RULES).
    """
    owned = {}
    if XREF_PATH.exists():
        xref = json.loads(XREF_PATH.read_text())
        for group in ("exact", "fuzzyStrong"):
            for m in xref.get(group, []):
                if m.get("tmcHandle"):
                    owned[m["tmcHandle"]] = m.get("title", "")

    for row in catalog["rows"]:
        h = row["handle"]
        if h in owned:
            continue
        title = base_rule_title(row["tmcOriginalName"])
        if title:
            owned[h] = title
    return owned


def main():
    catalog = json.loads(CATALOG_PATH.read_text())
    owned = load_owned(catalog)
    rings = {}
    for row in catalog["rows"]:
        handle = row["handle"]
        r = rings.get(handle)
        if not r:
            r = {
                "handle": handle,
                "tmcName": row["tmcOriginalName"],
                "suggested": suggested_name(row["tmcOriginalName"]),
                "category": row["category"],
                "tmcPriceAud": row.get("tmcPriceAud", ""),
                "owned": handle in owned,
                "elysiumTitle": owned.get(handle, ""),
                "images": {},
            }
            rings[handle] = r
        if row.get("sourceUrl"):
            r["images"][row["metalKey"]] = sized(row["sourceUrl"])

    out = [r for r in rings.values() if r["images"]]
    out.sort(key=lambda r: (0 if "Engagement" in r["category"] else 1, r["tmcName"].lower()))

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"Wrote {OUT_PATH}  ({len(out)} rings)")


if __name__ == "__main__":
    main()
