"use client";

import React, { useState } from "react";
import { ATELIER_LOCATIONS } from "../../data/coffeeData";
import { AtelierLocation } from "../../types/coffee";
import { MapPin, Clock, Users, Phone, Calendar, Sparkles } from "lucide-react";

interface Props {
  onSelectLocationForReservation: (locationId: string) => void;
}

export default function LocationsSection({ onSelectLocationForReservation }: Props) {
  const [selectedCity, setSelectedCity] = useState<string>("tokyo-ginza");

  const activeAtelier =
    ATELIER_LOCATIONS.find((loc) => loc.id === selectedCity) || ATELIER_LOCATIONS[0];

  return (
    <section id="locations-section" className="relative w-full py-24 px-4 md:px-12 bg-[#070605]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>GLOBAL ROASTERY ATELIERS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-100 tracking-tight mb-4">
            Visit Our Flagship <span className="italic font-normal text-amber-300">Sanctuaries</span>
          </h2>
          <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
            Four intimate spaces designed by acoustic and architectural purists. Step up to the brass bar for an omakase tasting or slow-drip flight.
          </p>
        </div>

        {/* City Switcher Buttons */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12 flex-wrap">
          {ATELIER_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedCity(loc.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                selectedCity === loc.id
                  ? "bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/25 scale-105"
                  : "bg-stone-900/60 text-stone-300 hover:text-stone-100 border border-stone-800"
              }`}
            >
              {loc.city.toUpperCase()} • {loc.neighborhood.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Location Showcase Card */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual Image */}
            <div className="lg:col-span-6 h-80 lg:h-[450px] relative overflow-hidden bg-stone-950">
              <img
                src={activeAtelier.image}
                alt={activeAtelier.city}
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a07] via-transparent to-black/30" />

              {/* Live Seating Pill */}
              <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-xs font-mono text-amber-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {activeAtelier.seatsAvailableNow} of {activeAtelier.seatsTotal} SEATS AVAILABLE NOW
                </span>
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-6 p-8 md:p-12 space-y-6">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  FLAGSHIP SANCTUARY
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-light text-stone-100">
                  {activeAtelier.city} Atelier
                </h3>
                <p className="text-xs font-mono text-stone-400 mt-1">
                  {activeAtelier.neighborhood}
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{activeAtelier.address}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div>Mon–Fri: {activeAtelier.hoursWeekday}</div>
                    <div className="text-stone-400">Sat–Sun: {activeAtelier.hoursWeekend}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Head Barista: {activeAtelier.headBarista}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{activeAtelier.phone}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onSelectLocationForReservation(activeAtelier.id)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl btn-luxury text-xs font-mono flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Omakase Seating</span>
                </button>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    activeAtelier.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-luxury-secondary text-xs font-mono flex items-center justify-center gap-2"
                >
                  <span>Google Maps Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
