import { BoxGeometry, CylinderGeometry, ExtrudeGeometry, Shape, Vector3 } from 'three';
import { gridPoints, instanceMatrices, roundedBox } from '@/core/geometry';
import { mulberry32, randRange } from '@/core/random';
import type { GeneratedModel, ModelPart, PartNode } from '@/models/types';

/**
 * Procedural desktop CPU (LGA package, Intel-style).
 *
 * Scale: 1 scene unit = 1 cm. Package is 3.75 × 3.75 (37.5 mm), assembled
 * height ≈ 0.35 units. The model is centered on the Y axis with the substrate
 * bottom at y = 0.
 *
 * Layer stack (bottom → top):
 *   LGA pads → bottom SMDs → substrate → top SMDs + die → thermal paste → IHS
 */

const SIZE = 3.75; // package width/depth
const SUB_H = 0.12; // substrate thickness
const DIE_W = 1.5;
const DIE_D = 1.15;
const DIE_H = 0.07;

/** Winged IHS outline (classic LGA heat spreader silhouette). */
function ihsFlangeShape(): Shape {
  const h = 1.5; // half body width
  const tab = 1.74; // tab tip x
  const tabHalf = 0.5; // tab half-height in z
  const cut = 0.28; // corner chamfer

  const s = new Shape();
  s.moveTo(-h + cut, -h);
  s.lineTo(h - cut, -h);
  s.lineTo(h, -h + cut);
  s.lineTo(h, -tabHalf - 0.1);
  s.lineTo(tab, -tabHalf);
  s.lineTo(tab, tabHalf);
  s.lineTo(h, tabHalf + 0.1);
  s.lineTo(h, h - cut);
  s.lineTo(h - cut, h);
  s.lineTo(-h + cut, h);
  s.lineTo(-h, h - cut);
  s.lineTo(-h, tabHalf + 0.1);
  s.lineTo(-tab, tabHalf);
  s.lineTo(-tab, -tabHalf);
  s.lineTo(-h, -tabHalf - 0.1);
  s.lineTo(-h, -h + cut);
  s.closePath();
  return s;
}

