"use client";

import React, { useState } from "react";
import { COFFEE_ORIGINS } from "../../data/coffeeData";
import { CoffeeOrigin } from "../../types/coffee";
import { Globe, MapPin, Mountain, Flame, Compass } from "lucide-react";

export default function OriginSection() {
  const [selectedOrigin, setSelectedOrigin] = useState<CoffeeOrigin>(COFFEE_ORIGINS[0]);

  return (
    <section id="origins-section" className="relative w-full py-24 px-4 md:px-12 bg-[#070605] overflow-hidden">
      {/* Background World Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#26180e_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>SINGLE-ORIGIN DIRECT TRADE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-100 tracking-tight mb-4">
            Terroir, Altitude & <span className="italic font-normal text-amber-300">Origin</span>
          </h2>
          <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
            We partner with independent micro-lot farmers who harvest above 1,700 meters. Explore each estate’s microclimate, varietal, and sensory radar.
          </p>
        </div>

        {/* Origin Selector Pills */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {COFFEE_ORIGINS.map((origin) => (
            <button
              key={origin.id}
              onClick={() => setSelectedOrigin(origin)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono flex items-center gap-2 transition-all duration-300 ${
                selectedOrigin.id === origin.id
                  ? "bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/25 scale-105"
                  : "glass-panel-light text-stone-300 hover:text-stone-100 hover:border-amber-500/40"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{origin.country} • {origin.farm}</span>
            </button>
          ))}
        </div>

        {/* Origin Details Card */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-amber-500/20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Compass className="w-4 h-4" />
                <span>COORDINATES: {selectedOrigin.coordinates}</span>
              </div>

              <div>
                <h3 className="text-3xl md:text-4xl font-serif font-light text-stone-100 mb-2">
                  {selectedOrigin.farm}
                </h3>
                <p className="text-sm font-mono text-stone-400">
                  {selectedOrigin.region}, {selectedOrigin.country}
                </p>
              </div>

              <p className="text-stone-300 text-sm md:text-base font-light leading-relaxed">
                {selectedOrigin.story}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800/80 font-mono text-xs">
                <div>
                  <div className="text-stone-500 text-[10px] flex items-center gap-1 mb-1">
                    <Mountain className="w-3 h-3 text-amber-400" />
                    <span>ALTITUDE</span>
                  </div>
                  <div className="text-stone-200 font-semibold">{selectedOrigin.altitude}</div>
                </div>

                <div>
                  <div className="text-stone-500 text-[10px] mb-1">VARIETAL</div>
                  <div className="text-stone-200 font-semibold">{selectedOrigin.varietal}</div>
                </div>

                <div>
                  <div className="text-stone-500 text-[10px] mb-1">PROCESS</div>
                  <div className="text-stone-200 font-semibold">{selectedOrigin.process}</div>
                </div>
              </div>

              {/* Flavor Tags */}
              <div className="pt-2">
                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-2">
                  Dominant Flavor Notes
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedOrigin.notes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Flavor Profile Matrix */}
            <div className="lg:col-span-5 bg-stone-950/60 p-6 md:p-8 rounded-2xl border border-stone-800/80 space-y-4">
              <div className="text-xs font-mono text-stone-400 flex items-center justify-between pb-2 border-b border-stone-800">
                <span>RADAR SENSORY INDEX</span>
                <span className="text-amber-300 font-bold">100 SCALE</span>
              </div>

              {[
                { label: "Floral Acidity", val: selectedOrigin.flavorProfile.acidity },
                { label: "Natural Sweetness", val: selectedOrigin.flavorProfile.sweetness },
                { label: "Viscous Body", val: selectedOrigin.flavorProfile.body },
                { label: "Volatile Aroma", val: selectedOrigin.flavorProfile.aroma },
                { label: "Cup Cleanliness", val: selectedOrigin.flavorProfile.cleanliness },
              ].map((attr) => (
                <div key={attr.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-300">{attr.label}</span>
                    <span className="text-amber-400 font-semibold">{attr.val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${attr.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
