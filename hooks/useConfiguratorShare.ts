"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readBuildFromSearch, writeBuildToQuery, type BuildState } from "@/lib/urlState";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function debounce<T extends (...args:any[])=>void>(fn:T, ms:number){
  let t:any; 
  return (...args:Parameters<T>)=> { clearTimeout(t); t=setTimeout(()=>fn(...args), ms); };
}

export default function useConfiguratorShare(initial?: BuildState){
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [build, setBuild] = useState<BuildState>(initial || {});
  const updatingRef = useRef(false);

  // On mount: read from URL, merge with initial (URL wins), clamp engraving length
  useEffect(()=>{
    const fromUrl = readBuildFromSearch(new URLSearchParams(sp.toString()));
    const merged: BuildState = { ...initial, ...fromUrl };
    if (merged.engravingText) merged.engravingText = merged.engravingText.slice(0,24);
    setBuild(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushUrl = useMemo(()=>debounce((next: BuildState)=>{
    updatingRef.current = true;
    const q = writeBuildToQuery(next, new URLSearchParams(sp.toString()));
    router.replace(`${pathname}${q}`, { scroll: false });
    // let next tick occur then unlock
    setTimeout(()=>{ updatingRef.current=false; }, 50);
  }, 200), [pathname, router, sp]);

  // When build changes locally, reflect in URL (debounced)
  useEffect(()=>{
    if (updatingRef.current) return;
    pushUrl(build);
  }, [build, pushUrl]);

  // Expose setters
  const setField = useCallback(<K extends keyof BuildState>(key: K, value: BuildState[K])=>{
    setBuild(prev => ({ ...prev, [key]: value }));
  },[]);

  // Copy link
  const copyLink = useCallback(async ()=>{
    const q = writeBuildToQuery(build, new URLSearchParams(sp.toString()));
    const url = `${window.location.origin}${pathname}${q}`;
    await navigator.clipboard.writeText(url);
    // fire toast event
    window.dispatchEvent(new CustomEvent("toast", { detail: { type:"success", text:"Link copied to clipboard" }}));
    return url;
  }, [build, pathname, sp]);

  return { build, setBuild, setField, copyLink };
}



