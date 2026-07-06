import type { BufferGeometry, Matrix4 } from 'three';
import type { MaterialId } from '@/materials';

/**
 * The PartsGraph contract — the single structure every system keys off:
 * ExplodeSystem reads explodeVector, AnnotationSystem reads annotationAnchor,
 * content panels read contentKey.
 */

/** One renderable chunk of a model. If `instances` is set, render as InstancedMesh. */
export interface ModelPart {
  id: string;
  /** logical node this part belongs to (explodes/highlights as a unit) */
  nodeId: string;
  geometry: BufferGeometry;
  materialId: MaterialId;
  instances?: Matrix4[];
  /** local pivot: geometry is authored relative to this point (spinning parts) */
  origin?: [number, number, number];
  /** continuous rotation around the local pivot (fan blades, hubs) */
  spin?: { axis: 'x' | 'y' | 'z'; speed: number };
}

/** An animated particle stream visualizing a process (data, heat). */
export interface FlowPath {
  id: string;
  /** CSS color; rendered HDR so it blooms */
  color: string;
  /** waypoints in model units — smoothed by a Catmull-Rom curve */
  points: [number, number, number][];
  count?: number;
  /** loops per second along the path */
  speed?: number;
  /** particle radius in model units */
  size?: number;
}

/** A logical, user-facing part of the hardware (selectable, annotatable). */
export interface PartNode {
  id: string;
  name: string;
  /** key into the content module for educational text */
  contentKey: string;
  /** world-space offset (scene units) applied at explode = 1 */
  explodeVector: [number, number, number];
  /** local anchor point for the annotation label */
  annotationAnchor: [number, number, number];
}

export interface GeneratedModel {
  id: string;
  parts: ModelPart[];
  nodes: PartNode[];
  /** rough bounding sphere radius of the assembled model, for camera framing */
  boundingRadius: number;
  /** optional process animations (data flow, heat) */
  flows?: FlowPath[];
}

/** Dispose all geometry owned by a generated model (materials are shared). */
export function disposeModel(model: GeneratedModel): void {
  for (const part of model.parts) part.geometry.dispose();
}
