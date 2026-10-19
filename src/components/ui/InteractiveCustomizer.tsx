"use client";

import React, { useState } from "react";
import ProductCustomizerScene from "../3d/ProductCustomizerScene";
import { CustomCoffeeConfig, CartItem } from "../../types/coffee";
import { Sparkles, ShoppingBag, Flame, Snowflake, Check, Plus } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  onAddToCart: (item: CartItem) => void;
}

export default function InteractiveCustomizer({ onAddToCart }: Props) {
  const [config, setConfig] = useState<CustomCoffeeConfig>({
    baseId: "flat-white",
    baseName: "Silk Cloud Flat White",
    cupType: "crystal-glass",
    roastLevel: "light",
    milkType: "whole",
    temperature: "hot",
    sweetness: 0,
    extraShot: false,
    toppings: ["24K Gold Dust"],
    calculatedPrice: 12.5,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recalculate price dynamically
  const updateConfig = (updates: Partial<CustomCoffeeConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };

      let basePrice = 8.5;
      if (next.baseId === "geisha") basePrice = 16.5;
      if (next.baseId === "nitro") basePrice = 13.0;
      if (next.baseId === "ristretto") basePrice = 6.0;

      if (next.milkType === "oat" || next.milkType === "macadamia") basePrice += 1.0;
      if (next.extraShot) basePrice += 2.5;

      next.toppings.forEach((t) => {
        if (t === "24K Gold Dust") basePrice += 4.0;
        if (t === "Ceylon Cinnamon") basePrice += 1.0;
        if (t === "Valrhona Cacao Nibs") basePrice += 1.5;
      });

      next.calculatedPrice = Number(basePrice.toFixed(2));
      return next;
    });
  };

  const toggleTopping = (topping: string) => {
    const exists = config.toppings.includes(topping);
    const updated = exists
      ? config.toppings.filter((t) => t !== topping)
      : [...config.toppings, topping];
    updateConfig({ toppings: updated });
  };

  const handleAddCustomToCart = () => {
    const summary = `${config.roastLevel.toUpperCase()} Roast • ${
      config.milkType === "none" ? "Black" : config.milkType.toUpperCase() + " Milk"
    } • ${config.temperature.toUpperCase()} • ${config.cupType.replace("-", " ")} ${
      config.toppings.length > 0 ? "• " + config.toppings.join(", ") : ""
    }`;

    onAddToCart({
      id: `custom-${Date.now()}`,
      productId: config.baseId,
      name: `Bespoke: ${config.baseName}`,
      price: config.calculatedPrice,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
      customizationSummary: summary,
    });

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#e28743", "#d4af37"],
    });

    setToastMessage("Added bespoke creation to order!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <section id="customizer-bar" className="relative w-full py-24 px-4 md:px-12 bg-[#070605]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE ALCHEMIST BAR</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-100 tracking-tight mb-4">
            Engineer Your <span className="italic font-normal text-amber-300">Custom Extract</span>
          </h2>
          <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
            Select your single-origin roast density, vessel acoustics, milk lipid ratio, and artisanal toppings. Watch the 3D cup adapt in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Visualizer Card (Left / Center) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full relative glass-panel p-6 rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl">
              {/* Telemetry pill */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1 rounded-full glass-panel-light text-[11px] font-mono text-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>3D BESPOKE SIMULATOR</span>
              </div>

              {/* 3D Canvas */}
              <ProductCustomizerScene config={config} />

              {/* Quick Spec Pills */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-800/80 text-center font-mono text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px]">ROAST</span>
                  <span className="text-amber-300 capitalize">{config.roastLevel}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">VESSEL</span>
                  <span className="text-amber-300 capitalize">{config.cupType.split("-")[0]}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">THERMAL</span>
                  <span className="text-amber-300 capitalize">{config.temperature}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Matrix (Right) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
              {/* 1. Base Formulation */}
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-2">
                  1. SELECT COFFEE BASE
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "geisha", name: "Panama Geisha", price: "$16.50" },
                    { id: "flat-white", name: "Guernsey Flat White", price: "$8.50" },
                    { id: "nitro", name: "Kyoto Nitro Drip", price: "$13.00" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateConfig({ baseId: b.id, baseName: b.name })}
                      className={`p-3 rounded-2xl text-left transition-all ${
                        config.baseId === b.id
                          ? "bg-amber-500/20 border border-amber-500/60 shadow-lg shadow-amber-500/10"
                          : "bg-stone-900/60 border border-stone-800/80 hover:border-stone-700"
                      }`}
                    >
                      <div className="text-xs font-medium text-stone-200">{b.name}</div>
                      <div className="text-[11px] font-mono text-amber-400 mt-1">{b.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Roast Profile & Vessel */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-2">
                    2. ROAST PROFILE
                  </label>
                  <div className="flex gap-1.5">
                    {(["light", "medium", "dark"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateConfig({ roastLevel: r })}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono capitalize transition-all ${
                          config.roastLevel === r
                            ? "bg-amber-500 text-stone-950 font-bold"
                            : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-2">
                    3. VESSEL MATERIAL
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: "crystal-glass", label: "Glass" },
                      { id: "matte-ceramic", label: "Ceramic" },
                      { id: "minimal-tumbler", label: "Tumbler" },
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => updateConfig({ cupType: v.id as CustomCoffeeConfig["cupType"] })}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all ${
                          config.cupType === v.id
                            ? "bg-amber-500 text-stone-950 font-bold"
                            : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Milk & Temperature */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-2">
                    4. MILK EMULSION
                  </label>
                  <select
                    value={config.milkType}
                    onChange={(e) =>
                      updateConfig({ milkType: e.target.value as CustomCoffeeConfig["milkType"] })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 text-xs font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="whole">Jersey Whole Milk</option>
                    <option value="oat">Barista Oat (+ $1.00)</option>
                    <option value="almond">Roasted Almond</option>
                    <option value="macadamia">Macadamia Silky (+ $1.00)</option>
                    <option value="none">Pure Black (Zero Milk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-2">
                    5. TEMPERATURE
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateConfig({ temperature: "hot" })}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                        config.temperature === "hot"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/60"
                          : "bg-stone-900/60 text-stone-400 border border-stone-800"
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>93°C Hot</span>
                    </button>
                    <button
                      onClick={() => updateConfig({ temperature: "iced" })}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                        config.temperature === "iced"
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/60"
                          : "bg-stone-900/60 text-stone-400 border border-stone-800"
                      }`}
                    >
                      <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                      <span>4°C Iced</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Artisanal Toppings */}
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-2">
                  6. BESPOKE FINISHES
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "24K Gold Dust",
                    "Ceylon Cinnamon",
                    "Valrhona Cacao Nibs",
                  ].map((top) => {
                    const active = config.toppings.includes(top);
                    return (
                      <button
                        key={top}
                        onClick={() => toggleTopping(top)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all ${
                          active
                            ? "bg-amber-500 text-stone-950 font-semibold"
                            : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800"
                        }`}
                      >
                        {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        <span>{top}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Price & Add to Order */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-stone-500">TOTAL ESTIMATE</div>
                  <div className="text-2xl font-serif text-stone-100 font-light">
                    ${config.calculatedPrice.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={handleAddCustomToCart}
                  className="px-6 py-3.5 rounded-2xl btn-luxury font-medium text-sm flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Order</span>
                </button>
              </div>

              {toastMessage && (
                <div className="text-center text-xs font-mono text-amber-300 animate-pulse">
                  ✓ {toastMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
