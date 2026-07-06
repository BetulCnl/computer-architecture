import { describe, expect, it } from 'vitest';
import { generators } from '@/models/registry';
import { getContent } from '@/content';

/**
 * Shared integrity contract every procedural model must satisfy.
 * Model-specific assertions live next to each generator.
 */
describe.each(Object.entries(generators))('model: %s', (id, generate) => {
  const model = generate();

  it('has a valid parts graph', () => {
    expect(model.id).toBe(id);
    expect(model.parts.length).toBeGreaterThan(0);
    expect(model.nodes.length).toBeGreaterThan(0);

    const nodeIds = model.nodes.map((n) => n.id);
    expect(new Set(nodeIds).size).toBe(nodeIds.length); // unique node ids

    const partIds = model.parts.map((p) => p.id);
    expect(new Set(partIds).size).toBe(partIds.length); // unique part ids

    for (const part of model.parts) expect(nodeIds).toContain(part.nodeId);
    for (const nodeId of nodeIds) {
      expect(model.parts.some((p) => p.nodeId === nodeId), `node ${nodeId} has parts`).toBe(true);
    }
  });

  it('has educational content for every node', () => {
    for (const node of model.nodes) {
      expect(getContent(node.contentKey), node.contentKey).not.toBeNull();
    }
  });

  it('produces finite geometry and instance transforms', () => {
    for (const part of model.parts) {
      const positions = part.geometry.getAttribute('position');
      expect(positions.count).toBeGreaterThan(0);
      for (let i = 0; i < positions.count; i++) {
        expect(Number.isFinite(positions.getX(i))).toBe(true);
        expect(Number.isFinite(positions.getY(i))).toBe(true);
        expect(Number.isFinite(positions.getZ(i))).toBe(true);
      }
      for (const matrix of part.instances ?? []) {
        for (const el of matrix.elements) expect(Number.isFinite(el)).toBe(true);
      }
    }
  });

  it('fits inside its declared bounding radius', () => {
    expect(model.boundingRadius).toBeGreaterThan(0);
    // sample geometry extents (vertex furthest from origin, ignoring instances
    // which only translate within the same envelope)
    let maxSq = 0;
    for (const part of model.parts) {
      if (part.instances) continue;
      const positions = part.geometry.getAttribute('position');
      for (let i = 0; i < positions.count; i++) {
        const d =
          positions.getX(i) ** 2 + positions.getY(i) ** 2 + positions.getZ(i) ** 2;
        if (d > maxSq) maxSq = d;
      }
    }
    expect(Math.sqrt(maxSq)).toBeLessThanOrEqual(model.boundingRadius * 1.15);
  });
});
