"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Procedural 3D coffee bean geometry with realistic center cleft
 */
export function createCoffeeBeanGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.35, 28, 20);
  geom.scale(1.25, 0.75, 0.7);

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Deep realistic center crease on top surface
    if (y > 0 && Math.abs(x) < 0.12) {
      const depth = (0.12 - Math.abs(x)) * 0.95;
      pos.setY(i, y - depth);
    }
    // Slight pinch at tips
    if (Math.abs(z) > 0.18) {
      const pinch = (Math.abs(z) - 0.18) * 0.2;
      pos.setX(i, x * (1 - pinch));
    }
  }
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates an ultra-detailed procedural Latte Art Crema Texture
 */
function createLatteArtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const center = 512;

  // 1. Base Espresso Crema Radial Gradient (Caramel to Dark Roast)
  const grad = ctx.createRadialGradient(center, center, 30, center, center, 510);
  grad.addColorStop(0, "#f3dfca");
  grad.addColorStop(0.18, "#d99d62");
  grad.addColorStop(0.45, "#aa652d");
  grad.addColorStop(0.75, "#6b3715");
  grad.addColorStop(0.95, "#341708");
  grad.addColorStop(1, "#1e0b03");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Microfoam Crema Specks (Simulates real espresso microfoam bubbles)
  ctx.fillStyle = "rgba(40, 16, 5, 0.2)";
  for (let i = 0; i < 2200; i++) {
    const r = Math.random() * 490;
    const th = Math.random() * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(center + Math.cos(th) * r, center + Math.sin(th) * r, 0.8 + Math.random() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Silky Steamed Milk Rosetta Feathering
  ctx.save();
  ctx.shadowColor = "rgba(255, 230, 205, 0.4)";
  ctx.shadowBlur = 12;

  // Center Stem
  ctx.strokeStyle = "rgba(255, 250, 242, 0.94)";
  ctx.lineWidth = 26;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(center, 840);
  ctx.bezierCurveTo(center - 20, 560, center - 15, 340, center, 200);
  ctx.stroke();

  // Rosetta Side Leaves (8 balanced tiers)
  for (let i = 0; i < 8; i++) {
    const y = 780 - i * 72;
    const spread = 150 - i * 13;
    const strokeWidth = 24 - i * 1.8;
    ctx.lineWidth = strokeWidth;

    // Left leaf
    ctx.beginPath();
    ctx.moveTo(center, y);
    ctx.bezierCurveTo(
      center - spread * 0.55,
      y - 36,
      center - spread,
      y - 16,
      center - spread * 1.12,
      y + 18
    );
    ctx.stroke();

    // Right leaf
    ctx.beginPath();
    ctx.moveTo(center, y);
    ctx.bezierCurveTo(
      center + spread * 0.55,
      y - 36,
      center + spread,
      y - 16,
      center + spread * 1.12,
      y + 18
    );
    ctx.stroke();
  }

  // Heart Crest at apex
  ctx.fillStyle = "rgba(255, 252, 245, 0.98)";
  ctx.beginPath();
  ctx.arc(center - 28, 195, 32, 0, Math.PI * 2);
  ctx.arc(center + 28, 195, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(center - 56, 205);
  ctx.lineTo(center, 275);
  ctx.lineTo(center + 56, 205);
  ctx.fill();

  ctx.restore();

  // Outer gold rim glow ring
  ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(center, center, 500, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  return tex;
}

export default function HeroCupScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // 1. Three.js Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 4.8);

    // 2. High-Performance WebGL Renderer (No heavy multi-pass transmission buffer)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff5ee, 0.8);
    scene.add(ambientLight);

    // Warm Key Light (Soft Studio Softbox)
    const keyLight = new THREE.DirectionalLight(0xffdfb8, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Cool Amber Rim Light (Gives the glass crystal contour pop)
    const rimLight = new THREE.PointLight(0xe28743, 3.5, 12);
    rimLight.position.set(-3.5, 2.5, -2.5);
    scene.add(rimLight);

    // Subtle Gold Floor Fill
    const fillLight = new THREE.DirectionalLight(0xd4af37, 0.8);
    fillLight.position.set(0, -2, 2);
    scene.add(fillLight);

    // 4. Contact Shadow Disk (Grounds the cup in space)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      sGrad.addColorStop(0, "rgba(0, 0, 0, 0.65)");
      sGrad.addColorStop(0.5, "rgba(20, 10, 5, 0.25)");
      sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeom = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.15;
    scene.add(shadowMesh);

    // 5. Cup Assembly Pivot Group
    const cupGroup = new THREE.Group();
    scene.add(cupGroup);

    // A. Double-Walled Crystal Glass Vessel
    const glassPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.85, 0),
      new THREE.Vector2(1.05, 0.2),
      new THREE.Vector2(1.24, 1.55),
      new THREE.Vector2(1.26, 1.8),
      new THREE.Vector2(1.2, 1.8),
      new THREE.Vector2(1.12, 1.55),
      new THREE.Vector2(0.95, 0.35),
      new THREE.Vector2(0.85, 0.25),
      new THREE.Vector2(0, 0.25),
    ];
    const glassGeom = new THREE.LatheGeometry(glassPoints, 36);
    // Optimized standard PBR material for silky 60 FPS
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
    });
    const glassCup = new THREE.Mesh(glassGeom, glassMaterial);
    glassCup.position.y = -0.9;
    cupGroup.add(glassCup);

    // B. Gold Rim Accent Ring
    const goldRimGeom = new THREE.TorusGeometry(1.23, 0.02, 16, 48);
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });
    const goldRim = new THREE.Mesh(goldRimGeom, goldRimMat);
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.9;
    cupGroup.add(goldRim);

    // C. Rich Roasted Espresso Core
    const liquidPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0.28),
      new THREE.Vector2(0.82, 0.28),
      new THREE.Vector2(1.08, 1.5),
      new THREE.Vector2(0, 1.5),
    ];
    const liquidGeom = new THREE.LatheGeometry(liquidPoints, 32);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0x241107,
      roughness: 0.15,
      metalness: 0.05,
      emissive: 0x1a0b04,
      emissiveIntensity: 0.3,
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMaterial);
    liquidMesh.position.y = -0.9;
    cupGroup.add(liquidMesh);

    // D. Photorealistic Rosetta Foam Disc
    const cremaGeom = new THREE.CircleGeometry(1.07, 36);
    cremaGeom.rotateX(-Math.PI / 2);
    const cremaTexture = createLatteArtTexture();
    const cremaMaterial = new THREE.MeshStandardMaterial({
      map: cremaTexture,
      roughness: 0.55,
      metalness: 0.05,
    });
    const cremaMesh = new THREE.Mesh(cremaGeom, cremaMaterial);
    cremaMesh.position.set(0, 0.61, 0);
    cupGroup.add(cremaMesh);

    // 6. Floating Roasted Specialty Coffee Beans
    const beanGeom = createCoffeeBeanGeometry();
    const beanMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c160b,
      roughness: 0.32,
      metalness: 0.15,
    });

    const beansGroup = new THREE.Group();
    scene.add(beansGroup);

    const beansCount = 12;
    const beanData: Array<{
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      phase: number;
    }> = [];

    for (let i = 0; i < beansCount; i++) {
      const beanMesh = new THREE.Mesh(beanGeom, beanMaterial);
      const angle = (i / beansCount) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 1.8 + Math.random() * 1.3;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 2.6 + 0.2;
      const z = Math.sin(angle) * radius;

      beanMesh.position.set(x, y, z);
      beanMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.55 + Math.random() * 0.35;
      beanMesh.scale.set(scale, scale, scale);

      beansGroup.add(beanMesh);
      beanData.push({
        mesh: beanMesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.6 + Math.random() * 0.6,
        rotSpeedX: 0.008 + Math.random() * 0.015,
        rotSpeedY: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 7. Dynamic Rising Steam Particle System
    const steamParticleCount = 45;
    const steamGeom = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamParticleCount * 3);
    const steamSpeeds: number[] = [];

    for (let i = 0; i < steamParticleCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.7;
      steamPositions[i * 3 + 1] = 0.65 + Math.random() * 2.0;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
      steamSpeeds.push(0.008 + Math.random() * 0.014);
    }
    steamGeom.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));

    const smokeCanvas = document.createElement("canvas");
    smokeCanvas.width = 128;
    smokeCanvas.height = 128;
    const smCtx = smokeCanvas.getContext("2d");
    if (smCtx) {
      const g = smCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      g.addColorStop(0, "rgba(255, 240, 225, 0.85)");
      g.addColorStop(0.35, "rgba(235, 215, 195, 0.3)");
      g.addColorStop(1, "rgba(255, 255, 255, 0)");
      smCtx.fillStyle = g;
      smCtx.fillRect(0, 0, 128, 128);
    }
    const smokeTexture = new THREE.CanvasTexture(smokeCanvas);

    const steamMaterial = new THREE.PointsMaterial({
      size: 0.45,
      map: smokeTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const steamParticles = new THREE.Points(steamGeom, steamMaterial);
    cupGroup.add(steamParticles);

    setIsLoaded(true);

    // Mouse Controls & Drag Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        cupGroup.rotation.y += deltaX * 0.008;
        cupGroup.rotation.x = Math.max(-0.4, Math.min(0.4, cupGroup.rotation.x + deltaY * 0.008));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        mouseX = normX;
        mouseY = normY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousemove", handleMouseMove);
    domEl.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // IntersectionObserver to sleep when scrolled away
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 60-FPS Render Loop with Lerping
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Gentle floating levitation
      cupGroup.position.y = Math.sin(elapsed * 1.4) * 0.05;

      if (!isDragging) {
        targetRotY = mouseX * 0.3 + Math.sin(elapsed * 0.35) * 0.12;
        targetRotX = -mouseY * 0.15;
        cupGroup.rotation.y += (targetRotY - cupGroup.rotation.y) * 0.05;
        cupGroup.rotation.x += (targetRotX - cupGroup.rotation.x) * 0.05;
      }

      // Animate floating beans
      beanData.forEach((b) => {
        b.mesh.rotation.x += b.rotSpeedX;
        b.mesh.rotation.y += b.rotSpeedY;
        b.mesh.position.y = b.baseY + Math.sin(elapsed * b.speedY + b.phase) * 0.2;
      });
      beansGroup.rotation.y = elapsed * 0.06;

      // Animate steam particles rising
      const posAttr = steamGeom.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < steamParticleCount; i++) {
        positions[i * 3 + 1] += steamSpeeds[i];
        positions[i * 3] += Math.sin(elapsed * 2 + positions[i * 3 + 1] * 2) * 0.002;
        positions[i * 3 + 2] += Math.cos(elapsed * 2 + positions[i * 3 + 1] * 2) * 0.002;

        if (positions[i * 3 + 1] > 2.6) {
          positions[i * 3 + 1] = 0.65;
          positions[i * 3] = (Math.random() - 0.5) * 0.6;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);
      domEl.removeEventListener("mousemove", handleMouseMove);
      domEl.removeEventListener("mousedown", handleMouseDown);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      glassGeom.dispose();
      glassMaterial.dispose();
      goldRimGeom.dispose();
      goldRimMat.dispose();
      liquidGeom.dispose();
      liquidMaterial.dispose();
      cremaGeom.dispose();
      cremaMaterial.dispose();
      cremaTexture.dispose();
      beanGeom.dispose();
      beanMaterial.dispose();
      steamGeom.dispose();
      steamMaterial.dispose();
      smokeTexture.dispose();
      shadowGeom.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[680px] flex items-center justify-center">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to rotate the 3D coffee cup"
      />

      {/* Floating Interactive Badge */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass-panel-light text-xs font-mono text-amber-200/90 flex items-center gap-2 border border-amber-500/20 pointer-events-none transition-opacity duration-300 ${
          isInteracting ? "opacity-30" : "opacity-90"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>360° INTERACTIVE 3D CUP • DRAG TO ROTATE</span>
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest text-amber-200/70">
              SYNTHESIZING 3D ATELIER...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
