# PcRL — Interactive 3D Hardware Lab

**🌐 Canlı site: [betulcnl.github.io/computer-architecture](https://betulcnl.github.io/computer-architecture/)**

A production-grade, interactive 3D education platform for PC hardware. Every model — CPU, GPU, DDR5 RAM, NVMe SSD, ATX motherboard, tower cooler — is **generated procedurally in Three.js**: no GLB/FBX files, no downloaded assets, no external HDRIs. The entire experience ships as a static SPA.

## Features

- **Explorable lab** — orbit six hardware components, hover to highlight, click any part for an annotated close-up and educational panel (35+ content cards)
- **Exploded views** — spring-animated layer separation on every model (`E` or the slider)
- **Process simulations** — HDR particle streams visualize data flow (SSD→NAND, PCIe→GPU die→VRAM, RAM↔CPU) and heat rising through the cooler; fans spin up (`Space`)
- **Guided tour** — a 9-chapter cinematic story ("the life of your data") with automated camera choreography
- **Adaptive quality** — `ultra/high/medium/low` tiers (DPR, shadows, postprocessing, env resolution) auto-tuned by a performance monitor, user-overridable
- **Keyboard shortcuts** — `1–6` switch component, `E` explode, `Space` simulate, `←/→` tour navigation, `Esc` close/exit

## Stack

React 19 · React Three Fiber 9 · drei · @react-three/postprocessing · zustand · maath · TypeScript (strict) · Vite · Vitest · ESLint

## Architecture

```
src/
  core/        geometry utils (roundedBox, grids, instance matrices), Stage (procedural
               Lightformer environment — no HDR downloads), Effects (selective bloom)
  materials/   shared PBR singletons (+ emissive highlight variants for hover/select)
  models/      one pure generator per component → { parts, nodes, flows, boundingRadius }
               ModelView renders ANY generated model with full interactivity
  systems/     CameraDirector — single owner of all camera motion (focus + cinematic)
  state/       zustand stores: app (selection/explode/sim/tour), quality (tiers)
  ui/          HUD overlay, info panel, tour panel, keyboard shortcuts
  content/     educational text + tour chapters, keyed by PartNode.contentKey
```

**The PartsGraph contract**: every logical part carries `{ id, name, contentKey, explodeVector, annotationAnchor }`. The explode system, annotations, camera focus and content panels all key off this single structure — adding a new hardware model means writing one generator function and one content file; interactivity is free.

## Development

```bash
npm install
npm run dev        # Vite dev server
npm run test       # Vitest — generator integrity contract for all 6 models
npm run lint       # ESLint (typescript-eslint)
npm run build      # tsc strict + production bundle
```

## Performance notes

- Repeated geometry (1,200 LGA pads, fin stacks, VRAM, fan blades) uses `InstancedMesh`
- Materials are app-wide singletons — switching models never recompiles shaders
- No per-frame allocations in `useFrame`; all temp vectors/matrices are module-level
- Bloom is selective by construction: only HDR (`toneMapped: false`) flow particles exceed the luminance threshold
