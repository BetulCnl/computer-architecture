import { useApp } from '@/state/app';
import type { ComponentId } from '@/state/app';
import { lessonEntries } from '@/lessons/registry';

const HARDWARE: { id: ComponentId; label: string }[] = [
  { id: 'cpu', label: 'İşlemci (CPU)' },
  { id: 'gpu', label: 'Ekran Kartı (GPU)' },
  { id: 'ram', label: 'Bellek (DDR5)' },
  { id: 'ssd', label: 'NVMe SSD' },
  { id: 'motherboard', label: 'Anakart' },
  { id: 'cooler', label: 'Soğutucu' },
];

/**
 * Sol gezinme çubuğu — iki ana kategori:
 *  · Donanım Laboratuvarı: mevcut interaktif 3B modeller
 *  · Bilgisayar Mimarisi: itu_dersNotlari'ndan üretilen interaktif dersler
 */
export function Sidebar() {
  const view = useApp((s) => s.view);
  const activeComponent = useApp((s) => s.activeComponent);
  const activeLessonId = useApp((s) => s.activeLessonId);
  const sidebarOpen = useApp((s) => s.sidebarOpen);
  const openLab = useApp((s) => s.openLab);
  const openLesson = useApp((s) => s.openLesson);
  const toggleSidebar = useApp((s) => s.toggleSidebar);
  const inTour = useApp((s) => s.tourIndex !== null);

  if (inTour) return null;

  return (
    <>
      <button
        type="button"
        className={`sidebar-toggle${sidebarOpen ? ' open' : ''}`}
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        title={sidebarOpen ? 'Menüyü kapat' : 'Menüyü aç'}
      >
        {sidebarOpen ? '‹' : '☰'}
      </button>
      <nav className={`sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Ana gezinme">
        <div className="sidebar-brand">
          <span className="brand-name">
            Pc<em>RL</em>
          </span>
          <span className="brand-tag">İnteraktif Donanım ve Mimari</span>
        </div>

        <div className="sidebar-section">
          <h2 className="sidebar-heading">Donanım Laboratuvarı</h2>
          <ul className="sidebar-list">
            {HARDWARE.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`sidebar-item${view === 'lab' && activeComponent === c.id ? ' active' : ''}`}
                  onClick={() => openLab(c.id)}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h2 className="sidebar-heading">Bilgisayar Mimarisi</h2>
          <ul className="sidebar-list">
            {lessonEntries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className={`sidebar-item lesson${
                    view === 'lesson' && activeLessonId === entry.id ? ' active' : ''
                  }${entry.ready ? '' : ' draft'}`}
                  onClick={() => openLesson(entry.id)}
                  title={entry.ready ? entry.title : `${entry.title} — içerik hazırlanıyor`}
                >
                  <span className="lesson-no">{String(entry.order).padStart(2, '0')}</span>
                  <span className="lesson-title">{entry.title}</span>
                  {!entry.ready && <span className="lesson-badge">Hazırlanıyor</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="sidebar-footnote">
          Ders içerikleri, İTÜ Bilgisayar Mühendisliği &quot;Bilgisayar Mimarisi&quot; ders
          notlarından (Feza Buzluca) derlenmiştir.
        </p>
      </nav>
    </>
  );
}
