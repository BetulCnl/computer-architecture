import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { LabScene } from '@/scenes/LabScene';
import { Hud } from '@/ui/Hud';
import { useQualityPreset } from '@/state/quality';
import { useApp } from '@/state/app';
import { useShortcuts } from '@/ui/useShortcuts';

export default function App() {
  const preset = useQualityPreset();
  useShortcuts();

  return (
    <div className="app">
      <Canvas
        shadows={preset.shadows}
        dpr={preset.dpr}
        camera={{ position: [5.2, 3.6, 6.6], fov: 40, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
        }}
        onPointerMissed={() => useApp.getState().clearSelection()}
      >
        <Suspense fallback={null}>
          <LabScene />
        </Suspense>
      </Canvas>
      <Hud />
    </div>
  );
}
