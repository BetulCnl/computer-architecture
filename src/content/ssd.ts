import type { PartContent } from '@/content/cpu';

export const ssdContent: Record<string, PartContent> = {
  'ssd.controller': {
    title: 'NVMe Controller',
    summary: 'A small processor that orchestrates every read and write.',
    details:
      'The controller is a dedicated multi-core chip: it maps logical addresses to physical NAND pages, spreads writes evenly (wear leveling), fixes bit errors on the fly, and talks to the CPU over PCIe using the NVMe protocol — designed for flash, with thousands of parallel command queues.',
  },
  'ssd.nand': {
    title: 'NAND Flash',
    summary: 'Where your data actually lives — stacked hundreds of layers high.',
    details:
      'NAND cells trap electrons on an insulated gate, so data persists without power. Modern 3D NAND stacks 200+ layers of cells vertically and stores multiple bits per cell. Each package here holds hundreds of billions of cells, erased and rewritten in blocks.',
  },
  'ssd.dram': {
    title: 'DRAM Cache',
    summary: 'Fast working memory for the drive’s address map.',
    details:
      'The controller keeps its logical-to-physical address map in this DRAM chip for instant lookups. Budget drives omit it (using host memory instead), which is one of the main real-world differences between cheap and premium NVMe drives under sustained load.',
  },
  'ssd.smds': {
    title: 'Passive Components',
    summary: 'Capacitors and resistors that keep power and signals clean.',
    details:
      'Dozens of tiny capacitors filter the 3.3 V supply during bursts of NAND activity, when current demand spikes sharply. Some enterprise drives add larger capacitors as emergency power, letting the controller flush in-flight data if power is suddenly lost.',
  },
  'ssd.pcb': {
    title: 'M.2 PCB',
    summary: 'The 22 × 80 mm card that replaced whole 2.5-inch drives.',
    details:
      'The “2280” in M.2 2280 is simply the size: 22 mm wide, 80 mm long. With no case, no cables and no moving parts, the entire drive is a handful of chips on one small board that mounts flat on the motherboard.',
  },
  'ssd.contacts': {
    title: 'M.2 Edge Connector',
    summary: 'A direct PCIe link to the CPU — no adapter chips in between.',
    details:
      'These gold fingers carry four PCIe lanes straight to the processor. The notch position is the “key”: an M-key edge like this one signals PCIe ×4 NVMe. That direct connection is why NVMe drives are many times faster than SATA.',
  },
};
