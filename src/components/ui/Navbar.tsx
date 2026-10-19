"use client";

import React, { useState, useEffect } from "react";
import { soundscape } from "../../lib/audioSynth";
import { Volume2, VolumeX, ShoppingBag, Calendar, Menu, X, Sparkles } from "lucide-react";

interface Props {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export default function Navbar({ cartCount, onOpenCart, onOpenReservation }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    const active = soundscape.toggle();
    setIsPlayingAudio(active);
  };

  const navLinks = [
    { label: "The Journey", href: "#scroll-journey" },
    { label: "Alchemist Bar", href: "#customizer-bar" },
    { label: "Latte Art Studio", href: "#latte-art-studio" },
    { label: "Artisanal Menu", href: "#artisanal-menu" },
    { label: "Origins", href: "#origins-section" },
    { label: "Ateliers", href: "#locations-section" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "glass-nav py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-black/80 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#090807] flex items-center justify-center">
                <span className="text-amber-300 font-serif text-lg font-bold">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-serif tracking-[0.25em] text-stone-100 font-light group-hover:text-amber-200 transition-colors">
                AURA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-amber-400/80 -mt-1">
                COFFEE ATELIER
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono tracking-wider text-stone-300 hover:text-amber-300 transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Ambient Soundscape Toggle Button */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-2 ${
                isPlayingAudio
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20"
                  : "bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200"
              }`}
              title={isPlayingAudio ? "Mute Café Soundscape" : "Play Ambient Café Soundscape (Web Audio)"}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline-flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-amber-400 animate-pulse" />
                    <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-3 bg-amber-400 animate-pulse delay-150" />
                  </span>
                </>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Table Reservation Button */}
            <button
              onClick={onOpenReservation}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full btn-luxury-secondary text-xs font-mono tracking-wider"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Reserve</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-amber-500 text-stone-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
              title="Open Order Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-bounce shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/90 backdrop-blur-xl flex flex-col justify-center px-8 space-y-6 lg:hidden">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl font-serif font-light text-stone-200 hover:text-amber-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full py-3.5 rounded-2xl btn-luxury font-medium text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>

            <button
              onClick={toggleSound}
              className="w-full py-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-mono flex items-center justify-center gap-2"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{isPlayingAudio ? "Mute Soundscape" : "Enable Café Soundscape"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
