import { useApp } from '@/state/app';
import type { ComponentId } from '@/state/app';
import { InfoPanel } from '@/ui/InfoPanel';
import { TourPanel } from '@/ui/TourPanel';
import { useQuality } from '@/state/quality';
import type { QualityTier } from '@/state/quality';

const COMPONENTS: { id: ComponentId; label: string; title: string }[] = [
  { id: 'cpu', label: 'CPU', title: 'Merkezi İşlem Birimi' },
  { id: 'gpu', label: 'GPU', title: 'Ekran Kartı' },
  { id: 'ram', label: 'DDR5', title: 'DDR5 Bellek Modülü' },
  { id: 'ssd', label: 'SSD', title: 'NVMe Katı Hal Sürücüsü' },
  { id: 'motherboard', label: 'Anakart', title: 'ATX Anakart' },
  { id: 'cooler', label: 'Soğutucu', title: 'Kule Tipi Hava Soğutucu' },
];

/** 2D overlay: brand, component switcher, controls, info panel, tour. */
export function Hud() {
  const activeComponent = useApp((s) => s.activeComponent);
  const setActiveComponent = useApp((s) => s.setActiveComponent);
  const explode = useApp((s) => s.explode);
  const setExplode = useApp((s) => s.setExplode);
  const sim = useApp((s) => s.sim);
  const toggleSim = useApp((s) => s.toggleSim);
  const inTour = useApp((s) => s.tourIndex !== null);
  const startTour = useApp((s) => s.startTour);
  const tier = useQuality((s) => s.tier);
  const auto = useQuality((s) => s.auto);
  const setTier = useQuality((s) => s.setTier);
  const setAuto = useQuality((s) => s.setAuto);

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="brand">
          <span className="brand-name">bc</span>
        </div>
        {!inTour && (
          <nav className="switcher" aria-label="Bileşen seçici">
            {COMPONENTS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`switcher-btn${activeComponent === c.id ? ' active' : ''}`}
                title={c.title}
                onClick={() => setActiveComponent(c.id)}
              >
                {c.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {!inTour && <InfoPanel />}
      {inTour && <TourPanel />}

      {!inTour && (
        <div className="hud-bottom">
          <div className="panel controls-panel">
            <div className="control-group">
              <input
                id="explode"
                className="slider"
                type="range"
                aria-label="Patlatılmış görünüm"
                min={0}
                max={1}
                step={0.01}
                value={explode}
                onChange={(e) => setExplode(Number(e.target.value))}
              />
            </div>
            <button
              type="button"
              className={`sim-btn${sim ? ' active' : ''}`}
              onClick={toggleSim}
              title="Süreç simülasyonunu aç/kapat (Boşluk)"
            >
              {sim ? '■ Durdur' : '▶ Simüle Et'}
            </button>
            <button type="button" className="tour-start-btn" onClick={startTour}>
              ✦ Rehberli Tur
            </button>
          </div>

          <div className="panel quality">
            <label className="control-label" htmlFor="quality">
              Kalite {auto ? '(otomatik)' : ''}
            </label>
            <select
              id="quality"
              value={auto ? 'auto' : tier}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'auto') setAuto();
                else setTier(v as QualityTier);
              }}
            >
              <option value="auto">Otomatik</option>
              <option value="ultra">Ultra</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
