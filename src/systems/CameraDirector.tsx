import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useApp } from '@/state/app';

const HOME_TARGET = new Vector3(0, 0.2, 0);
const destTarget = new Vector3();
const destPosition = new Vector3();
const viewDir = new Vector3();

/**
 * Single owner of camera choreography.
 *
 * Lab mode: the user orbits freely. When a part is selected, the director
 * glides the OrbitControls target (and dollies the camera) to frame it; any
 * user drag cancels the automated move so the camera never fights the user.
 * Cinematic (scroll story) mode plugs in here later.
 */
export function CameraDirector() {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const camera = useThree((s) => s.camera);
  const focus = useApp((s) => s.focus);
  const pose = useApp((s) => s.pose);
  const moving = useRef(false);
  const dolly = useRef(false);

  // cinematic pose (guided tour) — takes priority over part focus
  useEffect(() => {
    if (!pose) return;
    destTarget.set(pose.target[0], pose.target[1], pose.target[2]);
    destPosition.set(pose.position[0], pose.position[1], pose.position[2]);
    dolly.current = true;
    moving.current = true;
  }, [pose]);

  // new focus target → start a transition
  useEffect(() => {
    if (useApp.getState().pose) return; // tour owns the camera
    if (focus) {
      destTarget.set(focus.center[0], focus.center[1], focus.center[2]);
      viewDir
        .copy(camera.position)
        .sub(controls ? controls.target : HOME_TARGET)
        .normalize();
      const distance = Math.min(Math.max(focus.radius * 3.2, 2.4), 11);
      destPosition.copy(destTarget).addScaledVector(viewDir, distance);
      dolly.current = true;
      moving.current = true;
    } else {
      // deselect → re-center the pivot, keep the camera where the user left it
      destTarget.copy(HOME_TARGET);
      dolly.current = false;
      moving.current = true;
    }
  }, [focus, camera, controls]);

  // a user drag takes priority over any automated move
  useEffect(() => {
    if (!controls) return;
    const cancel = () => {
      moving.current = false;
    };
    controls.addEventListener('start', cancel);
    return () => controls.removeEventListener('start', cancel);
  }, [controls]);

  useFrame((_, delta) => {
    if (!moving.current || !controls) return;
    easing.damp3(controls.target, destTarget, 0.25, delta);
    if (dolly.current) easing.damp3(camera.position, destPosition, 0.3, delta);
    controls.update();
    const targetDone = controls.target.distanceTo(destTarget) < 0.005;
    const positionDone = !dolly.current || camera.position.distanceTo(destPosition) < 0.01;
    if (targetDone && positionDone) moving.current = false;
  });

  return null;
}
