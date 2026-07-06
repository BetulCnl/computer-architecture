import type { ComponentId } from '@/state/app';
import type { GeneratedModel } from '@/models/types';
import { generateCpu } from '@/models/cpu/generate';
import { generateRam } from '@/models/ram/generate';
import { generateSsd } from '@/models/ssd/generate';
import { generateCooler } from '@/models/cooler/generate';
import { generateGpu } from '@/models/gpu/generate';
import { generateMotherboard } from '@/models/motherboard/generate';

/** Every hardware generator, keyed by ComponentId. */
export const generators: Record<ComponentId, () => GeneratedModel> = {
  cpu: generateCpu,
  ram: generateRam,
  ssd: generateSsd,
  cooler: generateCooler,
  gpu: generateGpu,
  motherboard: generateMotherboard,
};
