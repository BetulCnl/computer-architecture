import { BoxGeometry, CylinderGeometry, TorusGeometry, Vector3 } from 'three';
import { instanceMatrices, roundedBox } from '@/core/geometry';
import { mulberry32, randRange } from '@/core/random';
import type { GeneratedModel, ModelPart, PartNode } from '@/models/types';

/**
 * Procedural dual-fan graphics card (1 unit = 1 cm).
 *
 * Product-shot orientation: card lies flat, fans facing +Y. Length on X
 * (26), width on Z (11). Layer stack bottom→top: backplate → PCB (with die,
 * VRAM, VRM, PCIe fingers) → heatsink fins → shroud with two axial fans.
 * I/O bracket stands at the -X end.
 */
export function generateGpu(seed = 4090): GeneratedModel {
  const rng = mulberry32(seed);
  const parts: ModelPart[] = [];

  // --- backplate ----------------------------------------------------------------
  const backplate = roundedBox(26, 0.16, 10.8, 0.15);
  backplate.translate(0, -1.0, 0);
  parts.push({ id: 'backplate-body', nodeId: 'backplate', geometry: backplate, materialId: 'aluminum' });

  // --- PCB ------------------------------------------------------------------------
  const pcb = roundedBox(25, 0.18, 10.4, 0.12);
  pcb.translate(-0.4, -0.72, 0);
  parts.push({ id: 'pcb-body', nodeId: 'pcb', geometry: pcb, materialId: 'pcbBlack' });

  // --- GPU die (iridescent silicon, off-center like real cards) -------------------
  const die = new BoxGeometry(2.7, 0.22, 2.7);
  die.translate(-3.0, -0.5, 0);
  parts.push({ id: 'gpu-die', nodeId: 'die', geometry: die, materialId: 'silicon' });

  // --- VRAM ring around the die -----------------------------------------------------
  const vramPoints = [
    new Vector3(-6.2, -0.52, -1.4),
    new Vector3(-6.2, -0.52, 1.4),
    new Vector3(-3.0, -0.52, -3.4),
    new Vector3(-3.0, -0.52, 3.4),
    new Vector3(0.2, -0.52, -1.4),
    new Vector3(0.2, -0.52, 1.4),
    new Vector3(-6.2, -0.52, 0),
    new Vector3(0.2, -0.52, 0),
  ];
  const vram = new BoxGeometry(1.35, 0.14, 1.35);
  parts.push({
    id: 'vram-chips',
    nodeId: 'vram',
    geometry: vram,
    materialId: 'blackPlastic',
    instances: instanceMatrices(vramPoints),
  });

  // --- VRM: chokes + capacitors on the +X half --------------------------------------
  const chokePoints: Vector3[] = [];
  for (let i = 0; i < 8; i++) chokePoints.push(new Vector3(4.2 + (i % 4) * 1.1, -0.5, i < 4 ? -2.2 : 2.2));
  const choke = new BoxGeometry(0.9, 0.5, 0.9);
  parts.push({
    id: 'vrm-chokes',
    nodeId: 'vrm',
    geometry: choke,
    materialId: 'aluminum',
    instances: instanceMatrices(chokePoints),
  });
  const capPoints: Vector3[] = [];
  for (let i = 0; i < 12; i++) {
    capPoints.push(new Vector3(randRange(rng, 3.8, 8.6), -0.42, randRange(rng, -0.9, 0.9)));
  }
  const capacitor = new CylinderGeometry(0.28, 0.28, 0.55, 12);
  parts.push({
    id: 'vrm-caps',
    nodeId: 'vrm',
    geometry: capacitor,
    materialId: 'nickel',
    instances: instanceMatrices(capPoints),
  });

  // --- PCIe edge fingers (front-long edge, underside) --------------------------------
  const fingerPoints: Vector3[] = [];
  for (let i = 0; i < 42; i++) fingerPoints.push(new Vector3(-9.4 + i * 0.3, -0.86, 4.9));
  const finger = new BoxGeometry(0.16, 0.14, 0.5);
  parts.push({
    id: 'pcie-fingers',
    nodeId: 'pcie',
    geometry: finger,
    materialId: 'gold',
    instances: instanceMatrices(fingerPoints),
  });

  // --- heatsink fin array ---------------------------------------------------------------
  const finPoints: Vector3[] = [];
  for (let i = 0; i < 40; i++) finPoints.push(new Vector3(-10.7 + i * 0.55, 0.25, 0));
  const fin = new BoxGeometry(0.07, 1.3, 9.6);
  parts.push({
    id: 'heatsink-fins',
    nodeId: 'heatsink',
    geometry: fin,
    materialId: 'aluminum',
    instances: instanceMatrices(finPoints),
  });

  // --- shroud + two axial fans (facing +Y) -------------------------------------------
  const shroud = roundedBox(26, 0.55, 11, 0.2);
  shroud.translate(0, 1.2, 0);
  parts.push({ id: 'shroud-body', nodeId: 'shroud', geometry: shroud, materialId: 'blackPlastic' });

  for (const [index, fanX] of [-6, 6].entries()) {
    const ring = new TorusGeometry(3.5, 0.3, 12, 48);
    ring.rotateX(Math.PI / 2);
    ring.translate(fanX, 1.55, 0);
    parts.push({ id: `fan-ring-${index}`, nodeId: 'fans', geometry: ring, materialId: 'blackPlastic' });

    const hub = new CylinderGeometry(1.15, 1.15, 0.5, 24);
    parts.push({
      id: `fan-hub-${index}`,
      nodeId: 'fans',
      geometry: hub,
      materialId: 'blackPlastic',
      origin: [fanX, 1.55, 0],
      spin: { axis: 'y', speed: index === 0 ? 6.5 : -6.5 },
    });

    const blade = new BoxGeometry(2.15, 0.08, 0.8);
    blade.rotateX(0.5);
    blade.translate(1.75, 0, 0);
    const bladePoints = Array.from({ length: 9 }, () => new Vector3(0, 0, 0));
    parts.push({
      id: `fan-blades-${index}`,
      nodeId: 'fans',
      geometry: blade,
      materialId: 'blackPlastic',
      instances: instanceMatrices(bladePoints, (i) => ({ rotationY: (i * 2 * Math.PI) / 9 })),
      origin: [fanX, 1.55, 0],
      spin: { axis: 'y', speed: index === 0 ? 6.5 : -6.5 },
    });
  }

  // --- I/O bracket (-X end) -----------------------------------------------------------
  const bracket = roundedBox(0.16, 2.6, 10.8, 0.05);
  bracket.translate(-13.2, 0.1, 0);
  parts.push({ id: 'io-bracket', nodeId: 'bracket', geometry: bracket, materialId: 'nickel' });

  const nodes: PartNode[] = [
    {
      id: 'fans',
      name: 'Axial Fans',
      contentKey: 'gpu.fans',
      explodeVector: [0, 10.0, 0],
      annotationAnchor: [6, 2.4, 2.6],
    },
    {
      id: 'shroud',
      name: 'Cooler Shroud',
      contentKey: 'gpu.shroud',
      explodeVector: [0, 7.0, 0],
      annotationAnchor: [11, 1.6, 3.6],
    },
    {
      id: 'heatsink',
      name: 'Heatsink Fins',
      contentKey: 'gpu.heatsink',
      explodeVector: [0, 4.2, 0],
      annotationAnchor: [-9.5, 1.2, 3.4],
    },
    {
      id: 'die',
      name: 'GPU Die',
      contentKey: 'gpu.die',
      explodeVector: [0, 2.4, 0],
      annotationAnchor: [-3.0, 0, 2.0],
    },
    {
      id: 'vram',
      name: 'GDDR Memory',
      contentKey: 'gpu.vram',
      explodeVector: [0, 1.6, 0],
      annotationAnchor: [-6.2, -0.2, -2.2],
    },
    {
      id: 'vrm',
      name: 'Power Delivery (VRM)',
      contentKey: 'gpu.vrm',
      explodeVector: [0, 1.6, 0],
      annotationAnchor: [6.4, 0, -2.8],
    },
    {
      id: 'pcb',
      name: 'Graphics PCB',
      contentKey: 'gpu.pcb',
      explodeVector: [0, 0, 0],
      annotationAnchor: [8.5, -0.55, -4.4],
    },
    {
      id: 'pcie',
      name: 'PCIe Connector',
      contentKey: 'gpu.pcie',
      explodeVector: [0, -2.2, 2.4],
      annotationAnchor: [-3.2, -1.0, 5.2],
    },
    {
      id: 'backplate',
      name: 'Backplate',
      contentKey: 'gpu.backplate',
      explodeVector: [0, -4.0, 0],
      annotationAnchor: [7.5, -1.2, -3.8],
    },
    {
      id: 'bracket',
      name: 'I/O Bracket',
      contentKey: 'gpu.bracket',
      explodeVector: [-5.5, 0, 0],
      annotationAnchor: [-13.3, 1.6, 2.4],
    },
  ];

  return {
    id: 'gpu',
    parts,
    nodes,
    boundingRadius: 14.2,
    flows: [
      {
        id: 'pcie-to-die',
        color: '#4f8cff',
        points: [
          [-3.2, -1.6, 5.4],
          [-3.0, -0.55, 2.6],
          [-3.0, -0.3, 0.3],
        ],
        count: 12,
        speed: 0.22,
        size: 0.28,
      },
      {
        id: 'die-to-vram',
        color: '#7ce0a3',
        points: [
          [-3.0, -0.25, -0.2],
          [-4.6, -0.3, -0.9],
          [-6.2, -0.35, -1.4],
        ],
        count: 8,
        speed: 0.3,
        size: 0.24,
      },
    ],
  };
}