export function generateCpu(seed = 1701): GeneratedModel {
  const rng = mulberry32(seed);
  const parts: ModelPart[] = [];

  // --- substrate -----------------------------------------------------------
  const substrate = roundedBox(SIZE, SUB_H, SIZE, 0.03);
  substrate.translate(0, SUB_H / 2, 0);
  parts.push({ id: 'substrate-body', nodeId: 'substrate', geometry: substrate, materialId: 'pcbGreen' });

  // --- LGA contact pads (bottom, instanced) --------------------------------
  const padCols = 36;
  const centerLo = padCols / 2 - 5;
  const centerHi = padCols / 2 + 4;
  const padPoints = gridPoints({
    cols: padCols,
    rows: padCols,
    spacingX: 0.09,
    spacingZ: 0.09,
    y: -0.012,
    // keep-out cavity in the middle (where the bottom SMDs live)
    filter: (ix, iz) => !(ix >= centerLo && ix <= centerHi && iz >= centerLo && iz <= centerHi),
  });
  const pad = new CylinderGeometry(0.026, 0.026, 0.024, 8);
  parts.push({
    id: 'lga-pads',
    nodeId: 'pads',
    geometry: pad,
    materialId: 'gold',
    instances: instanceMatrices(padPoints),
  });

  // --- bottom SMD capacitors (in the pad keep-out cavity) ------------------
  const bottomSmdPoints: Vector3[] = [];
  const bottomRots: number[] = [];
  for (let i = 0; i < 34; i++) {
    bottomSmdPoints.push(
      new Vector3(randRange(rng, -0.38, 0.38), -0.03, randRange(rng, -0.38, 0.38)),
    );
    bottomRots.push(rng() > 0.5 ? Math.PI / 2 : 0);
  }
  const bottomSmd = new BoxGeometry(0.14, 0.055, 0.07);
  parts.push({
    id: 'bottom-smds',
    nodeId: 'pads',
    geometry: bottomSmd,
    materialId: 'ceramic',
    instances: instanceMatrices(bottomSmdPoints, (i) => ({ rotationY: bottomRots[i] ?? 0 })),
  });

  // --- silicon die ----------------------------------------------------------
  const die = new BoxGeometry(DIE_W, DIE_H, DIE_D);
  die.translate(0, SUB_H + DIE_H / 2, 0);
  parts.push({ id: 'die-body', nodeId: 'die', geometry: die, materialId: 'silicon' });

  // --- top SMD capacitors flanking the die ---------------------------------
  const topSmdPoints: Vector3[] = [];
  const topRots: number[] = [];
  for (const sideX of [-1.35, 1.35]) {
    for (let i = 0; i < 12; i++) {
      topSmdPoints.push(new Vector3(sideX + randRange(rng, -0.12, 0.12), SUB_H + 0.025, -1.1 + i * 0.2));
      topRots.push(Math.PI / 2);
    }
  }
  for (const sideZ of [-1.35, 1.35]) {
    for (let i = 0; i < 8; i++) {
      topSmdPoints.push(new Vector3(-0.8 + i * 0.23, SUB_H + 0.025, sideZ + randRange(rng, -0.1, 0.1)));
      topRots.push(0);
    }
  }
  const topSmd = new BoxGeometry(0.11, 0.05, 0.06);
  parts.push({
    id: 'top-smds',
    nodeId: 'smds',
    geometry: topSmd,
    materialId: 'ceramic',
    instances: instanceMatrices(topSmdPoints, (i) => ({ rotationY: topRots[i] ?? 0 })),
  });

  // --- thermal interface material ------------------------------------------
  const paste = roundedBox(DIE_W + 0.06, 0.022, DIE_D + 0.06, 0.01);
  paste.translate(0, SUB_H + DIE_H + 0.011, 0);
  parts.push({ id: 'tim-layer', nodeId: 'paste', geometry: paste, materialId: 'thermalPaste' });

  // --- IHS: winged flange + raised cap --------------------------------------
  const flange = new ExtrudeGeometry(ihsFlangeShape(), {
    depth: 0.055,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  flange.rotateX(-Math.PI / 2); // extrude along +y
  flange.translate(0, SUB_H + 0.06, 0);
  parts.push({ id: 'ihs-flange', nodeId: 'ihs', geometry: flange, materialId: 'nickel' });

  const cap = roundedBox(2.88, 0.17, 2.88, 0.05);
  cap.translate(0, SUB_H + 0.055 + 0.018 + 0.085 + 0.06, 0);
  parts.push({ id: 'ihs-cap', nodeId: 'ihs', geometry: cap, materialId: 'nickel' });

  // --- parts graph -----------------------------------------------------------
  const nodes: PartNode[] = [
    {
      id: 'ihs',
      name: 'Integrated Heat Spreader',
      contentKey: 'cpu.ihs',
      explodeVector: [0, 1.7, 0],
      annotationAnchor: [1.1, 0.42, 1.1],
    },
    {
      id: 'paste',
      name: 'Thermal Interface Material',
      contentKey: 'cpu.paste',
      explodeVector: [0, 1.0, 0],
      annotationAnchor: [0.85, 0.22, 0.65],
    },
    {
      id: 'die',
      name: 'Silicon Die',
      contentKey: 'cpu.die',
      explodeVector: [0, 0.55, 0],
      annotationAnchor: [0.8, 0.18, 0.62],
    },
    {
      id: 'smds',
      name: 'SMD Capacitors',
      contentKey: 'cpu.smds',
      explodeVector: [0, 0.3, 0],
      annotationAnchor: [1.4, 0.12, 0.4],
    },
    {
      id: 'substrate',
      name: 'Package Substrate',
      contentKey: 'cpu.substrate',
      explodeVector: [0, 0, 0],
      annotationAnchor: [1.9, 0.06, 0.9],
    },
    {
      id: 'pads',
      name: 'LGA Contact Pads',
      contentKey: 'cpu.pads',
      explodeVector: [0, -1.1, 0],
      annotationAnchor: [1.2, -0.1, 1.2],
    },
  ];

  return {
    id: 'cpu',
    parts,
    nodes,
    boundingRadius: 2.8,
    flows: [
      {
        id: 'data-in',
        color: '#4f8cff',
        points: [
          [2.3, -0.9, 2.3],
          [1.1, -0.15, 1.1],
          [0.25, 0.2, 0.25],
        ],
        count: 10,
        speed: 0.26,
        size: 0.055,
      },
      {
        id: 'data-out',
        color: '#7ce0a3',
        points: [
          [-0.25, 0.2, -0.25],
          [-1.1, -0.15, -1.1],
          [-2.3, -0.9, -2.3],
        ],
        count: 10,
        speed: 0.26,
        size: 0.055,
      },
    ],
  };
}
