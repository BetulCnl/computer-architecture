import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Paralelleştirmenin sınırı (Amdahl yasası) — interaktif.
 * Programın paralelleştirilebilen oranı p kaydırılır; işlemci sayısına göre
 * hızlanma eğrisi çizilir: S = 1 / ((1-p) + p/n).
 */
export default function AmdahlViz() {
  const [p, setP] = useState(0.9);

  const W = 660;
  const H = 300;
  const M = { l: 64, r: 24, t: 24, b: 46 };
  const maxN = 64;
  const maxS = 24;
  const X = (n: number) => M.l + (Math.log2(n) / Math.log2(maxN)) * (W - M.l - M.r);
  const Y = (s: number) => H - M.b - (Math.min(s, maxS) / maxS) * (H - M.t - M.b);
  const speedup = (n: number) => 1 / (1 - p + p / n);

  const pts = Array.from({ length: 61 }, (_, i) => {
    const n = Math.pow(2, (i / 60) * 6);
    return `${i === 0 ? 'M' : 'L'}${X(n).toFixed(1)},${Y(speedup(n)).toFixed(1)}`;
  }).join(' ');

  const limit = 1 / (1 - p);

  return (
    <VizShell
      footer={
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 10 }}>
              Paralelleştirilebilen oran p:
              <input
                type="range"
                min={0.5}
                max={0.99}
                step={0.01}
                value={p}
                onChange={(e) => setP(Number(e.target.value))}
                className="slider"
                style={{ width: 180 }}
              />
              <strong style={{ color: VIZ.accent, fontFamily: 'JetBrains Mono, monospace' }}>
                %{Math.round(p * 100)}
              </strong>
            </label>
          </div>
          <p>
            Programın %{Math.round((1 - p) * 100)}&apos;i sıralı kalırsa, işlemci sayısı ne kadar
            artarsa artsın hızlanma <strong>{limit.toFixed(1)}×</strong> değerini aşamaz. Bu yüzden
            &quot;işleri her zaman paralel alt işlemlere bölmek mümkün değildir&quot; — çok
            çekirdeğin sınırlarından biri budur; iletişim ve senkronizasyon yükleri gerçek hızlanmayı
            daha da düşürür.
          </p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Amdahl yasası eğrisi">
        <line x1={M.l} y1={M.t} x2={M.l} y2={H - M.b} stroke={VIZ.border} />
        <line x1={M.l} y1={H - M.b} x2={W - M.r} y2={H - M.b} stroke={VIZ.border} />
        {[1, 2, 4, 8, 16, 32, 64].map((n) => (
          <g key={n}>
            <text x={X(n)} y={H - M.b + 18} textAnchor="middle" fill={VIZ.muted} fontSize={10.5} fontFamily="JetBrains Mono, monospace">
              {n}
            </text>
            <line x1={X(n)} y1={H - M.b} x2={X(n)} y2={M.t} stroke={VIZ.border} opacity={0.3} />
          </g>
        ))}
        {[1, 4, 8, 12, 16, 20, 24].map((s) => (
          <g key={s}>
            <text x={M.l - 8} y={Y(s) + 4} textAnchor="end" fill={VIZ.muted} fontSize={10.5} fontFamily="JetBrains Mono, monospace">
              {s}×
            </text>
            <line x1={M.l} y1={Y(s)} x2={W - M.r} y2={Y(s)} stroke={VIZ.border} opacity={0.3} />
          </g>
        ))}
        <text x={(W + M.l - M.r) / 2} y={H - 8} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
          işlemci sayısı (n, logaritmik)
        </text>
        <text x={20} y={(H - M.b + M.t) / 2} textAnchor="middle" fill={VIZ.muted} fontSize={11} transform={`rotate(-90 20 ${(H - M.b + M.t) / 2})`}>
          hızlanma S
        </text>
        {/* teorik üst sınır */}
        {limit <= maxS && (
          <>
            <line x1={M.l} y1={Y(limit)} x2={W - M.r} y2={Y(limit)} stroke={VIZ.red} strokeWidth={1.6} strokeDasharray="6 4" />
            <text x={W - M.r - 4} y={Y(limit) - 6} textAnchor="end" fill={VIZ.red} fontSize={11} fontWeight={700}>
              üst sınır: {limit.toFixed(1)}×
            </text>
          </>
        )}
        {/* ideal doğrusal */}
        <path d={`M${X(1)},${Y(1)} L${X(maxS)},${Y(maxS)}`} stroke={VIZ.muted} strokeWidth={1.4} strokeDasharray="4 4" fill="none" />
        <text x={X(17)} y={Y(21)} fill={VIZ.muted} fontSize={10.5}>
          ideal (doğrusal)
        </text>
        {/* gerçek eğri */}
        <path d={pts} stroke={VIZ.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
        {[2, 4, 8, 16, 32, 64].map((n) => (
          <circle key={n} cx={X(n)} cy={Y(speedup(n))} r={4} fill={VIZ.accent} stroke="#fff" strokeWidth={1} />
        ))}
      </svg>
    </VizShell>
  );
}
