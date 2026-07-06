import { BoxGeometry, Vector3 } from 'three';
import { instanceMatrices, roundedBox } from '@/core/geometry';
import { mulberry32, randRange } from '@/core/random';
import type { GeneratedModel, ModelPart, PartNode } from '@/models/types';

/**
 * Procedural DDR5 UDIMM (1 unit = 1 cm).
 *
 * Standing orientation: length on X (13.3), height on Y (3.0), thickness on Z.
 * Front face is +Z. Heatspreader is a removable shell so the exploded view
 * reveals the DRAM packages and the on-module PMIC (the DDR5 signature).
 */
export function generateRam(seed = 5300): GeneratedModel {
  const rng = mulberry32(seed);
  const parts: ModelPart[] = [];

  const L = 13.3;
  const H = 3.0;

  // --- PCB -------------------------------------------------------------------
  const pcb = roundedBox(L, H, 0.13, 0.03);
  parts.push({ id: 'pcb-body', nodeId: 'pcb', geometry: pcb, materialId: 'pcbBlack' });

  // --- gold edge fingers (both faces, DDR5 off-center notch) ------------------
  const fingerPoints: Vector3[] = [];
  for (const z of [0.07, -0.07]) {
    for (let i = 0; i < 60; i++) {
      const x = -6.2 + i * 0.21;
      if (Math.abs(x - 0.65) < 0.18) continue; // key notch
      fingerPoints.push(new Vector3(x, -1.36, z));
    }
  }
  const finger = new BoxGeometry(0.13, 0.26, 0.02);
  parts.push({
    id: 'edge-fingers',
    nodeId: 'contacts',
    geometry: finger,
    materialId: 'gold',
    instances: instanceMatrices(fingerPoints),
  });

  // --- DRAM packages (8 per face, PMIC gap in the middle) ---------------------
  const chipXs = [-5.35, -3.95, -2.55, -1.15, 1.15, 2.55, 3.95, 5.35];
  const chip = new BoxGeometry(1.2, 1.75, 0.1);
  for (const [nodeId, z] of [
    ['chips-front', 0.12],
    ['chips-back', -0.12],
  ] as const) {
    parts.push({
      id: `${nodeId}-array`,
      nodeId,
      geometry: chip,
      materialId: 'blackPlastic',
      instances: instanceMatrices(chipXs.map((x) => new Vector3(x, 0.05, z))),
    });
  }

  // --- PMIC + support components (front center) -------------------------------
  const pmic = new BoxGeometry(0.55, 0.65, 0.09);
  pmic.translate(0, 0.35, 0.11);
  parts.push({ id: 'pmic-chip', nodeId: 'pmic', geometry: pmic, materialId: 'blackPlastic' });

  const smdPoints: Vector3[] = [];
  for (let i = 0; i < 22; i++) {
    smdPoints.push(new Vector3(randRange(rng, -0.85, 0.85), randRange(rng, -0.9, -0.1), 0.1));
  }
  const smd = new BoxGeometry(0.14, 0.08, 0.05);
  parts.push({
    id: 'pmic-smds',
    nodeId: 'pmic',
    geometry: smd,
    materialId: 'ceramic',
    instances: instanceMatrices(smdPoints, () => (rng() > 0.5 ? { rotationY: Math.PI / 2 } : {})),
  });

  // --- heatspreader shell ------------------------------------------------------
  const plate = roundedBox(13.5, 2.75, 0.1, 0.04);
  const front = plate.clone();
  front.translate(0, 0.28, 0.3);
  parts.push({ id: 'spreader-front', nodeId: 'heatspreader', geometry: front, materialId: 'aluminum' });
  const back = plate;
  back.translate(0, 0.28, -0.3);
  parts.push({ id: 'spreader-back', nodeId: 'heatspreader', geometry: back, materialId: 'aluminum' });
  const topBar = roundedBox(13.5, 0.4, 0.72, 0.06);
  topBar.translate(0, 1.72, 0);
  parts.push({ id: 'spreader-top', nodeId: 'heatspreader', geometry: topBar, materialId: 'aluminum' });

  const nodes: PartNode[] = [
    {
      id: 'heatspreader',
      name: 'Heatspreader',
      contentKey: 'ram.spreader',
      explodeVector: [0, 3.4, 0],
      annotationAnchor: [4.5, 1.9, 0.4],
    },
    {
      id: 'chips-front',
      name: 'DRAM Packages',
      contentKey: 'ram.chips',
      explodeVector: [0, 0, 2.2],
      annotationAnchor: [3.9, 1.1, 0.25],
    },
    {
      id: 'chips-back',
      name: 'DRAM Packages (rear)',
      contentKey: 'ram.chips',
      explodeVector: [0, 0, -2.2],
      annotationAnchor: [-3.9, 1.1, -0.25],
    },
    {
      id: 'pmic',
      name: 'Power Management IC',
      contentKey: 'ram.pmic',
      explodeVector: [0, 0, 3.4],
      annotationAnchor: [0, 0.9, 0.3],
    },
    {
      id: 'pcb',
      name: 'Module PCB',
      contentKey: 'ram.pcb',
      explodeVector: [0, 0, 0],
      annotationAnchor: [-6.2, 0.9, 0.2],
    },
    {
      id: 'contacts',
      name: 'Edge Connector',
      contentKey: 'ram.contacts',
      explodeVector: [0, -2.4, 0],
      annotationAnchor: [3.2, -1.4, 0.25],
    },
  ];

  return {
    id: 'ram',
    parts,
    nodes,
    boundingRadius: 7.0,
    flows: [
      {
        id: 'write-left',
        color: '#4f8cff',
        points: [
          [0.3, -2.1, 0.3],
          [-0.4, -0.7, 0.3],
          [-2.55, 0.05, 0.3],
          [-5.35, 0.05, 0.3],
        ],
        count: 12,
        speed: 0.2,
        size: 0.14,
      },
      {
        id: 'read-right',
        color: '#7ce0a3',
        points: [
          [5.35, 0.05, 0.3],
          [2.55, 0.05, 0.3],
          [0.9, -0.7, 0.3],
          [0.3, -2.1, 0.3],
        ],
        count: 12,
        speed: 0.2,
        size: 0.14,
      },
    ],
  };
}
