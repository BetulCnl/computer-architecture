import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Kesme işleme animasyonu.
 * "Tek kesme": ana program → kesme çevrimi (PC ve SR yığına) → KHP → RTI.
 * "İç içe kesmeler": ders notlarındaki (Buzluca 4.29) düzey/maske örneği —
 * 1. düzey çalışırken 4. düzey kabul edilir, 2. düzey maske nedeniyle bekler.
 */

const DUR = 12;

interface Phase {
  from: number;
  to: number;
  label: string;
  text: string;
}

const SINGLE_PHASES: Phase[] = [
  { from: 0, to: 0.18, label: 'Ana program', text: 'MİB ana programın komutlarını yürütüyor. Her komutun yürütme çevriminden sonra kesme istekleri sorgulanır.' },
  { from: 0.18, to: 0.22, label: 'Kesme isteği', text: 'G/Ç arabirimi hazır olduğunda kesme isteği (IRQ) gönderir. MİB o anda yürüttüğü komutu tamamlar.' },
  { from: 0.22, to: 0.38, label: 'Kesme çevrimi', text: 'Donanım hazırlık yapar: geri dönüş adresi (PC) ve durum saklayıcısı (SR) yığına yazılır, kesme kabul (INTACK) gönderilir, vektör adresi PC’ye yüklenir, diğer kesmeler maskelenir.' },
  { from: 0.38, to: 0.72, label: 'KHP', text: 'Kesme hizmet programı (KHP) çalışır: veri aktarımı gibi kaynağın istediği iş yapılır.' },
  { from: 0.72, to: 0.84, label: 'RTI', text: 'KHP’nin son komutu RTI: SR ve PC yığından geri alınır — kesilen program kaldığı yerden habersizce devam eder.' },
  { from: 0.84, to: 1, label: 'Ana program', text: 'MİB ana programa geri döndü. Hazırlık + dönüş işlemleri çok sayıda bellek erişimi gerektirdiğinden sık kesme performansı düşürür.' },
];

/** iç içe kesme senaryosu: [zaman, çalışan düzey, maske, olay] */
const NESTED: { at: number; level: number; mask: string; event?: string }[] = [
  { at: 0, level: 0, mask: '000', event: 'Ana program çalışıyor (maske 000: her kesmeye açık).' },
  { at: 0.14, level: 1, mask: '001', event: '1. düzeyden istek geldi → kabul edildi. Maske 001: artık yalnız daha yüksek düzeyler kabul edilir.' },
  { at: 0.32, level: 4, mask: '100', event: '4. düzeyden istek geldi. 4 > 1 olduğundan KHP-1 kesilir, KHP-4 başlar (iç içe kesme).' },
  { at: 0.5, level: 4, mask: '100', event: '2. düzeyden istek geldi ama 2 ≤ 4: maske nedeniyle KABUL EDİLMEDİ — istek bekletiliyor.' },
  { at: 0.62, level: 2, mask: '010', event: 'KHP-4 bitti (RTE). Maske 001’e döndü; bekleyen 2. düzey isteği şimdi kabul edildi.' },
  { at: 0.78, level: 1, mask: '001', event: 'KHP-2 bitti (RTE) → yarım kalan KHP-1 devam ediyor.' },
  { at: 0.9, level: 0, mask: '000', event: 'KHP-1 de bitti (RTE) → ana programa dönüldü.' },
];

