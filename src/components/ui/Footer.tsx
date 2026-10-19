"use client";

import React, { useState } from "react";
import { Mail, Check, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 2000);
  };

  return (
    <footer className="relative w-full bg-[#050403] text-stone-400 font-mono text-xs border-t border-stone-800/80 pt-20 pb-12 px-4 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5">
                <div className="w-full h-full rounded-full bg-[#090807] flex items-center justify-center">
                  <span className="text-amber-300 font-serif text-base font-bold">A</span>
                </div>
              </div>
              <span className="text-lg font-serif tracking-[0.25em] text-stone-100 font-light">
                AURA COFFEE ATELIER
              </span>
            </div>
            <p className="text-stone-400 text-sm font-light leading-relaxed max-w-md">
              A sensory sanctuary dedicated to 1,800m+ single-origin terroirs, thermodynamic brewing precision, and the transcendent beauty of the extraction.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-stone-200 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PRIVATE HARVEST RESERVE ALLOCATION</span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Receive private invitations to limited micro-lot arrivals, harvest cuppings, and guest masterclass registrations.
              </p>

              {subscribed ? (
                <div className="py-2.5 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Welcome to the Atelier Allocation.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your private email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl btn-luxury font-medium whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Global Timezones & Hours Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-stone-900 text-xs">
          <div>
            <span className="text-amber-400 font-bold block mb-1">TOKYO GINZA</span>
            <p className="text-stone-300">6-10-1 Ginza, Chuo City</p>
            <p className="text-stone-500">07:30 – 22:00 JST</p>
          </div>
          <div>
            <span className="text-amber-400 font-bold block mb-1">MILAN DUOMO</span>
            <p className="text-stone-300">Piazza del Duomo, 21</p>
            <p className="text-stone-500">07:00 – 21:30 CET</p>
          </div>
          <div>
            <span className="text-amber-400 font-bold block mb-1">LONDON MAYFAIR</span>
            <p className="text-stone-300">42 Mount Street, W1K</p>
            <p className="text-stone-500">07:00 – 20:30 GMT</p>
          </div>
          <div>
            <span className="text-amber-400 font-bold block mb-1">NEW YORK SOHO</span>
            <p className="text-stone-300">88 Crosby Street, NY 10012</p>
            <p className="text-stone-500">06:30 – 21:00 EST</p>
          </div>
        </div>

        {/* Bottom Rights & Manifesto */}
        <div className="pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © 2026 Aura Coffee Atelier Ltd. All rights reserved. Direct-Trade Certified.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-amber-300 transition-colors">Instagram</a>
            <a href="#" className="hover:text-amber-300 transition-colors">TikTok</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Spotify Soundscapes</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
