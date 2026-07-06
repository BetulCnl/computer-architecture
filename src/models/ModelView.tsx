import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Html, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { easing } from 'maath';
import {
  Box3,
  CatmullRomCurve3,
  Color,
  Matrix4,
  MeshBasicMaterial,
  Sphere,
  SphereGeometry,
  Vector3,
} from 'three';
import type { Group, InstancedMesh, Material, Object3D } from 'three';
import { getHighlightMaterials, getMaterials } from '@/materials';
import { disposeModel } from '@/models/types';
import type { FlowPath, GeneratedModel, ModelPart, PartNode } from '@/models/types';
import { useApp } from '@/state/app';

const tmpTarget = new Vector3();
const tmpBox = new Box3();
const tmpSphere = new Sphere();
const tmpVec = new Vector3();
const tmpMat = new Matrix4();

/** All models are normalized to roughly this on-screen radius. */
const TARGET_RADIUS = 2.8;

/** Renders one part (mesh or InstancedMesh) with optional pivot + spin. */
function PartMesh({ part, material }: { part: ModelPart; material: Material }) {
  const ref = useRef<Object3D>(null);
  const instances = part.instances;

  useLayoutEffect(() => {
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
    // idle at quarter speed; full speed while the simulation runs
    const factor = useApp.getState().sim ? 1 : 0.25;
    obj.rotation[spin.axis] += spin.speed * factor * delta;
  });

  const mesh = instances ? (
    // NOTE: geometry/material must be props, not args — anything inside `args`
    // recreates the InstancedMesh on change (hover material swap), wiping the
    // instance matrices set in the layout effect.
    <instancedMesh
      ref={ref as React.RefObject<InstancedMesh>}
      args={[undefined, undefined, instances.length]}
      geometry={part.geometry}
      material={material}
      castShadow
      receiveShadow
    />
  ) : (
    <mesh ref={ref} geometry={part.geometry} material={material} castShadow receiveShadow />
  );

  return part.origin ? <group position={part.origin}>{mesh}</group> : mesh;
}

/** HDR particle stream along a Catmull-Rom path — visualizes data/heat flow. */
function FlowParticles({ flow, defaultSize }: { flow: FlowPath; defaultSize: number }) {
  const ref = useRef<InstancedMesh>(null);
  const count = flow.count ?? 12;
  const speed = flow.speed ?? 0.2;

  const curve = useMemo(
    () => new CatmullRomCurve3(flow.points.map((p) => new Vector3(p[0], p[1], p[2]))),
    [flow.points],
  );
  const geometry = useMemo(() => new SphereGeometry(flow.size ?? defaultSize, 10, 8), [flow.size, defaultSize]);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(flow.color).multiplyScalar(4), // HDR → picked up by bloom
        toneMapped: false,
      }),
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
      const u = (t + i / count) % 1;
      curve.getPointAt(u, tmpVec);
      tmpMat.makeTranslation(tmpVec.x, tmpVec.y, tmpVec.z);
      mesh.setMatrixAt(i, tmpMat);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />;
}

/**
 * Generic interactive renderer for any GeneratedModel.
 *
 * One <group> per PartNode: the group carries the explode offset, hover/select
 * material swap, pointer events and the annotation label — every model gets
 * full interactivity, process animation and entrance transition for free.
 */
export function ModelView({ model }: { model: GeneratedModel }) {
  const materials = getMaterials();
  const highlight = getHighlightMaterials();
  const rootRef = useRef<Group>(null);
  const nodeRefs = useRef(new Map<string, Group>());
  const hovered = useApp((s) => s.hovered);
  const selected = useApp((s) => s.selected);
  const sim = useApp((s) => s.sim);
  const setHovered = useApp((s) => s.setHovered);
  const select = useApp((s) => s.select);

  useCursor(hovered !== null);

  // geometry is owned by this component; dispose on unmount
  useEffect(() => () => disposeModel(model), [model]);

  // uniform normalization: a motherboard and a CPU occupy similar screen space
  const scale = TARGET_RADIUS / model.boundingRadius;

  // entrance: scale up from 60% on mount
  useLayoutEffect(() => {
    rootRef.current?.scale.setScalar(scale * 0.6);
  }, [scale]);

  useFrame((_, delta) => {
    // entrance spring
    const root = rootRef.current;
    if (root) {
      tmpTarget.setScalar(scale);
      easing.damp3(root.scale, tmpTarget, 0.3, delta);
    }
    // per-node explode offsets
    const explode = useApp.getState().explode;
    for (const node of model.nodes) {
      const group = nodeRefs.current.get(node.id);
      if (!group) continue;
      tmpTarget.set(
        node.explodeVector[0] * explode,
        node.explodeVector[1] * explode,
        node.explodeVector[2] * explode,
      );
      easing.damp3(group.position, tmpTarget, 0.22, delta);
    }
  });

  const handleClick = (node: PartNode) => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const group = nodeRefs.current.get(node.id);
    if (!group) return;
    // frame the part exactly where it currently is (explode included)
    tmpBox.setFromObject(group);
    tmpBox.getBoundingSphere(tmpSphere);
    select(
      { id: node.id, name: node.name, contentKey: node.contentKey },
      {
        center: [tmpSphere.center.x, tmpSphere.center.y, tmpSphere.center.z],
        radius: tmpSphere.radius,
      },
    );
  };

  return (
    <group ref={rootRef}>
      {model.nodes.map((node) => {
        const active = hovered === node.id || selected?.id === node.id;
        const registry = active ? highlight : materials;
        return (
          <group
            key={node.id}
            ref={(g) => {
              if (g) nodeRefs.current.set(node.id, g);
              else nodeRefs.current.delete(node.id);
            }}
            onClick={handleClick(node)}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(node.id);
            }}
            onPointerOut={() => setHovered(null)}
          >
            {model.parts
              .filter((part) => part.nodeId === node.id)
              .map((part) => (
                <PartMesh key={part.id} part={part} material={registry[part.materialId]} />
              ))}
            {selected?.id === node.id && (
              <Html position={node.annotationAnchor} center zIndexRange={[20, 0]}>
                <div className="annotation">{node.name}</div>
              </Html>
            )}
          </group>
        );
      })}
      {sim &&
        model.flows?.map((flow) => (
          <FlowParticles key={flow.id} flow={flow} defaultSize={model.boundingRadius * 0.02} />
        ))}
    </group>
  );
}
