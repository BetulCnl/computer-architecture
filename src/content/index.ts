import { cpuContent } from '@/content/cpu';
import type { PartContent } from '@/content/cpu';
import { ramContent } from '@/content/ram';
import { ssdContent } from '@/content/ssd';
import { coolerContent } from '@/content/cooler';
import { gpuContent } from '@/content/gpu';
import { motherboardContent } from '@/content/motherboard';

/** All content registries — new models append theirs here. */
const registries: Record<string, PartContent>[] = [
  cpuContent,
  ramContent,
  ssdContent,
  coolerContent,
  gpuContent,
  motherboardContent,
];

/** Resolve educational content by a PartNode.contentKey. */
export function getContent(key: string): PartContent | null {
  for (const registry of registries) {
    const content = registry[key];
    if (content) return content;
  }
  return null;
}

export type { PartContent };
