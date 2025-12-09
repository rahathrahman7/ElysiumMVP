"use client";
import AccordionSection from "../config/AccordionSection";
import SelectCard from "../config/SelectCard";
import MetalSwatch from "../config/MetalSwatch";
import SelectionSummary from "../config/SelectionSummary";
import useSelectedCount from "./SectionSelectedCount";
import { useRouter, useSearchParams } from "next/navigation";
import { facets, parseQuery, toQuery, toggle } from "@/lib/filterSchema";

// Metal color mapping for swatches
const metalColors: Record<string, string> = {
  yellow: "#FFD700",
  white: "#F5F5F5", 
  rose: "#E8B4B8",
  platinum: "#E5E4E2"
};

export default function FilterSections() {
  const router = useRouter();
  const sp = useSearchParams();
  const state = parseQuery(sp);

  const toggleAndPush = (key: "style"|"shape"|"metal"|"collection", id: string) => {
    const next = toggle(state, key, id);
    router.push(`${location.pathname}${toQuery(next)}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(location.pathname, { scroll: false });
  };

  // Prepare items for SelectionSummary
  const summaryItems = [
    { key: "Style", value: state.style?.length ? `${state.style.length} selected` : undefined },
    { key: "Collection", value: state.collection?.length ? `${state.collection.length} selected` : undefined },
    { key: "Shape", value: state.shape?.length ? `${state.shape.length} selected` : undefined },
    { key: "Metal", value: state.metal?.length ? `${state.metal.length} selected` : undefined },
  ];

  return (
    <div className="space-y-6">
      <AccordionSection 
        title="Configure Your Ring" 
        defaultOpen={false}
        className="configurator-section"
      >
        <div className="space-y-12">
          {/* Style Section */}
          <div>
            <h4 className="font-serif text-xl text-neutral-800 mb-6 font-light tracking-wide">Choose Your Style</h4>
            <div className="configurator-grid">
              {facets.style.map(opt => (
                <SelectCard
                  key={opt.id}
                  label={opt.label}
                  active={(state.style || []).includes(opt.id)}
                  onClick={() => toggleAndPush("style", opt.id)}
                  className="config-option-card"
                  iconSrc={opt.icon}
                />
              ))}
            </div>
          </div>

          {/* Collection Section */}
          <div>
            <h4 className="font-serif text-xl text-neutral-800 mb-6 font-light tracking-wide">Choose Your Collection</h4>
            <div className="configurator-grid">
              {facets.collection.map(opt => (
                <SelectCard
                  key={opt.id}
                  label={opt.label}
                  active={(state.collection || []).includes(opt.id)}
                  onClick={() => toggleAndPush("collection", opt.id)}
                  className="config-option-card"
                />
              ))}
            </div>
          </div>

          {/* Shape Section */}
          <div>
            <h4 className="font-serif text-xl text-neutral-800 mb-6 font-light tracking-wide">Choose Your Shape</h4>
            <div className="configurator-grid">
              {facets.shape.map(opt => (
                <SelectCard
                  key={opt.id}
                  label={opt.label}
                  active={(state.shape || []).includes(opt.id)}
                  onClick={() => toggleAndPush("shape", opt.id)}
                  className="config-option-card"
                  iconSrc={opt.icon}
                />
              ))}
            </div>
          </div>

          {/* Metal Section */}
          <div>
            <h4 className="font-serif text-xl text-neutral-800 mb-6 font-light tracking-wide">Choose Your Metal</h4>
            <div className="configurator-grid">
              {facets.metal.map(opt => (
                <MetalSwatch
                  key={opt.id}
                  label={opt.label}
                  active={(state.metal || []).includes(opt.id)}
                  onClick={() => toggleAndPush("metal", opt.id)}
                  swatchColor={metalColors[opt.id] || "#F5F5F5"}
                  className="config-option-card"
                />
              ))}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Selection Summary */}
      <SelectionSummary 
        items={summaryItems}
        onClear={clearAllFilters}
      />
    </div>
  );
}
