"use client";

import React, { useState } from "react";
import { COFFEE_MENU } from "../../data/coffeeData";
import { CoffeeCategory, CoffeeProduct, CartItem } from "../../types/coffee";
import { Star, Plus, Flame, Snowflake, Award, SlidersHorizontal, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  onAddToCart: (item: CartItem) => void;
}

export default function MenuSection({ onAddToCart }: Props) {
  const [activeCategory, setActiveCategory] = useState<CoffeeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { key: CoffeeCategory; label: string }[] = [
    { key: "all", label: "Full Atelier" },
    { key: "signature", label: "Signature Alchemy" },
    { key: "espresso", label: "9-Bar Espresso" },
    { key: "cold", label: "Cold Extractions" },
    { key: "pastry", label: "Artisanal Pastries" },
    { key: "beans", label: "Reserve Whole Beans" },
  ];

  const filteredItems = COFFEE_MENU.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tastingNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleQuickAdd = (product: CoffeeProduct) => {
    onAddToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      customizationSummary: `Standard Reserve • ${product.temperature} • Single-Origin`,
    });

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.8 },
      colors: ["#e28743", "#d4af37"],
    });
  };

  const jumpToCustomizer = () => {
    const el = document.getElementById("customizer-bar");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="artisanal-menu" className="relative w-full py-24 px-4 md:px-12 bg-[#090807]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DAILY EXTRACTIONS & RESERVE BEANS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-100 tracking-tight mb-4">
            The Artisanal <span className="italic font-normal text-amber-300">Menu</span>
          </h2>
          <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
            Every cup is extracted with laboratory precision. Sourced directly from independent mountain micro-lots, roasted on site in small batches, and poured to perfection.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 md:pb-0 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-300 ${
                  activeCategory === c.key
                    ? "bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20"
                    : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search by flavor, origin, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-stone-900/80 border border-stone-800 text-stone-200 text-xs font-mono placeholder:text-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card-interactive rounded-3xl overflow-hidden flex flex-col justify-between group border border-stone-800/80"
            >
              {/* Product Visual */}
              <div className="relative h-60 w-full overflow-hidden bg-stone-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a07] via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {item.temperature === "Hot" && (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-mono flex items-center gap-1 border border-amber-500/20">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>Hot</span>
                      </span>
                    )}
                    {item.temperature === "Iced" && (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-sky-300 text-[10px] font-mono flex items-center gap-1 border border-sky-500/20">
                        <Snowflake className="w-3 h-3 text-sky-400" />
                        <span>Iced</span>
                      </span>
                    )}
                    {item.temperature === "Both" && (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-300 text-[10px] font-mono border border-stone-700">
                        Hot & Cold
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-mono border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Award banner if present */}
                {item.award && (
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/80 backdrop-blur-md text-amber-100 text-[10px] font-mono border border-amber-400/40 shadow-lg">
                    <Award className="w-3 h-3 text-yellow-300" />
                    <span>{item.award}</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-light text-stone-100 group-hover:text-amber-200 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-mono mt-1">
                    {item.tagline}
                  </p>
                  <p className="text-xs text-stone-400 mt-2.5 line-clamp-2 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tasting Notes */}
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">
                    Tasting Profile
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-300 text-[10px] font-mono border border-stone-800"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 block">PRICE</span>
                    <span className="text-xl font-serif font-light text-stone-100">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={jumpToCustomizer}
                      className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
                      title="Customize in 3D Alchemist Bar"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      className="px-4 py-2.5 rounded-xl btn-luxury text-xs font-mono flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
