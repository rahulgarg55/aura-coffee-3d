"use client";

import React, { useState } from "react";
import { CartItem } from "../../types/coffee";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Check, CreditCard, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: Props) {
  const [fulfillment, setFulfillment] = useState<"dine-in" | "pickup" | "delivery">("dine-in");
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tipAmount = (subtotal * tipPercent) / 100;
  const tax = subtotal * 0.08;
  const total = subtotal + tipAmount + tax;

  const handleSimulatedCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setReceiptNumber(`AUR-ORD-${Math.floor(10000 + Math.random() * 90000)}`);
      setOrderCompleted(true);
      onClearCart();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#e28743", "#d4af37", "#f5eee6"],
      });
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-[#0a0807] border-l border-amber-500/20 flex flex-col justify-between p-6 shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-serif font-light text-stone-100">Your Extraction Bag</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-900 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Contents */}
        <div className="flex-1 py-6 space-y-4 overflow-y-auto">
          {orderCompleted ? (
            /* Order Success Receipt */
            <div className="text-center py-12 space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif text-stone-100 font-light">
                Extraction Commenced
              </h4>
              <p className="text-xs text-stone-400">
                Receipt: <span className="text-amber-300 font-bold">{receiptNumber}</span>
              </p>
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-left text-xs space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-stone-500">FULFILLMENT</span>
                  <span className="text-stone-200 uppercase">{fulfillment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">BARISTA STATUS</span>
                  <span className="text-amber-400">Puck Tamped & Pre-Infusing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">EST. TIME</span>
                  <span className="text-stone-200">4 – 6 minutes</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setOrderCompleted(false);
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl btn-luxury text-xs font-mono mt-6"
              >
                Back to Roastery
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-20 space-y-3 font-mono">
              <ShoppingBag className="w-12 h-12 text-stone-700 mx-auto" />
              <p className="text-sm text-stone-400">Your extraction bag is empty.</p>
              <p className="text-xs text-stone-600">
                Explore our single-origin menu or customize a drink at the Alchemist Bar.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between gap-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-stone-200 truncate">{item.name}</h4>
                  {item.customizationSummary && (
                    <p className="text-[10px] text-amber-400/90 font-mono truncate">
                      {item.customizationSummary}
                    </p>
                  )}
                  <div className="text-xs font-mono text-stone-300 mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-stone-500 hover:text-red-400 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing Details */}
        {!orderCompleted && cart.length > 0 && (
          <div className="pt-4 border-t border-stone-800 space-y-4 font-mono text-xs">
            {/* Fulfillment Mode */}
            <div>
              <span className="text-stone-500 text-[10px] block mb-1.5">FULFILLMENT METHOD</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "dine-in", label: "Dine-in" },
                  { id: "pickup", label: "Pickup" },
                  { id: "delivery", label: "Beans Ship" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFulfillment(f.id as typeof fulfillment)}
                    className={`py-1.5 rounded-lg transition-all ${
                      fulfillment === f.id
                        ? "bg-amber-500 text-stone-950 font-bold"
                        : "bg-stone-900 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Selection */}
            <div>
              <span className="text-stone-500 text-[10px] block mb-1.5">BARISTA APPRECIATION</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[10, 15, 20, 0].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipPercent(t)}
                    className={`py-1.5 rounded-lg transition-all ${
                      tipPercent === t
                        ? "bg-amber-500/30 text-amber-300 border border-amber-500/50"
                        : "bg-stone-900 text-stone-400"
                    }`}
                  >
                    {t === 0 ? "No Tip" : `${t}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-stone-400 pt-2 border-t border-stone-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Barista Tip ({tipPercent}%)</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-serif text-stone-100 pt-2 border-t border-stone-800">
                <span>Total Due</span>
                <span className="font-bold text-amber-300">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleSimulatedCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 rounded-2xl btn-luxury text-sm font-medium flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25"
            >
              {isCheckingOut ? (
                <span>Transmitting Order to Barista...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with Apple Pay • 1-Click</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
