import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

/**
 * Postprocessing chain. Bloom is selective by construction: with
 * luminanceThreshold = 1 only HDR emissive surfaces (data-flow pulses, LEDs)
 * exceed it — regular lit materials never bloom.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={0.6} luminanceThreshold={1.0} />
      <Vignette eskil={false} offset={0.22} darkness={0.62} />
    </EffectComposer>
  );
}
