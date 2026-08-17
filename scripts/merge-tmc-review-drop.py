#!/usr/bin/env python3
"""Merge exports/tmc-fine-jewellery/new-drop.json into the hosted review catalog.

Preserves existing /tmc-review entries (including owned flags) and appends
any new handles. Does not require the ring scrape catalog.

Usage: python3 scripts/merge-tmc-review-drop.py
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DROP_PATH = ROOT / "exports/tmc-fine-jewellery/new-drop.json"
OUT_PATH = ROOT / "public/data/tmc-review-catalog.json"


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


def sort_key(r):
    cat = r["category"]
    if "Fine Jewellery" in cat:
        group = 2
    elif "Engagement" in cat:
        group = 0
    else:
        group = 1
    return (group, cat, r["tmcName"].lower())


def main():
    if not DROP_PATH.exists():
        raise SystemExit(f"Missing {DROP_PATH} — run append-new-tmc-fine-jewellery.mjs first")
    if not OUT_PATH.exists():
        raise SystemExit(f"Missing {OUT_PATH}")

    existing = json.loads(OUT_PATH.read_text())
    rings = {r["handle"]: r for r in existing}
    before = len(rings)

    drop = json.loads(DROP_PATH.read_text())
    added = []
    updated_images = 0

    for row in drop.get("rows", []):
        handle = row["handle"]
        r = rings.get(handle)
        if not r:
            r = {
                "handle": handle,
                "tmcName": row["tmcOriginalName"],
                "suggested": suggested_name(row["tmcOriginalName"]),
                "category": row["category"],
                "tmcPriceAud": row.get("tmcPriceAud", ""),
                "owned": False,
                "elysiumTitle": "",
                "isNew": True,
                "images": {},
            }
            rings[handle] = r
            added.append(handle)
        if row.get("sourceUrl"):
            key = row["metalKey"]
            url = sized(row["sourceUrl"])
            if r["images"].get(key) != url:
                if handle not in added:
                    updated_images += 1
                r["images"][key] = url

    out = [r for r in rings.values() if r.get("images")]
    out.sort(key=sort_key)
    OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding="utf-8")

    print(f"Catalog was {before} items")
    print(f"Added {len(set(added))} new handles")
    print(f"Updated images on {updated_images} existing handles")
    print(f"Wrote {OUT_PATH}  ({len(out)} items)")
    for h in sorted(set(added)):
        item = rings[h]
        metals = ",".join(item["images"].keys())
        print(f"  + {item['category'].replace('Fine Jewellery — ', ''):10}  {item['tmcName']}  [{metals}]  A${item['tmcPriceAud']}")


if __name__ == "__main__":
    main()
