import { BoxGeometry, Vector3 } from 'three';
import { instanceMatrices, roundedBox } from '@/core/geometry';
import { mulberry32, randRange } from '@/core/random';
import type { GeneratedModel, ModelPart, PartNode } from '@/models/types';

/**
 * Procedural NVMe SSD, M.2 2280 form factor (1 unit = 1 cm).
 *
 * Lying flat: length on X (8.0), width on Z (2.2), components face +Y.
 * Connector end is -X with the M-key notch in the gold fingers.
 */
export function generateSsd(seed = 2280): GeneratedModel {
  const rng = mulberry32(seed);
  const parts: ModelPart[] = [];

  // --- PCB -------------------------------------------------------------------
  const pcb = roundedBox(8.0, 0.09, 2.2, 0.03);
  parts.push({ id: 'pcb-body', nodeId: 'pcb', geometry: pcb, materialId: 'pcbBlack' });

  // --- gold edge fingers with M-key notch (-X end, both faces) ----------------
  const fingerPoints: Vector3[] = [];
  for (const y of [0.055, -0.055]) {
    for (let i = 0; i < 15; i++) {
      const z = -0.98 + i * 0.14;
      if (z > 0.5 && z < 0.75) continue; // M-key notch
      fingerPoints.push(new Vector3(-3.72, y, z));
    }
  }
  const finger = new BoxGeometry(0.5, 0.02, 0.09);
  parts.push({
    id: 'edge-fingers',
    nodeId: 'contacts',
    geometry: finger,
    materialId: 'gold',
    instances: instanceMatrices(fingerPoints),
  });

  // --- NVMe controller ---------------------------------------------------------
  const controller = new BoxGeometry(1.35, 0.13, 1.35);
  controller.translate(-2.5, 0.11, 0);
  parts.push({ id: 'controller-chip', nodeId: 'controller', geometry: controller, materialId: 'blackPlastic' });

  // --- DRAM cache --------------------------------------------------------------
  const dram = new BoxGeometry(0.95, 0.11, 1.25);
  dram.translate(-1.15, 0.1, 0);
  parts.push({ id: 'dram-chip', nodeId: 'dram', geometry: dram, materialId: 'blackPlastic' });

  // --- NAND flash packages -------------------------------------------------------
  const nand = new BoxGeometry(1.55, 0.13, 1.85);
  parts.push({
    id: 'nand-array',
    nodeId: 'nand',
    geometry: nand,
    materialId: 'blackPlastic',
    instances: instanceMatrices([new Vector3(0.55, 0.11, 0), new Vector3(2.35, 0.11, 0)]),
  });

  // --- passive SMDs --------------------------------------------------------------
  const smdPoints: Vector3[] = [];
  for (let i = 0; i < 26; i++) {
    smdPoints.push(new Vector3(randRange(rng, -3.2, 3.4), 0.07, randRange(rng, -0.95, 0.95)));
  }
  const smd = new BoxGeometry(0.12, 0.06, 0.06);
  parts.push({
    id: 'passive-smds',
    nodeId: 'smds',
    geometry: smd,
    materialId: 'ceramic',
    instances: instanceMatrices(smdPoints, () => (rng() > 0.5 ? { rotationY: Math.PI / 2 } : {})),
  });

  const nodes: PartNode[] = [
    {
      id: 'controller',
      name: 'NVMe Controller',
      contentKey: 'ssd.controller',
      explodeVector: [0, 1.6, 0],
      annotationAnchor: [-2.5, 0.35, 0.8],
    },
    {
      id: 'nand',
      name: 'NAND Flash',
      contentKey: 'ssd.nand',
      explodeVector: [0, 1.1, 0],
      annotationAnchor: [1.4, 0.35, 1.0],
    },
    {
      id: 'dram',
      name: 'DRAM Cache',
      contentKey: 'ssd.dram',
      explodeVector: [0, 2.1, 0],
      annotationAnchor: [-1.15, 0.3, 0.75],
    },
    {
      id: 'smds',
      name: 'Passive Components',
      contentKey: 'ssd.smds',
      explodeVector: [0, 0.6, 0],
      annotationAnchor: [3.1, 0.2, 0.7],
    },
    {
      id: 'pcb',
      name: 'M.2 PCB',
      contentKey: 'ssd.pcb',
      explodeVector: [0, 0, 0],
      annotationAnchor: [3.6, 0.1, -0.9],
    },
    {
      id: 'contacts',
      name: 'M.2 Edge Connector',
      contentKey: 'ssd.contacts',
      explodeVector: [-2.0, 0, 0],
      annotationAnchor: [-3.7, 0.15, 1.0],
    },
  ];

  return {
    id: 'ssd',
    parts,
    nodes,
    boundingRadius: 4.3,
    flows: [
      {
        id: 'host-to-nand',
        color: '#4f8cff',
        points: [
          [-4.3, 0.15, 0],
          [-2.5, 0.45, 0],
          [-1.15, 0.4, 0],
          [0.55, 0.4, 0],
          [2.35, 0.4, 0],
        ],
        count: 14,
        speed: 0.22,
        size: 0.09,
      },
    ],
  };
}
