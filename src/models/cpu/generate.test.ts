import { describe, expect, it } from 'vitest';
import { generateCpu } from '@/models/cpu/generate';
import { cpuContent } from '@/content/cpu';

describe('generateCpu', () => {
  const model = generateCpu();

  it('produces the expected parts graph', () => {
    const nodeIds = model.nodes.map((n) => n.id);
    expect(nodeIds).toEqual(['ihs', 'paste', 'die', 'smds', 'substrate', 'pads']);
    // every part belongs to a declared node
    for (const part of model.parts) {
      expect(nodeIds).toContain(part.nodeId);
    }
    // every node has at least one renderable part
    for (const id of nodeIds) {
      expect(model.parts.some((p) => p.nodeId === id)).toBe(true);
    }
  });

  it('has educational content for every node', () => {
    for (const node of model.nodes) {
      expect(cpuContent[node.contentKey], node.contentKey).toBeDefined();
    }
  });

  it('generates a dense LGA pad field', () => {
    const pads = model.parts.find((p) => p.id === 'lga-pads');
    expect(pads?.instances?.length).toBeGreaterThan(1000);
  });

  it('produces finite geometry positions', () => {
    for (const part of model.parts) {
      const positions = part.geometry.getAttribute('position');
      expect(positions.count).toBeGreaterThan(0);
      for (let i = 0; i < positions.count; i++) {
        expect(Number.isFinite(positions.getX(i))).toBe(true);
        expect(Number.isFinite(positions.getY(i))).toBe(true);
        expect(Number.isFinite(positions.getZ(i))).toBe(true);
      }
    }
  });

  it('is deterministic for the same seed', () => {
    const a = generateCpu(42);
    const b = generateCpu(42);
    const smdA = a.parts.find((p) => p.id === 'top-smds');
    const smdB = b.parts.find((p) => p.id === 'top-smds');
    expect(smdA?.instances?.map((m) => m.elements)).toEqual(
      smdB?.instances?.map((m) => m.elements),
    );
  });

  it('reports a sane bounding radius', () => {
    expect(model.boundingRadius).toBeGreaterThan(1);
    expect(model.boundingRadius).toBeLessThan(10);
  });
});
