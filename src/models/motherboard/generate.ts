import { BoxGeometry, CylinderGeometry, Vector3 } from 'three';
import { instanceMatrices, roundedBox } from '@/core/geometry';
import { mulberry32, randRange } from '@/core/random';
import type { GeneratedModel, ModelPart, PartNode } from '@/models/types';

/**
 * Procedural ATX motherboard (1 unit = 1 cm).
 *
 * Lying flat, components facing +Y. Width on X (24.4), depth on Z (30.5).
 * Rear I/O is the -X edge; the CPU socket sits upper-left area (-Z half),
 * DIMM slots to its right, PCIe slots on the lower (-Z→+Z) half.
 */
export function generateMotherboard(seed = 1151): GeneratedModel {
  const rng = mulberry32(seed);
  const parts: ModelPart[] = [];

  // --- PCB -------------------------------------------------------------------
  const pcb = roundedBox(24.4, 0.18, 30.5, 0.2);
  parts.push({ id: 'pcb-body', nodeId: 'pcb', geometry: pcb, materialId: 'pcbBlack' });

  // --- CPU socket: nickel land plate + retention frame -------------------------
  const socketPlate = new BoxGeometry(4.2, 0.14, 3.9);
  socketPlate.translate(-2.0, 0.16, -7.5);
  parts.push({ id: 'socket-plate', nodeId: 'socket', geometry: socketPlate, materialId: 'nickel' });
  const frameSide = new BoxGeometry(0.55, 0.35, 5.2);
  const frameEnd = new BoxGeometry(5.6, 0.35, 0.55);
  const fs1 = frameSide.clone();
  fs1.translate(-4.55, 0.25, -7.5);
  const fs2 = frameSide;
  fs2.translate(0.55, 0.25, -7.5);
  const fe1 = frameEnd.clone();
  fe1.translate(-2.0, 0.25, -10.15);
  const fe2 = frameEnd;
  fe2.translate(-2.0, 0.25, -4.85);
  parts.push({ id: 'socket-frame-l', nodeId: 'socket', geometry: fs1, materialId: 'blackPlastic' });
  parts.push({ id: 'socket-frame-r', nodeId: 'socket', geometry: fs2, materialId: 'blackPlastic' });
  parts.push({ id: 'socket-frame-t', nodeId: 'socket', geometry: fe1, materialId: 'blackPlastic' });
  parts.push({ id: 'socket-frame-b', nodeId: 'socket', geometry: fe2, materialId: 'blackPlastic' });

  // --- VRM heatsinks (L-shape around the socket) --------------------------------
  const vrmA = roundedBox(2.2, 1.5, 7.5, 0.12);
  vrmA.translate(-7.2, 0.85, -7.5);
  parts.push({ id: 'vrm-heatsink-left', nodeId: 'vrm', geometry: vrmA, materialId: 'aluminum' });
  const vrmB = roundedBox(7.5, 1.5, 2.2, 0.12);
  vrmB.translate(-2.0, 0.85, -12.6);
  parts.push({ id: 'vrm-heatsink-top', nodeId: 'vrm', geometry: vrmB, materialId: 'aluminum' });

  // --- DIMM slots ×4 --------------------------------------------------------------
  const dimmXs = [3.6, 4.6, 5.6, 6.6];
  const dimm = new BoxGeometry(0.62, 0.55, 14.0);
  parts.push({
    id: 'dimm-slots',
    nodeId: 'dimm',
    geometry: dimm,
    materialId: 'blackPlastic',
    instances: instanceMatrices(dimmXs.map((x) => new Vector3(x, 0.35, -6.5))),
  });

  // --- PCIe slots (x16 + x16 + x4) --------------------------------------------------
  const pcieZs = [3.6, 8.0, 11.4];
  const pcieLengths = [15.0, 15.0, 6.5];
  for (let i = 0; i < pcieZs.length; i++) {
    const slot = new BoxGeometry(pcieLengths[i] ?? 15, 0.5, 0.85);
    slot.translate(-2.5, 0.32, pcieZs[i] ?? 0);
    parts.push({ id: `pcie-slot-${i}`, nodeId: 'pcie', geometry: slot, materialId: 'blackPlastic' });
  }

  // --- chipset heatsink ---------------------------------------------------------------
  const chipset = roundedBox(4.6, 0.85, 4.6, 0.15);
  chipset.translate(6.8, 0.55, 7.5);
  parts.push({ id: 'chipset-heatsink', nodeId: 'chipset', geometry: chipset, materialId: 'aluminum' });

  // --- M.2 heatsink shield ---------------------------------------------------------------
  const m2 = roundedBox(2.6, 0.35, 9.0, 0.1);
  m2.translate(0.8, 0.3, -0.5);
  parts.push({ id: 'm2-shield', nodeId: 'm2', geometry: m2, materialId: 'aluminum' });

  // --- rear I/O shroud ----------------------------------------------------------------
  const io = roundedBox(3.6, 2.2, 11.0, 0.2);
  io.translate(-10.2, 1.2, -9.0);
  parts.push({ id: 'io-shroud', nodeId: 'io', geometry: io, materialId: 'blackPlastic' });

  // --- ATX power + SATA cluster ---------------------------------------------------------
  const atx = new BoxGeometry(1.3, 1.0, 5.4);
  atx.translate(11.2, 0.6, -5.5);
  parts.push({ id: 'atx-24pin', nodeId: 'power', geometry: atx, materialId: 'blackPlastic' });
  const sataPoints = [
    new Vector3(11.3, 0.35, 6.4),
    new Vector3(11.3, 0.35, 7.6),
    new Vector3(11.3, 0.35, 8.8),
    new Vector3(11.3, 0.35, 10.0),
  ];
  const sata = new BoxGeometry(1.1, 0.45, 0.85);
  parts.push({
    id: 'sata-ports',
    nodeId: 'power',
    geometry: sata,
    materialId: 'blackPlastic',
    instances: instanceMatrices(sataPoints),
  });

  // --- electrolytic capacitors scattered near socket & audio -----------------------------
  const capPoints: Vector3[] = [];
  for (let i = 0; i < 10; i++) {
    capPoints.push(new Vector3(randRange(rng, -8.5, 1.5), 0.55, randRange(rng, -2.8, -1.0)));
  }
  for (let i = 0; i < 5; i++) {
    capPoints.push(new Vector3(randRange(rng, -10.5, -7.5), 0.55, randRange(rng, 9.5, 13.0)));
  }
  const capacitor = new CylinderGeometry(0.42, 0.42, 0.95, 12);
  parts.push({
    id: 'capacitors',
    nodeId: 'caps',
    geometry: capacitor,
    materialId: 'nickel',
    instances: instanceMatrices(capPoints),
  });

  // --- CMOS battery ------------------------------------------------------------------------
  const battery = new CylinderGeometry(1.0, 1.0, 0.28, 24);
  battery.translate(-2.5, 0.25, 12.5);
  parts.push({ id: 'cmos-battery', nodeId: 'battery', geometry: battery, materialId: 'nickel' });

  const nodes: PartNode[] = [
    {
      id: 'socket',
      name: 'CPU Socket',
      contentKey: 'mb.socket',
      explodeVector: [0, 6.0, 0],
      annotationAnchor: [-2.0, 0.8, -5.2],
    },
    {
      id: 'vrm',
      name: 'VRM Heatsinks',
      contentKey: 'mb.vrm',
      explodeVector: [0, 4.5, 0],
      annotationAnchor: [-7.2, 2.0, -4.2],
    },
    {
      id: 'dimm',
      name: 'DDR5 DIMM Slots',
      contentKey: 'mb.dimm',
      explodeVector: [0, 3.5, 0],
      annotationAnchor: [5.1, 0.9, -12.5],
    },
    {
      id: 'pcie',
      name: 'PCIe Slots',
      contentKey: 'mb.pcie',
      explodeVector: [0, 3.0, 0],
      annotationAnchor: [4.0, 0.8, 3.6],
    },
    {
      id: 'chipset',
      name: 'Chipset Heatsink',
      contentKey: 'mb.chipset',
      explodeVector: [0, 5.0, 0],
      annotationAnchor: [6.8, 1.3, 5.0],
    },
    {
      id: 'm2',
      name: 'M.2 Slot & Shield',
      contentKey: 'mb.m2',
      explodeVector: [0, 4.0, 0],
      annotationAnchor: [0.8, 0.85, -4.8],
    },
    {
      id: 'io',
      name: 'Rear I/O',
      contentKey: 'mb.io',
      explodeVector: [0, 5.5, 0],
      annotationAnchor: [-10.2, 2.8, -3.4],
    },
    {
      id: 'power',
      name: 'Power & Storage Headers',
      contentKey: 'mb.power',
      explodeVector: [0, 3.0, 0],
      annotationAnchor: [11.2, 1.5, -2.2],
    },
    {
      id: 'caps',
      name: 'Capacitors',
      contentKey: 'mb.caps',
      explodeVector: [0, 2.0, 0],
      annotationAnchor: [-4.5, 1.2, -1.6],
    },
    {
      id: 'battery',
      name: 'CMOS Battery',
      contentKey: 'mb.battery',
      explodeVector: [0, 4.5, 0],
      annotationAnchor: [-2.5, 0.7, 14.0],
    },
    {
      id: 'pcb',
      name: 'Motherboard PCB',
      contentKey: 'mb.pcb',
      explodeVector: [0, 0, 0],
      annotationAnchor: [10.5, 0.2, 13.5],
    },
  ];

  return {
    id: 'motherboard',
    parts,
    nodes,
    boundingRadius: 19.6,
    flows: [
      {
        id: 'ram-to-cpu',
        color: '#4f8cff',
        points: [
          [5.1, 0.9, -6.5],
          [1.5, 1.3, -7.0],
          [-2.0, 0.9, -7.5],
        ],
        count: 10,
        speed: 0.28,
        size: 0.38,
      },
      {
        id: 'm2-to-cpu',
        color: '#7ce0a3',
        points: [
          [0.8, 0.8, 2.0],
          [0.2, 1.5, -2.8],
          [-2.0, 0.9, -7.5],
        ],
        count: 10,
        speed: 0.2,
        size: 0.38,
      },
      {
        id: 'pcie-to-cpu',
        color: '#c9a2ff',
        points: [
          [3.5, 0.8, 3.6],
          [0.5, 1.6, -1.5],
          [-2.0, 0.9, -7.5],
        ],
        count: 10,
        speed: 0.24,
        size: 0.38,
      },
    ],
  };
}
