"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Ring = {
  handle: string;
  tmcName: string;
  suggested: string;
  category: string;
  tmcPriceAud: string;
  isNew?: boolean;
  images: Partial<Record<"yellow" | "white" | "rose", string>>;
};

type RingOptions = {
  metals: string[];
  origins: string[];
  carats: string[];
  colours: string[];
  clarities: string[];
  certificates: string[];
  sizes: string;
};

type Review = {
  keep: boolean;
  displayName: string;
  priceGbp: string;
  notes: string;
  preferredMetal: string;
  options?: RingOptions;
};

const METAL_ORDER: Array<"yellow" | "white" | "rose"> = ["yellow", "white", "rose"];
const METAL_LABEL: Record<string, string> = {
  yellow: "Yellow Gold",
  white: "White Gold",
  rose: "Rose Gold",
};

// Mirrors the ELYSIUM product configurator options.
const OPTION_GROUPS: Array<{ key: keyof Omit<RingOptions, "sizes">; label: string; values: string[] }> = [
  {
    key: "metals",
    label: "Metals",
    values: [
      "Yellow Gold",
      "Rose Gold",
      "White Gold",
      "Platinum",
      "Two-Tone Rose/Platinum",
      "Two-Tone Yellow/Platinum",
    ],
  },
  { key: "origins", label: "Diamond origin", values: ["Natural", "Lab Grown"] },
  { key: "carats", label: "Carat", values: ["1ct", "1.5ct", "2ct", "2.5ct", "3ct+"] },
  { key: "colours", label: "Colour", values: ["D", "E", "F"] },
  { key: "clarities", label: "Clarity", values: ["IF", "VVS1", "VVS2", "VS1"] },
  { key: "certificates", label: "Certificate", values: ["GIA", "IGI"] },
];

function defaultOptions(): RingOptions {
  return {
    metals: ["Yellow Gold", "Rose Gold", "White Gold", "Platinum"],
    origins: ["Natural", "Lab Grown"],
    carats: ["1ct", "1.5ct", "2ct", "2.5ct", "3ct+"],
    colours: ["D", "E", "F"],
    clarities: ["IF", "VVS1", "VVS2", "VS1"],
    certificates: ["GIA", "IGI"],
    sizes: "F – Z+4",
  };
}

function emptyReview(): Review {
  return { keep: false, displayName: "", priceGbp: "", notes: "", preferredMetal: "" };
}

