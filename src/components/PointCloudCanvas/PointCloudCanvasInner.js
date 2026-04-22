import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useClearColor from '@site/src/hooks/useClearColor';

const POINT_COUNT = 14000;

function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function PointCloud() {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(POINT_COUNT * 3);
    const col = new Float32Array(POINT_COUNT * 3);
    const r = rng(42);
    let idx = 0;

    // === Road surface (20%) ===
    const roadN = Math.floor(POINT_COUNT * 0.20);
    for (let i = 0; i < roadN; i++) {
      const i3 = idx * 3;
      // Two crossing roads
      const isXroad = r() < 0.5;
      if (isXroad) {
        pos[i3] = (r() - 0.5) * 7;
        pos[i3 + 1] = -1.5 + (r() - 0.5) * 0.01;
        pos[i3 + 2] = (r() - 0.5) * 1.2;
      } else {
        pos[i3] = (r() - 0.5) * 1.2;
        pos[i3 + 1] = -1.5 + (r() - 0.5) * 0.01;
        pos[i3 + 2] = (r() - 0.5) * 7;
      }
      // Asphalt gray with lane markings
      const isMarking = r() < 0.05;
      if (isMarking) {
        col[i3] = 0.9; col[i3 + 1] = 0.85; col[i3 + 2] = 0.2;
      } else {
        const v = 0.22 + r() * 0.08;
        col[i3] = v; col[i3 + 1] = v; col[i3 + 2] = v + 0.02;
      }
      idx++;
    }

    // === Sidewalk / ground (10%) ===
    const sidewalkN = Math.floor(POINT_COUNT * 0.10);
    for (let i = 0; i < sidewalkN; i++) {
      const i3 = idx * 3;
      pos[i3] = (r() - 0.5) * 7;
      pos[i3 + 1] = -1.49 + (r() - 0.5) * 0.01;
      pos[i3 + 2] = (r() - 0.5) * 7;
      // Skip road area
      if ((Math.abs(pos[i3]) < 0.7 && Math.abs(pos[i3 + 2]) < 3.5) ||
          (Math.abs(pos[i3 + 2]) < 0.7 && Math.abs(pos[i3]) < 3.5)) {
        pos[i3] += (r() > 0.5 ? 1 : -1) * (0.7 + r() * 1.5);
      }
      const v = 0.45 + r() * 0.1;
      col[i3] = v; col[i3 + 1] = v - 0.02; col[i3 + 2] = v - 0.05;
      idx++;
    }

    // === Buildings with RGB facades (45%) ===
    const buildingN = Math.floor(POINT_COUNT * 0.45);
    const buildings = [
      { x: -2.0, z: -1.8, w: 1.0, d: 0.9, h: 3.5, wallR: 0.72, wallG: 0.65, wallB: 0.55, roofR: 0.35, roofG: 0.25, roofB: 0.2 },
      { x: -0.3, z: -2.0, w: 0.8, d: 0.7, h: 5.0, wallR: 0.82, wallG: 0.80, wallB: 0.78, roofR: 0.4, roofG: 0.35, roofB: 0.3 },
      { x: 1.3, z: -1.8, w: 1.1, d: 0.9, h: 3.0, wallR: 0.65, wallG: 0.68, wallB: 0.75, roofR: 0.3, roofG: 0.28, roofB: 0.32 },
      { x: -2.2, z: 1.5, w: 0.9, d: 0.8, h: 2.5, wallR: 0.78, wallG: 0.72, wallB: 0.62, roofR: 0.45, roofG: 0.3, roofB: 0.25 },
      { x: 0.0, z: 1.8, w: 1.0, d: 0.85, h: 4.2, wallR: 0.85, wallG: 0.82, wallB: 0.78, roofR: 0.25, roofG: 0.25, roofB: 0.3 },
      { x: 1.8, z: 1.6, w: 0.8, d: 0.75, h: 2.8, wallR: 0.7, wallG: 0.75, wallB: 0.72, roofR: 0.5, roofG: 0.35, roofB: 0.25 },
      { x: -1.0, z: -0.1, w: 0.6, d: 0.5, h: 1.5, wallR: 0.75, wallG: 0.7, wallB: 0.65, roofR: 0.38, roofG: 0.32, roofB: 0.28 },
      { x: 2.5, z: -0.2, w: 0.7, d: 0.6, h: 2.0, wallR: 0.68, wallG: 0.72, wallB: 0.7, roofR: 0.42, roofG: 0.38, roofB: 0.35 },
    ];

    for (let i = 0; i < buildingN; i++) {
      const b = buildings[Math.floor(r() * buildings.length)];
      const i3 = idx * 3;
      const face = r();
      let px, py, pz, cr, cg, cb;

      if (face < 0.24) {
        px = b.x + (r() - 0.5) * b.w; py = -1.5 + r() * b.h; pz = b.z + b.d / 2;
        cr = b.wallR; cg = b.wallG; cb = b.wallB;
        // Window pattern
        if (r() < 0.15 && py > -1.0) { cr = 0.4; cg = 0.5; cb = 0.65; }
      } else if (face < 0.48) {
        px = b.x + (r() - 0.5) * b.w; py = -1.5 + r() * b.h; pz = b.z - b.d / 2;
        cr = b.wallR; cg = b.wallG; cb = b.wallB;
        if (r() < 0.15 && py > -1.0) { cr = 0.4; cg = 0.5; cb = 0.65; }
      } else if (face < 0.72) {
        px = b.x - b.w / 2; py = -1.5 + r() * b.h; pz = b.z + (r() - 0.5) * b.d;
        cr = b.wallR * 0.95; cg = b.wallG * 0.95; cb = b.wallB * 0.95;
      } else if (face < 0.92) {
        px = b.x + b.w / 2; py = -1.5 + r() * b.h; pz = b.z + (r() - 0.5) * b.d;
        cr = b.wallR * 1.05; cg = b.wallG * 1.05; cb = b.wallB * 1.05;
      } else {
        px = b.x + (r() - 0.5) * b.w; py = -1.5 + b.h; pz = b.z + (r() - 0.5) * b.d;
        cr = b.roofR; cg = b.roofG; cb = b.roofB;
      }

      pos[i3] = px + (r() - 0.5) * 0.006;
      pos[i3 + 1] = py + (r() - 0.5) * 0.006;
      pos[i3 + 2] = pz + (r() - 0.5) * 0.006;
      col[i3] = Math.min(1, cr + (r() - 0.5) * 0.03);
      col[i3 + 1] = Math.min(1, cg + (r() - 0.5) * 0.03);
      col[i3 + 2] = Math.min(1, cb + (r() - 0.5) * 0.03);
      idx++;
    }

    // === Vegetation / trees (15%) ===
    const treeN = Math.floor(POINT_COUNT * 0.15);
    const treeCenters = [
      { x: -1.5, z: 2.5, r: 0.4, h: 1.5 },
      { x: 0.6, z: 2.6, r: 0.5, h: 1.8 },
      { x: 2.2, z: 2.3, r: 0.35, h: 1.2 },
      { x: -2.5, z: -0.5, r: 0.3, h: 1.0 },
      { x: 0.8, z: -2.8, r: 0.35, h: 1.3 },
      { x: -0.8, z: 2.8, r: 0.25, h: 1.1 },
    ];
    for (let i = 0; i < treeN; i++) {
      const tc = treeCenters[Math.floor(r() * treeCenters.length)];
      const i3 = idx * 3;
      const angle = r() * Math.PI * 2, rad = r() * tc.r;
      pos[i3] = tc.x + Math.cos(angle) * rad + (r() - 0.5) * 0.02;
      pos[i3 + 1] = -1.5 + 0.3 + r() * tc.h;
      pos[i3 + 2] = tc.z + Math.sin(angle) * rad + (r() - 0.5) * 0.02;
      // Varying greens with some brown
      if (r() < 0.1) {
        col[i3] = 0.35; col[i3 + 1] = 0.22; col[i3 + 2] = 0.1; // trunk
      } else {
        col[i3] = 0.08 + r() * 0.12;
        col[i3 + 1] = 0.3 + r() * 0.35;
        col[i3 + 2] = 0.05 + r() * 0.1;
      }
      idx++;
    }

    // === Cars (5%) ===
    const carN = Math.floor(POINT_COUNT * 0.05);
    const carConfigs = [
      { x: -1.5, z: 0.3, l: 0.8, w: 0.35, h: 0.3, color: [0.85, 0.12, 0.12] },
      { x: 0.5, z: -0.5, l: 0.75, w: 0.35, h: 0.28, color: [0.15, 0.15, 0.75] },
      { x: 1.8, z: 0.8, l: 0.85, w: 0.38, h: 0.32, color: [0.9, 0.9, 0.9] },
    ];
    for (let i = 0; i < carN; i++) {
      const car = carConfigs[Math.floor(r() * carConfigs.length)];
      const i3 = idx * 3;
      const face = r();
      if (face < 0.3) {
        pos[i3] = car.x + (r() - 0.5) * car.l;
        pos[i3 + 1] = -1.5 + r() * car.h;
        pos[i3 + 2] = car.z + car.w / 2;
      } else if (face < 0.6) {
        pos[i3] = car.x + (r() - 0.5) * car.l;
        pos[i3 + 1] = -1.5 + r() * car.h;
        pos[i3 + 2] = car.z - car.w / 2;
      } else if (face < 0.85) {
        pos[i3] = car.x + (r() - 0.5) * car.l;
        pos[i3 + 1] = -1.5 + car.h;
        pos[i3 + 2] = car.z + (r() - 0.5) * car.w;
      } else {
        pos[i3] = car.x + (r() - 0.5) * car.l;
        pos[i3 + 1] = -1.5 + r() * car.h;
        pos[i3 + 2] = car.z + (r() - 0.5) * car.w;
      }
      col[i3] = Math.min(1, car.color[0] + (r() - 0.5) * 0.05);
      col[i3 + 1] = Math.min(1, car.color[1] + (r() - 0.5) * 0.05);
      col[i3 + 2] = Math.min(1, car.color[2] + (r() - 0.5) * 0.05);
      idx++;
    }

    // Fill remaining with ground scatter
    while (idx < POINT_COUNT) {
      const i3 = idx * 3;
      pos[i3] = (r() - 0.5) * 7;
      pos[i3 + 1] = -1.5 + (r() - 0.5) * 0.01;
      pos[i3 + 2] = (r() - 0.5) * 7;
      const v = 0.35 + r() * 0.12;
      col[i3] = v; col[i3 + 1] = v - 0.02; col[i3 + 2] = v - 0.05;
      idx++;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={POINT_COUNT} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={POINT_COUNT} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function ClearHandler() {
  const { color, alpha } = useClearColor();
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(color, alpha);
  }, [gl, color, alpha]);
  return null;
}

export default function PointCloudCanvasInner() {
  return (
    <Canvas
      camera={{ position: [5, 3.5, 5], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ClearHandler />
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        minDistance={3}
        maxDistance={12}
        enablePan={false}
        target={[0, 0, 0]}
      />
      <PointCloud />
    </Canvas>
  );
}
