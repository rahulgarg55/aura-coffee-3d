"use client";

import React, { useState } from "react";
import { ATELIER_LOCATIONS } from "../../data/coffeeData";
import { Calendar, Clock, Users, Sparkles, Check, X, QrCode } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialLocationId?: string;
}

export default function ReservationModal({
  isOpen,
  onClose,
  initialLocationId = "tokyo-ginza",
}: Props) {
  const [locationId, setLocationId] = useState(initialLocationId);
  const [experience, setExperience] = useState<string>("omakase");
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<string>("2026-10-24");
  const [timeSlot, setTimeSlot] = useState<string>("14:30");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  if (!isOpen) return null;

  const experiences = [
    {
      id: "omakase",
      title: "Omakase Extraction Flight",
      price: "$45 / guest",
      desc: "5 rare single-origin extractions paired with artisanal cannelés and sensory flavor wheels.",
    },
    {
      id: "masterclass",
      title: "Cupping & Roasting Masterclass",
      price: "$65 / guest",
      desc: "Hands-on bean density grading, green sample roasting, and triangulation cupping with head barista.",
    },
    {
      id: "private-table",
      title: "Barista Counter Table Reservation",
      price: "$25 deposit",
      desc: "Reserved front-row acoustic seating at our saturated brass lever espresso machine.",
    },
  ];

  const times = ["10:00 AM", "12:30 PM", "02:30 PM", "04:30 PM", "06:30 PM", "08:30 PM"];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) {
      alert("Please provide your name and email for the reservation pass.");
      return;
    }

    const ref = `AURA-${locationId.slice(0, 3).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    setBookingRef(ref);
    setConfirmed(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#e28743", "#d4af37", "#f5eee6"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-xl w-full border border-amber-500/30 my-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmed ? (
          <form onSubmit={handleConfirm} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PRIVATE TASTING & TABLE BOOKING</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-light text-stone-100">
                Reserve an Atelier Sanctuary
              </h3>
            </div>

            {/* Location Selector */}
            <div>
              <label className="text-xs font-mono text-stone-400 block mb-2">
                1. SELECT ROASTERY LOCATION
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 text-xs font-mono focus:outline-none focus:border-amber-500"
              >
                {ATELIER_LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.city} Atelier ({l.neighborhood}) • {l.seatsAvailableNow} seats free
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Selector */}
            <div>
              <label className="text-xs font-mono text-stone-400 block mb-2">
                2. CHOOSE SENSORY EXPERIENCE
              </label>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      experience === exp.id
                        ? "bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-500/10"
                        : "bg-stone-900/60 border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-stone-200">{exp.title}</span>
                      <span className="text-xs font-mono text-amber-300">{exp.price}</span>
                    </div>
                    <p className="text-xs text-stone-400 font-light">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guests, Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div>
                <label className="text-stone-400 block mb-1.5">GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-400 block mb-1.5">DATE</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1.5">TIME</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1.5">
                  EMAIL FOR PASS
                </label>
                <input
                  type="email"
                  required
                  placeholder="elena@sommelier.org"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl btn-luxury font-medium text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm & Issue Tasting Pass</span>
            </button>
          </form>
        ) : (
          /* Confirmation Pass Screen */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
                RESERVATION CONFIRMED
              </span>
              <h3 className="text-3xl font-serif text-stone-100 mt-1">
                We Await Your Arrival
              </h3>
              <p className="text-xs text-stone-400 font-mono mt-1">
                Pass dispatched to <span className="text-stone-200">{guestEmail}</span>
              </p>
            </div>

            {/* Luxury Ticket Pass */}
            <div className="p-6 rounded-2xl bg-stone-950/80 border border-amber-500/30 text-left font-mono space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                <span className="text-xs text-amber-300 font-bold">AURA ATELIER PASS</span>
                <span className="text-xs text-stone-400">{bookingRef}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-stone-500 block text-[10px]">PATRON</span>
                  <span className="text-stone-200">{guestName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">SANCTUARY</span>
                  <span className="text-stone-200 capitalize">{locationId.replace("-", " ")}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">DATE & TIME</span>
                  <span className="text-stone-200">{date} • {timeSlot}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">PARTY SIZE</span>
                  <span className="text-stone-200">{guests} {guests === 1 ? "Guest" : "Guests"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <span>Scan upon entry at host counter</span>
                </div>
                <span className="text-amber-400 font-bold">READY</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl btn-luxury text-xs font-mono"
            >
              Done & Return to Atelier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