export default function ReviewClient() {
  const [rings, setRings] = useState<Ring[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [cat, setCat] = useState<"all" | "Engagement" | "Wedding" | "Fine Jewellery">("all");
  const [fjSub, setFjSub] = useState<"all" | "Earrings" | "Necklaces" | "Bracelets" | "Fine Rings">("all");
  const [keepFilter, setKeepFilter] = useState<"all" | "kept" | "new">("all");
  const [q, setQ] = useState("");

  function sectionOf(category: string): "Engagement" | "Wedding" | "Fine Jewellery" {
    if (category.includes("Fine Jewellery")) return "Fine Jewellery";
    if (category.includes("Engagement")) return "Engagement";
    return "Wedding";
  }

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const savingCount = useRef(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Load catalog independently so a broken reviews API never blanks the grid.
        const catalogRes = await fetch("/data/tmc-review-catalog.json");
        const catalog: Ring[] = catalogRes.ok ? await catalogRes.json() : [];
        if (!active) return;
        setRings(Array.isArray(catalog) ? catalog : []);

        try {
          const reviewRes = await fetch("/api/tmc-review");
          const rev = reviewRes.ok
            ? await reviewRes.json()
            : await reviewRes.json().catch(() => ({ reviews: {} }));
          if (!active) return;
          setReviews(rev.reviews || {});
        } catch {
          if (active) setReviews({});
        }
      } catch {
        if (active) setRings([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function getReview(handle: string): Review {
    return reviews[handle] || emptyReview();
  }

  async function persist(handle: string, patch: Partial<Review>) {
    savingCount.current += 1;
    setSaveState("saving");
    try {
      const res = await fetch("/api/tmc-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, ...patch }),
      });
      if (!res.ok) throw new Error("save failed");
      savingCount.current -= 1;
      if (savingCount.current <= 0) {
        savingCount.current = 0;
        setSaveState("saved");
      }
    } catch {
      savingCount.current = Math.max(0, savingCount.current - 1);
      setSaveState("error");
    }
  }

  function update(handle: string, patch: Partial<Review>, opts?: { immediate?: boolean }) {
    setReviews((prev) => ({ ...prev, [handle]: { ...emptyReview(), ...prev[handle], ...patch } }));
    if (opts?.immediate) {
      persist(handle, patch);
    } else {
      clearTimeout(timers.current[handle]);
      setSaveState("saving");
      timers.current[handle] = setTimeout(() => persist(handle, patch), 700);
    }
  }

  // Add / remove a ring from the "we want this" list. When first added, seed
  // the configurator options with the standard ELYSIUM set for the client to trim.
  function toggleKeep(ring: Ring) {
    const current = getReview(ring.handle);
    const next = !current.keep;
    const patch: Partial<Review> = { keep: next };
    if (next && !current.options) patch.options = defaultOptions();
    update(ring.handle, patch, { immediate: true });
  }

  function currentOptions(handle: string): RingOptions {
    return getReview(handle).options || defaultOptions();
  }

  function toggleOption(handle: string, key: keyof Omit<RingOptions, "sizes">, value: string) {
    const opts = currentOptions(handle);
    const set = new Set(opts[key]);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    update(handle, { options: { ...opts, [key]: Array.from(set) } });
  }

  function setSizes(handle: string, sizes: string) {
    update(handle, { options: { ...currentOptions(handle), sizes } });
  }

  const keptCount = useMemo(() => Object.values(reviews).filter((r) => r?.keep).length, [reviews]);

  const stats = useMemo(() => {
    const eng = rings.filter((r) => r.category.includes("Engagement")).length;
    const wed = rings.filter((r) => r.category.includes("Wedding")).length;
    const fj = rings.filter((r) => r.category.includes("Fine Jewellery")).length;
    const fresh = rings.filter((r) => r.isNew).length;
    return { total: rings.length, eng, wed, fj, fresh };
  }, [rings]);

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rings.filter((ring) => {
      if (cat === "Engagement" && !ring.category.includes("Engagement")) return false;
      if (cat === "Wedding" && !ring.category.includes("Wedding")) return false;
      if (cat === "Fine Jewellery" && !ring.category.includes("Fine Jewellery")) return false;
      if (cat === "Fine Jewellery" && fjSub !== "all" && !ring.category.includes(fjSub)) return false;
      if (keepFilter === "kept" && !getReview(ring.handle).keep) return false;
      if (keepFilter === "new" && !ring.isNew) return false;
      if (query) {
        const hay = `${ring.tmcName} ${ring.suggested}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rings, reviews, cat, fjSub, keepFilter, q]);

  // Build the grid with section headers so Fine Jewellery isn't buried under rings.
  const gridItems = useMemo(() => {
    const items: Array<{ kind: "header"; title: string; count: number } | { kind: "ring"; ring: Ring }> = [];
    let lastSection = "";
    for (const ring of visible) {
      const section = sectionOf(ring.category);
      if (cat === "all" && section !== lastSection) {
        const count = visible.filter((r) => sectionOf(r.category) === section).length;
        items.push({ kind: "header", title: section, count });
        lastSection = section;
      }
      items.push({ kind: "ring", ring });
    }
    return items;
  }, [visible, cat]);

  function firstMetal(ring: Ring) {
    for (const m of METAL_ORDER) if (ring.images[m]) return m;
    return METAL_ORDER[0];
  }

  function exportCsv() {
    const cols = [
      "Add to ELYSIUM",
      "Display Name",
      "Price GBP",
      "Notes",
      "Metals",
      "Diamond Origin",
      "Carats",
      "Colours",
      "Clarities",
      "Certificates",
      "Ring Sizes",
      "TMC Original Name",
      "Category",
      "TMC Price AUD",
      "Handle",
    ];
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [cols.map(esc).join(",")];
    for (const ring of rings) {
      const r = getReview(ring.handle);
      const o = r.keep ? r.options || defaultOptions() : undefined;
      lines.push(
        [
          r.keep ? "Yes" : "No",
          r.displayName,
          r.priceGbp,
          r.notes,
          o ? o.metals.join("; ") : "",
          o ? o.origins.join("; ") : "",
          o ? o.carats.join("; ") : "",
          o ? o.colours.join("; ") : "",
          o ? o.clarities.join("; ") : "",
          o ? o.certificates.join("; ") : "",
          o ? o.sizes : "",
          ring.tmcName,
          ring.category,
          ring.tmcPriceAud,
          ring.handle,
        ]
          .map(esc)
          .join(",")
      );
    }
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TMC_Ring_Selection.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const saveLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
      ? "All changes saved"
      : saveState === "error"
      ? "Save failed — check connection"
      : "Changes save automatically";

  return (
    <div className="tmc-review">
      <style>{CSS}</style>

      <header className="tr-header">
        <div className="tr-header-row">
          <div className="tr-brand">
            ELYSIUM<small>TMC Selection · Rings &amp; Fine Jewellery</small>
          </div>
          <div className="tr-stats">
            <div className="tr-stat">
              <div className="n">{stats.total}</div>
              <div className="l">Total</div>
            </div>
            <div className="tr-stat">
              <div className="n">{stats.eng}</div>
              <div className="l">Engagement</div>
            </div>
            <div className="tr-stat">
              <div className="n">{stats.wed}</div>
              <div className="l">Wedding</div>
            </div>
            <div className="tr-stat">
              <div className="n">{stats.fj}</div>
              <div className="l">Fine Jewellery</div>
            </div>
            <div className="tr-pill">Adding: {keptCount}</div>
          </div>
        </div>

        <p className="tr-intro">
          Browse rings and fine jewellery below. Use the category tabs — tap{" "}
          <strong>Fine Jewellery</strong> for earrings, necklaces, bracelets and fine rings, or{" "}
          <strong>New drop</strong> for the August TMC additions. Tap{" "}
          <strong>Add to ELYSIUM</strong> on pieces you want listed, then rename, price, note, and choose
          options. Everything saves automatically.
        </p>

        <div className="tr-toolbar">
          <input
            type="search"
            placeholder="Search by name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="tr-seg">
            {(
              [
                ["all", "All", stats.total],
                ["Engagement", "Engagement", stats.eng],
                ["Wedding", "Wedding", stats.wed],
                ["Fine Jewellery", "Fine Jewellery", stats.fj],
              ] as const
            ).map(([key, label, count]) => (
              <button
                key={key}
                className={cat === key ? "active" : ""}
                onClick={() => {
                  setCat(key);
                  if (key !== "Fine Jewellery") setFjSub("all");
                }}
              >
                {label} <em>{count}</em>
              </button>
            ))}
          </div>
          <div className="tr-seg">
            <button className={keepFilter === "all" ? "active" : ""} onClick={() => setKeepFilter("all")}>
              Show all
            </button>
            <button className={keepFilter === "kept" ? "active" : ""} onClick={() => setKeepFilter("kept")}>
              Added only
            </button>
            {stats.fresh > 0 && (
              <button className={keepFilter === "new" ? "active" : ""} onClick={() => setKeepFilter("new")}>
                New drop <em>{stats.fresh}</em>
              </button>
            )}
          </div>
          <button className="tr-btn" onClick={exportCsv}>
            Export CSV
          </button>
          <span className={`tr-save tr-save-${saveState}`}>{saveLabel}</span>
        </div>

        {cat === "Fine Jewellery" && (
          <div className="tr-subfilter">
            {(
              [
                ["all", "All fine jewellery"],
                ["Earrings", "Earrings"],
                ["Necklaces", "Necklaces"],
                ["Bracelets", "Bracelets"],
                ["Fine Rings", "Fine rings"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                className={fjSub === key ? "active" : ""}
                onClick={() => setFjSub(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="tr-main">
        {loading ? (
          <div className="tr-empty">Loading catalogue…</div>
        ) : visible.length === 0 ? (
          <div className="tr-empty">No pieces match your filters.</div>
        ) : (
          <div className="tr-grid">
            {gridItems.map((item) => {
              if (item.kind === "header") {
                return (
                  <div key={`h-${item.title}`} className="tr-section">
                    <h2>{item.title}</h2>
                    <span>{item.count} pieces</span>
                    {item.title === "Fine Jewellery" && cat === "all" && (
                      <button type="button" onClick={() => setCat("Fine Jewellery")}>
                        View fine jewellery only →
                      </button>
                    )}
                  </div>
                );
              }
              const ring = item.ring;
              const r = getReview(ring.handle);
              const active =
                r.preferredMetal && ring.images[r.preferredMetal as keyof Ring["images"]]
                  ? (r.preferredMetal as "yellow" | "white" | "rose")
                  : firstMetal(ring);
              const o = currentOptions(ring.handle);
              return (
                <div key={ring.handle} className={`tr-card${r.keep ? " kept" : ""}`}>
                  <div className="tr-imgwrap">
                    <div className="tr-cat">
                      {ring.category}
                      {ring.isNew ? <span className="tr-new">New</span> : null}
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" src={ring.images[active]} alt={ring.tmcName} />
                    <div className="tr-metals">
                      {METAL_ORDER.filter((m) => ring.images[m]).map((m) => (
                        <button
                          key={m}
                          className={`tr-dot m-${m}${m === active ? " active" : ""}`}
                          title={METAL_LABEL[m]}
                          onClick={() => update(ring.handle, { preferredMetal: m }, { immediate: true })}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="tr-body">
                    <div className="tr-tmc">{ring.tmcName}</div>
                    <div className="tr-keeprow">
                      <button
                        className={`tr-keep${r.keep ? " on" : ""}`}
                        onClick={() => toggleKeep(ring)}
                      >
                        {r.keep ? "✓ Adding to ELYSIUM" : "＋ Add to ELYSIUM"}
                      </button>
                      <span className="tr-ref">TMC ref: A${ring.tmcPriceAud || "—"}</span>
                    </div>

                    {r.keep && (
                      <>
                        <div className="tr-field">
                          <label>Display name</label>
                          <input
                            type="text"
                            placeholder={ring.suggested}
                            value={r.displayName}
                            onChange={(e) => update(ring.handle, { displayName: e.target.value })}
                          />
                        </div>
                        <div className="tr-field">
                          <label>Price (GBP)</label>
                          <div className="tr-price">
                            <span>£</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="e.g. 1450"
                              value={r.priceGbp}
                              onChange={(e) => update(ring.handle, { priceGbp: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="tr-field">
                          <label>Notes</label>
                          <textarea
                            placeholder="Any notes for this piece…"
                            value={r.notes}
                            onChange={(e) => update(ring.handle, { notes: e.target.value })}
                          />
                        </div>

                        <details className="tr-opts" open>
                          <summary>Configurator options</summary>
                          {OPTION_GROUPS.map((group) => (
                            <div key={group.key} className="tr-optgroup">
                              <label>{group.label}</label>
                              <div className="tr-chips">
                                {group.values.map((v) => {
                                  const on = o[group.key].includes(v);
                                  return (
                                    <button
                                      key={v}
                                      type="button"
                                      className={`tr-chip${on ? " on" : ""}`}
                                      onClick={() => toggleOption(ring.handle, group.key, v)}
                                    >
                                      {v}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          <div className="tr-optgroup">
                            <label>Ring sizes offered</label>
                            <input
                              type="text"
                              className="tr-sizes"
                              placeholder="e.g. F – Z+4"
                              value={o.sizes}
                              onChange={(e) => setSizes(ring.handle, e.target.value)}
                            />
                          </div>
                        </details>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="tr-footer">
        ELYSIUM × TMC selection · Rings &amp; fine jewellery · Images are 3D metal renders · Edits save automatically.
      </footer>
    </div>
  );
}

const CSS = `
.tmc-review {
  --bg:#f6f1ea; --card:#fff; --ink:#3d2a17; --brown:#6d3d0d; --gold:#c8a24a;
  --muted:#9b8b76; --line:#e7ded1; --shadow:0 6px 24px rgba(109,61,13,0.08);
  background:var(--bg); color:var(--ink); min-height:100vh;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
}
.tmc-review *{box-sizing:border-box;}
.tr-header{position:sticky;top:0;z-index:50;background:rgba(246,241,234,0.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);padding:16px 24px;}
.tr-header-row{display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
.tr-brand{font-size:26px;font-weight:600;letter-spacing:0.14em;color:var(--brown);text-transform:uppercase;font-family:var(--font-cormorant),Georgia,serif;}
.tr-brand small{display:block;font-size:10px;letter-spacing:0.3em;color:var(--muted);margin-top:2px;font-family:inherit;}
.tr-stats{display:flex;gap:18px;margin-left:auto;align-items:center;flex-wrap:wrap;}
.tr-stat{text-align:center;}
.tr-stat .n{font-size:22px;font-weight:700;color:var(--brown);}
.tr-stat .l{font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:var(--muted);}
.tr-pill{background:var(--brown);color:#fff;padding:10px 18px;border-radius:999px;font-weight:600;font-size:14px;}
.tr-intro{margin:12px 0 0;font-size:13px;color:var(--muted);max-width:900px;line-height:1.5;}
.tr-intro strong{color:var(--brown);}
.tr-toolbar{display:flex;gap:12px;margin-top:14px;flex-wrap:wrap;align-items:center;}
.tr-toolbar input[type=search]{flex:1;min-width:220px;padding:11px 16px;border:1px solid var(--line);border-radius:10px;font-size:14px;background:#fff;color:var(--ink);}
.tr-seg{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;}
.tr-seg button{border:0;background:transparent;padding:10px 14px;font-size:13px;cursor:pointer;color:var(--ink);white-space:nowrap;}
.tr-seg button em{font-style:normal;opacity:0.65;margin-left:4px;font-size:11px;}
.tr-seg button.active{background:var(--brown);color:#fff;}
.tr-seg button.active em{opacity:0.85;}
.tr-subfilter{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
.tr-subfilter button{border:1px solid var(--line);background:#fff;color:var(--ink);padding:7px 14px;border-radius:999px;font-size:12px;cursor:pointer;}
.tr-subfilter button.active{background:var(--gold);border-color:var(--gold);color:#3d2a17;font-weight:600;}
.tr-btn{border:1px solid var(--brown);background:var(--brown);color:#fff;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;}
.tr-save{font-size:12px;color:var(--muted);}
.tr-save-saved{color:#2e7d32;}
.tr-save-error{color:#c0392b;}
.tr-main{padding:24px;max-width:1500px;margin:0 auto;}
.tr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;align-items:start;}
.tr-section{grid-column:1 / -1;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;padding:18px 4px 4px;border-top:1px solid var(--line);margin-top:8px;}
.tr-section:first-child{border-top:0;margin-top:0;padding-top:0;}
.tr-section h2{margin:0;font-size:18px;letter-spacing:0.12em;text-transform:uppercase;color:var(--brown);font-family:var(--font-cormorant),Georgia,serif;}
.tr-section span{font-size:12px;color:var(--muted);}
.tr-section button{margin-left:auto;border:0;background:transparent;color:var(--brown);font-size:13px;font-weight:600;cursor:pointer;text-decoration:underline;}
.tr-card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column;transition:border-color .2s,box-shadow .2s;}
.tr-card.kept{border-color:var(--gold);box-shadow:0 0 0 2px var(--gold),var(--shadow);}
.tr-imgwrap{position:relative;aspect-ratio:1/1;background:#efe7db;}
.tr-imgwrap img{width:100%;height:100%;object-fit:contain;padding:12px;}
.tr-cat{position:absolute;top:10px;left:10px;background:rgba(255,255,255,0.9);color:var(--brown);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 9px;border-radius:999px;display:flex;align-items:center;gap:6px;}
.tr-new{background:var(--gold);color:#3d2a17;font-size:9px;letter-spacing:0.12em;padding:2px 6px;border-radius:999px;font-weight:700;}
.tr-metals{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:8px;background:rgba(255,255,255,0.85);padding:6px 8px;border-radius:999px;}
.tr-dot{width:20px;height:20px;border-radius:50%;border:2px solid #fff;cursor:pointer;box-shadow:0 0 0 1px var(--line);padding:0;}
.tr-dot.active{box-shadow:0 0 0 2px var(--brown);}
.m-yellow{background:#e8c66a;}
.m-white{background:#e6e6e6;}
.m-rose{background:#e2b7a3;}
.tr-body{padding:14px;display:flex;flex-direction:column;gap:10px;flex:1;}
.tr-tmc{font-size:11px;color:var(--muted);min-height:28px;}
.tr-keeprow{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.tr-keep{border:1px solid var(--line);background:#fff;color:var(--ink);padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;flex:1;text-align:center;}
.tr-keep.on{background:var(--gold);border-color:var(--gold);color:#3d2a17;}
.tr-ref{font-size:11px;color:var(--muted);white-space:nowrap;}
.tr-field label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);margin-bottom:4px;}
.tr-field input,.tr-field textarea{width:100%;padding:9px 11px;border:1px solid var(--line);border-radius:9px;font-size:13px;font-family:inherit;background:#fdfbf8;color:var(--ink);}
.tr-field textarea{resize:vertical;min-height:46px;}
.tr-price{position:relative;}
.tr-price span{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:13px;}
.tr-price input{padding-left:24px;}
.tr-opts{border:1px solid var(--line);border-radius:10px;background:#fdfbf8;padding:8px 10px;}
.tr-opts summary{cursor:pointer;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:var(--brown);font-weight:600;}
.tr-optgroup{margin-top:10px;}
.tr-optgroup label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);margin-bottom:5px;}
.tr-chips{display:flex;flex-wrap:wrap;gap:6px;}
.tr-chip{border:1px solid var(--line);background:#fff;color:var(--muted);padding:5px 10px;border-radius:999px;font-size:12px;cursor:pointer;transition:all .15s;}
.tr-chip.on{background:var(--brown);border-color:var(--brown);color:#fff;}
.tr-sizes{width:100%;padding:8px 11px;border:1px solid var(--line);border-radius:9px;font-size:13px;font-family:inherit;background:#fff;color:var(--ink);}
.tr-empty{text-align:center;padding:60px;color:var(--muted);}
.tr-footer{text-align:center;padding:30px;color:var(--muted);font-size:12px;}
@media (max-width:640px){.tr-brand{font-size:20px;}.tr-main{padding:14px;}}
`;
