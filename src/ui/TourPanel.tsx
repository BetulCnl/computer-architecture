import { useEffect } from 'react';
import { tourChapters } from '@/content/story';
import { useApp } from '@/state/app';

/**
 * Guided tour overlay. Applying a chapter = setting component, explode,
 * simulation and camera pose through the stores — the same systems the free
 * lab uses, so the tour needs no special rendering path.
 */
export function TourPanel() {
  const tourIndex = useApp((s) => s.tourIndex);
  const setTourIndex = useApp((s) => s.setTourIndex);
  const exitTour = useApp((s) => s.exitTour);

  const chapter = tourIndex !== null ? tourChapters[tourIndex] : undefined;

  // apply the chapter to the world
  useEffect(() => {
    if (!chapter) return;
    const s = useApp.getState();
    if (s.activeComponent !== chapter.component) s.setActiveComponent(chapter.component);
    s.setExplode(chapter.explode);
    s.setSim(chapter.sim);
    s.setPose(chapter.camera);
  }, [chapter]);

  if (!chapter || tourIndex === null) return null;

  const isFirst = tourIndex === 0;
  const isLast = tourIndex === tourChapters.length - 1;

  return (
    <div className="tour">
      <div className="tour-progress">
        {tourChapters.map((c, i) => (
          <button
            key={c.id}
            type="button"
            aria-label={`Bölüm ${i + 1}`}
            className={`tour-dot${i === tourIndex ? ' active' : ''}`}
            onClick={() => setTourIndex(i)}
          />
        ))}
      </div>
      <h2 className="tour-title">{chapter.title}</h2>
      <p className="tour-body">{chapter.body}</p>
      <div className="tour-nav">
        <button type="button" className="tour-btn ghost" onClick={exitTour}>
          Turdan çık
        </button>
        <div className="tour-nav-right">
          <button
            type="button"
            className="tour-btn"
            disabled={isFirst}
            onClick={() => setTourIndex(tourIndex - 1)}
          >
            ← Geri
          </button>
          <button
            type="button"
            className="tour-btn primary"
            onClick={() => (isLast ? exitTour() : setTourIndex(tourIndex + 1))}
          >
            {isLast ? 'Bitir' : 'Sonraki →'}
          </button>
        </div>
      </div>
    </div>
  );
}
