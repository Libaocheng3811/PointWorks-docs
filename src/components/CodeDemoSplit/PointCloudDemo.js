import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useClearColor from '@site/src/hooks/useClearColor';
import styles from './styles.module.css';

function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ============================
// Example 1: 体素降采样
// 密集地形扫描 → 均匀网格采样
// ============================
function genVoxelBefore() {
  const r = rng(101);
  const N = 12000;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const x = (r() - 0.5) * 4, z = (r() - 0.5) * 4;
    // Terrain with a hill and a valley
    const dist = Math.sqrt(x * x + z * z);
    const h = Math.sin(dist * 1.5) * 0.8 + Math.cos(x * 0.8) * 0.3 - 0.5;
    pos[i3] = x + (r() - 0.5) * 0.04;
    pos[i3 + 1] = h + (r() - 0.5) * 0.02;
    pos[i3 + 2] = z + (r() - 0.5) * 0.04;
    // RGB by height
    const t = (h + 1.0) / 1.8;
    if (h < -0.1) {
      col[i3] = 0.3; col[i3 + 1] = 0.45; col[i3 + 2] = 0.25; // low green
    } else if (h < 0.3) {
      col[i3] = 0.55 + t * 0.2; col[i3 + 1] = 0.48 + t * 0.15; col[i3 + 2] = 0.35; // brown/earth
    } else {
      col[i3] = 0.6; col[i3 + 1] = 0.55 + t * 0.1; col[i3 + 2] = 0.45 + t * 0.1; // rock
    }
  }
  return { positions: pos, colors: col, count: N };
}

function genVoxelAfter() {
  const r = rng(101);
  const gridSize = 55;
  const N = gridSize * gridSize;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let ix = 0; ix < gridSize; ix++) {
    for (let iz = 0; iz < gridSize; iz++) {
      const i = ix * gridSize + iz;
      const i3 = i * 3;
      const x = -2 + ix * 4 / (gridSize - 1);
      const z = -2 + iz * 4 / (gridSize - 1);
      const dist = Math.sqrt(x * x + z * z);
      const h = Math.sin(dist * 1.5) * 0.8 + Math.cos(x * 0.8) * 0.3 - 0.5;
      pos[i3] = x + (r() - 0.5) * 0.01;
      pos[i3 + 1] = h + (r() - 0.5) * 0.01;
      pos[i3 + 2] = z + (r() - 0.5) * 0.01;
      const t = (h + 1.0) / 1.8;
      if (h < -0.1) { col[i3] = 0.3; col[i3 + 1] = 0.45; col[i3 + 2] = 0.25; }
      else if (h < 0.3) { col[i3] = 0.55 + t * 0.2; col[i3 + 1] = 0.48 + t * 0.15; col[i3 + 2] = 0.35; }
      else { col[i3] = 0.6; col[i3 + 1] = 0.55 + t * 0.1; col[i3 + 2] = 0.45 + t * 0.1; }
    }
  }
  return { positions: pos, colors: col, count: N };
}

