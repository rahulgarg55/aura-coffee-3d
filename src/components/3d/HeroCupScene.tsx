"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Creates a procedural 3D coffee bean mesh with center cleft
 */
export function createCoffeeBeanGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.35, 24, 18);
  geom.scale(1.2, 0.75, 0.7);

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Indent the center crease/cleft on the top surface
    if (y > 0 && Math.abs(x) < 0.12) {
      const depth = (0.12 - Math.abs(x)) * 0.85;
      pos.setY(i, y - depth);
    }
  }
  geom.computeVertexNormals();
  return geom;
}

export default function HeroCupScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff0e6, 0.85);
    scene.add(ambientLight);

    const warmKeyLight = new THREE.SpotLight(0xffb070, 4.5);
    warmKeyLight.position.set(4, 5, 4);
    warmKeyLight.angle = Math.PI / 4;
    warmKeyLight.penumbra = 0.6;
    scene.add(warmKeyLight);

    const rimLight = new THREE.PointLight(0xe28743, 3.5, 10);
    rimLight.position.set(-3.5, 3, -2.5);
    scene.add(rimLight);

    const goldFillLight = new THREE.DirectionalLight(0xd4af37, 1.2);
    goldFillLight.position.set(0, -2, 2);
    scene.add(goldFillLight);

    // Main Pivot Group for User Rotation
    const cupGroup = new THREE.Group();
    scene.add(cupGroup);

    // 1. Double-Walled Crystal Glass Cup
    // Outer glass cylinder/lathe
    const glassPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.9, 0),
      new THREE.Vector2(1.1, 0.25),
      new THREE.Vector2(1.25, 1.6),
      new THREE.Vector2(1.28, 1.9),
      new THREE.Vector2(1.22, 1.9),
      new THREE.Vector2(1.12, 1.6),
      new THREE.Vector2(0.95, 0.35),
      new THREE.Vector2(0.85, 0.25),
      new THREE.Vector2(0, 0.25),
    ];
    const glassGeom = new THREE.LatheGeometry(glassPoints, 48);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.52,
      thickness: 0.45,
      specularIntensity: 1.0,
      specularColor: 0xffeedd,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const glassCup = new THREE.Mesh(glassGeom, glassMaterial);
    glassCup.position.y = -0.9;
    cupGroup.add(glassCup);

    // 2. Coffee Liquid Core
    const liquidPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0.28),
      new THREE.Vector2(0.82, 0.28),
      new THREE.Vector2(1.08, 1.55),
      new THREE.Vector2(0, 1.55),
    ];
    const liquidGeom = new THREE.LatheGeometry(liquidPoints, 40);
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a0d07,
      transmission: 0.25,
      roughness: 0.12,
      ior: 1.34,
      thickness: 1.2,
      emissive: 0x241107,
      emissiveIntensity: 0.35,
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMaterial);
    liquidMesh.position.y = -0.9;
    cupGroup.add(liquidMesh);

    // 3. Crema / Foam Disc on Top with Rosetta Ripple
    const cremaGeom = new THREE.CircleGeometry(1.07, 48);
    cremaGeom.rotateX(-Math.PI / 2);

    // Canvas procedural crema texture
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Golden hazelnut gradient
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
      grad.addColorStop(0, "#f2ddc4");
      grad.addColorStop(0.35, "#cf9659");
      grad.addColorStop(0.75, "#8a4d1f");
      grad.addColorStop(1, "#3d1e0b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Latte art rosetta feathering
      ctx.strokeStyle = "rgba(255, 245, 235, 0.85)";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";

      // Center leaf
      ctx.beginPath();
      ctx.moveTo(256, 420);
      ctx.bezierCurveTo(240, 280, 220, 160, 256, 90);
      ctx.stroke();

      // Rosetta wing petals
      for (let i = 0; i < 7; i++) {
        const y = 380 - i * 40;
        const spread = 75 - i * 6;
        ctx.lineWidth = 12 - i * 1.1;

        // Left wing
        ctx.beginPath();
        ctx.moveTo(256, y);
        ctx.bezierCurveTo(256 - spread * 0.6, y - 20, 256 - spread, y - 10, 256 - spread * 1.1, y + 10);
        ctx.stroke();

        // Right wing
        ctx.beginPath();
        ctx.moveTo(256, y);
        ctx.bezierCurveTo(256 + spread * 0.6, y - 20, 256 + spread, y - 10, 256 + spread * 1.1, y + 10);
        ctx.stroke();
      }

      // Heart crest
      ctx.fillStyle = "rgba(255, 248, 240, 0.95)";
      ctx.beginPath();
      ctx.arc(245, 85, 16, 0, Math.PI * 2);
      ctx.arc(267, 85, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const cremaTexture = new THREE.CanvasTexture(canvas);
    cremaTexture.wrapS = THREE.ClampToEdgeWrapping;
    cremaTexture.wrapT = THREE.ClampToEdgeWrapping;

    const cremaMaterial = new THREE.MeshStandardMaterial({
      map: cremaTexture,
      roughness: 0.65,
      metalness: 0.05,
    });
    const cremaMesh = new THREE.Mesh(cremaGeom, cremaMaterial);
    cremaMesh.position.set(0, 0.65, 0);
    cupGroup.add(cremaMesh);

    // 4. Floating Coffee Beans in 3D Space
    const beanGeom = createCoffeeBeanGeometry();
    const beanMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2012,
      roughness: 0.38,
      metalness: 0.15,
    });

    const beansGroup = new THREE.Group();
    scene.add(beansGroup);

    const beansCount = 14;
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
      const angle = (i / beansCount) * Math.PI * 2 + (Math.random() * 0.4);
      const radius = 1.9 + Math.random() * 1.4;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 3.2;
      const z = Math.sin(angle) * radius;

      beanMesh.position.set(x, y, z);
      beanMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.55 + Math.random() * 0.4;
      beanMesh.scale.set(scale, scale, scale);

      beansGroup.add(beanMesh);
      beanData.push({
        mesh: beanMesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.4 + Math.random() * 0.5,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.015 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 5. Dynamic Rising Steam Particle System
    const steamParticleCount = 65;
    const steamGeom = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamParticleCount * 3);
    const steamOpacities = new Float32Array(steamParticleCount);
    const steamScales = new Float32Array(steamParticleCount);
    const steamSpeeds: number[] = [];

    for (let i = 0; i < steamParticleCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.8;
      steamPositions[i * 3 + 1] = 0.65 + Math.random() * 2.2;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      steamOpacities[i] = Math.random() * 0.35;
      steamScales[i] = 0.1 + Math.random() * 0.25;
      steamSpeeds.push(0.006 + Math.random() * 0.012);
    }

    steamGeom.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));

    // Custom circular soft smoke texture
    const smokeCanvas = document.createElement("canvas");
    smokeCanvas.width = 128;
    smokeCanvas.height = 128;
    const sCtx = smokeCanvas.getContext("2d");
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      sGrad.addColorStop(0, "rgba(255, 240, 225, 0.8)");
      sGrad.addColorStop(0.4, "rgba(240, 220, 200, 0.35)");
      sGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const smokeTexture = new THREE.CanvasTexture(smokeCanvas);

    const steamMaterial = new THREE.PointsMaterial({
      size: 0.55,
      map: smokeTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const steamParticles = new THREE.Points(steamGeom, steamMaterial);
    cupGroup.add(steamParticles);

    setIsLoaded(true);

    // Mouse Interaction / Camera Tilt
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
        cupGroup.rotation.x = Math.max(-0.5, Math.min(0.5, cupGroup.rotation.x + deltaY * 0.008));
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

    // Visibility observer to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsed = clock.getElapsedTime();

      // Soft float of the cup
      cupGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

      if (!isDragging) {
        // Natural gentle idle rotation + mouse parallax
        targetRotY = mouseX * 0.35 + Math.sin(elapsed * 0.4) * 0.15;
        targetRotX = -mouseY * 0.2;
        cupGroup.rotation.y += (targetRotY - cupGroup.rotation.y) * 0.05;
        cupGroup.rotation.x += (targetRotX - cupGroup.rotation.x) * 0.05;
      }

      // Animate floating beans
      beanData.forEach((b) => {
        b.mesh.rotation.x += b.rotSpeedX;
        b.mesh.rotation.y += b.rotSpeedY;
        b.mesh.position.y = b.baseY + Math.sin(elapsed * b.speedY + b.phase) * 0.25;
      });

      // Orbit the bean group gently
      beansGroup.rotation.y = elapsed * 0.08;

      // Animate steam particles rising
      const posAttr = steamGeom.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < steamParticleCount; i++) {
        positions[i * 3 + 1] += steamSpeeds[i];
        // Swirling curl noise approximation
        positions[i * 3] += Math.sin(elapsed * 2 + positions[i * 3 + 1] * 3) * 0.003;
        positions[i * 3 + 2] += Math.cos(elapsed * 2 + positions[i * 3 + 1] * 3) * 0.003;

        // Reset particle if too high
        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = 0.65;
          positions[i * 3] = (Math.random() - 0.5) * 0.7;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
      liquidGeom.dispose();
      liquidMaterial.dispose();
      cremaGeom.dispose();
      cremaMaterial.dispose();
      beanGeom.dispose();
      beanMaterial.dispose();
      steamGeom.dispose();
      steamMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[680px] flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
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

      {/* Loading state indicator */}
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
