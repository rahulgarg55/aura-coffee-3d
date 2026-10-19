"use client";

import React, { useState } from "react";
import Navbar from "../components/ui/Navbar";
import HeroSection from "../components/ui/HeroSection";
import ScrollJourneyScene from "../components/3d/ScrollJourneyScene";
import InteractiveCustomizer from "../components/ui/InteractiveCustomizer";
import LatteArtCanvas from "../components/latte-art/LatteArtCanvas";
import MenuSection from "../components/ui/MenuSection";
import OriginSection from "../components/ui/OriginSection";
import ReviewsSection from "../components/ui/ReviewsSection";
import LocationsSection from "../components/ui/LocationsSection";
import ReservationModal from "../components/ui/ReservationModal";
import CartDrawer from "../components/ui/CartDrawer";
import Footer from "../components/ui/Footer";
import { CartItem } from "../types/coffee";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "init-geisha",
      productId: "alchemy-smoked-geisha",
      name: "The Smoked Geisha Nectar",
      price: 18.5,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80",
      customizationSummary: "Hand-Carved Ice Sphere • Single-Origin Panama",
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedLocationForReservation, setSelectedLocationForReservation] =
    useState("tokyo-ginza");

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSelectLocationAndReserve = (locationId: string) => {
    setSelectedLocationForReservation(locationId);
    setIsReservationOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#070605] text-[#f7ede2] relative selection:bg-[#d97736] selection:text-white">
      {/* 1. Glassmorphic Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* 2. Hero Section with 3D Photorealistic Cup */}
      <HeroSection onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 3. The Centerpiece: Scroll-Driven 3D Brewing Journey */}
      <ScrollJourneyScene />

      {/* 4. The Alchemist Bar (3D Interactive Customizer) */}
      <InteractiveCustomizer onAddToCart={handleAddToCart} />

      {/* 5. The Foam Studio (Draw Your Own Latte Art & Story Card) */}
      <LatteArtCanvas />

      {/* 6. Artisanal Menu (Filterable & Interactive) */}
      <MenuSection onAddToCart={handleAddToCart} />

      {/* 7. Terroir & Single-Origin Flavor Radar */}
      <OriginSection />

      {/* 8. Critical Acclaim & Michelin Reviews */}
      <ReviewsSection />

      {/* 9. Global Roastery Sanctuaries (Tokyo, Milan, London, NYC) */}
      <LocationsSection
        onSelectLocationForReservation={handleSelectLocationAndReserve}
      />

      {/* 10. Table Reservation & Tasting Flight Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        initialLocationId={selectedLocationForReservation}
      />

      {/* 11. Shopping Bag & 1-Click Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 12. Luxury Footer */}
      <Footer />
    </main>
  );
}
