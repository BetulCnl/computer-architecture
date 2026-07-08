import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * İşlemci performansını sınırlayan etkenler: Moore yasası, güç engeli ve
 * işlemci-bellek hız makası. Stilize (şematik) eğriler — büyüklükler logaritmik
 * ruhludur, birebir ölçekli değildir.
 */
const MODES = [
  { id: 'moore', label: 'Moore Yasası' },
  { id: 'power', label: 'Güç Engeli' },
  { id: 'gap', label: 'İşlemci–Bellek Makası' },
];

export default function PerformanceWallsViz() {
  const [mode, setMode] = useState('moore');

  const W = 660;
  const H = 300;
  const M = { l: 70, r: 24, t: 28, b: 46 };
  const plotW = W - M.l - M.r;
  const plotH = H - M.t - M.b;
  const X = (u: number) => M.l + u * plotW;
  const Y = (u: number) => M.t + (1 - u) * plotH;

  const path = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ');

  const years = { moore: ['1971', '1985', '2000', '2015', '2025'], power: ['1990', '2000', '2004', '2015', '2020'], gap: ['1980', '1990', '2000', '2010', '2020'] }[
    mode
  ]!;

  return (
    <VizShell
      modes={MODES}
      mode={mode}
      onMode={setMode}
      footer={
        mode === 'moore' ? (
          <p>
            <strong>Moore yasası (1965):</strong> Bir yongaya sığan transistör sayısı yaklaşık her
            18–24 ayda ikiye katlanır. ~50 yıl geçerli kaldı; günümüzde artış hızı düşüyor ve
            yasanın 2025 civarında sona ereceği öngörülüyor.
          </p>
        ) : mode === 'power' ? (
          <p>
            Dinamik güç <code>P ~ V²f</code> ile orantılıdır. 2003–2004 civarında yonga başına güç
            200 W&apos;ı aşınca soğutma ekonomik olmaktan çıktı: <strong>saat hızı artışından
            vazgeçildi</strong>, transistörler çok çekirdeğe harcanmaya başlandı (Dennard
            ölçeklemesinin sonu).
          </p>
        ) : (
          <p>
            İşlemcilerin erişim hızı bellekten çok daha hızlı gelişti; aradaki makas her yıl
            açıldı. Bu açığı kapatmak için <strong>cep bellek (cache)</strong>, geniş veri yolları
            ve paralel bellek erişimi kullanılır — 6. dersin ana konusu.
          </p>
        )
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Performans eğrileri">
        {/* eksenler */}
        <line x1={M.l} y1={M.t} x2={M.l} y2={H - M.b} stroke={VIZ.border} />
        <line x1={M.l} y1={H - M.b} x2={W - M.r} y2={H - M.b} stroke={VIZ.border} />
        {years.map((y, i) => (
          <text key={y} x={X(i / (years.length - 1))} y={H - M.b + 20} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
            {y}
          </text>
        ))}

        {mode === 'moore' && (
          <>
            <text x={30} y={H / 2} textAnchor="middle" fill={VIZ.muted} fontSize={11} transform={`rotate(-90 30 ${H / 2})`}>
              transistör sayısı (log)
            </text>
            <path
              d={path([[0, 0.04], [0.25, 0.22], [0.5, 0.45], [0.75, 0.68], [0.88, 0.8], [1, 0.86]])}
              fill="none"
              stroke={VIZ.accent}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path
              d={path([[0.75, 0.68], [0.88, 0.86], [1, 1]])}
              fill="none"
              stroke={VIZ.muted}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <text x={X(0.8)} y={Y(0.98)} fill={VIZ.muted} fontSize={11}>
              yasanın öngörüsü
            </text>
            <text x={X(0.62)} y={Y(0.42)} fill={VIZ.accent} fontSize={11.5} fontWeight={700}>
              gerçekleşen (yavaşlıyor)
            </text>
            <circle cx={X(0.04)} cy={Y(0.06)} r={4} fill={VIZ.amber} />
            <text x={X(0.06)} y={Y(0.1)} fill={VIZ.amber} fontSize={11}>
              Intel 4004 · 2300 transistör
            </text>
          </>
        )}

        {mode === 'power' && (
          <>
            <text x={30} y={H / 2} textAnchor="middle" fill={VIZ.muted} fontSize={11} transform={`rotate(-90 30 ${H / 2})`}>
              saat hızı / güç
            </text>
            {/* saat hızı: hızlı yükseliş, sonra plato */}
            <path
              d={path([[0, 0.08], [0.2, 0.2], [0.4, 0.52], [0.5, 0.72], [0.6, 0.76], [0.8, 0.77], [1, 0.78]])}
              fill="none"
              stroke={VIZ.accent}
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* güç eğrisi duvara çarpar */}
            <path
              d={path([[0, 0.04], [0.3, 0.18], [0.45, 0.5], [0.5, 0.92]])}
              fill="none"
              stroke={VIZ.red}
              strokeWidth={2.5}
              strokeDasharray="6 4"
            />
            <line x1={X(0.5)} y1={M.t} x2={X(0.5)} y2={H - M.b} stroke={VIZ.red} strokeWidth={1.5} opacity={0.55} />
            <text x={X(0.51)} y={M.t + 14} fill={VIZ.red} fontSize={11.5} fontWeight={700}>
              Güç Engeli (~200 W, 2003)
            </text>
            <text x={X(0.66)} y={Y(0.7)} fill={VIZ.accent} fontSize={11.5} fontWeight={700}>
              saat hızı sabitlendi
            </text>
            <text x={X(0.66)} y={Y(0.62)} fill={VIZ.green} fontSize={11.5} fontWeight={700}>
              → çözüm: çok çekirdek
            </text>
          </>
        )}

        {mode === 'gap' && (
          <>
            <text x={30} y={H / 2} textAnchor="middle" fill={VIZ.muted} fontSize={11} transform={`rotate(-90 30 ${H / 2})`}>
              performans (log)
            </text>
            <path
              d={path([[0, 0.06], [0.3, 0.3], [0.6, 0.66], [0.8, 0.82], [1, 0.9]])}
              fill="none"
              stroke={VIZ.accent}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path
              d={path([[0, 0.05], [0.3, 0.12], [0.6, 0.2], [0.8, 0.26], [1, 0.3]])}
              fill="none"
              stroke={VIZ.green}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <text x={X(0.68)} y={Y(0.78)} fill={VIZ.accent} fontSize={11.5} fontWeight={700}>
              işlemci
            </text>
            <text x={X(0.68)} y={Y(0.14)} fill={VIZ.green} fontSize={11.5} fontWeight={700}>
              DRAM bellek
            </text>
            {/* makas */}
            <line x1={X(0.9)} y1={Y(0.87)} x2={X(0.9)} y2={Y(0.28)} stroke={VIZ.amber} strokeWidth={1.5} strokeDasharray="4 4" />
            <text x={X(0.9)} y={Y(0.56)} textAnchor="end" fill={VIZ.amber} fontSize={11.5} fontWeight={700}>
              makas → cache ile kapatılır{'  '}
            </text>
          </>
        )}
      </svg>
    </VizShell>
  );
}
