#!/usr/bin/env python3
"""Build a sleek, self-contained ring review app for the client.

Reads exports/tmc-ring-catalog/catalog.json and produces a single
index.html at the catalog root. The client opens it in a browser, views
every ring with a metal-colour switcher, edits Name / Price / Notes,
toggles Keep, and exports their selections to CSV or JSON. Progress is
auto-saved to the browser (localStorage), so nothing is lost.

Usage: python3 scripts/build-tmc-review-app.py
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "exports/tmc-ring-catalog"
CATALOG_PATH = CATALOG_DIR / "catalog.json"
OUT_PATH = CATALOG_DIR / "index.html"

METAL_ORDER = ["yellow", "white", "rose"]
METAL_LABEL = {"yellow": "Yellow Gold", "white": "White Gold", "rose": "Rose Gold"}


def suggested_name(tmc_name: str) -> str:
    """Clean the TMC name into a neutral suggested display name."""
    name = tmc_name
    name = re.sub(r"[™®]", "", name)
    name = re.sub(r"\bThe\b", "", name)
    name = re.sub(r"\bRing\b", "", name)
    name = name.replace(" - ", " — ")
    name = re.sub(r"\s+", " ", name).strip(" —-")
    return name.strip()


def group_rings(rows):
    rings = {}
    for row in rows:
        handle = row["handle"]
        ring = rings.get(handle)
        if not ring:
            ring = {
                "handle": handle,
                "tmcName": row["tmcOriginalName"],
                "suggested": suggested_name(row["tmcOriginalName"]),
                "category": row["category"],
                "tmcPriceAud": row.get("tmcPriceAud", ""),
                "images": {},
            }
            rings[handle] = ring
        if row.get("imageRelative"):
            ring["images"][row["metalKey"]] = row["imageRelative"]
    # Only rings that have at least one image
    return [r for r in rings.values() if r["images"]]


def build_html(rings):
    data_json = json.dumps(rings, ensure_ascii=False)
    total = len(rings)
    engagement = sum(1 for r in rings if "Engagement" in r["category"])
    wedding = sum(1 for r in rings if "Wedding" in r["category"])

    # NOTE: braces in the CSS/JS are doubled for str.format below.
    return TEMPLATE.format(
        data_json=data_json,
        total=total,
        engagement=engagement,
        wedding=wedding,
    )


TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TMC Ring Review — ELYSIUM</title>
<style>
  :root {{
    --bg: #f6f1ea;
    --card: #ffffff;
    --ink: #3d2a17;
    --brown: #6d3d0d;
    --gold: #c8a24a;
    --muted: #9b8b76;
    --line: #e7ded1;
    --shadow: 0 6px 24px rgba(109,61,13,0.08);
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--ink);
  }}
  h1, h2, .serif {{ font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif; }}

  header {{
    position: sticky; top: 0; z-index: 50;
    background: rgba(246,241,234,0.92);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
    padding: 16px 24px;
  }}
  .header-row {{ display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }}
  .brand {{ font-size: 26px; font-weight: 600; letter-spacing: 0.14em; color: var(--brown); text-transform: uppercase; font-family: "Cormorant Garamond", Georgia, serif; }}
  .brand small {{ display:block; font-size: 10px; letter-spacing: 0.3em; color: var(--muted); font-family: -apple-system, sans-serif; margin-top: 2px; }}
  .stats {{ display: flex; gap: 18px; margin-left: auto; align-items: center; flex-wrap: wrap; }}
  .stat {{ text-align: center; }}
  .stat .n {{ font-size: 22px; font-weight: 700; color: var(--brown); }}
  .stat .l {{ font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--muted); }}
  .kept-pill {{ background: var(--brown); color: #fff; padding: 10px 18px; border-radius: 999px; font-weight: 600; font-size: 14px; }}

  .toolbar {{ display: flex; gap: 12px; margin-top: 14px; flex-wrap: wrap; align-items: center; }}
  .toolbar input[type="search"] {{
    flex: 1; min-width: 220px; padding: 11px 16px; border: 1px solid var(--line);
    border-radius: 10px; font-size: 14px; background: #fff;
  }}
  .seg {{ display: inline-flex; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: #fff; }}
  .seg button {{ border: 0; background: transparent; padding: 10px 16px; font-size: 13px; cursor: pointer; color: var(--ink); }}
  .seg button.active {{ background: var(--brown); color: #fff; }}
  .btn {{ border: 1px solid var(--brown); background: #fff; color: var(--brown); padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }}
  .btn.primary {{ background: var(--brown); color: #fff; }}
  .btn:hover {{ filter: brightness(0.97); }}

  main {{ padding: 24px; max-width: 1500px; margin: 0 auto; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }}

  .card {{
    background: var(--card); border: 1px solid var(--line); border-radius: 16px;
    overflow: hidden; box-shadow: var(--shadow); display: flex; flex-direction: column;
    transition: border-color .2s, box-shadow .2s, transform .1s;
  }}
  .card.kept {{ border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold), var(--shadow); }}
  .imgwrap {{ position: relative; aspect-ratio: 1/1; background: #efe7db; }}
  .imgwrap img {{ width: 100%; height: 100%; object-fit: contain; padding: 12px; }}
  .cat {{ position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); color: var(--brown);
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 9px; border-radius: 999px; }}
  .metals {{ position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 8px; background: rgba(255,255,255,0.85); padding: 6px 8px; border-radius: 999px; }}
  .metal-dot {{ width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 0 1px var(--line); }}
  .metal-dot.active {{ box-shadow: 0 0 0 2px var(--brown); }}
  .m-yellow {{ background: #e8c66a; }}
  .m-white {{ background: #e6e6e6; }}
  .m-rose {{ background: #e2b7a3; }}

  .body {{ padding: 14px; display: flex; flex-direction: column; gap: 10px; flex: 1; }}
  .tmc-name {{ font-size: 11px; color: var(--muted); letter-spacing: 0.04em; min-height: 28px; }}
  .keep-row {{ display: flex; align-items: center; justify-content: space-between; }}
  .keep-btn {{ border: 1px solid var(--line); background: #fff; color: var(--ink); padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; display:flex; align-items:center; gap:8px; }}
  .keep-btn.on {{ background: var(--gold); border-color: var(--gold); color: #3d2a17; }}
  .ref-price {{ font-size: 11px; color: var(--muted); }}
  .field label {{ display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 4px; }}
  .field input, .field textarea {{
    width: 100%; padding: 9px 11px; border: 1px solid var(--line); border-radius: 9px; font-size: 13px; font-family: inherit; background: #fdfbf8;
  }}
  .field textarea {{ resize: vertical; min-height: 46px; }}
  .price-input {{ position: relative; }}
  .price-input span {{ position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 13px; }}
  .price-input input {{ padding-left: 24px; }}

  .empty {{ text-align: center; padding: 60px; color: var(--muted); }}
  footer {{ text-align: center; padding: 30px; color: var(--muted); font-size: 12px; }}
  .save-note {{ font-size: 11px; color: var(--muted); margin-left: 8px; }}
  @media (max-width: 640px) {{ .brand {{ font-size: 20px; }} main {{ padding: 14px; }} }}
</style>
</head>
<body>
<header>
  <div class="header-row">
    <div class="brand">ELYSIUM<small>TMC Ring Review</small></div>
    <div class="stats">
      <div class="stat"><div class="n">{total}</div><div class="l">Total Rings</div></div>
      <div class="stat"><div class="n">{engagement}</div><div class="l">Engagement</div></div>
      <div class="stat"><div class="n">{wedding}</div><div class="l">Wedding</div></div>
      <div class="kept-pill">Keeping: <span id="keptCount">0</span></div>
    </div>
  </div>
  <div class="toolbar">
    <input type="search" id="search" placeholder="Search rings by name…" />
    <div class="seg" id="catSeg">
      <button data-cat="all" class="active">All</button>
      <button data-cat="Engagement">Engagement</button>
      <button data-cat="Wedding">Wedding</button>
    </div>
    <div class="seg" id="keepSeg">
      <button data-keep="all" class="active">Show all</button>
      <button data-keep="kept">Kept only</button>
    </div>
    <button class="btn primary" id="exportCsv">Export CSV</button>
    <button class="btn" id="exportJson">Export JSON</button>
    <button class="btn" id="resetBtn">Reset</button>
    <span class="save-note" id="saveNote">Auto-saved in your browser</span>
  </div>
</header>

<main>
  <div class="grid" id="grid"></div>
  <div class="empty" id="empty" style="display:none">No rings match your filters.</div>
</main>

<footer>
  ELYSIUM × TMC ring selection · Images are 3D metal renders only · Your edits stay on this device until you export.
</footer>

<script>
const RINGS = {data_json};
const STORE_KEY = "tmc-ring-review-v1";
const METAL_ORDER = ["yellow","white","rose"];
const METAL_LABEL = {{ yellow: "Yellow Gold", white: "White Gold", rose: "Rose Gold" }};

let state = loadState();
let filters = {{ cat: "all", keep: "all", q: "" }};

function loadState() {{
  try {{ return JSON.parse(localStorage.getItem(STORE_KEY)) || {{}}; }}
  catch (e) {{ return {{}}; }}
}}
function saveState() {{
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  updateKeptCount();
}}
function entry(handle) {{
  if (!state[handle]) state[handle] = {{ keep: false, name: "", price: "", notes: "", metal: null }};
  return state[handle];
}}
function updateKeptCount() {{
  const n = Object.values(state).filter(e => e && e.keep).length;
  document.getElementById("keptCount").textContent = n;
}}

function firstMetal(ring) {{
  for (const m of METAL_ORDER) if (ring.images[m]) return m;
  return null;
}}

function matches(ring) {{
  if (filters.cat === "Engagement" && ring.category.indexOf("Engagement") === -1) return false;
  if (filters.cat === "Wedding" && ring.category.indexOf("Wedding") === -1) return false;
  if (filters.keep === "kept" && !(state[ring.handle] && state[ring.handle].keep)) return false;
  if (filters.q) {{
    const hay = (ring.tmcName + " " + ring.suggested).toLowerCase();
    if (!hay.includes(filters.q.toLowerCase())) return false;
  }}
  return true;
}}

function render() {{
  const grid = document.getElementById("grid");
  const list = RINGS.filter(matches);
  document.getElementById("empty").style.display = list.length ? "none" : "block";
  grid.innerHTML = "";
  for (const ring of list) grid.appendChild(card(ring));
  updateKeptCount();
}}

function card(ring) {{
  const e = entry(ring.handle);
  const activeMetal = e.metal && ring.images[e.metal] ? e.metal : firstMetal(ring);

  const el = document.createElement("div");
  el.className = "card" + (e.keep ? " kept" : "");

  const metalDots = METAL_ORDER
    .filter(m => ring.images[m])
    .map(m => `<div class="metal-dot m-${{m}} ${{m===activeMetal?'active':''}}" data-metal="${{m}}" title="${{METAL_LABEL[m]}}"></div>`)
    .join("");

  el.innerHTML = `
    <div class="imgwrap">
      <div class="cat">${{ring.category}}</div>
      <img loading="lazy" src="${{ring.images[activeMetal]}}" alt="${{ring.tmcName}}" />
      <div class="metals">${{metalDots}}</div>
    </div>
    <div class="body">
      <div class="tmc-name">${{ring.tmcName}}</div>
      <div class="keep-row">
        <button class="keep-btn ${{e.keep?'on':''}}">${{e.keep?'✓ Keeping':'＋ Keep'}}</button>
        <span class="ref-price">TMC ref: A$${{ring.tmcPriceAud||'—'}}</span>
      </div>
      <div class="field">
        <label>Display name</label>
        <input type="text" class="f-name" placeholder="${{ring.suggested}}" value="${{e.name||''}}" />
      </div>
      <div class="field">
        <label>Price (GBP)</label>
        <div class="price-input"><span>£</span><input type="text" inputmode="decimal" class="f-price" placeholder="e.g. 1450" value="${{e.price||''}}" /></div>
      </div>
      <div class="field">
        <label>Notes</label>
        <textarea class="f-notes" placeholder="Any notes for this ring…">${{e.notes||''}}</textarea>
      </div>
    </div>`;

  // metal switch
  el.querySelectorAll(".metal-dot").forEach(dot => {{
    dot.addEventListener("click", () => {{
      const m = dot.dataset.metal;
      entry(ring.handle).metal = m;
      el.querySelector("img").src = ring.images[m];
      el.querySelectorAll(".metal-dot").forEach(d => d.classList.toggle("active", d === dot));
      saveState();
    }});
  }});

  // keep toggle
  const keepBtn = el.querySelector(".keep-btn");
  keepBtn.addEventListener("click", () => {{
    const en = entry(ring.handle);
    en.keep = !en.keep;
    keepBtn.classList.toggle("on", en.keep);
    keepBtn.textContent = en.keep ? "✓ Keeping" : "＋ Keep";
    el.classList.toggle("kept", en.keep);
    saveState();
    if (filters.keep === "kept" && !en.keep) render();
  }});

  // field inputs
  el.querySelector(".f-name").addEventListener("input", ev => {{ entry(ring.handle).name = ev.target.value; saveState(); }});
  el.querySelector(".f-price").addEventListener("input", ev => {{ entry(ring.handle).price = ev.target.value; saveState(); }});
  el.querySelector(".f-notes").addEventListener("input", ev => {{ entry(ring.handle).notes = ev.target.value; saveState(); }});

  return el;
}}

// toolbar wiring
document.getElementById("search").addEventListener("input", e => {{ filters.q = e.target.value; render(); }});
document.getElementById("catSeg").addEventListener("click", e => {{
  if (e.target.tagName !== "BUTTON") return;
  filters.cat = e.target.dataset.cat;
  [...e.currentTarget.children].forEach(b => b.classList.toggle("active", b === e.target));
  render();
}});
document.getElementById("keepSeg").addEventListener("click", e => {{
  if (e.target.tagName !== "BUTTON") return;
  filters.keep = e.target.dataset.keep;
  [...e.currentTarget.children].forEach(b => b.classList.toggle("active", b === e.target));
  render();
}});

function csvEscape(v) {{ v = (v==null?"":String(v)); return /[",\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; }}
function download(filename, text, type) {{
  const blob = new Blob([text], {{ type }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}}

document.getElementById("exportCsv").addEventListener("click", () => {{
  const cols = ["Keep","Display Name","Price GBP","Notes","TMC Original Name","Category","Preferred Metal","TMC Price AUD","Handle","Metals Available"];
  const lines = [cols.map(csvEscape).join(",")];
  for (const ring of RINGS) {{
    const e = state[ring.handle] || {{}};
    const metals = METAL_ORDER.filter(m => ring.images[m]).map(m => METAL_LABEL[m]).join(" / ");
    lines.push([
      e.keep ? "Yes" : "No",
      e.name || "",
      e.price || "",
      e.notes || "",
      ring.tmcName,
      ring.category,
      e.metal ? METAL_LABEL[e.metal] : "",
      ring.tmcPriceAud || "",
      ring.handle,
      metals,
    ].map(csvEscape).join(","));
  }}
  download("TMC_Ring_Selection.csv", "\ufeff" + lines.join("\n"), "text/csv;charset=utf-8");
}});

document.getElementById("exportJson").addEventListener("click", () => {{
  const out = RINGS.map(ring => {{
    const e = state[ring.handle] || {{}};
    return {{
      handle: ring.handle, keep: !!e.keep, displayName: e.name || "", priceGBP: e.price || "",
      notes: e.notes || "", tmcName: ring.tmcName, category: ring.category,
      preferredMetal: e.metal || "", tmcPriceAud: ring.tmcPriceAud || "",
      metalsAvailable: METAL_ORDER.filter(m => ring.images[m]),
    }};
  }});
  download("TMC_Ring_Selection.json", JSON.stringify(out, null, 2), "application/json");
}});

document.getElementById("resetBtn").addEventListener("click", () => {{
  if (confirm("Clear all your selections and edits? This cannot be undone.")) {{
    state = {{}}; saveState(); render();
  }}
}});

render();
</script>
</body>
</html>
"""


def main():
    if not CATALOG_PATH.exists():
        raise SystemExit(f"Missing {CATALOG_PATH}. Run scrape-tmc-ring-catalog.mjs first.")
    catalog = json.loads(CATALOG_PATH.read_text())
    rings = group_rings(catalog["rows"])
    html = build_html(rings)
    OUT_PATH.write_text(html, encoding="utf-8")
    with_all_three = sum(1 for r in rings if len(r["images"]) == 3)
    print(f"Wrote {OUT_PATH}")
    print(f"  rings: {len(rings)}  (with all 3 metals: {with_all_three})")


if __name__ == "__main__":
    main()
