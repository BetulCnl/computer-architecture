import { useEffect } from 'react';
import { tourChapters } from '@/content/story';
import { useApp } from '@/state/app';
import type { ComponentId } from '@/state/app';

const COMPONENT_ORDER: ComponentId[] = ['cpu', 'gpu', 'ram', 'ssd', 'motherboard', 'cooler'];

/**
 * Global keyboard shortcuts:
 *   1–6      switch component
 *   E        toggle exploded view
 *   Space    toggle process simulation
 *   ←/→      navigate tour chapters
 *   Escape   exit tour / clear selection
 */
export function useShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT')) return;

      const s = useApp.getState();
      const inTour = s.tourIndex !== null;

      switch (event.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6': {
          if (inTour) break;
          const id = COMPONENT_ORDER[Number(event.key) - 1];
          if (id) s.setActiveComponent(id);
          break;
        }
        case 'e':
        case 'E':
          s.setExplode(s.explode > 0.5 ? 0 : 1);
          break;
        case ' ':
          event.preventDefault();
          s.toggleSim();
          break;
        case 'ArrowRight':
          if (inTour && s.tourIndex !== null && s.tourIndex < tourChapters.length - 1) {
            s.setTourIndex(s.tourIndex + 1);
          }
          break;
        case 'ArrowLeft':
          if (inTour && s.tourIndex !== null && s.tourIndex > 0) {
            s.setTourIndex(s.tourIndex - 1);
          }
          break;
        case 'Escape':
          if (inTour) s.exitTour();
          else s.clearSelection();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