export default function InterruptViz() {
  const [mode, setMode] = useState('single');
  const player = useVizPlayer();
  const u = Math.min((player.t % DUR) / (DUR * 0.92), 1);

  const W = 660;
  const LX = 120;
  const PW = W - LX - 30;

  if (mode === 'single') {
    const phase = SINGLE_PHASES.find((p) => u >= p.from && u < p.to) ?? SINGLE_PHASES[SINGLE_PHASES.length - 1]!;
    const stackItems = u >= 0.26 && u < 0.84 ? ['SR', 'PC'] : u >= 0.22 && u < 0.26 ? ['PC'] : [];
    return (
      <VizShell
        player={player}
        modes={[
          { id: 'single', label: 'Tek kesme' },
          { id: 'nested', label: 'İç içe kesmeler' },
        ]}
        mode={mode}
        onMode={(m) => {
          setMode(m);
          player.reset();
        }}
        footer={
          <p>
            <strong style={{ color: VIZ.accent }}>{phase.label}:</strong> {phase.text}
          </p>
        }
      >
        <svg viewBox={`0 0 ${W} 250`} role="img" aria-label="Kesme işleme zaman çizgisi">
          {/* zaman şeridi */}
          {SINGLE_PHASES.map((p, i) => {
            const colors = [VIZ.accent, VIZ.red, VIZ.amber, VIZ.purple, VIZ.green, VIZ.accent];
            const active = u >= p.from && u < p.to;
            return (
              <g key={i}>
                <rect
                  x={LX + p.from * PW}
                  y={60}
                  width={(p.to - p.from) * PW - 2}
                  height={40}
                  rx={7}
                  fill={active ? `${colors[i]}30` : `${colors[i]}12`}
                  stroke={colors[i]}
                  strokeWidth={active ? 2 : 1}
                />
                {(p.to - p.from) * PW > 55 && (
                  <text x={LX + ((p.from + p.to) / 2) * PW} y={84} textAnchor="middle" fill={active ? VIZ.text : VIZ.muted} fontSize={10.5} fontWeight={700}>
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
          <text x={LX - 10} y={84} textAnchor="end" fill={VIZ.muted} fontSize={11}>
            MİB
          </text>
          {/* IRQ oku */}
          {u >= 0.18 && (
            <g>
              <line x1={LX + 0.2 * PW} y1={150} x2={LX + 0.2 * PW} y2={104} stroke={VIZ.red} strokeWidth={2} markerEnd="url(#iv-arrow)" />
              <text x={LX + 0.2 * PW + 6} y={140} fill={VIZ.red} fontSize={11} fontWeight={700}>
                IRQ
              </text>
            </g>
          )}
          <defs>
            <marker id="iv-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={VIZ.red} />
            </marker>
          </defs>
          <rect x={LX + 0.12 * PW} y={150} width={0.16 * PW} height={34} rx={7} fill={VIZ.panel} stroke={VIZ.border} />
          <text x={LX + 0.2 * PW} y={171} textAnchor="middle" fill={VIZ.muted} fontSize={10.5}>
            G/Ç arabirimi
          </text>
          {/* yığın */}
          <text x={W - 120} y={135} textAnchor="middle" fill={VIZ.muted} fontSize={11} fontWeight={700}>
            Yığın (Stack)
          </text>
          <rect x={W - 170} y={142} width={100} height={72} rx={8} fill={VIZ.panel} stroke={VIZ.border} />
          {stackItems.map((item, i) => (
            <g key={item}>
              <rect x={W - 162} y={150 + i * 30} width={84} height={24} rx={5} fill={`${VIZ.amber}22`} stroke={VIZ.amber} />
              <text x={W - 120} y={166 + i * 30} textAnchor="middle" fill={VIZ.amber} fontSize={11} fontWeight={700} fontFamily="JetBrains Mono, monospace">
                {item}
              </text>
            </g>
          ))}
          {/* zaman imleci */}
          <line x1={LX + u * PW} y1={44} x2={LX + u * PW} y2={112} stroke={VIZ.text} strokeWidth={1.4} strokeDasharray="3 3" opacity={0.8} />
          <text x={LX} y={36} fill={VIZ.muted} fontSize={10.5}>
            zaman →
          </text>
        </svg>
      </VizShell>
    );
  }

  // iç içe kesmeler
  const idx = NESTED.reduce((acc, e, i) => (u >= e.at ? i : acc), 0);
  const current = NESTED[idx]!;
  const levels = [0, 1, 2, 4];
  const levelY = (lv: number) => 190 - levels.indexOf(lv) * 44;

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'single', label: 'Tek kesme' },
        { id: 'nested', label: 'İç içe kesmeler' },
      ]}
      mode={mode}
      onMode={(m) => {
        setMode(m);
        player.reset();
      }}
      footer={
        <p>
          <strong style={{ color: VIZ.accent }}>Maske: {current.mask}</strong> — {current.event} Bir
          kesme isteği ancak düzeyi maskedekinden <strong>büyükse</strong> kabul edilir; böylece
          yüksek öncelikli işler düşük öncelikli KHP&apos;leri kesebilir ama tersi olamaz.
        </p>
      }
    >
      <svg viewBox={`0 0 ${W} 250`} role="img" aria-label="İç içe kesmeler">
        {levels.map((lv) => (
          <g key={lv}>
            <text x={LX - 10} y={levelY(lv) + 4} textAnchor="end" fill={VIZ.muted} fontSize={11} fontFamily="JetBrains Mono, monospace">
              {lv === 0 ? 'Ana prog.' : `Düzey ${lv}`}
            </text>
            <line x1={LX} y1={levelY(lv)} x2={LX + PW} y2={levelY(lv)} stroke={VIZ.border} strokeWidth={1} />
          </g>
        ))}
        {/* çalışma bantları */}
        {NESTED.slice(0, -1).map((e, i) => {
          const next = NESTED[i + 1]!;
          const upto = Math.min(u, next.at);
          if (upto <= e.at) return null;
          return (
            <rect
              key={i}
              x={LX + e.at * PW}
              y={levelY(e.level) - 11}
              width={(upto - e.at) * PW}
              height={22}
              rx={5}
              fill={`${VIZ.accent}30`}
              stroke={VIZ.accent}
              strokeWidth={1.2}
            />
          );
        })}
        {/* olay işaretleri */}
        {NESTED.map((e, i) =>
          e.event && u >= e.at && i > 0 ? (
            <circle key={i} cx={LX + e.at * PW} cy={levelY(e.level)} r={4.5} fill={i === idx ? VIZ.amber : VIZ.muted} />
          ) : null,
        )}
        {/* reddedilen istek */}
        {u >= 0.5 && u < 0.62 && (
          <text x={LX + 0.5 * PW} y={levelY(2) - 18} textAnchor="middle" fill={VIZ.red} fontSize={11} fontWeight={700}>
            ✗ 2 ≤ 4 → bekletiliyor
          </text>
        )}
        <line x1={LX + u * PW} y1={20} x2={LX + u * PW} y2={220} stroke={VIZ.text} strokeWidth={1.2} strokeDasharray="3 3" opacity={0.7} />
        <text x={LX + u * PW} y={240} textAnchor="middle" fill={VIZ.accent} fontSize={11} fontWeight={700} fontFamily="JetBrains Mono, monospace">
          maske: {current.mask}
        </text>
      </svg>
    </VizShell>
  );
}
