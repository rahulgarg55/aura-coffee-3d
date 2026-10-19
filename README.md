# ☕ AURA COFFEE ATELIER (3D Luxury Specialty Roastery)

A premium, viral-worthy 3D coffee shop website crafted with **Next.js 16 (App Router), React 19, TypeScript, Three.js, Tailwind CSS v4, and the Web Audio API**.

---

## ✨ Core Features & Viral Experiences

1. **Cinematic Hero 3D Experience (`HeroCupScene.tsx`)**:
   - High-fidelity double-walled borosilicate crystal glass cup with realistic refraction, IOR 1.52, and liquid depth.
   - Procedural 3D coffee beans with realistic center clefts orbiting in zero gravity with natural tumbling physics.
   - Dynamic steam particle cloud rising and curling with procedural noise.
   - Interactive 360° drag-to-rotate controls with mouse-follow camera parallax.

2. **Scroll-Driven 3D Brewing Journey (`ScrollJourneyScene.tsx`)**:
   - **Stage 01 • The Selection**: High-altitude Panama Geisha beans floating with golden rim lighting.
   - **Stage 02 • The Precision Grind**: Beans funnel down into titanium burrs, fracturing into 450+ fresh coffee grounds showering downward.
   - **Stage 03 • 9-Bar Extraction**: Saturated brass group head and dual viscous espresso streams flowing into the cup with live pressure/temp telemetry.
   - **Stage 04 • The Velvet Infusion**: Microfoam steamed milk stream pouring into the cup, generating an expanding rosetta swirl.
   - **Stage 05 • The Masterpiece**: Fully formed crystal cup with layered latte art, rising steam trails, and interactive orbit inspection.

3. **"The Alchemist Bar" — 3D Interactive Customizer (`ProductCustomizerScene.tsx`)**:
   - Real-time 3D cup updates as the user customizes their coffee:
     - **Roast Profile**: Shifting liquid and crema color (Light Amber -> Medium Mahogany -> Dark Obsidian).
     - **Vessel Material**: Double-walled glass, Basalt Matte Ceramic, or Scandinavian Minimalist Tumbler.
     - **Temperature**: Hot (steam rising) vs. Iced (3 floating crystal ice cubes bobbing in the glass).
     - **Artisanal Toppings**: 24K Gold Leaf flakes, Ceylon cinnamon, or Valrhona cacao nibs.
   - Live price and nutritional calculation with 1-click "Add to Order".

4. **"The Foam Studio" — Draw Your Own Latte Art (`LatteArtCanvas.tsx`)**:
   - Interactive touch/mouse canvas simulating a freshly poured cup of specialty coffee with rich caramel crema.
   - Pouring tools: Steamed Milk, Etching Needle, Cocoa Drizzle, and 24K Gold Dust.
   - Preset templates (Rosetta, Heart, Blank Canvas).
   - **Viral Instagram / TikTok Story Generator**: Exports a 1080x1920 vertical luxury story card with customized blend name, extraction metadata, and 1-click high-res download.

5. **Sensory Café Soundscape (`audioSynth.ts`)**:
   - 100% client-side Web Audio API synthesizer.
   - Generates authentic vinyl crackle, gentle espresso machine steam hiss, and mellow Rhodes jazz chords without external audio file dependencies.
   - Ambient soundscape toggle and volume visualizer in the glassmorphic navigation bar.

6. **Complete Artisanal Roastery Website**:
   - Filterable menu with 6 categories, instant search, tasting note tags, dietary labels, and instant add-to-order.
   - Single-origin terroir explorer with 5-axis sensory radar index (Acidity, Sweetness, Body, Aroma, Cleanliness).
   - Sommelier & Michelin-star critic testimonials.
   - Flagship Sanctuaries in Tokyo Ginza, Milan Duomo, London Mayfair, and New York SoHo with live available seating indicators.
   - Multi-step table reservation and omakase tasting booking modal with pass generation and QR code.
   - Slide-out order bag & 1-click simulated Apple Pay checkout with confetti celebration.

---

## 🛠️ Tech Stack & Optimization

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Library**: React 19
- **3D Engine**: Three.js (Procedural PBR materials, custom lathe geometries, particle physics)
- **Styling**: Tailwind CSS v4 + Custom Luxury Glassmorphism Utilities
- **Audio**: Web Audio API (Synthesized binaural café ambience)
- **Animations**: GSAP-inspired scroll scrubbing & Framer Motion dynamics
- **Performance**: Device pixel ratio clamping (max 1.75), requestAnimationFrame throttle, IntersectionObserver lifecycle cleanup, 60 FPS target.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm run start
```

---

## 📱 Mobile & Responsive Experience
- Touch-friendly 3D drag interactions.
- Touch-drawing on the latte art canvas.
- Collapsible glassmorphic drawer menu.
- Smooth scroll transitions across mobile viewports.