// ============================
// Example 2: 地面分离 (CSF)
// 室外场景：路面+车辆+植被+建筑
// ============================
function genCSFBefore() {
  const r = rng(202);
  const N = 10000;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  let idx = 0;

  // Ground plane (35%)
  const groundN = Math.floor(N * 0.35);
  for (let i = 0; i < groundN; i++) {
    const i3 = idx * 3;
    pos[i3] = (r() - 0.5) * 5;
    pos[i3 + 1] = -1.5 + (r() - 0.5) * 0.008;
    pos[i3 + 2] = (r() - 0.5) * 5;
    const isRoad = (Math.abs(pos[i3]) < 0.6 || Math.abs(pos[i3 + 2]) < 0.6);
    if (isRoad) {
      const v = 0.2 + r() * 0.06;
      col[i3] = v; col[i3 + 1] = v; col[i3 + 2] = v + 0.02;
    } else {
      col[i3] = 0.35 + r() * 0.08;
      col[i3 + 1] = 0.32 + r() * 0.06;
      col[i3 + 2] = 0.25 + r() * 0.04;
    }
    idx++;
  }

  // Building (35%)
  const bldN = Math.floor(N * 0.35);
  const blds = [
    { x: -1.5, z: -1.5, w: 0.8, d: 0.7, h: 3.0, wr: 0.75, wg: 0.7, wb: 0.65 },
    { x: 1.2, z: -1.3, w: 0.9, d: 0.8, h: 4.0, wr: 0.82, wg: 0.8, wb: 0.78 },
    { x: 0.0, z: 1.5, w: 0.7, d: 0.6, h: 2.5, wr: 0.68, wg: 0.72, wb: 0.68 },
  ];
  for (let i = 0; i < bldN; i++) {
    const b = blds[Math.floor(r() * blds.length)];
    const i3 = idx * 3;
    const face = r();
    let px, py, pz;
    if (face < 0.3) { px = b.x + (r() - 0.5) * b.w; py = -1.5 + r() * b.h; pz = b.z + b.d / 2; }
    else if (face < 0.6) { px = b.x + (r() - 0.5) * b.w; py = -1.5 + r() * b.h; pz = b.z - b.d / 2; }
    else if (face < 0.8) { px = b.x - b.w / 2; py = -1.5 + r() * b.h; pz = b.z + (r() - 0.5) * b.d; }
    else if (face < 0.95) { px = b.x + b.w / 2; py = -1.5 + r() * b.h; pz = b.z + (r() - 0.5) * b.d; }
    else { px = b.x + (r() - 0.5) * b.w; py = -1.5 + b.h; pz = b.z + (r() - 0.5) * b.d; }
    pos[i3] = px + (r() - 0.5) * 0.005;
    pos[i3 + 1] = py + (r() - 0.5) * 0.005;
    pos[i3 + 2] = pz + (r() - 0.5) * 0.005;
    if (face >= 0.95) { col[i3] = 0.4; col[i3 + 1] = 0.3; col[i3 + 2] = 0.25; }
    else { col[i3] = b.wr + (r() - 0.5) * 0.03; col[i3 + 1] = b.wg + (r() - 0.5) * 0.03; col[i3 + 2] = b.wb + (r() - 0.5) * 0.03; }
    idx++;
  }

  // Trees (20%)
  const treeN = Math.floor(N * 0.20);
  const trees = [
    { x: -0.8, z: 2.0, r: 0.35, h: 1.2 },
    { x: 1.8, z: 1.8, r: 0.3, h: 1.0 },
    { x: -2.0, z: 0.5, r: 0.25, h: 1.4 },
    { x: 0.5, z: -2.2, r: 0.3, h: 1.1 },
    { x: 2.0, z: -0.2, r: 0.28, h: 0.9 },
  ];
  for (let i = 0; i < treeN; i++) {
    const t = trees[Math.floor(r() * trees.length)];
    const i3 = idx * 3;
    const a = r() * Math.PI * 2, rad = r() * t.r;
    pos[i3] = t.x + Math.cos(a) * rad;
    pos[i3 + 1] = -1.5 + 0.2 + r() * t.h;
    pos[i3 + 2] = t.z + Math.sin(a) * rad;
    col[i3] = 0.06 + r() * 0.12;
    col[i3 + 1] = 0.28 + r() * 0.35;
    col[i3 + 2] = 0.04 + r() * 0.08;
    idx++;
  }

  // Cars (10%)
  const carN = N - idx;
  const cars = [
    { x: -1.0, z: 0.0, l: 0.7, w: 0.3, h: 0.25, c: [0.8, 0.1, 0.1] },
    { x: 0.4, z: -0.8, l: 0.65, w: 0.28, h: 0.22, c: [0.1, 0.1, 0.7] },
  ];
  for (let i = 0; i < carN; i++) {
    const car = cars[Math.floor(r() * cars.length)];
    const i3 = idx * 3;
    pos[i3] = car.x + (r() - 0.5) * car.l;
    pos[i3 + 1] = -1.5 + r() * car.h + 0.02;
    pos[i3 + 2] = car.z + (r() - 0.5) * car.w;
    col[i3] = car.c[0] + (r() - 0.5) * 0.04;
    col[i3 + 1] = car.c[1] + (r() - 0.5) * 0.04;
    col[i3 + 2] = car.c[2] + (r() - 0.5) * 0.04;
    idx++;
  }

  return { positions: pos, colors: col, count: idx };
}

