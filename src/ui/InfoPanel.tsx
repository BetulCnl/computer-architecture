import { useApp } from '@/state/app';
import { getContent } from '@/content';

/** Slide-in education panel for the selected part. */
export function InfoPanel() {
  const selected = useApp((s) => s.selected);
  const clearSelection = useApp((s) => s.clearSelection);
  const content = selected ? getContent(selected.contentKey) : null;

  return (
    <aside className={`info-panel${content ? ' open' : ''}`} aria-hidden={!content}>
      {content && (
        <>
          <button
            type="button"
            className="info-close"
            onClick={clearSelection}
            aria-label="Paneli kapat"
          >
            ×
          </button>
          <h2 className="info-title">{content.title}</h2>
          <p className="info-summary">{content.summary}</p>
          <p className="info-details">{content.details}</p>
        </>
      )}
    </aside>
  );
}
