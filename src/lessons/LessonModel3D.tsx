import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ACESFilmicToneMapping, CatmullRomCurve3, Color, Matrix4, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';
import type { Group, InstancedMesh, Object3D } from 'three';
import { OrbitControls } from '@react-three/drei';
import { getMaterials } from '@/materials';
import { generators } from '@/models/registry';
import { disposeModel } from '@/models/types';
import type { FlowPath, ModelPart } from '@/models/types';
import { useApp } from '@/state/app';
import type { ComponentId } from '@/state/app';
import { observeReveal } from '@/lessons/Reveal';
import { Rich } from '@/lessons/RichText';

const TARGET_RADIUS = 2.6;
const tmpVec = new Vector3();
const tmpMat = new Matrix4();

/** Bir parçayı (mesh / InstancedMesh) laboratuvar durumundan bağımsız çizer. */
function LessonPart({ part, sim }: { part: ModelPart; sim: boolean }) {
  const ref = useRef<Object3D>(null);
  const materials = getMaterials();
  const instances = part.instances;

  useEffect(() => {
    if (!instances) return;
    const mesh = ref.current as InstancedMesh | null;
    if (!mesh) return;
    instances.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [instances]);

  useFrame((_, delta) => {
    const spin = part.spin;
    const obj = ref.current;
    if (!spin || !obj) return;
    obj.rotation[spin.axis] += spin.speed * (sim ? 1 : 0.25) * delta;
  });

  const material = materials[part.materialId];
  const mesh = instances ? (
    // Geometri/materyal props olarak verilir; args'a koymak InstancedMesh'i
    // yeniden yaratıp instance matrislerini siler (bkz. ModelView notu).
    <instancedMesh
      ref={ref as React.RefObject<InstancedMesh>}
      args={[undefined, undefined, instances.length]}
      geometry={part.geometry}
      material={material}
    />
  ) : (
    <mesh ref={ref} geometry={part.geometry} material={material} />
  );
  return part.origin ? <group position={part.origin}>{mesh}</group> : mesh;
}

/** Veri/ısı akışı parçacıkları — ders içi kopya, laboratuvar durumundan bağımsız. */
function LessonFlow({ flow, defaultSize }: { flow: FlowPath; defaultSize: number }) {
  const ref = useRef<InstancedMesh>(null);
  const count = flow.count ?? 12;
  const speed = flow.speed ?? 0.2;

  const curve = useMemo(
    () => new CatmullRomCurve3(flow.points.map((p) => new Vector3(p[0], p[1], p[2]))),
    [flow.points],
  );
  const geometry = useMemo(
    () => new SphereGeometry(flow.size ?? defaultSize, 10, 8),
    [flow.size, defaultSize],
  );
  const material = useMemo(
    () => new MeshBasicMaterial({ color: new Color(flow.color).multiplyScalar(4), toneMapped: false }),
    [flow.color],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime * speed;
    for (let i = 0; i < count; i++) {
      curve.getPointAt((t + i / count) % 1, tmpVec);
      tmpMat.makeTranslation(tmpVec.x, tmpVec.y, tmpVec.z);
      mesh.setMatrixAt(i, tmpMat);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />;
}

function LessonModelScene({
  component,
  sim,
  explode,
}: {
  component: ComponentId;
  sim: boolean;
  explode: number;
}) {
  const rootRef = useRef<Group>(null);
  const model = useMemo(() => generators[component](), [component]);
  useEffect(() => () => disposeModel(model), [model]);

  const scale = TARGET_RADIUS / model.boundingRadius;

  useFrame((_, delta) => {
    // sakin bir vitrin dönüşü — kullanıcı sürüklerse OrbitControls devralır
    if (rootRef.current) rootRef.current.rotation.y += delta * 0.12;
  });

  return (
    <>
      <directionalLight position={[4, 7, 3]} intensity={2.2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.8} color="#7aa2ff" />
      <ambientLight intensity={0.35} />
      <group ref={rootRef} scale={scale}>
        {model.nodes.map((node) => (
          <group
            key={node.id}
            position={[
              node.explodeVector[0] * explode,
              node.explodeVector[1] * explode,
              node.explodeVector[2] * explode,
            ]}
          >
            {model.parts
              .filter((part) => part.nodeId === node.id)
              .map((part) => (
                <LessonPart key={part.id} part={part} sim={sim} />
              ))}
          </group>
        ))}
        {sim &&
          model.flows?.map((flow) => (
            <LessonFlow key={flow.id} flow={flow} defaultSize={model.boundingRadius * 0.02} />
          ))}
      </group>
    </>
  );
}

interface LessonModel3DProps {
  component: ComponentId;
  title?: string;
  caption?: string;
  sim?: boolean;
  explode?: number;
}

const COMPONENT_LABELS: Record<ComponentId, string> = {
  cpu: 'İşlemci',
  gpu: 'Ekran Kartı',
  ram: 'DDR5 Bellek',
  ssd: 'NVMe SSD',
  motherboard: 'Anakart',
  cooler: 'Soğutucu',
};

/**
 * Ders içine gömülü prosedürel donanım modeli.
 *
 * Canvas yalnızca bölüm görünür alana yaklaşınca bağlanır ve uzaklaşınca
 * sökülür — bir derste birden çok 3B sahne olsa da aynı anda tek WebGL
 * bağlamı çalışır. "Laboratuvarda incele" ile tam interaktif laboratuvara
 * geçilir.
 */
export function LessonModel3D({ component, title, caption, sim = false, explode = 0 }: LessonModel3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const openLab = useApp((s) => s.openLab);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    return observeReveal(el, setVisible);
  }, []);

  return (
    <figure className="lesson-model" ref={hostRef}>
      <div className="lesson-model-head">
        <span className="lesson-model-title">{title ?? COMPONENT_LABELS[component]}</span>
        <button type="button" className="lesson-model-lab" onClick={() => openLab(component)}>
          Laboratuvarda incele →
        </button>
      </div>
      <div className="lesson-model-canvas" aria-label={`${COMPONENT_LABELS[component]} 3B modeli`}>
        {visible && (
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [4.6, 3.2, 5.8], fov: 40, near: 0.1, far: 100 }}
            gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}
          >
            <Suspense fallback={null}>
              <LessonModelScene component={component} sim={sim} explode={explode} />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} makeDefault />
          </Canvas>
        )}
      </div>
      {caption && (
        <figcaption className="lesson-caption">
          <Rich text={caption} />
        </figcaption>
      )}
    </figure>
  );
}
