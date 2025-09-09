export type BuildState = Partial<{
  origin: string;
  carat: string;
  colour: string;
  clarity: string;
  certificate: string;
  metal: string;
  ringSize: string;
  engravingText: string;
  engravingOn: boolean;
}>;

const KEYS: (keyof BuildState)[] = [
  "origin","carat","colour","clarity","certificate","metal","ringSize","engravingText","engravingOn"
];

export function readBuildFromSearch(sp: URLSearchParams): BuildState {
  const state: BuildState = {};
  KEYS.forEach(k => {
    const v = sp.get(String(k));
    if (v == null) return;
    if (k === "engravingOn") {
      state[k] = v === "1" || v === "true";
    } else {
      state[k] = v;
    }
  });
  return state;
}

export function writeBuildToQuery(state: BuildState, base?: URLSearchParams): string {
  const sp = new URLSearchParams(base ? base.toString() : "");
  // remove previous keys
  KEYS.forEach(k => sp.delete(String(k)));
  // set current
  Object.entries(state).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (k === "engravingOn") {
      sp.set(k, (v as boolean) ? "1" : "0");
    } else {
      sp.set(k, String(v));
    }
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function mergeBuild(base: BuildState, patch: BuildState): BuildState {
  return { ...base, ...patch };
}



