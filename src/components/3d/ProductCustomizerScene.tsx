"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { CustomCoffeeConfig } from "../../types/coffee";

interface Props {
  config: CustomCoffeeConfig;
}

export default function ProductCustomizerScene({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
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
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xfff3e6, 0.9);
    scene.add(ambient);

    const keySpot = new THREE.SpotLight(0xffaa60, 4.5);
    keySpot.position.set(3, 4, 3);
    keySpot.angle = Math.PI / 4;
    scene.add(keySpot);

    const rimPoint = new THREE.PointLight(0xe28743, 3.5, 10);
    rimPoint.position.set(-3, 2, -2);
    scene.add(rimPoint);

    // Pivot group for drag rotation
    const pivot = new THREE.Group();
    scene.add(pivot);

    // 1. Vessel / Cup Mesh
    const glassPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.9, 0),
      new THREE.Vector2(1.1, 0.25),
      new THREE.Vector2(1.22, 1.6),
      new THREE.Vector2(1.25, 1.8),
      new THREE.Vector2(1.18, 1.8),
      new THREE.Vector2(1.1, 1.55),
      new THREE.Vector2(0.95, 0.35),
      new THREE.Vector2(0.85, 0.25),
      new THREE.Vector2(0, 0.25),
    ];
    const glassGeom = new THREE.LatheGeometry(glassPoints, 44);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.93,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.52,
      thickness: 0.45,
      specularColor: 0xffedd5,
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
    const liquidGeom = new THREE.LatheGeometry(liquidPoints, 36);
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x221008,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.2,
      thickness: 1.0,
      emissive: 0x180b05,
      emissiveIntensity: 0.4,
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMaterial);
    liquidMesh.position.y = -0.85;
    pivot.add(liquidMesh);
    liquidMeshRef.current = liquidMesh;

    // 3. Crema / Foam Top Disc
    const cremaGeom = new THREE.CircleGeometry(1.05, 40);
    cremaGeom.rotateX(-Math.PI / 2);

    const cremaCanvas = document.createElement("canvas");
    cremaCanvas.width = 256;
    cremaCanvas.height = 256;
    const cCtx = cremaCanvas.getContext("2d");
    if (cCtx) {
      const g = cCtx.createRadialGradient(128, 128, 15, 128, 128, 120);
      g.addColorStop(0, "#f5ebd9");
      g.addColorStop(0.4, "#cf9355");
      g.addColorStop(0.8, "#7a3e14");
      g.addColorStop(1, "#361607");
      cCtx.fillStyle = g;
      cCtx.fillRect(0, 0, 256, 256);

      // Heart swirl
      cCtx.strokeStyle = "rgba(255, 250, 240, 0.9)";
      cCtx.lineWidth = 8;
      cCtx.beginPath();
      cCtx.arc(115, 115, 22, 0, Math.PI * 2);
      cCtx.arc(141, 115, 22, 0, Math.PI * 2);
      cCtx.fillStyle = "rgba(255, 250, 240, 0.9)";
      cCtx.fill();
    }
    const cremaTex = new THREE.CanvasTexture(cremaCanvas);
    const cremaMaterial = new THREE.MeshStandardMaterial({
      map: cremaTex,
      roughness: 0.6,
      metalness: 0.05,
    });
    const cremaMesh = new THREE.Mesh(cremaGeom, cremaMaterial);
    cremaMesh.position.set(0, 0.65, 0);
    pivot.add(cremaMesh);
    cremaMeshRef.current = cremaMesh;

    // 4. Floating 3D Ice Cubes (for Iced Coffee)
    const iceGroup = new THREE.Group();
    const iceGeom = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      roughness: 0.08,
      ior: 1.31,
      thickness: 0.35,
      transparent: true,
      opacity: 0.88,
    });

    const ice1 = new THREE.Mesh(iceGeom, iceMat);
    ice1.position.set(-0.25, 0.45, 0.2);
    ice1.rotation.set(0.4, 0.3, 0.2);

    const ice2 = new THREE.Mesh(iceGeom, iceMat);
    ice2.position.set(0.28, 0.48, -0.15);
    ice2.rotation.set(-0.3, 0.6, 0.1);

    const ice3 = new THREE.Mesh(iceGeom, iceMat);
    ice3.position.set(0.05, 0.58, 0.15);
    ice3.rotation.set(0.2, -0.4, 0.5);

    iceGroup.add(ice1, ice2, ice3);
    iceGroup.visible = false;
    pivot.add(iceGroup);
    iceGroupRef.current = iceGroup;

    // 5. Rising Steam System (for Hot Coffee)
    const steamCount = 35;
    const steamGeom = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 0.7;
      steamPos[i * 3 + 1] = 0.65 + Math.random() * 1.5;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }
    steamGeom.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffeedd,
      size: 0.3,
      transparent: true,
      opacity: 0.35,
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
    for (let i = 0; i < 18; i++) {
      const flake = new THREE.Mesh(goldFlakeGeom, goldFlakeMat);
      const r = Math.random() * 0.6;
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
      pivot.rotation.y += deltaX * 0.01;
      pivot.rotation.x = Math.max(-0.4, Math.min(0.4, pivot.rotation.x + deltaY * 0.01));
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

    // Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        pivot.rotation.y = Math.sin(elapsed * 0.5) * 0.25;
      }

      // Steam animation
      if (steamGroupRef.current && steamGroupRef.current.visible) {
        const sArr = steamGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < steamCount; i++) {
          sArr[i * 3 + 1] += 0.008;
          sArr[i * 3] += Math.sin(elapsed * 2 + sArr[i * 3 + 1]) * 0.002;
          if (sArr[i * 3 + 1] > 2.2) {
            sArr[i * 3 + 1] = 0.65;
          }
        }
        steamGeom.attributes.position.needsUpdate = true;
      }

      // Ice bobbing
      if (iceGroup.visible) {
        ice1.position.y = 0.45 + Math.sin(elapsed * 2) * 0.02;
        ice2.position.y = 0.48 + Math.cos(elapsed * 1.8) * 0.02;
        ice3.position.y = 0.58 + Math.sin(elapsed * 2.2) * 0.015;
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
      iceGeom.dispose();
      iceMat.dispose();
      steamGeom.dispose();
      steamMat.dispose();
      goldFlakeGeom.dispose();
      goldFlakeMat.dispose();
    };
  }, []);

  // Update 3D Materials and Visibility based on config
  useEffect(() => {
    // 1. Roast Level -> Liquid Color
    if (liquidMeshRef.current) {
      const mat = liquidMeshRef.current.material as THREE.MeshPhysicalMaterial;
      if (config.roastLevel === "light") {
        mat.color.setHex(0x522d16);
        mat.emissive.setHex(0x381e0e);
      } else if (config.roastLevel === "medium") {
        mat.color.setHex(0x2d170a);
        mat.emissive.setHex(0x1d0f06);
      } else {
        // dark
        mat.color.setHex(0x110804);
        mat.emissive.setHex(0x0a0402);
      }
    }

    // 2. Milk Type -> Crema Appearance & Height
    if (cremaMeshRef.current) {
      if (config.milkType === "none") {
        // Espresso only - thin crema
        cremaMeshRef.current.position.set(0, 0.45, 0);
        cremaMeshRef.current.scale.set(0.9, 0.9, 0.9);
      } else {
        // Velvet microfoam
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
      const mat = cupMeshRef.current.material as THREE.MeshPhysicalMaterial;
      if (config.cupType === "matte-ceramic") {
        mat.transmission = 0;
        mat.roughness = 0.85;
        mat.color.setHex(0x1a1a1a);
        mat.metalness = 0.1;
      } else if (config.cupType === "minimal-tumbler") {
        mat.transmission = 0;
        mat.roughness = 0.25;
        mat.color.setHex(0xc2b69d); // brushed warm brass/titanium
        mat.metalness = 0.75;
      } else {
        // crystal glass
        mat.transmission = 0.93;
        mat.roughness = 0.04;
        mat.color.setHex(0xffffff);
        mat.metalness = 0.0;
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
