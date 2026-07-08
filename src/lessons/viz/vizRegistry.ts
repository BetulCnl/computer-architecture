import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { VizId } from '@/lessons/types';

/**
 * Görselleştirme kayıt defteri — içerik dosyaları bileşenleri kimlikle
 * (VizId) referanslar; bileşenler tembel yüklenir ki ders paketleri ancak
 * gerektiğinde insin.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyViz = LazyExoticComponent<ComponentType<any>>;

export const vizRegistry: Record<VizId, AnyViz> = {
  'layered-model': lazy(() => import('./LayeredModelViz')),
  'cpu-cycle': lazy(() => import('./CpuCycleViz')),
  'von-neumann-harvard': lazy(() => import('./VonNeumannHarvardViz')),
  'performance-walls': lazy(() => import('./PerformanceWallsViz')),
  pipeline: lazy(() => import('./PipelineViz')),
  'branch-prediction': lazy(() => import('./BranchPredictionViz')),
  'bus-handshake': lazy(() => import('./BusHandshakeViz')),
  'bus-arbitration': lazy(() => import('./BusArbitrationViz')),
  'io-mapping': lazy(() => import('./IoMappingViz')),
  interrupt: lazy(() => import('./InterruptViz')),
  dma: lazy(() => import('./DmaViz')),
  'memory-hierarchy': lazy(() => import('./MemoryHierarchyViz')),
  'cache-mapping': lazy(() => import('./CacheMappingViz')),
  'write-policy': lazy(() => import('./WritePolicyViz')),
  'disk-geometry': lazy(() => import('./DiskGeometryViz')),
  raid: lazy(() => import('./RaidViz')),
  hamming: lazy(() => import('./HammingViz')),
  'virtual-memory': lazy(() => import('./VirtualMemoryViz')),
  multiprocessor: lazy(() => import('./MultiprocessorViz')),
  'cache-coherence': lazy(() => import('./CacheCoherenceViz')),
  amdahl: lazy(() => import('./AmdahlViz')),
  ieee754: lazy(() => import('./Ieee754Viz')),
};
