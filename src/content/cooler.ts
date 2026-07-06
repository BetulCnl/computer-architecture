import type { PartContent } from '@/content/cpu';

export const coolerContent: Record<string, PartContent> = {
  'cooler.base': {
    title: 'Cold Plate',
    summary: 'Polished copper that presses directly against the CPU.',
    details:
      'The copper base is machined flat to fractions of a millimeter and clamps onto the CPU heat spreader with thermal paste in between. Copper is used here because it conducts heat almost twice as well as aluminum — the heat must enter the cooler as fast as possible.',
  },
  'cooler.pipes': {
    title: 'Heatpipes',
    summary: 'Sealed copper tubes that move heat using evaporating liquid.',
    details:
      'Each pipe contains a small amount of fluid in a vacuum. At the hot base it evaporates, races up the pipe as vapor, condenses at the cool end and returns through a capillary wick — a self-pumping cycle with no moving parts that transfers heat far better than solid metal.',
  },
  'cooler.fins': {
    title: 'Fin Stack',
    summary: 'Dozens of aluminum fins turn the tower into a huge radiator.',
    details:
      'The fins exist to maximize surface area — unfolded, this stack would cover square meters. Heat spreads from the heatpipes into each fin, and the fan pushes air between them to carry it away. Fin spacing is a tuned compromise between surface area and airflow resistance.',
  },
  'cooler.fan': {
    title: 'Cooling Fan',
    summary: 'Pushes a steady stream of air through the fin stack.',
    details:
      'The fan creates the pressure difference that forces air between the fins. Blade shape, count and pitch are engineered to move maximum air at minimum noise, and PWM control lets the motherboard spin it anywhere from silent idle to full blast under load.',
  },
};
