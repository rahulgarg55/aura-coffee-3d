"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createCoffeeBeanGeometry } from "./HeroCupScene";

interface StageInfo {
  index: number;
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  telemetry: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
  };
}

const STAGES: StageInfo[] = [
  {
    index: 0,
    id: "harvest",
    badge: "STAGE 01 • SELECTION",
    title: "High-Altitude Bean Selection",
    subtitle: "Panama Volcán Barú • 1,800m Micro-Lot",
    description:
      "Hand-picked at peak Brix density from shaded volcanic slopes. Each bean undergoes spectroscopic sorting to ensure zero defects and immaculate density before roasting.",
    telemetry: {
      label1: "ELEVATION",
      val1: "1,850m",
      label2: "CHERRY BRIX",
      val2: "24.5°",
      label3: "LOT NUMBER",
      val3: "#47-G",
    },
  },
  {
    index: 1,
    id: "grind",
    badge: "STAGE 02 • THE PRECISION GRIND",
    title: "Conical Titanium Burr Fracture",
    subtitle: "98mm Flat Titanium Burrs • Zero Retention",
    description:
      "Beans cascade into counter-rotating diamond-cut burrs. Controlled particle distribution minimizes fines, unlocking floral acidity and pure stone-fruit aromatics.",
    telemetry: {
      label1: "MICRONS",
      val1: "280 μm",
      label2: "BURR RPM",
      val2: "450 RPM",
      label3: "RETENTION",
      val3: "< 0.05g",
    },
  },
  {
    index: 2,
    id: "extraction",
    badge: "STAGE 03 • 9-BAR EXTRACTION",
    title: "Pressurized Dynamic Extraction",
    subtitle: "93.8°C Saturated Brass Group Head",
    description:
      "Pressurized spring water contacts the tamped coffee puck. Viscous mahogany espresso streams emerge with concentrated honeyed sweetness and rich golden crema.",
    telemetry: {
      label1: "PRESSURE",
      val1: "9.3 BAR",
      label2: "TEMP",
      val2: "93.8°C",
      label3: "RATIO",
      val3: "1:2.1",
    },
  },
  {
    index: 3,
    id: "pour",
    badge: "STAGE 04 • THE VELVET INFUSION",
    title: "Micro-Textured Milk Swirl",
    subtitle: "Jersey Microfoam • 62°C Folding Technique",
    description:
      "Velvety steamed Guernsey milk folded in an arc through the dark crema. Fluid shear dynamics create an expanding rosetta pattern with a silken, glossy mouthfeel.",
    telemetry: {
      label1: "MICROFOAM",
      val1: "0.2mm Bubble",
      label2: "MILK TEMP",
      val2: "62.5°C",
      label3: "LIPID CONTENT",
      val3: "4.8%",
    },
  },
  {
    index: 4,
    id: "masterpiece",
    badge: "STAGE 05 • THE TASTING FLIGHT",
    title: "The Alchemical Cup",
    subtitle: "Double-Walled Borosilicate Vessel",
    description:
      "The complete master creation. Rising steam ribbons carry volatile aromatics of jasmine, bergamot, and roasted cacao, delivered in thermally insulated crystal glass.",
    telemetry: {
      label1: "AROMA VAPOR",
      val1: "Jasmine / Cocoa",
      label2: "CUP SCORE",
      val2: "94.5 PTS",
      label3: "EXPERIENCE",
      val3: "Pure Alchemy",
    },
  },
];

