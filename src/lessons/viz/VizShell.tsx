import type { ReactNode } from 'react';
import type { VizPlayer } from '@/lessons/viz/useVizPlayer';

/**
 * Görselleştirmelerin ortak çerçevesi: oynat/duraklat, hız ve sıfırlama
 * denetimleri + isteğe bağlı kip (mode) seçici. Tüm vizlerde aynı görsel dil.
 */
export function VizShell({
  player,
  children,
  modes,
  mode,
  onMode,
  footer,
}: {
  player?: VizPlayer;
  children: ReactNode;
  /** kip anahtarı → etiket */
  modes?: { id: string; label: string }[];
  mode?: string;
  onMode?: (id: string) => void;
  footer?: ReactNode;
}) {
  return (
    <div className="viz">
      {(player || modes) && (
        <div className="viz-controls">
          {player && (
            <div className="viz-controls-left">
              <button type="button" className="viz-btn" onClick={player.toggle}>
                {player.playing ? '⏸ Duraklat' : '▶ Oynat'}
              </button>
              <button type="button" className="viz-btn ghost" onClick={player.reset}>
                ↺ Baştan
              </button>
              <label className="viz-speed">
                Hız
                <select
                  value={player.speed}
                  onChange={(e) => player.setSpeed(Number(e.target.value))}
                >
                  <option value={0.5}>0,5×</option>
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                </select>
              </label>
            </div>
          )}
          {modes && (
            <div className="viz-modes" role="tablist">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === m.id}
                  className={`viz-mode${mode === m.id ? ' active' : ''}`}
                  onClick={() => onMode?.(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="viz-body">{children}</div>
      {footer && <div className="viz-footer">{footer}</div>}
    </div>
  );
}

/** Vizlerde ortak SVG renk paleti — global.css değişkenleriyle uyumlu. */
export const VIZ = {
  bg: '#0d1017',
  panel: '#12161f',
  border: 'rgba(255,255,255,0.09)',
  text: '#e8eaf0',
  muted: '#8a90a0',
  accent: '#4f8cff',
  accentSoft: 'rgba(79,140,255,0.18)',
  green: '#3ecf8e',
  amber: '#ffb45e',
  red: '#ff6b6b',
  purple: '#b48cff',
  cyan: '#4fd7ff',
} as const;
