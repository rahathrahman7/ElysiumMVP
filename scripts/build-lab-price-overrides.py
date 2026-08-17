#!/usr/bin/env python3
"""Generate the client price book override JSON from the Lab Prices xlsx.

Reads the newest "Lab Prices (2).xlsx" (falls back to (1), then Lab Prices.xlsx)
and writes public/data/tmc-lab-prices.json mapping product slug ->
    { "name", "basePriceGBP", "caratDeltas": { label: delta } }

Lab Prices (2) has four side-by-side tables:
  A-E Rings | G-K Earrings | M-Q Bracelets | S-W Necklaces

Deltas are (tier price - base tier price). Base is 1ct when present, otherwise
the lowest-priced tier (e.g. 0.5ct for studs/necklaces, 2tcw for tennis).

Usage: python3 scripts/build-lab-price-overrides.py
"""

from __future__ import annotations

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

RING_CARAT_LABELS = {
    "1ct": "1ct",
    "1.5ct": "1.5ct",
    "2ct": "2ct",
    "2.5ct": "2.5ct",
    "3ct": "3ct+",
    "3ct+": "3ct+",
}

TABLES = (
    (0, "rings"),
    (6, "earrings"),
    (12, "bracelets"),
    (18, "necklaces"),
)

SKIP_NAME_RE = re.compile(
    r"^(name|earrings|bracelets|necklaces|different length)",
    re.I,
)


def slugify(name: str) -> str:
    n = unicodedata.normalize("NFKD", name)
    n = n.encode("ascii", "ignore").decode("ascii")
    n = n.lower()
    n = re.sub(r"[^a-z0-9]+", "-", n)
    return n.strip("-")


def pick_sheet_path() -> Path:
    for name in ("Lab Prices (2).xlsx", "Lab Prices (1).xlsx", "Lab Prices.xlsx"):
        path = PRICES_DIR / name
        if path.exists():
            return path
    raise FileNotFoundError(f"No Lab Prices xlsx found in {PRICES_DIR}")


def parse_price(raw) -> float | None:
    if raw is None or raw == "":
        return None
    if isinstance(raw, (int, float)):
        return float(raw)
    s = str(raw).strip().replace("£", "").replace(",", "")
    try:
        return float(s)
    except ValueError:
        return None


def norm_carat(raw, category: str) -> str | None:
    if raw is None or str(raw).strip() == "":
        return None
    key = str(raw).strip().lower().replace(" ", "")
    if category == "rings":
        return RING_CARAT_LABELS.get(key)

    m = re.match(r"^(\d+(?:\.\d+)?)ct", key)
    if m:
        return f"{m.group(1)}ct"

    m = re.match(r"^(\d+(?:\.\d+)?)tcw$", key)
    if m:
        return f"{m.group(1)}tcw"

    return RING_CARAT_LABELS.get(key)


def product_key(name: str, category: str) -> str:
    base = slugify(name)
    low = name.lower()
    if category == "rings":
        return base
    if category == "earrings":
        if base == "beloved" or "earring" in low or "hoop" in low:
            return "beloved" if base == "beloved" else base
        return f"{base}-earrings" if not base.endswith("-earrings") else base
    if category == "necklaces":
        if "necklace" in low or "chain" in low:
            return base
        return f"{base}-necklace"
    if category == "bracelets":
        if base == "paperclip":
            return "paperclip-bracelet"
        return base
    return base


def main() -> None:
    path = pick_sheet_path()
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.active

    prices: dict[str, dict[str | None, float]] = {}
    names: dict[str, str] = {}

    for row in ws.iter_rows(min_row=2, values_only=True):
        for base, category in TABLES:
            if len(row) <= base + 4:
                continue
            name, _shape, carat, _metal, price = row[base : base + 5]
            if not name:
                continue
            name_s = str(name).strip()
            if SKIP_NAME_RE.match(name_s):
                continue
            price_val = parse_price(price)
            if price_val is None:
                continue
            label = norm_carat(carat, category)
            key = product_key(name_s, category)
            prices.setdefault(key, {})[label] = price_val
            names[key] = name_s

    overrides: dict[str, dict] = {}
    for key, tiers in prices.items():
        labeled = [(lab, val) for lab, val in tiers.items() if lab is not None]
        # Rings: prefer 1ct. Fine jewellery: lowest sheet tier as entry price.
        prefer_one_ct = "2.5ct" in tiers or (
            "1.5ct" in tiers
            and "0.5ct" not in tiers
            and not any(str(l).endswith("tcw") for l in tiers if l)
        )

        if prefer_one_ct and "1ct" in tiers:
            base_label = "1ct"
            base = tiers["1ct"]
        elif labeled:
            base_label, base = min(labeled, key=lambda x: x[1])
        elif None in tiers:
            base_label = None
            base = tiers[None]
        else:
            continue

        carat_deltas = {
            lab: round(val - base)
            for lab, val in tiers.items()
            if lab is not None
        }

        overrides[key] = {
            "name": names[key],
            "basePriceGBP": round(base),
            "caratDeltas": carat_deltas,
            "baseCaratLabel": base_label or "",
        }

    aliases = {
        "paperclip-chain": "paperclip-necklace",
        "classic-4-claw-tennis-bracelet": "classic-tennis",
        "bezel-tennis-bracelet": "bezel-tennis",
        "beloved-hoops": "beloved",
        "beloved-earrings": "beloved",
    }
    for alias, target in aliases.items():
        if target in overrides and alias not in overrides:
            overrides[alias] = {**overrides[target], "name": overrides[target]["name"]}

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(overrides, indent=2, ensure_ascii=False) + "\n")
    print(f"Source: {path.name}")
    print(f"Wrote {len(overrides)} price entries -> {OUT_PATH.relative_to(ROOT)}")
    for slug in (
        "ethereal",
        "splendour",
        "essence",
        "essence-earrings",
        "essence-necklace",
        "crown-necklace",
        "allure-earrings",
        "paperclip-necklace",
        "paperclip-bracelet",
        "classic-tennis",
        "bezel-tennis",
        "beloved",
    ):
        if slug in overrides:
            o = overrides[slug]
            print(
                f"  {slug}: £{o['basePriceGBP']} base={o.get('baseCaratLabel')!r} "
                f"deltas {o['caratDeltas']}"
            )


if __name__ == "__main__":
    main()
