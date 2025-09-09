"use client";
import { useState } from "react";

export default function RingSizeGuide(){
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={()=>setOpen(true)} className="text-sm link-underline">Ring size guide</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl">Find your ring size (UK)</h3>
              <button onClick={()=>setOpen(false)}>✕</button>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              UK sizes run F → Z in half sizes. Tip: wrap a strip of paper around the finger, mark, measure mm, match to the table.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-neutral-500">
                  <th className="py-2">UK</th><th>Inside Circumference (mm)</th><th>Inside Diameter (mm)</th>
                </tr></thead>
                <tbody>
                  {[
                    ["F","44.5","14.1"],["F 1/2","45.2","14.4"],["G","45.5","14.5"],["G 1/2","46.8","14.9"],
                    ["H","47.1","15.0"],["H 1/2","47.7","15.2"],["I","48.0","15.3"],["I 1/2","48.7","15.5"],
                    ["J","49.0","15.6"],["J 1/2","49.6","15.8"],["K","50.0","15.9"],["K 1/2","50.6","16.1"],
                    ["L","51.2","16.3"],["L 1/2","51.9","16.5"],["M","52.5","16.7"],["M 1/2","53.1","16.9"],
                    ["N","53.8","17.1"],["N 1/2","54.4","17.3"],["O","55.1","17.5"],["O 1/2","55.7","17.7"],
                    ["P","56.3","17.9"],["P 1/2","57.0","18.1"],["Q","57.6","18.3"],["Q 1/2","58.3","18.6"],
                    ["R","58.9","18.8"],["R 1/2","59.5","18.9"],["S","60.2","19.2"],["S 1/2","60.8","19.4"],
                    ["T","61.4","19.6"],["T 1/2","62.1","19.8"],["U","62.7","20.0"],["U 1/2","63.4","20.2"],
                    ["V","64.0","20.4"],["V 1/2","64.6","20.6"],["W","65.3","20.8"],["W 1/2","65.9","21.0"],
                    ["X","66.6","21.2"],["X 1/2","67.2","21.4"],["Y","67.8","21.6"],["Y 1/2","68.5","21.8"],
                    ["Z","69.1","22.0"]
                  ].map(r=>(
                    <tr key={r[0]} className="border-t"><td className="py-2">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-neutral-500">For Z+ sizes, contact us for a custom fit.</p>
          </div>
        </div>
      )}
    </>
  );
}








