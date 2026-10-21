"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { CustomCoffeeConfig } from "../../types/coffee";

interface Props {
  config: CustomCoffeeConfig;
}

export default function ProductCustomizerScene({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const cremaMeshRef = useRef<THREE.Mesh | null>(null);
  const iceGroupRef = useRef<THREE.Group | null>(null);
  const steamGroupRef = useRef<THREE.Points | null>(null);
  const cupMeshRef = useRef<THREE.Mesh | null>(null);
  const toppingsGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.1, 4.4);

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

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xfff3e6, 0.85);
    scene.add(ambient);

    const keySpot = new THREE.DirectionalLight(0xffaa60, 2.8);
    keySpot.position.set(3, 4, 3);
    scene.add(keySpot);

    const rimPoint = new THREE.PointLight(0xe28743, 3.2, 10);
    rimPoint.position.set(-3, 2, -2);
    scene.add(rimPoint);

    // Contact Shadow Disk
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
      sGrad.addColorStop(0, "rgba(0, 0, 0, 0.6)");
      sGrad.addColorStop(0.5, "rgba(20, 10, 5, 0.2)");
      sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeom = new THREE.PlaneGeometry(2.8, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.1;
    scene.add(shadowMesh);

    // Pivot group for drag rotation
    const pivot = new THREE.Group();
    scene.add(pivot);

    // 1. Vessel / Cup Mesh
    const glassPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.85, 0),
      new THREE.Vector2(1.05, 0.22),
      new THREE.Vector2(1.22, 1.55),
      new THREE.Vector2(1.24, 1.75),
      new THREE.Vector2(1.18, 1.75),
      new THREE.Vector2(1.1, 1.55),
      new THREE.Vector2(0.95, 0.35),
      new THREE.Vector2(0.85, 0.25),
      new THREE.Vector2(0, 0.25),
    ];
    const glassGeom = new THREE.LatheGeometry(glassPoints, 32);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
    });
    const cupMesh = new THREE.Mesh(glassGeom, glassMaterial);
    cupMesh.position.y = -0.85;
    pivot.add(cupMesh);
    cupMeshRef.current = cupMesh;

    // 2. Coffee Liquid Core
    const liquidPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0.28),
      new THREE.Vector2(0.82, 0.28),
      new THREE.Vector2(1.06, 1.5),
      new THREE.Vector2(0, 1.5),
    ];
    const liquidGeom = new THREE.LatheGeometry(liquidPoints, 28);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0x241107,
      roughness: 0.15,
      metalness: 0.05,
      emissive: 0x180b05,
      emissiveIntensity: 0.3,
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMaterial);
    liquidMesh.position.y = -0.85;
    pivot.add(liquidMesh);
    liquidMeshRef.current = liquidMesh;

    // 3. Crema / Foam Top Disc
    const cremaGeom = new THREE.CircleGeometry(1.05, 32);
    cremaGeom.rotateX(-Math.PI / 2);

    const cremaCanvas = document.createElement("canvas");
    cremaCanvas.width = 512;
    cremaCanvas.height = 512;
    const cCtx = cremaCanvas.getContext("2d");
    if (cCtx) {
      const g = cCtx.createRadialGradient(256, 256, 20, 256, 256, 250);
      g.addColorStop(0, "#f5ebd9");
      g.addColorStop(0.35, "#cf9355");
      g.addColorStop(0.75, "#7a3e14");
      g.addColorStop(1, "#361607");
      cCtx.fillStyle = g;
      cCtx.fillRect(0, 0, 512, 512);

      // Heart swirl
      cCtx.fillStyle = "rgba(255, 250, 240, 0.92)";
      cCtx.beginPath();
      cCtx.arc(230, 230, 40, 0, Math.PI * 2);
      cCtx.arc(282, 230, 40, 0, Math.PI * 2);
      cCtx.fill();

      cCtx.beginPath();
      cCtx.moveTo(195, 245);
      cCtx.lineTo(256, 320);
      cCtx.lineTo(317, 245);
      cCtx.fill();
    }
    const cremaTex = new THREE.CanvasTexture(cremaCanvas);
    const cremaMaterial = new THREE.MeshStandardMaterial({
      map: cremaTex,
      roughness: 0.55,
      metalness: 0.05,
    });
    const cremaMesh = new THREE.Mesh(cremaGeom, cremaMaterial);
    cremaMesh.position.set(0, 0.65, 0);
    pivot.add(cremaMesh);
    cremaMeshRef.current = cremaMesh;

    // 4. Floating 3D Ice Cubes (for Iced Coffee)
    const iceGroup = new THREE.Group();
    const iceGeom = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });

    const ice1 = new THREE.Mesh(iceGeom, iceMat);
    ice1.position.set(-0.24, 0.45, 0.18);
    ice1.rotation.set(0.4, 0.3, 0.2);

    const ice2 = new THREE.Mesh(iceGeom, iceMat);
    ice2.position.set(0.26, 0.48, -0.14);
    ice2.rotation.set(-0.3, 0.6, 0.1);

    const ice3 = new THREE.Mesh(iceGeom, iceMat);
    ice3.position.set(0.04, 0.56, 0.14);
    ice3.rotation.set(0.2, -0.4, 0.5);

    iceGroup.add(ice1, ice2, ice3);
    iceGroup.visible = false;
    pivot.add(iceGroup);
    iceGroupRef.current = iceGroup;

    // 5. Rising Steam System (for Hot Coffee)
    const steamCount = 30;
    const steamGeom = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 0.6;
      steamPos[i * 3 + 1] = 0.65 + Math.random() * 1.4;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    steamGeom.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffeedd,
      size: 0.28,
      transparent: true,
      opacity: 0.3,
    });
    const steamParticles = new THREE.Points(steamGeom, steamMat);
    pivot.add(steamParticles);
    steamGroupRef.current = steamParticles;

    // 6. Toppings Group (Gold flakes / cinnamon)
    const toppingsGroup = new THREE.Group();
    const goldFlakeGeom = new THREE.TetrahedronGeometry(0.04);
    const goldFlakeMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.2,
    });
    for (let i = 0; i < 16; i++) {
      const flake = new THREE.Mesh(goldFlakeGeom, goldFlakeMat);
      const r = Math.random() * 0.55;
      const th = Math.random() * Math.PI * 2;
      flake.position.set(Math.cos(th) * r, 0.66, Math.sin(th) * r);
      flake.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      toppingsGroup.add(flake);
    }
    pivot.add(toppingsGroup);
    toppingsGroupRef.current = toppingsGroup;

    // Mouse Drag Rotation
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      pivot.rotation.y += deltaX * 0.008;
      pivot.rotation.x = Math.max(-0.35, Math.min(0.35, pivot.rotation.x + deltaY * 0.008));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const el = renderer.domElement;
    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Resize
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

    // 60-FPS Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        pivot.rotation.y = Math.sin(elapsed * 0.4) * 0.2;
      }

      // Steam animation
      if (steamGroupRef.current && steamGroupRef.current.visible) {
        const sArr = steamGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < steamCount; i++) {
          sArr[i * 3 + 1] += 0.007;
          sArr[i * 3] += Math.sin(elapsed * 2 + sArr[i * 3 + 1]) * 0.002;
          if (sArr[i * 3 + 1] > 2.0) {
            sArr[i * 3 + 1] = 0.65;
          }
        }
        steamGeom.attributes.position.needsUpdate = true;
      }

      // Ice bobbing
      if (iceGroup.visible) {
        ice1.position.y = 0.45 + Math.sin(elapsed * 2) * 0.015;
        ice2.position.y = 0.48 + Math.cos(elapsed * 1.8) * 0.015;
        ice3.position.y = 0.56 + Math.sin(elapsed * 2.2) * 0.012;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mousedown", handleMouseDown);
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
      cremaTex.dispose();
      iceGeom.dispose();
      iceMat.dispose();
      steamGeom.dispose();
      steamMat.dispose();
      goldFlakeGeom.dispose();
      goldFlakeMat.dispose();
      shadowGeom.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
    };
  }, []);

  // Update 3D Materials and Visibility based on config
  useEffect(() => {
    // 1. Roast Level -> Liquid Color
    if (liquidMeshRef.current) {
      const mat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      if (config.roastLevel === "light") {
        mat.color.setHex(0x5a3118);
        mat.emissive.setHex(0x381e0e);
      } else if (config.roastLevel === "medium") {
        mat.color.setHex(0x2f180b);
        mat.emissive.setHex(0x1d0f06);
      } else {
        // dark
        mat.color.setHex(0x140a05);
        mat.emissive.setHex(0x0a0402);
      }
    }

    // 2. Milk Type -> Crema Appearance & Height
    if (cremaMeshRef.current) {
      if (config.milkType === "none") {
        cremaMeshRef.current.position.set(0, 0.45, 0);
        cremaMeshRef.current.scale.set(0.9, 0.9, 0.9);
      } else {
        cremaMeshRef.current.position.set(0, 0.65, 0);
        cremaMeshRef.current.scale.set(1, 1, 1);
      }
    }

    // 3. Temperature -> Ice vs Steam
    if (iceGroupRef.current && steamGroupRef.current) {
      if (config.temperature === "iced") {
        iceGroupRef.current.visible = true;
        steamGroupRef.current.visible = false;
      } else {
        iceGroupRef.current.visible = false;
        steamGroupRef.current.visible = true;
      }
    }

    // 4. Toppings Visibility
    if (toppingsGroupRef.current) {
      toppingsGroupRef.current.visible = config.toppings.length > 0;
    }

    // 5. Cup Type Material
    if (cupMeshRef.current) {
      const mat = cupMeshRef.current.material as THREE.MeshStandardMaterial;
      if (config.cupType === "matte-ceramic") {
        mat.opacity = 1.0;
        mat.roughness = 0.85;
        mat.color.setHex(0x181818);
        mat.metalness = 0.1;
      } else if (config.cupType === "minimal-tumbler") {
        mat.opacity = 1.0;
        mat.roughness = 0.25;
        mat.color.setHex(0xb8aa8d);
        mat.metalness = 0.75;
      } else {
        // crystal glass
        mat.opacity = 0.72;
        mat.roughness = 0.08;
        mat.color.setHex(0xffffff);
        mat.metalness = 0.1;
      }
    }
  }, [config]);

  return (
    <div className="relative w-full h-[360px] md:h-[460px] flex items-center justify-center">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Drag to inspect your bespoke coffee in 360°"
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-mono text-amber-200/60 pointer-events-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>LIVE 3D REACTION • DRAG TO ROTATE</span>
      </div>
    </div>
  );
}
