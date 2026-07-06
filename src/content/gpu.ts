import type { PartContent } from '@/content/cpu';

export const gpuContent: Record<string, PartContent> = {
  'gpu.die': {
    title: 'GPU Die',
    summary: 'Thousands of small cores built for massively parallel math.',
    details:
      'Where a CPU has a handful of powerful cores, a GPU die packs thousands of simpler ones that all execute at once. Rendering a frame means running the same math on millions of pixels — exactly the kind of workload this architecture devours. The same parallelism now trains AI models.',
  },
  'gpu.vram': {
    title: 'GDDR Memory',
    summary: 'Ultra-wide, ultra-fast memory ringed around the die.',
    details:
      'Graphics memory trades latency for staggering bandwidth: textures and frame data stream over a bus hundreds of bits wide at terabytes per second. The chips encircle the die because at these speeds every millimeter of trace length matters.',
  },
  'gpu.vrm': {
    title: 'Power Delivery (VRM)',
    summary: 'Converts 12 V into hundreds of amps at ~1 V for the die.',
    details:
      'A modern GPU can draw 300+ watts at around one volt — that is hundreds of amps. The VRM splits this load across many phases, each with a choke (the metal cubes) and capacitors, switching millions of times per second to keep the voltage rock-stable under wild load swings.',
  },
  'gpu.heatsink': {
    title: 'Heatsink Fins',
    summary: 'A dense aluminum radiator hidden under the shroud.',
    details:
      'Heat from the die and memory is spread through a vapor chamber or heatpipes into this fin array. The fins convert a small, intensely hot spot into a large, mildly warm surface that airflow can actually cool.',
  },
  'gpu.fans': {
    title: 'Axial Fans',
    summary: 'Push air through the fins and out of the card.',
    details:
      'The fans force air between the heatsink fins and exhaust it through the card. Most modern cards stop the fans entirely at idle for silence, and some alternate fan spin directions to reduce turbulence between adjacent blades.',
  },
  'gpu.shroud': {
    title: 'Cooler Shroud',
    summary: 'Channels airflow — and defines the card’s look.',
    details:
      'The plastic shroud ducts the fans’ airflow through the fins instead of letting it spill sideways. It is also the card’s face: industrial design, lighting and branding live here, wrapped around what is essentially a big radiator.',
  },
  'gpu.pcb': {
    title: 'Graphics PCB',
    summary: 'A dense multi-layer board — a computer within your computer.',
    details:
      'The GPU board carries its own processor, its own memory and its own power delivery: a complete computer that talks to the host over PCIe. High-end cards use 12+ copper layers to route thousands of high-speed connections in a palm-width space.',
  },
  'gpu.pcie': {
    title: 'PCIe Connector',
    summary: 'The ×16 slot link — the card’s data lifeline.',
    details:
      'Sixteen PCIe lanes connect the card to the CPU, moving tens of gigabytes per second. Commands, textures and compute data all cross this edge. The connector supplies 75 W too; anything beyond that arrives through the auxiliary power cables.',
  },
  'gpu.backplate': {
    title: 'Backplate',
    summary: 'Stiffens the card and sinks a little heat.',
    details:
      'Heavy coolers can flex a long PCB over time, stressing solder joints. The metal backplate acts as a spine, often with thermal pads pulling warmth from the memory and VRM on the board’s rear face.',
  },
  'gpu.bracket': {
    title: 'I/O Bracket',
    summary: 'Anchors the card to the case and exposes display outputs.',
    details:
      'The bracket screws into the chassis, supporting the card’s weight and aligning its DisplayPort/HDMI outputs with the case cutout. On many cards it is also part of the exhaust path for warm air.',
  },
};
