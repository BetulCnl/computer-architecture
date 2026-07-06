import type { CameraPose, ComponentId } from '@/state/app';

/**
 * Guided tour: "the life of your data" — a curated path through the machine.
 * Camera poses are in scene units (models are normalized to radius ≈ 2.8,
 * centered near the origin at y ≈ 0.2).
 */
export interface TourChapter {
  id: string;
  component: ComponentId;
  title: string;
  body: string;
  explode: number;
  sim: boolean;
  camera: CameraPose;
}

export const tourChapters: TourChapter[] = [
  {
    id: 'intro',
    component: 'motherboard',
    title: 'Welcome to the Machine',
    body: 'Everything in a PC connects through this board. Power, data and control signals cross it billions of times per second. Let’s follow them.',
    explode: 0,
    sim: true,
    camera: { position: [3.8, 4.6, 4.6], target: [0, 0.1, 0] },
  },
  {
    id: 'motherboard-exploded',
    component: 'motherboard',
    title: 'The City Beneath',
    body: 'Lift the surface and the motherboard reveals its districts: the CPU socket, memory slots, expansion lanes and the chipset — each with a dedicated role.',
    explode: 0.85,
    sim: true,
    camera: { position: [-3.4, 3.8, 5.2], target: [0, 0.6, 0] },
  },
  {
    id: 'cpu',
    component: 'cpu',
    title: 'The Brain',
    body: 'The CPU executes billions of instructions per second. Data streams in through more than a thousand gold contacts on its underside.',
    explode: 0,
    sim: true,
    camera: { position: [2.9, 2.2, 3.6], target: [0, 0.2, 0] },
  },
  {
    id: 'cpu-inside',
    component: 'cpu',
    title: 'Under the Lid',
    body: 'Beneath the heat spreader sits a fingernail-sized silicon die holding billions of transistors — the rainbow shimmer comes from its nanoscale circuit layers.',
    explode: 1,
    sim: false,
    camera: { position: [3.4, 1.6, 3.4], target: [0, 0.5, 0] },
  },
  {
    id: 'ram',
    component: 'ram',
    title: 'Working Memory',
    body: 'RAM is the CPU’s desk space: blazing fast, but it forgets everything at power-off. DDR5 modules even regulate their own voltage with an on-board PMIC.',
    explode: 0.65,
    sim: true,
    camera: { position: [2.6, 2.4, 4.4], target: [0, 0.3, 0] },
  },
  {
    id: 'ssd',
    component: 'ssd',
    title: 'Long-Term Memory',
    body: 'The NVMe SSD keeps your data with no moving parts, streaming it over PCIe lanes directly to the CPU — watch it travel from connector to NAND.',
    explode: 0.5,
    sim: true,
    camera: { position: [1.8, 3.4, 3.8], target: [0, 0.3, 0] },
  },
  {
    id: 'gpu',
    component: 'gpu',
    title: 'The Parallel Powerhouse',
    body: 'Thousands of small cores render your pixels and train AI models. An entire computer — processor, memory, power delivery — lives on this one card.',
    explode: 0.9,
    sim: true,
    camera: { position: [-3.6, 3.2, 4.6], target: [0, 0.5, 0] },
  },
  {
    id: 'cooler',
    component: 'cooler',
    title: 'Keeping It Alive',
    body: 'All that computation becomes heat. Heatpipes carry it from the copper cold plate into the fin stack, where the fan sweeps it away — follow the warmth upward.',
    explode: 0,
    sim: true,
    camera: { position: [3.4, 1.8, 4.2], target: [0, 0.4, 0] },
  },
  {
    id: 'finale',
    component: 'cpu',
    title: 'Now You Know',
    body: 'Six components, one machine. Exit the tour and explore each part yourself — click anything to learn how it works.',
    explode: 0,
    sim: true,
    camera: { position: [4.6, 3.0, 5.6], target: [0, 0.2, 0] },
  },
];
