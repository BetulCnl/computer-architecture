import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { LabScene } from '@/scenes/LabScene';
import { Hud } from '@/ui/Hud';
import { Sidebar } from '@/ui/Sidebar';
import { LessonView } from '@/lessons/LessonView';
import { lessonEntries } from '@/lessons/registry';
import { useQualityPreset } from '@/state/quality';
import { useApp } from '@/state/app';
import { useShortcuts } from '@/ui/useShortcuts';

/** URL karması ↔ görünüm eşitlemesi: #/ders/<id> paylaşılabilir bağlantı verir. */
function useHashRoute() {
  const view = useApp((s) => s.view);
  const activeLessonId = useApp((s) => s.activeLessonId);

  // ilk yüklemede karmayı uygula
  useEffect(() => {
    const match = /^#\/ders\/(.+)$/.exec(window.location.hash);
    if (match?.[1] && lessonEntries.some((e) => e.id === match[1])) {
      useApp.getState().openLesson(match[1]);
    }
  }, []);

  // görünüm değişince karmayı güncelle
  useEffect(() => {
    const hash = view === 'lesson' && activeLessonId ? `#/ders/${activeLessonId}` : '#/lab';
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }, [view, activeLessonId]);
}

export default function App() {
  const preset = useQualityPreset();
  const view = useApp((s) => s.view);
  const sidebarOpen = useApp((s) => s.sidebarOpen);
  useShortcuts();
  useHashRoute();

  return (
    <div className={`app${sidebarOpen ? ' with-sidebar' : ''}`}>
      <Sidebar />
      <main className="app-main">
        {view === 'lab' ? (
          <>
            <Canvas
              shadows={preset.shadows}
              dpr={preset.dpr}
              camera={{ position: [5.2, 3.6, 6.6], fov: 40, near: 0.1, far: 100 }}
              gl={{
                antialias: true,
                powerPreference: 'high-performance',
                toneMapping: ACESFilmicToneMapping,
              }}
              onPointerMissed={() => useApp.getState().clearSelection()}
            >
              <Suspense fallback={null}>
                <LabScene />
              </Suspense>
            </Canvas>
            <Hud />
          </>
        ) : (
          <LessonView />
        )}
      </main>
    </div>
  );
}
