import { create } from 'zustand';

/** Hardware components the platform can display. */
export type ComponentId = 'cpu' | 'gpu' | 'ram' | 'ssd' | 'motherboard' | 'cooler';

/** Metadata of the currently selected logical part. */
export interface SelectedPart {
  id: string;
  name: string;
  contentKey: string;
}

/** World-space framing info captured at selection time (drives CameraDirector). */
export interface FocusTarget {
  center: [number, number, number];
  radius: number;
}

/** Explicit cinematic camera pose (guided tour chapters). */
export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

/** Ana görünüm: 3B donanım laboratuvarı ya da bir mimari dersi. */
export type ViewId = 'lab' | 'lesson';

interface AppState {
  /** hangi ana görünüm aktif */
  view: ViewId;
  /** lesson görünümünde açık olan dersin kimliği */
  activeLessonId: string | null;
  /** sol gezinme çubuğu açık mı (dar ekranlarda kapatılabilir) */
  sidebarOpen: boolean;
  activeComponent: ComponentId;
  /** 0 = assembled, 1 = fully exploded */
  explode: number;
  hovered: string | null;
  selected: SelectedPart | null;
  focus: FocusTarget | null;
  /** process animations (data flow, heat, fan spin-up) */
  sim: boolean;
  /** guided tour chapter index, or null when not touring */
  tourIndex: number | null;
  /** cinematic camera pose requested by the tour */
  pose: CameraPose | null;
  /** Laboratuvara geç; istenirse belli bir bileşene odaklan. */
  openLab: (component?: ComponentId) => void;
  /** Bir mimari dersini aç. */
  openLesson: (id: string) => void;
  toggleSidebar: () => void;
  setActiveComponent: (id: ComponentId) => void;
  setExplode: (value: number) => void;
  setHovered: (id: string | null) => void;
  select: (part: SelectedPart, focus: FocusTarget) => void;
  clearSelection: () => void;
  setSim: (on: boolean) => void;
  toggleSim: () => void;
  startTour: () => void;
  exitTour: () => void;
  setTourIndex: (index: number) => void;
  setPose: (pose: CameraPose | null) => void;
}

export const useApp = create<AppState>()((set) => ({
  view: 'lab',
  activeLessonId: null,
  sidebarOpen: true,
  activeComponent: 'cpu',
  explode: 0,
  hovered: null,
  selected: null,
  focus: null,
  sim: false,
  tourIndex: null,
  pose: null,
  openLab: (component) =>
    set((s) => ({
      view: 'lab',
      activeLessonId: null,
      tourIndex: null,
      pose: null,
      ...(component && component !== s.activeComponent
        ? { activeComponent: component, selected: null, focus: null, hovered: null, explode: 0 }
        : {}),
    })),
  openLesson: (activeLessonId) =>
    set({
      view: 'lesson',
      activeLessonId,
      tourIndex: null,
      pose: null,
      sim: false,
      selected: null,
      focus: null,
      hovered: null,
    }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActiveComponent: (activeComponent) =>
    set({ activeComponent, selected: null, focus: null, hovered: null, explode: 0 }),
  setExplode: (explode) => set({ explode }),
  setHovered: (hovered) => set({ hovered }),
  select: (selected, focus) => set({ selected, focus }),
  clearSelection: () => set({ selected: null, focus: null }),
  setSim: (sim) => set({ sim }),
  toggleSim: () => set((s) => ({ sim: !s.sim })),
  startTour: () => set({ tourIndex: 0, selected: null, focus: null, hovered: null }),
  exitTour: () => set({ tourIndex: null, pose: null, sim: false, explode: 0 }),
  setTourIndex: (tourIndex) => set({ tourIndex }),
  setPose: (pose) => set({ pose }),
}));
