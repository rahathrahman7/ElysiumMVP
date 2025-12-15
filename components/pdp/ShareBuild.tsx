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
    <div className="flex justify-end pt-4">
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
        className="group flex items-center gap-1.5 font-serif text-[11px] uppercase tracking-[0.15em] text-[#6D3D0D]/50 hover:text-[#D4AF37] transition-colors duration-200 disabled:opacity-50"
        disabled={busy}
      >
        {busy ? (
          "Copying…"
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share this build
          </>
        )}
      </button>
    </div>
  );
}









