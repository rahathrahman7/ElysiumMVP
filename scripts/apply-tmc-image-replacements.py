#!/usr/bin/env python3
"""
Apply client TMC-review image replacements onto existing Elysium products.

Reads Keep notes from production /api/tmc-review intent (hardcoded mapping below),
copies metal renders into each product folder, updates products.json galleries,
removes hidden-halo tags where requested, and drops Orabella prices by £1000.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "public/data/products.json"
SCRAPE = ROOT / "exports/tmc-ring-catalog/images"
PUBLIC_TMC = ROOT / "public/products/tmc-import"

# slug -> replacement config
REPLACEMENTS = [
    {
        "slug": "unity-engagement-ring",
        "handle": "the-amira-ring-1",
        "folder": "Unity",
        "prefix": "unity-tmc",
        "remove_hidden_halo": True,
        # No white render in scrape — keep existing white/plat paths for those metals
        "metals_with_new": ["yellow", "rose"],
        "blurb": (
            "Unity showcases an oval-cut lab-grown diamond in a graceful cathedral setting, "
            "elevated by a sculptural twisted band adorned with four delicately set marquise accent stones."
        ),
    },
    {
        "slug": "aura-engagement-ring",
        "handle": "the-avery-ring-oval-with-marquise-and-round-brilliant-band",
        "folder": "Aura",
        "prefix": "aura-tmc",
        "remove_hidden_halo": False,
        "metals_with_new": ["yellow", "rose", "white"],
        "blurb": None,
    },
    {
        "slug": "aveline-radiant-solitaire",
        "handle": "the-eloise-ring-radiant-antique-halo",
        "folder": "Aveline",
        "prefix": "aveline-tmc",
        "remove_hidden_halo": True,
        "metals_with_new": ["yellow", "rose", "white"],
        "blurb": (
            "Stunning in its simplicity, the Aveline engagement ring is a classic radiant solitaire "
            "design featuring four talon-tipped claws and an antique style halo."
        ),
    },
    {
        "slug": "eterna-oval-solitaire-hidden-halo",
        "handle": "the-luise-ring-oval-halo",
        "folder": "Eterna",
        "prefix": "eterna-tmc",
        "remove_hidden_halo": True,
        "metals_with_new": ["yellow", "rose", "white"],
        "blurb": (
            "Renowned for its timeless elegance, the Eterna engagement ring features a classic "
            "four-talon claw oval solitaire design, enhanced by a dazzling halo."
        ),
    },
    {
        "slug": "ovalis-oval-solitaire",
        "handle": "the-luise-ring-oval-solitaire",
        "folder": "Ovalis",
        "prefix": "ovalis-tmc",
        "remove_hidden_halo": False,
        "metals_with_new": ["yellow", "rose", "white"],
        "blurb": None,
    },
    {
        "slug": "lumea-engagement-ring",
        "handle": "the-luise-ring-oval-toi-et-moi",
        "folder": "Lumea",
        "prefix": "lumea-tmc",
        "remove_hidden_halo": False,
        "metals_with_new": ["yellow", "rose", "white"],
        "blurb": (
            "The Lumea engagement ring showcases a striking oval-cut stone paired with a twin oval-cut stone, "
            "brought together in a timeless toi et moi design."
        ),
    },
    {
        "slug": "orabella-toi-et-moi",
        "handle": "the-noa-ring-radiant-and-trilliant-trilogy",
        "folder": "Orabella",
        "prefix": "orabella-tmc",
        "remove_hidden_halo": False,
        "metals_with_new": ["yellow", "rose", "white"],
        "price_drop_gbp": 1000,
        "blurb": (
            "The Orabella features a lab-grown diamond elegantly framed by two delicate trillion-cut accent stones. "
            "Rich in symbolism, each stone represents the past, the present, and the future."
        ),
    },
    {
        "slug": "clarion-engagement-ring",
        "handle": "the-vienna-ring-radiant-solitaire",
        "folder": "Clarion",
        "prefix": "clarion-tmc",
        "remove_hidden_halo": False,
        "metals_with_new": ["yellow", "rose", "white"],
        "blurb": None,
    },
]

METAL_FILE = {
    "yellow": "yellow.jpg",
    "rose": "rose.jpg",
    "white": "white.jpg",
}

# Product metal name -> which colour file to use
GALLERY_MAP = {
    "18k Yellow Gold": "yellow",
    "18k Rose Gold": "rose",
    "18k White Gold": "white",
    "Platinum": "white",
    "Two-Tone Rose/Platinum": "rose",
    "Two-Tone Yellow/Platinum": "yellow",
}


def resolve_src(handle: str, colour: str) -> Path | None:
    """Prefer scrape colour file; fall back to public tmc-import metal-*."""
    scrape = SCRAPE / handle / METAL_FILE[colour]
    if scrape.exists():
        return scrape
    pub = PUBLIC_TMC / handle
    for name in (f"metal-{colour}.jpg", f"metal-{colour}-front.jpg", METAL_FILE[colour]):
        candidate = pub / name
        if candidate.exists():
            return candidate
    return None


def copy_metal_images(cfg: dict) -> dict[str, str]:
    """Copy available metal renders into product folder. Returns colour -> public path."""
    dest_dir = ROOT / "public/products" / cfg["folder"]
    dest_dir.mkdir(parents=True, exist_ok=True)
    paths: dict[str, str] = {}
    for colour in cfg["metals_with_new"]:
        src = resolve_src(cfg["handle"], colour)
        if not src:
            print(f"  WARNING: missing {colour} for {cfg['handle']}")
            continue
        dest_name = f"{cfg['prefix']}-{colour}.jpg"
        dest = dest_dir / dest_name
        shutil.copy2(src, dest)
        paths[colour] = f"/products/{cfg['folder']}/{dest_name}"
        print(f"  copied {src.name} -> {dest.relative_to(ROOT)}")
    return paths


def build_gallery(product: dict, colour_paths: dict[str, str], metals_with_new: list[str]) -> dict:
    gallery = dict(product.get("galleryByMetal") or {})
    for metal_name, colour in GALLERY_MAP.items():
        if metal_name not in gallery and metal_name not in (m["name"] for m in product.get("metals") or []):
            continue
        if colour not in metals_with_new or colour not in colour_paths:
            # Leave existing gallery entries for metals without new renders
            continue
        gallery[metal_name] = [colour_paths[colour]]
    return gallery


def strip_hidden_halo(product: dict) -> None:
    styles = [s for s in (product.get("styles") or []) if s != "hidden-halo"]
    collections = [c for c in (product.get("collections") or []) if c != "hidden-halo"]
    product["styles"] = styles
    product["collections"] = collections


def apply_price_drop(product: dict, drop: int) -> None:
    old = product.get("basePriceGBP") or 0
    product["basePriceGBP"] = max(0, int(old) - drop)
    print(f"  price {old} -> {product['basePriceGBP']} (−£{drop})")


def main() -> None:
    products = json.loads(PRODUCTS_PATH.read_text())
    by_slug = {p["slug"]: p for p in products}
    report = []

    for cfg in REPLACEMENTS:
        product = by_slug.get(cfg["slug"])
        if not product:
            print(f"MISSING PRODUCT {cfg['slug']}")
            continue
        print(f"\n=== {cfg['slug']} ← {cfg['handle']} ===")
        colour_paths = copy_metal_images(cfg)
        if not colour_paths:
            print("  SKIP: no images copied")
            continue

        gallery = build_gallery(product, colour_paths, cfg["metals_with_new"])
        product["galleryByMetal"] = gallery

        # Primary images: yellow first, else any available new colour
        primary_colour = "yellow" if "yellow" in colour_paths else next(iter(colour_paths))
        product["images"] = [colour_paths[primary_colour]]
        # Prefer listing available metals' heroes in images[] for shop cards
        ordered = []
        for c in ("yellow", "rose", "white"):
            if c in colour_paths and colour_paths[c] not in ordered:
                ordered.append(colour_paths[c])
        if ordered:
            product["images"] = ordered

        if cfg.get("remove_hidden_halo"):
            strip_hidden_halo(product)
            print("  removed hidden-halo from styles/collections")

        if cfg.get("blurb"):
            product["blurb"] = cfg["blurb"]
            print("  updated blurb")

        if cfg.get("price_drop_gbp"):
            apply_price_drop(product, cfg["price_drop_gbp"])

        report.append(
            {
                "slug": cfg["slug"],
                "handle": cfg["handle"],
                "images": product["images"],
                "galleryKeys": list(gallery.keys()),
                "basePriceGBP": product.get("basePriceGBP"),
                "styles": product.get("styles"),
            }
        )

    PRODUCTS_PATH.write_text(json.dumps(products, indent=2, ensure_ascii=False) + "\n")
    print(f"\nWrote {PRODUCTS_PATH}")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
