"use client";
import { useEffect, useState } from "react";

export default function ShareBuild({ onShare }:{ onShare: ()=>Promise<string>|void }){
  const [busy, setBusy] = useState(false);
  useEffect(()=>{
    const handler = (e:any)=>{
      // naive toast render — relies on globals.css helper
      const { type, text } = e.detail || {};
      const bar = document.createElement("div");
      bar.className = `toast ${type || "info"}`;
      bar.textContent = text || "Done";
      document.body.appendChild(bar);
      requestAnimationFrame(()=> bar.classList.add("show"));
      setTimeout(()=>{ bar.classList.remove("show"); setTimeout(()=>bar.remove(), 250); }, 1600);
    };
    window.addEventListener("toast", handler as any);
    return ()=> window.removeEventListener("toast", handler as any);
  },[]);

  return (
    <button
      type="button"
      aria-label="Share this build"
      onClick={async ()=>{
        try{
          setBusy(true);
          await onShare();
        } finally {
          setBusy(false);
        }
      }}
      className="rounded-full border border-[var(--gold)] bg-white px-4 py-2 text-sm hover:bg-[color-mix(in_srgb,var(--gold)_10%,#fff)] transition disabled:opacity-60"
      disabled={busy}
    >
      {busy ? "Copying…" : "Share this build"}
    </button>
  );
}









