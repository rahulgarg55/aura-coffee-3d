"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Download, RefreshCw, PenTool, Droplets, Heart } from "lucide-react";
import confetti from "canvas-confetti";

type ToolType = "milk" | "etching" | "chocolate" | "gold";

export default function LatteArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>("milk");
  const [brushSize, setBrushSize] = useState<number>(14);
  const [blendName, setBlendName] = useState<string>("Bespoke Geisha Flat White");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [shareCardGenerated, setShareCardGenerated] = useState<boolean>(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

  // Initialize the Crema Base
  const initCanvas = (preset?: "rosetta" | "heart" | "swan" | "clear") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;

    // Outer rich crema gradient
    const grad = ctx.createRadialGradient(center, center, 10, center, center, center);
    grad.addColorStop(0, "#e8be89");
    grad.addColorStop(0.35, "#ba7a3d");
    grad.addColorStop(0.7, "#6b3915");
    grad.addColorStop(1, "#261105");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();

    // Crema micro-specks
    ctx.fillStyle = "rgba(40, 18, 6, 0.25)";
    for (let i = 0; i < 400; i++) {
      const r = Math.random() * (center - 10);
      const th = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(center + Math.cos(th) * r, center + Math.sin(th) * r, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (preset === "rosetta") {
      drawRosettaPreset(ctx, center);
    } else if (preset === "heart") {
      drawHeartPreset(ctx, center);
    }
  };

  const drawHeartPreset = (ctx: CanvasRenderingContext2D, center: number) => {
    ctx.fillStyle = "rgba(255, 248, 238, 0.95)";
    ctx.beginPath();
    ctx.arc(center - 32, center - 15, 48, 0, Math.PI * 2);
    ctx.arc(center + 32, center - 15, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(center - 75, center);
    ctx.lineTo(center, center + 95);
    ctx.lineTo(center + 75, center);
    ctx.fill();
  };

  const drawRosettaPreset = (ctx: CanvasRenderingContext2D, center: number) => {
    ctx.strokeStyle = "rgba(255, 250, 240, 0.92)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(center, center + 140);
    ctx.bezierCurveTo(center - 10, center, center + 10, center - 80, center, center - 130);
    ctx.stroke();

    for (let i = 0; i < 7; i++) {
      const y = center + 100 - i * 36;
      const spread = 75 - i * 7;
      ctx.lineWidth = 14 - i * 1.2;

      ctx.beginPath();
      ctx.moveTo(center, y);
      ctx.bezierCurveTo(center - spread * 0.6, y - 16, center - spread, y - 6, center - spread * 1.1, y + 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(center, y);
      ctx.bezierCurveTo(center + spread * 0.6, y - 16, center + spread, y - 6, center + spread * 1.1, y + 10);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 250, 240, 0.95)";
    ctx.beginPath();
    ctx.arc(center - 15, center - 135, 18, 0, Math.PI * 2);
    ctx.arc(center + 15, center - 135, 18, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    initCanvas("rosetta");
  }, []);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    // Confine drawing strictly within the circular cup diameter
    const center = canvas.width / 2;
    const distFromCenter = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
    if (distFromCenter > center - 8) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (selectedTool === "milk") {
      ctx.strokeStyle = "rgba(255, 250, 242, 0.88)";
      ctx.lineWidth = brushSize;
      ctx.shadowColor = "rgba(255, 240, 220, 0.4)";
      ctx.shadowBlur = 6;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (selectedTool === "etching") {
      ctx.strokeStyle = "rgba(42, 18, 7, 0.85)";
      ctx.lineWidth = 4;
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (selectedTool === "chocolate") {
      ctx.strokeStyle = "rgba(28, 12, 4, 0.95)";
      ctx.lineWidth = brushSize * 0.75;
      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 4;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (selectedTool === "gold") {
      // Shimmering 24K Gold Dust
      ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
      ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
      ctx.shadowBlur = 8;
      for (let i = 0; i < 5; i++) {
        const ox = (Math.random() - 0.5) * brushSize * 1.8;
        const oy = (Math.random() - 0.5) * brushSize * 1.8;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, 1.5 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  };

  // Generate Instagram / TikTok Story Card
  const handleGenerateStoryCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create an offscreen vertical high-res 1080x1920 Story Card
    const storyCanvas = document.createElement("canvas");
    storyCanvas.width = 1080;
    storyCanvas.height = 1920;
    const sCtx = storyCanvas.getContext("2d");
    if (!sCtx) return;

    // Background: Dark Obsidian Studio
    const bgGrad = sCtx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, "#090807");
    bgGrad.addColorStop(0.5, "#18100b");
    bgGrad.addColorStop(1, "#070605");
    sCtx.fillStyle = bgGrad;
    sCtx.fillRect(0, 0, 1080, 1920);

    // Warm amber ambient glow behind cup
    const glow = sCtx.createRadialGradient(540, 920, 50, 540, 920, 600);
    glow.addColorStop(0, "rgba(226, 135, 67, 0.3)");
    glow.addColorStop(0.5, "rgba(212, 175, 55, 0.12)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    sCtx.fillStyle = glow;
    sCtx.fillRect(0, 0, 1080, 1920);

    // Header Branding
    sCtx.fillStyle = "#e28743";
    sCtx.font = "bold 28px monospace";
    sCtx.textAlign = "center";
    sCtx.fillText("A U R A   C O F F E E   A T E L I E R", 540, 240);

    sCtx.fillStyle = "#ffffff";
    sCtx.font = "300 68px serif";
    sCtx.fillText("Bespoke Latte Art Edition", 540, 330);

    sCtx.fillStyle = "#a89f91";
    sCtx.font = "32px sans-serif";
    sCtx.fillText(`"${blendName}"`, 540, 400);

    // Draw the Circular Coffee Cup with outer saucer / shadow
    sCtx.save();
    sCtx.beginPath();
    sCtx.arc(540, 940, 360, 0, Math.PI * 2);
    sCtx.fillStyle = "rgba(10, 7, 5, 0.85)";
    sCtx.shadowColor = "rgba(0, 0, 0, 0.8)";
    sCtx.shadowBlur = 60;
    sCtx.shadowOffsetY = 30;
    sCtx.fill();

    // Clip to circle and draw coffee
    sCtx.beginPath();
    sCtx.arc(540, 940, 340, 0, Math.PI * 2);
    sCtx.clip();
    sCtx.drawImage(canvas, 540 - 340, 940 - 340, 680, 680);
    sCtx.restore();

    // Cup rim highlight ring
    sCtx.strokeStyle = "rgba(255, 230, 200, 0.35)";
    sCtx.lineWidth = 10;
    sCtx.beginPath();
    sCtx.arc(540, 940, 342, 0, Math.PI * 2);
    sCtx.stroke();

    // Bottom Telemetry & Metadata
    sCtx.fillStyle = "#d4af37";
    sCtx.font = "26px monospace";
    sCtx.fillText("EXTRACTION TELEMETRY", 540, 1450);

    sCtx.fillStyle = "#f5eee6";
    sCtx.font = "32px sans-serif";
    sCtx.fillText("Origin: Panama Geisha • 93.8°C Saturated Brass", 540, 1510);
    sCtx.fillText("Microfoam: 62°C Jersey Gold • Hand-Poured", 540, 1560);

    sCtx.strokeStyle = "rgba(226, 135, 67, 0.3)";
    sCtx.lineWidth = 2;
    sCtx.beginPath();
    sCtx.moveTo(240, 1640);
    sCtx.lineTo(840, 1640);
    sCtx.stroke();

    sCtx.fillStyle = "#a89f91";
    sCtx.font = "24px monospace";
    sCtx.fillText("EXPERIENCE THE ALCHEMY @ AURACOFFEE.ATELIER", 540, 1720);

    const dataUrl = storyCanvas.toDataURL("image/png");
    setShareImageUrl(dataUrl);
    setShareCardGenerated(true);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#e28743", "#d4af37", "#f5eee6"],
    });
  };

  const handleDownloadImage = () => {
    if (!shareImageUrl) return;
    const a = document.createElement("a");
    a.href = shareImageUrl;
    a.download = `Aura-Latte-Art-${Date.now()}.png`;
    a.click();
  };

  return (
    <section id="latte-art-studio" className="relative w-full py-24 px-4 md:px-12 bg-[#090807] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE FOAM STUDIO</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-100 tracking-tight mb-4">
            Draw Your Signature <span className="italic font-normal text-amber-300">Latte Art</span>
          </h2>
          <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
            Drag your cursor or finger across the microfoam surface. Choose your pouring tools, carve fine ribbons, or sprinkle 24K gold dust, then export a shareable Instagram card.
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Panel (Left) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-2">
                  NAME YOUR CREATION
                </label>
                <input
                  type="text"
                  value={blendName}
                  onChange={(e) => setBlendName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Tools Selector */}
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-3">
                  SELECT POURING TOOL
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTool("milk")}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                      selectedTool === "milk"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-transparent"
                    }`}
                  >
                    <Droplets className="w-4 h-4 text-amber-200" />
                    <span>Steamed Milk</span>
                  </button>

                  <button
                    onClick={() => setSelectedTool("etching")}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                      selectedTool === "etching"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-transparent"
                    }`}
                  >
                    <PenTool className="w-4 h-4 text-amber-200" />
                    <span>Etching Needle</span>
                  </button>

                  <button
                    onClick={() => setSelectedTool("chocolate")}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                      selectedTool === "chocolate"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-transparent"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-950 border border-amber-700" />
                    <span>Cocoa Drizzle</span>
                  </button>

                  <button
                    onClick={() => setSelectedTool("gold")}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                      selectedTool === "gold"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-transparent"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>24K Gold Flakes</span>
                  </button>
                </div>
              </div>

              {/* Brush Flow Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono text-stone-400 mb-2">
                  <span>POUR FLOW THICKNESS</span>
                  <span className="text-amber-300">{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="32"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-2">
                  LOAD PRESET ART
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => initCanvas("rosetta")}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-xs font-mono border border-stone-800 transition-colors"
                  >
                    Rosetta
                  </button>
                  <button
                    onClick={() => initCanvas("heart")}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-xs font-mono border border-stone-800 transition-colors"
                  >
                    Heart
                  </button>
                  <button
                    onClick={() => initCanvas("clear")}
                    className="flex items-center justify-center p-2 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
                    title="Clear cup canvas"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleGenerateStoryCard}
                className="w-full py-3.5 rounded-2xl btn-luxury font-medium text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Story Card</span>
              </button>
            </div>
          </div>

          {/* Interactive Foam Canvas (Center) */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-full glass-panel shadow-2xl border border-amber-500/30">
              {/* Outer porcelain saucer rim */}
              <div className="relative rounded-full p-3 bg-stone-900/80 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={520}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                  className="rounded-full w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] cursor-crosshair touch-none select-none shadow-2xl"
                />
              </div>

              {/* Subtle pulsing rim indicator */}
              <div className="absolute inset-0 rounded-full border border-amber-500/20 pointer-events-none animate-pulse-glow" />
            </div>

            <div className="mt-4 text-xs font-mono text-stone-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>TOUCH OR DRAG INSIDE CUP TO DRAW</span>
            </div>
          </div>
        </div>

        {/* Modal: Generated Story Card */}
        {shareCardGenerated && shareImageUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-sm w-full space-y-4 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-amber-300">
                  INSTAGRAM STORY READY
                </div>
                <button
                  onClick={() => setShareCardGenerated(false)}
                  className="text-stone-400 hover:text-stone-100 text-sm font-mono"
                >
                  ✕ Close
                </button>
              </div>

              {/* Story Card Image Preview */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800 max-h-[500px]">
                <img
                  src={shareImageUrl}
                  alt="Custom Latte Art Story"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadImage}
                  className="flex-1 py-3 rounded-xl btn-luxury text-xs font-mono flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Atelier link copied to clipboard!");
                  }}
                  className="px-4 py-3 rounded-xl btn-luxury-secondary text-xs font-mono"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