function genCSFAfter() {
  const before = genCSFBefore();
  const pos = new Float32Array(before.count * 3);
  const col = new Float32Array(before.count * 3);
  let idx = 0;

  for (let i = 0; i < before.count; i++) {
    const i3 = i * 3;
    const y = before.positions[i3 + 1];
    const isGround = y < -1.2;
    if (isGround) {
      // Ground: warm brown-orange
      pos[idx * 3] = before.positions[i3];
      pos[idx * 3 + 1] = before.positions[i3 + 1] - 0.4;
      pos[idx * 3 + 2] = before.positions[i3 + 2];
      col[idx * 3] = 0.85; col[idx * 3 + 1] = 0.45; col[idx * 3 + 2] = 0.15;
    } else {
      // Objects: vivid blue, shift up
      pos[idx * 3] = before.positions[i3];
      pos[idx * 3 + 1] = before.positions[i3 + 1] + 0.4;
      pos[idx * 3 + 2] = before.positions[i3 + 2];
      col[idx * 3] = 0.15; col[idx * 3 + 1] = 0.55; col[idx * 3 + 2] = 1.0;
    }
    idx++;
  }

  return { positions: pos.slice(0, idx * 3), colors: col.slice(0, idx * 3), count: idx };
}

// ============================
// Example 3: 去噪处理
// 干净的建筑扫描 + 散布噪声点
// ============================
function genOutlierBefore() {
  const r = rng(303);
  const N = 10000;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  let idx = 0;

  // Clean building facade (60%)
  const bldN = Math.floor(N * 0.60);
  const blds = [
    { x: -0.8, z: 0.0, w: 1.6, d: 0.8, h: 3.5, wr: 0.82, wg: 0.78, wb: 0.72 },
    { x: 0.8, z: 0.0, w: 0.8, d: 1.6, h: 3.5, wr: 0.78, wg: 0.74, wb: 0.68 },
  ];
  for (let i = 0; i < bldN; i++) {
    const b = blds[Math.floor(r() * blds.length)];
    const i3 = idx * 3;
    const face = r();
    let px, py, pz;
    if (face < 0.25) { px = b.x + (r() - 0.5) * b.w; py = -1.5 + r() * b.h; pz = b.z + b.d / 2; }
    else if (face < 0.50) { px = b.x + (r() - 0.5) * b.w; py = -1.5 + r() * b.h; pz = b.z - b.d / 2; }
    else if (face < 0.75) { px = b.x - b.w / 2; py = -1.5 + r() * b.h; pz = b.z + (r() - 0.5) * b.d; }
    else { px = b.x + b.w / 2; py = -1.5 + r() * b.h; pz = b.z + (r() - 0.5) * b.d; }
    pos[i3] = px + (r() - 0.5) * 0.004;
    pos[i3 + 1] = py + (r() - 0.5) * 0.004;
    pos[i3 + 2] = pz + (r() - 0.5) * 0.004;
    // Window grid pattern
    const windowX = Math.floor((px - b.x + b.w / 2) / 0.3);
    const windowY = Math.floor((py + 1.5) / 0.6);
    const isWindow = (windowX + windowY) % 2 === 0 && py > -1.2;
    if (isWindow && face < 0.5) {
      col[i3] = 0.35; col[i3 + 1] = 0.45; col[i3 + 2] = 0.55; // blue window
    } else {
      col[i3] = b.wr + (r() - 0.5) * 0.02;
      col[i3 + 1] = b.wg + (r() - 0.5) * 0.02;
      col[i3 + 2] = b.wb + (r() - 0.5) * 0.02;
    }
    idx++;
  }

  // Ground (10%)
  const groundN = Math.floor(N * 0.10);
  for (let i = 0; i < groundN; i++) {
    const i3 = idx * 3;
    pos[i3] = (r() - 0.5) * 4;
    pos[i3 + 1] = -1.5 + (r() - 0.5) * 0.005;
    pos[i3 + 2] = (r() - 0.5) * 4;
    const v = 0.25 + r() * 0.06;
    col[i3] = v; col[i3 + 1] = v; col[i3 + 2] = v;
    idx++;
  }

  // Outlier noise (30%) - scattered randomly far from surfaces
  const noiseN = N - idx;
  for (let i = 0; i < noiseN; i++) {
    const i3 = idx * 3;
    // Scatter noise around the building volume
    const bx = r() > 0.5 ? -0.8 : 0.8;
    pos[i3] = bx + (r() - 0.5) * 3;
    pos[i3 + 1] = -1.5 + r() * 5.5;
    pos[i3 + 2] = (r() - 0.5) * 3;
    // Noise: dim reddish-gray
    col[i3] = 0.5 + r() * 0.15;
    col[i3 + 1] = 0.35 + r() * 0.1;
    col[i3 + 2] = 0.3 + r() * 0.1;
    idx++;
  }

  return { positions: pos, colors: col, count: idx };
}

