import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * MİB komut çevrimi durum makinesi: Komut alma → çözme → operand alma →
 * yürütme → kesme sorgulama döngüsü. Aktif durum animasyonla ilerler.
 */
const STATES = [
  { id: 'fetch', label: 'Komut Alma', x: 140, y: 70, detail: 'Program sayacındaki adresten komut bellekten okunur.' },
  { id: 'decode', label: 'Komut Çözme', x: 380, y: 70, detail: 'Denetim birimi komutu yorumlar, gerekli denetim işaretlerini hazırlar.' },
  { id: 'operand', label: 'Operand Alma', x: 520, y: 170, detail: 'Komutun işleyeceği veriler (operandlar) saklayıcıdan ya da bellekten alınır.' },
  { id: 'execute', label: 'Yürütme', x: 380, y: 270, detail: 'ALU işlemi yapar; sonuç saklayıcıya veya belleğe yazılır.' },
  { id: 'interrupt', label: 'Kesme Sorgulama', x: 140, y: 270, detail: 'Bekleyen kesme var mı bakılır; varsa kesme çevrimine girilir, yoksa sıradaki komuta geçilir.' },
] as const;

const STEP_SECONDS = 1.4;

export default function CpuCycleViz() {
  const player = useVizPlayer();
  const step = Math.floor(player.t / STEP_SECONDS) % STATES.length;
  const active = STATES[step]!;

  return (
    <VizShell
      player={player}
      footer={
        <p>
          <strong style={{ color: VIZ.accent }}>{active.label}:</strong> {active.detail} Merkezi
          işlem birimi, sonlu durumlu bir makine gibi bu döngüde durmadan döner — saniyede
          milyarlarca kez.
        </p>
      }
    >
      <svg viewBox="0 0 660 340" role="img" aria-label="Komut çevrimi durum makinesi">
        <defs>
          <marker id="cc-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={VIZ.muted} />
          </marker>
        </defs>
        {/* geçiş okları */}
        {STATES.map((s, i) => {
          const n = STATES[(i + 1) % STATES.length]!;
          const dx = n.x - s.x;
          const dy = n.y - s.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const pad = 62;
          return (
            <line
              key={s.id}
              x1={s.x + ux * pad}
              y1={s.y + uy * (pad * 0.55)}
              x2={n.x - ux * pad}
              y2={n.y - uy * (pad * 0.55)}
              stroke={i === step ? VIZ.accent : VIZ.muted}
              strokeWidth={i === step ? 2.5 : 1.4}
              markerEnd="url(#cc-arrow)"
              opacity={i === step ? 1 : 0.5}
            />
          );
        })}
        {/* durumlar */}
        {STATES.map((s, i) => {
          const isActive = i === step;
          return (
            <g key={s.id}>
              <ellipse
                cx={s.x}
                cy={s.y}
                rx={78}
                ry={34}
                fill={isActive ? `${VIZ.accent}26` : VIZ.panel}
                stroke={isActive ? VIZ.accent : VIZ.border}
                strokeWidth={isActive ? 2.5 : 1}
              />
              {isActive && (
                <ellipse cx={s.x} cy={s.y} rx={86} ry={41} fill="none" stroke={VIZ.accent} strokeWidth={1} opacity={0.35} />
              )}
              <text
                x={s.x}
                y={s.y + 4.5}
                textAnchor="middle"
                fill={isActive ? VIZ.text : VIZ.muted}
                fontSize={13}
                fontWeight={700}
                fontFamily="Inter, sans-serif"
              >
                {s.label}
              </text>
            </g>
          );
        })}
        {/* kesme dallanması açıklaması */}
        <text x={330} y={328} textAnchor="middle" fill={VIZ.muted} fontSize={11.5} fontFamily="Inter, sans-serif">
          Kesme yoksa → sıradaki komutun alınmasına dönülür · Kesme varsa → kesme hazırlık işlemleri yapılır
        </text>
      </svg>
    </VizShell>
  );
}
