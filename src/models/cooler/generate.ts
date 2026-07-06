import {
  BoxGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  Euler,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { composeMatrix, instanceMatrices, roundedBox } from '@/core/geometry';
import type { GeneratedModel, ModelPart, PartNode } from '@/models/types';

/**
 * Procedural tower air cooler (1 unit = 1 cm, centered on the origin).
 *
 * Copper cold plate at the bottom, four heatpipes rising through an aluminum
 * fin stack, 92 mm-class fan on the +Z face. Vertically centered: the base
 * sits near y = -6, the pipe caps exit near y = +6.
 */
export function generateCooler(): GeneratedModel {
  const parts: ModelPart[] = [];
  const yBase = -5.8; // top surface of the cold plate

  // --- copper cold plate + mounting block -------------------------------------
  const plate = roundedBox(4.4, 0.5, 4.4, 0.08);
  plate.translate(0, yBase - 0.25, 0);
  parts.push({ id: 'cold-plate', nodeId: 'base', geometry: plate, materialId: 'copper' });
  const block = roundedBox(3.4, 0.9, 3.4, 0.08);
  block.translate(0, yBase + 0.45, 0);
  parts.push({ id: 'base-block', nodeId: 'base', geometry: block, materialId: 'aluminum' });

  // --- heatpipes ---------------------------------------------------------------
  const pipeXs = [-1.35, -0.45, 0.45, 1.35];
  const capPoints: Vector3[] = [];
  for (let i = 0; i < pipeXs.length; i++) {
    const x = pipeXs[i] ?? 0;
    const curve = new CatmullRomCurve3([
      new Vector3(x * 0.55, yBase + 0.7, 0),
      new Vector3(x * 0.85, yBase + 1.6, 0),
      new Vector3(x, yBase + 3.2, 0),
      new Vector3(x, 6.0, 0),
    ]);
    const tube = new TubeGeometry(curve, 24, 0.3, 10);
    parts.push({ id: `heatpipe-${i}`, nodeId: 'heatpipes', geometry: tube, materialId: 'copper' });
    capPoints.push(new Vector3(x, 6.0, 0));
  }
  const cap = new SphereGeometry(0.3, 10, 8);
  parts.push({
    id: 'heatpipe-caps',
    nodeId: 'heatpipes',
    geometry: cap,
    materialId: 'copper',
    instances: instanceMatrices(capPoints),
  });

  // --- aluminum fin stack --------------------------------------------------------
  const finPoints: Vector3[] = [];
  for (let i = 0; i < 34; i++) finPoints.push(new Vector3(0, -2.3 + i * 0.235, 0));
  const fin = roundedBox(8.8, 0.07, 4.4, 0.05);
  parts.push({
    id: 'fin-stack',
    nodeId: 'fins',
    geometry: fin,
    materialId: 'aluminum',
    instances: instanceMatrices(finPoints),
  });

  // --- fan (frame ring + hub + 7 blades + corner mounts), facing +Z ---------------
  const fanZ = 3.3;
  const fanY = 0.6; // fan center height
  const ring = new TorusGeometry(4.0, 0.28, 12, 48);
  ring.translate(0, fanY, fanZ);
  parts.push({ id: 'fan-frame', nodeId: 'fan', geometry: ring, materialId: 'blackPlastic' });

  const hub = new CylinderGeometry(1.3, 1.3, 0.9, 24);
  hub.rotateX(Math.PI / 2);
  parts.push({
    id: 'fan-hub',
    nodeId: 'fan',
    geometry: hub,
    materialId: 'blackPlastic',
    origin: [0, fanY, fanZ],
    spin: { axis: 'z', speed: 5.5 },
  });

  const blade = new BoxGeometry(2.5, 0.85, 0.1);
  blade.rotateX(0.55); // blade pitch
  blade.translate(2.0, 0, 0);
  const bladeMatrices = Array.from({ length: 7 }, (_, i) =>
    composeMatrix(new Vector3(0, 0, 0), new Euler(0, 0, (i * 2 * Math.PI) / 7)),
  );
  parts.push({
    id: 'fan-blades',
    nodeId: 'fan',
    geometry: blade,
    materialId: 'blackPlastic',
    instances: bladeMatrices,
    origin: [0, fanY, fanZ],
    spin: { axis: 'z', speed: 5.5 },
  });

  const mount = new BoxGeometry(0.5, 0.5, 0.7);
  const mountPoints = [
    new Vector3(-3.6, fanY - 3.6, fanZ - 0.4),
    new Vector3(3.6, fanY - 3.6, fanZ - 0.4),
    new Vector3(-3.6, fanY + 3.6, fanZ - 0.4),
    new Vector3(3.6, fanY + 3.6, fanZ - 0.4),
  ];
  parts.push({
    id: 'fan-mounts',
    nodeId: 'fan',
    geometry: mount,
    materialId: 'blackPlastic',
    instances: instanceMatrices(mountPoints),
  });

  const nodes: PartNode[] = [
    {
      id: 'fan',
      name: 'Cooling Fan',
      contentKey: 'cooler.fan',
      explodeVector: [0, 0, 5.5],
      annotationAnchor: [3.2, 4.6, 3.4],
    },
    {
      id: 'fins',
      name: 'Fin Stack',
      contentKey: 'cooler.fins',
      explodeVector: [0, 0, -4.5],
      annotationAnchor: [4.6, 3.2, -1.2],
    },
    {
      id: 'heatpipes',
      name: 'Heatpipes',
      contentKey: 'cooler.pipes',
      explodeVector: [0, 2.6, 0],
      annotationAnchor: [1.6, 6.2, 0.5],
    },
    {
      id: 'base',
      name: 'Cold Plate',
      contentKey: 'cooler.base',
      explodeVector: [0, -3.4, 0],
      annotationAnchor: [2.6, -5.6, 1.6],
    },
  ];

  return {
    id: 'cooler',
    parts,
    nodes,
    boundingRadius: 7.6,
    flows: [
      {
        id: 'heat-rise',
        color: '#ff7a3c',
        points: [
          [0, -6.2, 0],
          [-0.45, -3.0, 0],
          [-0.45, 1.5, 0],
          [-0.45, 6.0, 0],
        ],
        count: 10,
        speed: 0.16,
        size: 0.22,
      },
      {
        id: 'heat-rise-2',
        color: '#ff7a3c',
        points: [
          [0, -6.2, 0],
          [0.45, -3.0, 0],
          [0.45, 1.5, 0],
          [0.45, 6.0, 0],
        ],
        count: 10,
        speed: 0.14,
        size: 0.22,
      },
    ],
  };
}
