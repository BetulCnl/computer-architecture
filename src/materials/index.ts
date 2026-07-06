import { Color, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import type { Material } from 'three';

/**
 * Shared PBR material library.
 *
 * Materials are app-wide singletons (created once, reused by every model) so
 * switching components never re-compiles shaders. Geometry is disposed per
 * model; materials are not.
 */
export type MaterialId =
  | 'pcbGreen'
  | 'pcbBlack'
  | 'gold'
  | 'nickel'
  | 'silicon'
  | 'ceramic'
  | 'blackPlastic'
  | 'aluminum'
  | 'copper'
  | 'thermalPaste';

function build(): Record<MaterialId, Material> {
  return {
    // Soldermask over fiberglass — slight clearcoat sheen like a real PCB
    pcbGreen: new MeshPhysicalMaterial({
      color: new Color('#0e3b22'),
      roughness: 0.55,
      metalness: 0.0,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
    }),
    pcbBlack: new MeshPhysicalMaterial({
      color: new Color('#101216'),
      roughness: 0.5,
      metalness: 0.0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.3,
    }),
    gold: new MeshStandardMaterial({
      color: new Color('#d9b44a'),
      roughness: 0.32,
      metalness: 1.0,
    }),
    // Nickel-plated copper IHS
    nickel: new MeshStandardMaterial({
      color: new Color('#c7cbd1'),
      roughness: 0.28,
      metalness: 1.0,
    }),
    // Silicon die — thin-film iridescence gives the real rainbow shimmer
    silicon: new MeshPhysicalMaterial({
      color: new Color('#23283f'),
      roughness: 0.12,
      metalness: 0.55,
      iridescence: 0.85,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [120, 480],
    }),
    // Tan MLCC capacitors / small SMD components
    ceramic: new MeshStandardMaterial({
      color: new Color('#b0946a'),
      roughness: 0.45,
      metalness: 0.15,
    }),
    blackPlastic: new MeshStandardMaterial({
      color: new Color('#131417'),
      roughness: 0.55,
      metalness: 0.0,
    }),
    aluminum: new MeshStandardMaterial({
      color: new Color('#9aa0a6'),
      roughness: 0.38,
      metalness: 1.0,
    }),
    copper: new MeshStandardMaterial({
      color: new Color('#b87333'),
      roughness: 0.32,
      metalness: 1.0,
    }),
    thermalPaste: new MeshStandardMaterial({
      color: new Color('#878c94'),
      roughness: 0.9,
      metalness: 0.05,
    }),
  };
}

let cache: Record<MaterialId, Material> | null = null;

/** Lazily-built singleton material registry. */
export function getMaterials(): Record<MaterialId, Material> {
  cache ??= build();
  return cache;
}

let highlightCache: Record<MaterialId, Material> | null = null;

/**
 * Emissive-tinted variants of every material, used for hover/selection
 * highlighting. Cloned once — swapping mesh.material between the two
 * registries costs nothing at runtime.
 */
export function getHighlightMaterials(): Record<MaterialId, Material> {
  if (!highlightCache) {
    const entries = Object.entries(getMaterials()).map(([id, mat]) => {
      const clone = mat.clone() as MeshStandardMaterial;
      clone.emissive = new Color('#2f5fd0');
      clone.emissiveIntensity = 0.38;
      return [id, clone] as const;
    });
    highlightCache = Object.fromEntries(entries) as unknown as Record<MaterialId, Material>;
  }
  return highlightCache;
}
