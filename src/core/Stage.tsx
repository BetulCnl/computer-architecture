import type { ReactNode } from 'react';
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { Effects } from '@/core/Effects';
import { useQuality, useQualityPreset } from '@/state/quality';

/**
 * Studio stage: procedural environment lighting (no HDR downloads — the
 * environment map is rendered once from Lightformers), key/rim lights,
 * grounded contact shadows, adaptive quality monitoring and postprocessing.
 */
export function Stage({ children }: { children: ReactNode }) {
  const preset = useQualityPreset();
  const degrade = useQuality((s) => s.degrade);
  const upgrade = useQuality((s) => s.upgrade);

  return (
    <>
      <color attach="background" args={['#0a0c10']} />

      <PerformanceMonitor onDecline={degrade} onIncline={upgrade} flipflops={3}>
        {/* key light — the only shadow caster */}
        <directionalLight
          position={[4, 7, 3]}
          intensity={2.4}
          castShadow={preset.shadows}
          shadow-mapSize={[preset.shadowMapSize, preset.shadowMapSize]}
          shadow-bias={-0.0004}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-camera-far={20}
        />
        {/* cool rim for silhouette separation */}
        <directionalLight position={[-5, 3, -5]} intensity={0.7} color="#7aa2ff" />
        <ambientLight intensity={0.12} />

        {/* procedural studio environment — generated at runtime, zero assets */}
        <Environment resolution={preset.envResolution} frames={1}>
          <Lightformer form="rect" intensity={4.5} position={[0, 5, -6]} scale={[8, 4, 1]} />
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[-6, 3, 2]}
            rotation-y={Math.PI / 2}
            scale={[6, 3, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            position={[6, 2, 2]}
            rotation-y={-Math.PI / 2}
            scale={[6, 2, 1]}
          />
          <Lightformer form="ring" intensity={2.8} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={4} />
        </Environment>

        {children}

        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.55}
          scale={16}
          blur={2.6}
          far={4}
          resolution={512}
        />
      </PerformanceMonitor>

      {preset.post && <Effects />}
    </>
  );
}
