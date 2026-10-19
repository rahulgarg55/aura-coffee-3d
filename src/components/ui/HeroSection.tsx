"use client";

import React from "react";
import HeroCupScene from "../3d/HeroCupScene";
import { ArrowDown, Sparkles, Award, Coffee, Compass } from "lucide-react";

interface Props {
  onOpenReservation: () => void;
}

export default function HeroSection({ onOpenReservation }: Props) {
  const scrollToJourney = () => {
    const el = document.getElementById("scroll-journey");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMenu = () => {
    const el = document.getElementById("artisanal-menu");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-4 md:px-12 bg-gradient-to-b from-[#0e0906] via-[#090807] to-[#070605] overflow-hidden">
      {/* Background Ambient Lighting Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Editorial Narrative */}
          <div className="lg:col-span-6 z-10 space-y-6 text-center lg:text-left">
            {/* Live Roastery Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel-light text-xs font-mono text-amber-200 border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ROASTERIES OPEN NOW • TOKYO • LONDON • MILAN • NYC</span>
            </div>

            {/* Giant Luxury Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-stone-100 tracking-tight leading-[1.08]">
              Crafted at the threshold of{" "}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                Light & Dark
              </span>
            </h1>

            <p className="text-stone-300/90 text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Experience the future of specialty coffee. From volcanic single-origin micro-lots to 9-bar saturated brass extractions, explore a multisensory journey through scroll-driven 3D alchemy.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={scrollToJourney}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-luxury text-sm font-medium flex items-center justify-center gap-2.5 group"
              >
                <span>Experience 3D Journey</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              <button
                onClick={scrollToMenu}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl btn-luxury-secondary text-sm font-medium flex items-center justify-center gap-2"
              >
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>Explore Menu</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800/80 max-w-md mx-auto lg:mx-0 text-left font-mono">
              <div>
                <div className="text-xl md:text-2xl font-serif text-amber-300 font-light">94.5</div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Cup Score</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-serif text-amber-300 font-light">93.8°C</div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Temp Precision</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-serif text-amber-300 font-light">100%</div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Direct Origin</div>
              </div>
            </div>
          </div>

          {/* Right 3D Photorealistic Cup Presentation */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Floating Metric Badges */}
            <div className="hidden sm:flex absolute -top-4 -left-6 z-20 glass-panel px-4 py-2.5 rounded-2xl items-center gap-3 shadow-xl border border-amber-500/20 animate-float-slow">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-stone-400">WORLD CUP WINNER</div>
                <div className="text-xs font-semibold text-stone-100">Panama Geisha #47</div>
              </div>
            </div>

            <div className="hidden sm:flex absolute bottom-8 -right-4 z-20 glass-panel px-4 py-2.5 rounded-2xl items-center gap-3 shadow-xl border border-amber-500/20">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-stone-400">MICRO-FOAM RATIO</div>
                <div className="text-xs font-semibold text-stone-100">0.2mm Velvet Crema</div>
              </div>
            </div>

            {/* Three.js Hero Cup Scene */}
            <HeroCupScene />
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="flex flex-col items-center justify-center gap-2 text-stone-500 text-xs font-mono tracking-widest uppercase cursor-pointer pt-6" onClick={scrollToJourney}>
        <span className="text-[10px] text-amber-400/80">SCROLL TO COMMENCE THE BREW</span>
        <div className="w-5 h-8 rounded-full border border-stone-700 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-amber-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
