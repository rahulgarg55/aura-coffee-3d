"use client";

import React from "react";
import { REVIEWS } from "../../data/coffeeData";
import { Star, Quote, Award } from "lucide-react";

export default function ReviewsSection() {
  return (
    <section className="relative w-full py-24 px-4 md:px-12 bg-[#090807]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>CRITICAL ACCLAIM & SOMMELIER PRAISE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-100 tracking-tight mb-4">
            Voices of the <span className="italic font-normal text-amber-300">Connoisseurs</span>
          </h2>
          <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
            From Michelin-star cellar masters to international design critics, read how Aura Atelier is redefining sensory standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="glass-card-interactive p-8 rounded-3xl flex flex-col justify-between border border-stone-800/80 relative"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-amber-500/30" />

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-stone-200 text-sm font-light leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-stone-800/80 mt-6 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-11 h-11 rounded-full object-cover border border-amber-500/30"
                />
                <div>
                  <div className="text-sm font-serif text-stone-100">{rev.author}</div>
                  <div className="text-[11px] font-mono text-amber-400/90">{rev.title}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    Order: {rev.order}
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
