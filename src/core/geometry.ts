import { Matrix4, Quaternion, Vector3 } from 'three';
import type { Euler } from 'three';
import type { BufferGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/**
 * Geometry construction utilities shared by all procedural model generators.
 * Everything here is pure — no scene, no React, no side effects.
 */

/** Rounded box with sensible defaults for hardware parts. */
export function roundedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
  segments = 2,
): BufferGeometry {
  return new RoundedBoxGeometry(width, height, depth, segments, radius);
}

export interface GridOptions {
  cols: number;
  rows: number;
  spacingX: number;
  spacingZ: number;
  /** y coordinate applied to every point (default 0) */
  y?: number;
  /** return false to skip a cell (ix/iz are 0-based column/row indices) */
  filter?: (ix: number, iz: number) => boolean;
}

/** Centered XZ grid of points — pad arrays, chip arrays, fin stacks, pin fields. */
export function gridPoints(options: GridOptions): Vector3[] {
  const { cols, rows, spacingX, spacingZ, y = 0, filter } = options;
  const points: Vector3[] = [];
  const offsetX = ((cols - 1) * spacingX) / 2;
  const offsetZ = ((rows - 1) * spacingZ) / 2;
  for (let ix = 0; ix < cols; ix++) {
    for (let iz = 0; iz < rows; iz++) {
      if (filter && !filter(ix, iz)) continue;
      points.push(new Vector3(ix * spacingX - offsetX, y, iz * spacingZ - offsetZ));
    }
  }
  return points;
}

const UP = new Vector3(0, 1, 0);

export interface InstanceTransform {
  rotationY?: number;
  scale?: number;
}

/** Compose a Matrix4 for an instanced part placement. */
export function instanceMatrix(position: Vector3, transform: InstanceTransform = {}): Matrix4 {
  const { rotationY = 0, scale = 1 } = transform;
  const q = new Quaternion().setFromAxisAngle(UP, rotationY);
  return new Matrix4().compose(position, q, new Vector3(scale, scale, scale));
}

/** Compose a Matrix4 from position + arbitrary Euler rotation (fan blades…). */
export function composeMatrix(position: Vector3, rotation?: Euler, scale = 1): Matrix4 {
  const q = rotation ? new Quaternion().setFromEuler(rotation) : new Quaternion();
  return new Matrix4().compose(position, q, new Vector3(scale, scale, scale));
}

/** Map a list of points to instance matrices, optionally per-index transforms. */
export function instanceMatrices(
  points: Vector3[],
  transformAt?: (index: number) => InstanceTransform,
): Matrix4[] {
  return points.map((p, i) => instanceMatrix(p, transformAt ? transformAt(i) : {}));
}