export default function ScrollJourneyScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for 3D objects
  const progressRef = useRef(0);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 700;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 6.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xffa550, 5);
    keySpot.position.set(3, 7, 4);
    keySpot.angle = Math.PI / 4;
    keySpot.penumbra = 0.5;
    scene.add(keySpot);

    const rimLight = new THREE.PointLight(0xe28743, 4, 15);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const bottomGlow = new THREE.DirectionalLight(0xd4af37, 1.4);
    bottomGlow.position.set(0, -3, 1);
    scene.add(bottomGlow);

    // ROOT SCENE GROUPS
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. STAGE 1: Floating Harvest Beans
    const beanGeom = createCoffeeBeanGeometry();
    const beanMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2012,
      roughness: 0.35,
      metalness: 0.1,
    });

    const harvestBeansGroup = new THREE.Group();
    masterGroup.add(harvestBeansGroup);

    const harvestBeans: Array<{
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeed: THREE.Vector3;
    }> = [];

    for (let i = 0; i < 22; i++) {
      const bMesh = new THREE.Mesh(beanGeom, beanMaterial);
      const theta = (i / 22) * Math.PI * 2;
      const radius = 1.2 + Math.random() * 1.8;
      const x = Math.cos(theta) * radius;
      const y = (Math.random() - 0.5) * 2.8 + 0.5;
      const z = Math.sin(theta) * radius;

      bMesh.position.set(x, y, z);
      bMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.5 + Math.random() * 0.45;
      bMesh.scale.set(s, s, s);

      harvestBeansGroup.add(bMesh);
      harvestBeans.push({
        mesh: bMesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeed: new THREE.Vector3(
          0.005 + Math.random() * 0.015,
          0.008 + Math.random() * 0.02,
          0.004 + Math.random() * 0.01
        ),
      });
    }

    // 2. STAGE 2: Falling Grind Particles (Coffee grounds)
    const grindCount = 450;
    const grindGeom = new THREE.BufferGeometry();
    const grindPositions = new Float32Array(grindCount * 3);
    const grindSpeeds = new Float32Array(grindCount);
    const grindSeeds = new Float32Array(grindCount * 2);

    for (let i = 0; i < grindCount; i++) {
      grindPositions[i * 3] = (Math.random() - 0.5) * 1.6;
      grindPositions[i * 3 + 1] = Math.random() * 3.5 - 0.5;
      grindPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
      grindSpeeds[i] = 0.02 + Math.random() * 0.04;
      grindSeeds[i * 2] = (Math.random() - 0.5) * 0.02;
      grindSeeds[i * 2 + 1] = (Math.random() - 0.5) * 0.02;
    }
    grindGeom.setAttribute("position", new THREE.BufferAttribute(grindPositions, 3));

    const grindMaterial = new THREE.PointsMaterial({
      color: 0x4a2818,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const grindParticles = new THREE.Points(grindGeom, grindMaterial);
    grindParticles.visible = false;
    masterGroup.add(grindParticles);

    // 3. STAGE 3: Portafilter & Flowing Espresso Stream
    const portafilterGroup = new THREE.Group();
    portafilterGroup.position.set(0, 1.8, 0);

    // Portafilter head ring (brass / chrome)
    const ringGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x2b2b2b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    portafilterGroup.add(ringMesh);

    // Portafilter handle
    const handleGeom = new THREE.CylinderGeometry(0.12, 0.16, 1.8, 16);
    handleGeom.rotateZ(Math.PI / 2);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x1f140e,
      roughness: 0.6,
    });
    const handleMesh = new THREE.Mesh(handleGeom, handleMat);
    handleMesh.position.set(1.5, 0, 0);
    portafilterGroup.add(handleMesh);

    // Dual Espresso Spouts
    const spoutMat = new THREE.MeshStandardMaterial({
      color: 0xc8a065,
      metalness: 0.85,
      roughness: 0.25,
    });
    const spoutGeom = new THREE.CylinderGeometry(0.08, 0.05, 0.35, 16);
    const spout1 = new THREE.Mesh(spoutGeom, spoutMat);
    spout1.position.set(-0.25, -0.3, 0);
    const spout2 = new THREE.Mesh(spoutGeom, spoutMat);
    spout2.position.set(0.25, -0.3, 0);
    portafilterGroup.add(spout1, spout2);

    // Flowing Liquid Streams
    const streamGeom1 = new THREE.CylinderGeometry(0.035, 0.05, 2.1, 16);
    const streamGeom2 = new THREE.CylinderGeometry(0.035, 0.05, 2.1, 16);
    const streamMat = new THREE.MeshStandardMaterial({
      color: 0x3d1708,
      emissive: 0x2a1005,
      roughness: 0.05,
      metalness: 0.1,
    });
    const streamMesh1 = new THREE.Mesh(streamGeom1, streamMat);
    streamMesh1.position.set(-0.25, -1.45, 0);
    const streamMesh2 = new THREE.Mesh(streamGeom2, streamMat);
    streamMesh2.position.set(0.25, -1.45, 0);
    portafilterGroup.add(streamMesh1, streamMesh2);

    portafilterGroup.visible = false;
    masterGroup.add(portafilterGroup);

    // 4. STAGE 4 & 5: Crystal Glass Cup
    const cupGroup = new THREE.Group();
    cupGroup.position.set(0, -1.1, 0);

    const glassPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.95, 0),
      new THREE.Vector2(1.15, 0.25),
      new THREE.Vector2(1.3, 1.8),
      new THREE.Vector2(1.25, 1.8),
      new THREE.Vector2(1.18, 1.55),
      new THREE.Vector2(1.0, 0.35),
      new THREE.Vector2(0.88, 0.25),
      new THREE.Vector2(0, 0.25),
    ];
    const glassGeom = new THREE.LatheGeometry(glassPoints, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.45,
      specularColor: 0xffedd5,
    });
    const cupMesh = new THREE.Mesh(glassGeom, glassMat);
    cupGroup.add(cupMesh);

    // Liquid in cup (scales up as it fills!)
    const liquidPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0.28),
      new THREE.Vector2(0.85, 0.28),
      new THREE.Vector2(1.12, 1.55),
      new THREE.Vector2(0, 1.55),
    ];
    const liquidGeom = new THREE.LatheGeometry(liquidPoints, 40);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x221008,
      roughness: 0.1,
      metalness: 0.05,
      emissive: 0x1f0e06,
    });
    const cupLiquid = new THREE.Mesh(liquidGeom, liquidMat);
    cupGroup.add(cupLiquid);

    // Foam surface disc
    const foamGeom = new THREE.CircleGeometry(1.11, 48);
    foamGeom.rotateX(-Math.PI / 2);

    // Canvas procedural rosetta texture
    const fCanvas = document.createElement("canvas");
    fCanvas.width = 512;
    fCanvas.height = 512;
    const fCtx = fCanvas.getContext("2d");
    if (fCtx) {
      const g = fCtx.createRadialGradient(256, 256, 30, 256, 256, 250);
      g.addColorStop(0, "#f7ede2");
      g.addColorStop(0.3, "#e2ad75");
      g.addColorStop(0.7, "#995222");
      g.addColorStop(1, "#361a09");
      fCtx.fillStyle = g;
      fCtx.fillRect(0, 0, 512, 512);

      fCtx.strokeStyle = "rgba(255, 250, 240, 0.9)";
      fCtx.lineWidth = 16;
      fCtx.lineCap = "round";

      fCtx.beginPath();
      fCtx.moveTo(256, 420);
      fCtx.bezierCurveTo(245, 280, 235, 170, 256, 95);
      fCtx.stroke();

      for (let i = 0; i < 6; i++) {
        const y = 370 - i * 44;
        const s = 70 - i * 7;
        fCtx.beginPath();
        fCtx.moveTo(256, y);
        fCtx.bezierCurveTo(256 - s * 0.6, y - 18, 256 - s, y - 8, 256 - s * 1.1, y + 10);
        fCtx.stroke();

        fCtx.beginPath();
        fCtx.moveTo(256, y);
        fCtx.bezierCurveTo(256 + s * 0.6, y - 18, 256 + s, y - 8, 256 + s * 1.1, y + 10);
        fCtx.stroke();
      }
    }
    const foamTex = new THREE.CanvasTexture(fCanvas);
    const foamMat = new THREE.MeshStandardMaterial({
      map: foamTex,
      roughness: 0.6,
      metalness: 0.05,
    });
    const foamMesh = new THREE.Mesh(foamGeom, foamMat);
    foamMesh.position.set(0, 1.56, 0);
    cupGroup.add(foamMesh);

    // Milk Stream (Pours into cup during Stage 4)
    const milkGeom = new THREE.CylinderGeometry(0.06, 0.08, 2.2, 16);
    const milkMat = new THREE.MeshStandardMaterial({
      color: 0xfffcf7,
      roughness: 0.25,
      metalness: 0.05,
    });
    const milkStream = new THREE.Mesh(milkGeom, milkMat);
    milkStream.position.set(0.15, 2.4, 0);
    milkStream.rotation.z = -0.15;
    milkStream.visible = false;
    cupGroup.add(milkStream);

    // Steam Cloud (Stage 5)
    const steamCount = 50;
    const steamGeom = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 0.8;
      steamPos[i * 3 + 1] = 1.6 + Math.random() * 2.0;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    steamGeom.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffeedd,
      size: 0.35,
      transparent: true,
      opacity: 0.35,
    });
    const steamCloud = new THREE.Points(steamGeom, steamMat);
    cupGroup.add(steamCloud);

    masterGroup.add(cupGroup);

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

    // Clock & Render Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const p = progressRef.current; // 0 to 1

      // ==========================================
      // SCROLL-DRIVEN 3D CAMERA & STAGE LOGIC
      // ==========================================

      if (p < 0.2) {
        // Stage 1: HARVEST (0.0 to 0.2)
        harvestBeansGroup.visible = true;
        grindParticles.visible = false;
        portafilterGroup.visible = false;
        cupGroup.visible = false;

        // Camera moves gently around beans
        camera.position.set(0, 1.2, 5.8);
        camera.lookAt(0, 0.4, 0);

        harvestBeans.forEach((b) => {
          b.mesh.rotation.x += b.rotSpeed.x;
          b.mesh.rotation.y += b.rotSpeed.y;
          b.mesh.position.y = b.baseY + Math.sin(elapsed * 1.5 + b.baseX) * 0.15;
        });
        harvestBeansGroup.rotation.y = elapsed * 0.1;
      } else if (p < 0.4) {
        // Stage 2: GRINDING (0.2 to 0.4)
        const localP = (p - 0.2) / 0.2; // 0 to 1

        harvestBeansGroup.visible = true;
        grindParticles.visible = true;
        portafilterGroup.visible = false;
        cupGroup.visible = false;

        // Beans funnel into grinder center
        harvestBeans.forEach((b, i) => {
          b.mesh.position.x = b.baseX * (1 - localP * 0.7);
          b.mesh.position.z = b.baseZ * (1 - localP * 0.7);
          b.mesh.position.y = b.baseY - localP * 1.5;
          b.mesh.rotation.y += 0.05;
        });

        // Grind particles raining down
        const pos = grindGeom.attributes.position as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < grindCount; i++) {
          arr[i * 3 + 1] -= grindSpeeds[i] * 1.8;
          if (arr[i * 3 + 1] < -1.5) {
            arr[i * 3 + 1] = 2.0;
          }
        }
        pos.needsUpdate = true;

        camera.position.set(0, 0.8, 4.6);
        camera.lookAt(0, 0, 0);
      } else if (p < 0.6) {
        // Stage 3: EXTRACTION (0.4 to 0.6)
        const localP = (p - 0.4) / 0.2;

        harvestBeansGroup.visible = false;
        grindParticles.visible = false;
        portafilterGroup.visible = true;
        cupGroup.visible = true;
        milkStream.visible = false;
        steamCloud.visible = false;

        // Stream pulsates with 9-bar pressure
        streamMesh1.scale.x = 0.9 + Math.sin(elapsed * 25) * 0.15;
        streamMesh2.scale.x = 0.9 + Math.cos(elapsed * 25) * 0.15;

        // Cup starts filling
        const fillAmount = Math.min(1, Math.max(0.1, localP * 0.6));
        cupLiquid.scale.set(1, fillAmount, 1);
        cupLiquid.position.y = -0.9 * (1 - fillAmount);
        foamMesh.position.y = 0.28 + fillAmount * 1.25;

        camera.position.set(0, 0.5, 4.8);
        camera.lookAt(0, 0, 0);
      } else if (p < 0.8) {
        // Stage 4: VELVET MILK POUR (0.6 to 0.8)
        const localP = (p - 0.6) / 0.2;

        harvestBeansGroup.visible = false;
        grindParticles.visible = false;
        portafilterGroup.visible = false;
        cupGroup.visible = true;
        milkStream.visible = true;
        steamCloud.visible = true;

        // Milk stream animates pouring
        milkStream.position.y = 2.3 + Math.sin(elapsed * 4) * 0.05;
        milkStream.rotation.z = -0.15 + Math.sin(elapsed * 2) * 0.03;

        // Cup fills completely with microfoam
        cupLiquid.scale.set(1, 1, 1);
        cupLiquid.position.y = 0;
        foamMesh.position.y = 1.56;
        foamMesh.rotation.y = elapsed * 0.08;

        camera.position.set(Math.sin(elapsed * 0.5) * 0.8, 1.2, 4.5);
        camera.lookAt(0, 0.4, 0);
      } else {
        // Stage 5: THE MASTERPIECE (0.8 to 1.0)
        harvestBeansGroup.visible = false;
        grindParticles.visible = false;
        portafilterGroup.visible = false;
        cupGroup.visible = true;
        milkStream.visible = false;
        steamCloud.visible = true;

        // Cup floats majestically
        cupGroup.position.y = -0.6 + Math.sin(elapsed * 1.5) * 0.08;
        cupGroup.rotation.y = elapsed * 0.25;

        // Steam particles rise
        const sPos = steamGeom.attributes.position as THREE.BufferAttribute;
        const sArr = sPos.array as Float32Array;
        for (let i = 0; i < steamCount; i++) {
          sArr[i * 3 + 1] += 0.012;
          sArr[i * 3] += Math.sin(elapsed * 2 + sArr[i * 3 + 1]) * 0.003;
          if (sArr[i * 3 + 1] > 3.4) {
            sArr[i * 3 + 1] = 1.6;
          }
        }
        sPos.needsUpdate = true;

        camera.position.set(0, 0.8, 4.2);
        camera.lookAt(0, 0.2, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      beanGeom.dispose();
      beanMaterial.dispose();
      grindGeom.dispose();
      grindMaterial.dispose();
      glassGeom.dispose();
      glassMat.dispose();
      liquidGeom.dispose();
      liquidMat.dispose();
      foamGeom.dispose();
      foamMat.dispose();
      milkGeom.dispose();
      milkMat.dispose();
      steamGeom.dispose();
      steamMat.dispose();
    };
  }, []);

  // Listen to Window Scroll over the sticky section
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScrollable = section.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      progressRef.current = progress;
      setScrollProgress(progress);

      const stageIndex = Math.min(4, Math.floor(progress * 5));
      setActiveStage(stageIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const jumpToStage = (stageIdx: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const totalScrollable = section.clientHeight - window.innerHeight;
    const targetY = section.offsetTop + (stageIdx / 4.5) * totalScrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const currentStage = STAGES[activeStage] || STAGES[0];

  return (
    <section
      ref={sectionRef}
      id="scroll-journey"
      className="relative w-full h-[450vh] bg-[#070605]"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between py-6 px-4 md:px-12 select-none">
        {/* Top HUD Bar */}
        <div className="z-20 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel py-3 px-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-amber-200 uppercase">
              SCROLL-DRIVEN EXTRACTION JOURNEY
            </span>
            <span className="hidden md:inline text-xs text-stone-500 font-mono">|</span>
            <span className="hidden md:inline text-xs font-mono text-stone-400">
              PROGRESS: {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          {/* Stage Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => jumpToStage(idx)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
                  activeStage === idx
                    ? "bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/25 scale-105"
                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/50"
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Center Canvas & Side Narrative Overlay */}
        <div className="relative w-full flex-1 flex flex-col lg:flex-row items-center justify-between my-2">
          {/* 3D WebGL Canvas */}
          <div
            ref={canvasRef}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto"
          />

          {/* Left Narrative Glass Panel */}
          <div className="z-10 w-full lg:max-w-md pointer-events-none mt-auto lg:mt-0 mb-6 lg:mb-0">
            <div className="glass-panel p-6 md:p-8 rounded-3xl pointer-events-auto shadow-2xl transition-all duration-500 border border-amber-500/20">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
                {currentStage.badge}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-light text-stone-100 tracking-tight mb-1">
                {currentStage.title}
              </h3>
              <p className="text-sm font-mono text-amber-400/90 mb-4">
                {currentStage.subtitle}
              </p>

              <p className="text-sm text-stone-300 leading-relaxed font-light mb-6">
                {currentStage.description}
              </p>

              {/* Live Telemetry HUD */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-800/80">
                <div>
                  <div className="text-[10px] font-mono text-stone-500">
                    {currentStage.telemetry.label1}
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {currentStage.telemetry.val1}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-stone-500">
                    {currentStage.telemetry.label2}
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {currentStage.telemetry.val2}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-stone-500">
                    {currentStage.telemetry.label3}
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {currentStage.telemetry.val3}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stage Scrubber Bar */}
          <div className="hidden lg:flex z-10 flex-col items-end gap-3 pointer-events-none pr-4">
            {STAGES.map((s, idx) => (
              <div
                key={s.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  activeStage === idx ? "opacity-100 translate-x-0" : "opacity-40 translate-x-2"
                }`}
              >
                <span className="text-xs font-mono text-amber-200/80">
                  {s.title.split(" ")[0]}
                </span>
                <div
                  className={`w-3 h-3 rounded-full border transition-all ${
                    activeStage === idx
                      ? "bg-amber-400 border-amber-300 scale-125 shadow-md shadow-amber-400/50"
                      : "border-stone-600 bg-stone-900"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Scroll Prompt Bar */}
        <div className="z-20 w-full flex items-center justify-between text-xs font-mono text-stone-400 px-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-ping" />
            <span>SCROLL DOWN TO PROGRESS EXTRACTION</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>AURA SPECIALTY ATELIER</span>
            <span>•</span>
            <span>PRECISION THERMAL DYNAMICS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
