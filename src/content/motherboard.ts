import type { PartContent } from '@/content/cpu';

export const motherboardContent: Record<string, PartContent> = {
  'mb.pcb': {
    title: 'Motherboard PCB',
    summary: 'The nervous system connecting every component.',
    details:
      'Six to eight copper layers route thousands of traces: high-speed PCIe and memory lanes, power planes and control signals. Every component in the PC ultimately communicates through this board — its layout quality decides how fast and stable the whole system can run.',
  },
  'mb.socket': {
    title: 'CPU Socket',
    summary: 'Over a thousand spring pins that mate with the CPU’s pads.',
    details:
      'In an LGA socket, delicate spring-loaded pins live here rather than on the CPU. The retention frame presses the processor down with carefully calibrated force so every pin makes contact. One bent pin can disable a whole memory channel — hence the protective cover on new boards.',
  },
  'mb.vrm': {
    title: 'VRM Heatsinks',
    summary: 'Cooling for the circuitry that feeds the CPU hundreds of amps.',
    details:
      'Beneath these heatsinks, the voltage regulator module converts 12 V into the ~1 V the CPU needs — at enormous current. The MOSFETs doing that switching get hot enough to throttle without cooling; beefier VRM cooling is a genuine reason high-end boards cost more.',
  },
  'mb.dimm': {
    title: 'DDR5 DIMM Slots',
    summary: 'Four channels of contact between CPU and memory.',
    details:
      'Memory slots connect straight to the memory controller inside the CPU — the chipset is not involved. Slot pairs share channels, which is why the manual tells you exactly which slots to fill first: the right pairing enables dual-channel bandwidth.',
  },
  'mb.pcie': {
    title: 'PCIe Slots',
    summary: 'Expansion lanes for GPUs and add-in cards.',
    details:
      'The reinforced top slot usually wires ×16 lanes directly to the CPU for the graphics card; lower slots often route through the chipset. Each PCIe generation doubles per-lane speed, and slots are backwards compatible — an old card works in a new slot and vice versa.',
  },
  'mb.chipset': {
    title: 'Chipset',
    summary: 'The CPU’s I/O deputy, hiding under this heatsink.',
    details:
      'The chipset fans out connectivity the CPU doesn’t handle directly: extra PCIe lanes, SATA ports, USB, networking. It links to the CPU through a dedicated high-speed connection and quietly runs warm enough to need its own heatsink.',
  },
  'mb.m2': {
    title: 'M.2 Slot & Shield',
    summary: 'Where the NVMe SSD mounts flat against the board.',
    details:
      'The M.2 slot delivers PCIe lanes to a drive screwed flat onto the board — no cables at all. The aluminum shield above it is a heatsink: fast NVMe drives can thermally throttle during long transfers without one.',
  },
  'mb.io': {
    title: 'Rear I/O',
    summary: 'The port cluster that faces out the back of the case.',
    details:
      'USB, networking, audio and display outputs gather at this edge, under a decorative shroud. The design goal is cable-free reach to the outside world while keeping all high-speed routing as short as possible to the CPU and chipset.',
  },
  'mb.power': {
    title: 'Power & Storage Headers',
    summary: '24-pin ATX power in, SATA data out.',
    details:
      'The tall 24-pin connector is the board’s main power feed from the PSU, carrying 12 V, 5 V and 3.3 V rails. The right-angle SATA ports nearby serve 2.5-inch drives and hard disks — older tech than NVMe, but still everywhere.',
  },
  'mb.caps': {
    title: 'Capacitors',
    summary: 'Tiny energy reservoirs smoothing every voltage rail.',
    details:
      'Solid polymer capacitors buffer the board’s power rails against microsecond-scale demand spikes. Their quality determines a motherboard’s lifespan — the “capacitor plague” of the early 2000s killed millions of boards and made solid caps the standard.',
  },
  'mb.battery': {
    title: 'CMOS Battery',
    summary: 'A coin cell that remembers time and settings when unplugged.',
    details:
      'This CR2032 keeps the real-time clock ticking and preserves firmware settings while the PC is disconnected from power. It lasts years — and popping it out remains the classic way to reset a misbehaving BIOS.',
  },
};
