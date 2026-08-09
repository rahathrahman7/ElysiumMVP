#!/usr/bin/env python3
"""Generate the client price book override JSON from the Lab Prices xlsx.

Reads the newest "Lab Prices (1).xlsx" (falls back to "Lab Prices.xlsx") and
writes public/data/tmc-lab-prices.json mapping product slug ->
    { "name", "basePriceGBP" (1ct), "caratDeltas": { label: delta } }

The sheet has two side-by-side tables (columns A-E and G-K), each with headers
Name, Shape, Carat, Metal, Price. Deltas are (tier price - 1ct price). Any tier
not present in the sheet (e.g. "3ct+") is left to the importer's default.

Usage: python3 scripts/build-lab-price-overrides.py
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    import openpyxl
except ImportError:
    print("openpyxl not installed. Run: pip3 install openpyxl", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
PRICES_DIR = ROOT / "public/Inventory /Engagement Ring Prices"
OUT_PATH = ROOT / "public/data/tmc-lab-prices.json"

# Carat cell text in the sheet -> importer carat label
CARAT_LABELS = {
    "1ct": "1ct",
    "1.5ct": "1.5ct",
    "2ct": "2ct",
    "2.5ct": "2.5ct",
    "3ct": "3ct+",
    "3ct+": "3ct+",
}


def slugify(name: str) -> str:
    """Mirror the JS slugify in scripts/import-selected-rings.mjs."""
    n = unicodedata.normalize("NFKD", name)
    n = n.encode("ascii", "ignore").decode("ascii")
    n = n.lower()
    n = re.sub(r"[^a-z0-9]+", "-", n)
    return n.strip("-")


def pick_sheet_path() -> Path:
    newest = PRICES_DIR / "Lab Prices (1).xlsx"
    if newest.exists():
        return newest
    return PRICES_DIR / "Lab Prices.xlsx"


def norm_carat(raw) -> str | None:
    if raw is None:
        return None
    key = str(raw).strip().lower().replace(" ", "")
    return CARAT_LABELS.get(key)


def main() -> None:
    path = pick_sheet_path()
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.active

    # Collect (name -> { carat_label: price }) across both side-by-side tables.
    prices: dict[str, dict[str, float]] = {}
    for row in ws.iter_rows(min_row=2, values_only=True):
        for base in (0, 6):  # two tables: A.. and G..
            if len(row) <= base + 4:
                continue
            name, _shape, carat, _metal, price = row[base : base + 5]
            if not name or price in (None, ""):
                continue
            label = norm_carat(carat)
            if not label:
                continue
            try:
                price_val = float(price)
            except (TypeError, ValueError):
                continue
            prices.setdefault(str(name).strip(), {})[label] = price_val

    overrides: dict[str, dict] = {}
    for name, tiers in prices.items():
        base = tiers.get("1ct")
        if base is None:
            continue
        carat_deltas = {
            label: round(val - base)
            for label, val in tiers.items()
        }
        overrides[slugify(name)] = {
            "name": name,
            "basePriceGBP": round(base),
            "caratDeltas": carat_deltas,
        }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(overrides, indent=2, ensure_ascii=False) + "\n")
    print(f"Source: {path.name}")
    print(f"Wrote {len(overrides)} price entries -> {OUT_PATH.relative_to(ROOT)}")
    for slug in ("odessa", "felicity", "leontine", "vow-veil"):
        if slug in overrides:
            o = overrides[slug]
            print(f"  {slug}: £{o['basePriceGBP']} deltas {o['caratDeltas']}")


if __name__ == "__main__":
    main()
