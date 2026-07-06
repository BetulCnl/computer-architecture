import { OrbitControls } from '@react-three/drei';
import { Stage } from '@/core/Stage';
import { ActiveModel } from '@/models/ActiveModel';
import { CameraDirector } from '@/systems/CameraDirector';

/**
 * The explorable lab: one component under studio lighting, free orbit.
 * (Phase 2 will replace raw OrbitControls with the CameraDirector.)
 */
export function LabScene() {
  return (
    <>
      <Stage>
        <group position={[0, 0.2, 0]}>
          <ActiveModel />
        </group>
      </Stage>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={3.5}
        maxDistance={16}
        maxPolarAngle={Math.PI * 0.88}
        target={[0, 0.2, 0]}
      />
      <CameraDirector />
    </>
  );
}
