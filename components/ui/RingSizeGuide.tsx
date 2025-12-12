"use client";
import { useState, useEffect } from "react";

export default function RingSizeGuide(){
  const [open, setOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      <button onClick={()=>setOpen(true)} className="text-sm link-underline">Ring size guide</button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={()=>setOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl p-4 sm:p-6 my-4 sm:my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-[#6D3D0D]">
                Find your ring size (UK)
              </h3>
              <button
                onClick={()=>setOpen(false)}
                className="ml-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 text-xl"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Instructions */}
            <p className="text-xs sm:text-sm text-neutral-700 mb-4">
              UK sizes run F → Z in half sizes. Tip: wrap a strip of paper around the finger, mark, measure mm, match to the table.
            </p>

            {/* Scrollable Table Container */}
            <div className="overflow-x-auto overflow-y-auto max-h-[50vh] sm:max-h-[60vh] border rounded-lg">
              <table className="w-full text-xs sm:text-sm">
                <thead className="sticky top-0 bg-gray-50 border-b">
                  <tr className="text-left text-neutral-600">
                    <th className="py-2 sm:py-3 px-2 sm:px-3 font-medium">UK</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 font-medium">
                      <span className="hidden sm:inline">Inside Circumference (mm)</span>
                      <span className="sm:hidden">Circ (mm)</span>
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 font-medium">
                      <span className="hidden sm:inline">Inside Diameter (mm)</span>
                      <span className="sm:hidden">Dia (mm)</span>
                    </th>
                  </tr>
                </thead>
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
                    <tr key={r[0]} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-2 sm:py-3 px-2 sm:px-3 font-medium">{r[0]}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-neutral-600">{r[1]}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-neutral-600">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Note */}
            <p className="mt-4 text-xs sm:text-sm text-neutral-500 text-center sm:text-left">
              For Z+ sizes, contact us for a custom fit.
            </p>
          </div>
        </div>
      )}
    </>
  );
}














