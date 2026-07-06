/**
 * Educational content for the CPU model, keyed by PartNode.contentKey.
 * Content lives here — never in components — so it can be reviewed,
 * extended and localized independently of rendering code.
 */
export interface PartContent {
  title: string;
  summary: string;
  details: string;
}

export const cpuContent: Record<string, PartContent> = {
  'cpu.ihs': {
    title: 'Integrated Heat Spreader (IHS)',
    summary: 'The nickel-plated copper lid that protects the die and spreads heat.',
    details:
      'The IHS distributes the intense, concentrated heat of the silicon die across a larger surface so the cooler can absorb it. It also physically protects the fragile die from mounting pressure. On modern CPUs it is soldered to the die with indium for better thermal transfer.',
  },
  'cpu.paste': {
    title: 'Thermal Interface Material (TIM)',
    summary: 'Fills microscopic gaps between the die and the heat spreader.',
    details:
      'Even polished metal surfaces have microscopic valleys that trap insulating air. TIM — solder or thermal paste — fills those gaps so heat can flow efficiently from the die into the IHS. Without it, a modern CPU would overheat in seconds.',
  },
  'cpu.die': {
    title: 'Silicon Die',
    summary: 'The actual processor: billions of transistors on a fingernail-sized chip.',
    details:
      'The die is cut from a silicon wafer and contains the CPU cores, cache memory and I/O logic — billions of transistors a few nanometers wide. The rainbow shimmer you see on real dies comes from light diffracting off the nanoscale circuit layers.',
  },
  'cpu.smds': {
    title: 'SMD Capacitors',
    summary: 'Tiny capacitors that smooth the power reaching the die.',
    details:
      'A CPU switches billions of times per second, causing sharp spikes in current demand. These multilayer ceramic capacitors sit as close to the die as possible and act as microscopic power reservoirs, keeping the supply voltage stable.',
  },
  'cpu.substrate': {
    title: 'Package Substrate',
    summary: 'A miniature circuit board connecting the die to the motherboard.',
    details:
      'The substrate is a multi-layer PCB that fans out the die’s thousands of microscopic connections to the larger contact pads on the bottom. Signal and power routing through the substrate is engineered as carefully as the chip itself.',
  },
  'cpu.pads': {
    title: 'LGA Contact Pads',
    summary: 'Gold-plated pads that mate with the spring pins in the socket.',
    details:
      'In a Land Grid Array (LGA) package the pins live in the motherboard socket, and the CPU carries flat gold-plated pads — over a thousand of them. Gold is used because it does not oxidize, guaranteeing a reliable connection for years.',
  },
};
