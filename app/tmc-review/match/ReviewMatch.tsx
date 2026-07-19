"use client";

import { useEffect, useMemo, useState } from "react";

type Original = {
  slug: string;
  title: string;
  blurb: string;
  image: string;
  hint: string;
  isMensBand: boolean;
};

type Ring = {
  handle: string;
  tmcName: string;
  category: string;
  images: Partial<Record<"yellow" | "white" | "rose", string>>;
};

type Match = { elysiumTitle: string; tmcHandle: string };

const METAL_ORDER: Array<"yellow" | "white" | "rose"> = ["yellow", "white", "rose"];

function firstImage(ring: Ring) {
  for (const m of METAL_ORDER) if (ring.images[m]) return ring.images[m];
  return "";
}

export default function ReviewMatch() {
  const [originals, setOriginals] = useState<Original[]>([]);
  const [tmc, setTmc] = useState<Ring[]>([]);
  const [matches, setMatches] = useState<Record<string, Match>>({});
  const [selected, setSelected] = useState<string>("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    (async () => {
      try {
        const [oRes, tRes, mRes] = await Promise.all([
          fetch("/data/elysium-originals.json"),
          fetch("/data/tmc-review-catalog.json"),
          fetch("/api/tmc-matches"),
        ]);
        const o: Original[] = await oRes.json();
        const t: Ring[] = await tRes.json();
        const m = await mRes.json().catch(() => ({ bySlug: {} }));
        setOriginals(o);
        setTmc(t);
        setMatches(m.bySlug || {});
        const firstUnmatched = o.find((x) => !(m.bySlug || {})[x.slug]?.tmcHandle) || o[0];
        if (firstUnmatched) {
          setSelected(firstUnmatched.slug);
          setQ(firstUnmatched.hint || "");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const current = originals.find((o) => o.slug === selected);
  const matchedCount = useMemo(
    () => Object.values(matches).filter((m) => m.tmcHandle).length,
    [matches]
  );
  const usedHandles = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [slug, m] of Object.entries(matches)) {
      if (m.tmcHandle) map[m.tmcHandle] = slug;
    }
    return map;
  }, [matches]);

  const tmcByHandle = useMemo(() => {
    const map: Record<string, Ring> = {};
    for (const r of tmc) map[r.handle] = r;
    return map;
  }, [tmc]);

  function selectOriginal(o: Original) {
    setSelected(o.slug);
    const existing = matches[o.slug]?.tmcHandle;
    setQ(existing ? tmcByHandle[existing]?.tmcName || "" : o.hint || "");
  }

  function nextUnmatched(afterSlug: string) {
    const idx = originals.findIndex((o) => o.slug === afterSlug);
    for (let i = idx + 1; i < originals.length; i++) {
      if (!matches[originals[i].slug]?.tmcHandle) return originals[i];
    }
    for (let i = 0; i < originals.length; i++) {
      if (!matches[originals[i].slug]?.tmcHandle) return originals[i];
    }
    return undefined;
  }

  async function save(slug: string, title: string, tmcHandle: string | null) {
    setSaveState("saving");
    setMatches((prev) => ({ ...prev, [slug]: { elysiumTitle: title, tmcHandle: tmcHandle || "" } }));
    try {
      const res = await fetch("/api/tmc-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elysiumSlug: slug, elysiumTitle: title, tmcHandle }),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function link(ring: Ring) {
    if (!current) return;
    save(current.slug, current.title, ring.handle);
    const nxt = nextUnmatched(current.slug);
    if (nxt) selectOriginal(nxt);
  }

  function clearMatch() {
    if (!current) return;
    save(current.slug, current.title, null);
  }

  const filteredTmc = useMemo(() => {
    const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return tmc;
    return tmc.filter((r) => {
      const hay = r.tmcName.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [tmc, q]);

  const currentMatch = current ? matches[current.slug]?.tmcHandle : "";
  const saveLabel =
    saveState === "saving" ? "Saving…" :
    saveState === "saved" ? "Saved" :
    saveState === "error" ? "Save failed" : "";

  return (
    <div className="tm">
      <style>{CSS}</style>

      <header className="tm-header">
        <div className="tm-brand">ELYSIUM<small>TMC Ring Matcher · internal</small></div>
        <div className="tm-progress">Matched {matchedCount} / {originals.length}</div>
        <a className="tm-link" href="/tmc-review">← Back to client review</a>
        <span className={`tm-save tm-save-${saveState}`}>{saveLabel}</span>
      </header>

      {loading ? (
        <div className="tm-empty">Loading…</div>
      ) : (
        <div className="tm-body">
          <aside className="tm-list">
            {originals.map((o) => {
              const m = matches[o.slug]?.tmcHandle;
              return (
                <button
                  key={o.slug}
                  className={`tm-item${o.slug === selected ? " active" : ""}${m ? " done" : ""}`}
                  onClick={() => selectOriginal(o)}
                >
                  <span className="tm-item-dot">{m ? "✓" : "○"}</span>
                  <span className="tm-item-title">{o.title}</span>
                </button>
              );
            })}
          </aside>

          <main className="tm-main">
            {current && (
              <>
                <div className="tm-current">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="tm-current-img" src={current.image} alt={current.title} />
                  <div className="tm-current-meta">
                    <div className="tm-current-label">Our ring</div>
                    <h2 className="tm-current-title">{current.title}</h2>
                    <p className="tm-current-blurb">{current.blurb}</p>
                    {currentMatch ? (
                      <div className="tm-linked">
                        Linked to: <strong>{tmcByHandle[currentMatch]?.tmcName || currentMatch}</strong>
                        <button className="tm-clear" onClick={clearMatch}>Clear</button>
                      </div>
                    ) : (
                      <div className="tm-unlinked">Not yet linked — pick the matching TMC ring below.</div>
                    )}
                  </div>
                </div>

                <div className="tm-search-row">
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search TMC rings…"
                  />
                  <span className="tm-count">{filteredTmc.length} TMC rings</span>
                </div>

                <div className="tm-grid">
                  {filteredTmc.map((ring) => {
                    const usedBy = usedHandles[ring.handle];
                    const isThis = usedBy === current.slug;
                    const usedElse = usedBy && usedBy !== current.slug;
                    return (
                      <button
                        key={ring.handle}
                        className={`tm-card${isThis ? " picked" : ""}${usedElse ? " used" : ""}`}
                        onClick={() => link(ring)}
                        title={usedElse ? `Already linked to ${usedBy}` : ring.tmcName}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img loading="lazy" src={firstImage(ring)} alt={ring.tmcName} />
                        <span className="tm-card-name">{ring.tmcName}</span>
                        {isThis && <span className="tm-badge picked">✓ Linked</span>}
                        {usedElse && <span className="tm-badge used">Used</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

const CSS = `
.tm{--bg:#f6f1ea;--card:#fff;--ink:#3d2a17;--brown:#6d3d0d;--gold:#c8a24a;--muted:#9b8b76;--line:#e7ded1;
  background:var(--bg);color:var(--ink);min-height:100vh;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;}
.tm *{box-sizing:border-box;}
.tm-header{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:20px;
  background:rgba(246,241,234,0.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);padding:14px 24px;}
.tm-brand{font-size:22px;font-weight:600;letter-spacing:0.14em;color:var(--brown);text-transform:uppercase;font-family:var(--font-cormorant),Georgia,serif;}
.tm-brand small{display:block;font-size:10px;letter-spacing:0.28em;color:var(--muted);margin-top:2px;font-family:inherit;}
.tm-progress{background:var(--brown);color:#fff;padding:8px 16px;border-radius:999px;font-weight:600;font-size:13px;}
.tm-link{margin-left:auto;color:var(--brown);font-size:13px;text-decoration:none;font-weight:600;}
.tm-save{font-size:12px;color:var(--muted);min-width:64px;}
.tm-save-saved{color:#2e7d32;}.tm-save-error{color:#c0392b;}
.tm-body{display:grid;grid-template-columns:280px 1fr;gap:0;align-items:start;}
.tm-list{position:sticky;top:64px;max-height:calc(100vh - 64px);overflow-y:auto;border-right:1px solid var(--line);padding:12px;display:flex;flex-direction:column;gap:4px;background:#fbf8f3;}
.tm-item{display:flex;align-items:center;gap:10px;text-align:left;border:0;background:transparent;padding:10px 12px;border-radius:9px;cursor:pointer;font-size:13px;color:var(--ink);}
.tm-item:hover{background:#f1e9dd;}
.tm-item.active{background:var(--brown);color:#fff;}
.tm-item.done .tm-item-dot{color:#2e7d32;}
.tm-item.active.done .tm-item-dot{color:#bfe3c0;}
.tm-item-dot{font-weight:700;}
.tm-item-title{flex:1;}
.tm-main{padding:20px 24px;}
.tm-current{display:flex;gap:20px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:18px;}
.tm-current-img{width:150px;height:150px;object-fit:contain;background:#efe7db;border-radius:12px;padding:8px;flex-shrink:0;}
.tm-current-label{font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:var(--muted);}
.tm-current-title{font-size:24px;margin:2px 0 6px;font-family:var(--font-cormorant),Georgia,serif;color:var(--brown);}
.tm-current-blurb{font-size:13px;color:var(--ink);margin:0 0 10px;max-width:640px;}
.tm-linked{font-size:13px;color:#2e7d32;}
.tm-linked strong{color:var(--ink);}
.tm-clear{margin-left:10px;border:1px solid var(--line);background:#fff;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;color:var(--ink);}
.tm-unlinked{font-size:13px;color:var(--muted);}
.tm-search-row{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.tm-search-row input{flex:1;padding:11px 16px;border:1px solid var(--line);border-radius:10px;font-size:14px;background:#fff;color:var(--ink);}
.tm-count{font-size:12px;color:var(--muted);}
.tm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;padding-bottom:40px;}
.tm-card{position:relative;border:1px solid var(--line);background:#fff;border-radius:12px;padding:8px;cursor:pointer;display:flex;flex-direction:column;gap:6px;text-align:center;}
.tm-card:hover{border-color:var(--gold);}
.tm-card.picked{border-color:#2e7d32;box-shadow:0 0 0 2px #2e7d32;}
.tm-card.used{opacity:0.55;}
.tm-card img{width:100%;aspect-ratio:1/1;object-fit:contain;background:#efe7db;border-radius:8px;padding:6px;}
.tm-card-name{font-size:11px;color:var(--ink);line-height:1.25;}
.tm-badge{position:absolute;top:6px;right:6px;font-size:9px;font-weight:700;text-transform:uppercase;padding:3px 6px;border-radius:6px;}
.tm-badge.picked{background:#2e7d32;color:#fff;}
.tm-badge.used{background:#b98a2a;color:#fff;}
.tm-empty{padding:60px;text-align:center;color:var(--muted);}
@media (max-width:800px){.tm-body{grid-template-columns:1fr;}.tm-list{position:static;max-height:220px;border-right:0;border-bottom:1px solid var(--line);}}
`;
