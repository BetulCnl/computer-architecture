import { create } from 'zustand';

/**
 * Adaptive rendering quality.
 *
 * The active tier drives every performance-sensitive setting (DPR, shadows,
 * postprocessing, environment resolution). `auto` mode lets the
 * PerformanceMonitor degrade/upgrade the tier at runtime; a manual selection
 * pins it.
 */
export type QualityTier = 'low' | 'medium' | 'high' | 'ultra';

export interface QualityPreset {
  /** [min, max] device pixel ratio passed to the canvas */
  dpr: [number, number];
  shadows: boolean;
  shadowMapSize: number;
  /** postprocessing chain (bloom, vignette) enabled */
  post: boolean;
  /** procedural environment map resolution */
  envResolution: number;
}

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
  low: { dpr: [1, 1], shadows: false, shadowMapSize: 512, post: false, envResolution: 64 },
  medium: { dpr: [1, 1.5], shadows: true, shadowMapSize: 1024, post: false, envResolution: 128 },
  high: { dpr: [1, 2], shadows: true, shadowMapSize: 2048, post: true, envResolution: 256 },
  ultra: { dpr: [1, 2], shadows: true, shadowMapSize: 4096, post: true, envResolution: 256 },
};

const TIER_ORDER: readonly QualityTier[] = ['low', 'medium', 'high', 'ultra'];

interface QualityState {
  tier: QualityTier;
  /** true → PerformanceMonitor may move the tier */
  auto: boolean;
  setTier: (tier: QualityTier) => void;
  setAuto: () => void;
  degrade: () => void;
  upgrade: () => void;
}

export const useQuality = create<QualityState>()((set) => ({
  tier: 'high',
  auto: true,
  setTier: (tier) => set({ tier, auto: false }),
  setAuto: () => set({ auto: true }),
  degrade: () =>
    set((s) => {
      if (!s.auto) return s;
      const next = TIER_ORDER[TIER_ORDER.indexOf(s.tier) - 1];
      return next ? { tier: next } : s;
    }),
  upgrade: () =>
    set((s) => {
      if (!s.auto) return s;
      const next = TIER_ORDER[TIER_ORDER.indexOf(s.tier) + 1];
      return next ? { tier: next } : s;
    }),
}));

/** Convenience selector for the preset of the active tier. */
export function useQualityPreset(): QualityPreset {
  return QUALITY_PRESETS[useQuality((s) => s.tier)];
}
