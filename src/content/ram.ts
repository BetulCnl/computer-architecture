import type { PartContent } from '@/content/cpu';

export const ramContent: Record<string, PartContent> = {
  'ram.spreader': {
    title: 'Heatspreader',
    summary: 'Aluminum shell that cools the memory chips — and looks good doing it.',
    details:
      'DDR5 modules draw more power than previous generations, and the on-module power circuitry adds extra heat. The aluminum shell wicks warmth away from the DRAM packages and spreads it into the case airflow. On many consumer modules it also doubles as styling and RGB mounting.',
  },
  'ram.chips': {
    title: 'DRAM Packages',
    summary: 'The chips that store your running programs — billions of tiny capacitors.',
    details:
      'Each package contains DRAM dies where every bit is a microscopic capacitor that leaks its charge in milliseconds. The memory controller must refresh every cell thousands of times per second — that is why RAM forgets everything when power is cut. Chips on both faces double the module capacity.',
  },
  'ram.pmic': {
    title: 'Power Management IC (PMIC)',
    summary: 'DDR5 moved voltage regulation from the motherboard onto the module itself.',
    details:
      'This is the defining change of DDR5: a PMIC on each module converts the 5 V input into the precise low voltages the DRAM needs. Local regulation means cleaner power, better signal integrity at high speeds, and per-module control that motherboards could never achieve.',
  },
  'ram.pcb': {
    title: 'Module PCB',
    summary: 'A precision-routed board where every trace length is matched.',
    details:
      'At DDR5 speeds, signals travel so fast that a few millimeters of extra trace length would skew data timing. The PCB routes every data line with matched lengths — the wiggly traces on real modules are deliberate delay-matching, not decoration.',
  },
  'ram.contacts': {
    title: 'Edge Connector',
    summary: '288 gold-plated fingers carrying data at billions of transfers per second.',
    details:
      'The module edge plugs directly into the DIMM slot. DDR5 keeps 288 pins but re-arranges them into two independent 32-bit channels per module. The off-center notch prevents inserting the module backwards or into a DDR4 slot.',
  },
};