function genOutlierAfter() {
  const before = genOutlierBefore();
  // Keep only points within reasonable bounds
  const kept = [];
  for (let i = 0; i < before.count; i++) {
    const x = before.positions[i * 3];
    const y = before.positions[i * 3 + 1];
    const z = before.positions[i * 3 + 2];
    // Keep points close to the building surfaces
    const nearBuilding = (
      (Math.abs(x - (-0.8)) < 1.0 && Math.abs(z) < 0.5 && y > -1.6 && y < 2.2) ||
      (Math.abs(x - 0.8) < 0.5 && Math.abs(z) < 1.0 && y > -1.6 && y < 2.2)
    );
    const isGround = y < -1.45 && y > -1.55;
    if (nearBuilding || isGround) {
      kept.push(i);
    }
  }
  const pos = new Float32Array(kept.length * 3);
  const col = new Float32Array(kept.length * 3);
  for (let j = 0; j < kept.length; j++) {
    const i = kept[j];
    const i3 = i * 3, j3 = j * 3;
    pos[j3] = before.positions[i3];
    pos[j3 + 1] = before.positions[i3 + 1];
    pos[j3 + 2] = before.positions[i3 + 2];
    col[j3] = before.colors[i3];
    col[j3 + 1] = before.colors[i3 + 1];
    col[j3 + 2] = before.colors[i3 + 2];
  }
  return { positions: pos, colors: col, count: kept.length };
}

// ============================
// Cache & Component
// ============================
const cache = {};
function getScene(id, processed) {
  const key = `${id}_${processed}`;
  if (cache[key]) return cache[key];
  let scene;
  if (id === 'voxel') scene = processed ? genVoxelAfter() : genVoxelBefore();
  else if (id === 'csf') scene = processed ? genCSFAfter() : genCSFBefore();
  else scene = processed ? genOutlierAfter() : genOutlierBefore();
  cache[key] = scene;
  return scene;
}

function PointCloudMesh({ exampleId, hasRun }) {
  const ref = useRef();
  const scene = useMemo(() => getScene(exampleId, hasRun), [exampleId, hasRun]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.003;
  });

  const ptSize = (exampleId === 'voxel' && hasRun) ? 0.04 : 0.016;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[scene.positions, 3]} count={scene.count} />
        <bufferAttribute attach="attributes-color" args={[scene.colors, 3]} count={scene.count} />
      </bufferGeometry>
      <pointsMaterial
        size={ptSize}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

const infoMap = {
  voxel: { before: '密集地形扫描 · 12,000 pts', after: '体素降采样后 · 3,025 pts · 均匀网格' },
  csf: { before: '室外场景混合点云 · 10,000 pts', after: '地面(棕色)与地物(蓝色)已分离' },
  outlier: { before: '建筑扫描 + 噪声点 · 10,000 pts', after: '离群点已移除 · 7,120 pts' },
};

function ClearHandler() {
  const { color, alpha } = useClearColor();
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(color, alpha);
  }, [gl, color, alpha]);
  return null;
}

export default function PointCloudDemo({ exampleId, hasRun, isRunning }) {
  const label = infoMap[exampleId][hasRun ? 'after' : 'before'];

  return (
    <div className={styles.previewInner}>
      <Canvas
        camera={{ position: [3.5, 2.5, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ClearHandler />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          minDistance={2}
          maxDistance={8}
        />
        <PointCloudMesh exampleId={exampleId} hasRun={hasRun} />
      </Canvas>
      <div className={styles.previewInfo}>
        <span className={styles.previewLabel}>{isRunning ? '处理中...' : label}</span>
      </div>
    </div>
  );
}
