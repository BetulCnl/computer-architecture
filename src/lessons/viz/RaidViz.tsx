import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * RAID düzeyleri: verilerin ve eşlik bilgilerinin disklere dağılımı.
 * "Diski boz" düğmesi bir diski devre dışı bırakır; eşlikli düzeylerde
 * XOR ile yeniden oluşturma açıklanır.
 */

type Level = '0' | '1' | '3' | '4' | '5' | '6';

interface Cell {
  label: string;
  kind: 'data' | 'parity' | 'parity2' | 'mirror';
}

/** her düzey için disk sütunları (4 satır) */
function layout(level: Level): { disks: Cell[][]; note: string } {
  const d = (n: number): Cell => ({ label: `şerit ${n}`, kind: 'data' });
  const p = (r: string): Cell => ({ label: `P(${r})`, kind: 'parity' });
  const q = (r: string): Cell => ({ label: `Q(${r})`, kind: 'parity2' });
  const m = (n: number): Cell => ({ label: `şerit ${n}`, kind: 'mirror' });
  switch (level) {
    case '0':
      return {
        disks: [
          [d(0), d(4), d(8), d(12)],
          [d(1), d(5), d(9), d(13)],
          [d(2), d(6), d(10), d(14)],
          [d(3), d(7), d(11), d(15)],
        ],
        note: 'Şeritleme (striping): fazlalık yok. Performans yüksek; ama bir disk bozulursa veri KAYBOLUR. Gerçek bir RAID sayılmaz.',
      };
    case '1':
      return {
        disks: [
          [d(0), d(2), d(4), d(6)],
          [d(1), d(3), d(5), d(7)],
          [m(0), m(2), m(4), m(6)],
          [m(1), m(3), m(5), m(7)],
        ],
        note: 'Aynalama (mirroring): her veri iki diske yazılır. Okuma hızlı (iki kopyadan hızlısı), kurtarma anında; ama disk sayısı ikiye katlanır — maliyet yüksek.',
      };
    case '3':
      return {
        disks: [
          [d(0), d(4), d(8), d(12)],
          [d(1), d(5), d(9), d(13)],
          [d(2), d(6), d(10), d(14)],
          [p('0-2'), p('4-6'), p('8-10'), p('12-14')],
        ],
        note: 'Senkron diskler + küçük şeritler + tek eşlik diski. Büyük blok aktarımlarında (dosya sunucusu, video) çok hızlı; bağımsız küçük erişimlerde zayıf.',
      };
    case '4':
      return {
        disks: [
          [d(0), d(4), d(8), d(12)],
          [d(1), d(5), d(9), d(13)],
          [d(2), d(6), d(10), d(14)],
          [p('0-2'), p('4-6'), p('8-10'), p('12-14')],
        ],
        note: 'Bağımsız diskler + büyük şeritler + tek eşlik diski. Her yazma eşlik diskine de yazmayı gerektirir → eşlik diski DARBOĞAZ olur (yazma cezası: 2 okuma + 2 yazma).',
      };
    case '5':
      return {
        disks: [
          [d(0), d(3), d(6), p('9-11')],
          [d(1), d(4), p('6-8'), d(9)],
          [d(2), p('3-5'), d(7), d(10)],
          [p('0-2'), d(5), d(8), d(11)],
        ],
        note: 'RAID 4 gibi; ama eşlik blokları TÜM disklere dağıtılır — tek eşlik diski darboğazı ortadan kalkar. En yaygın kullanılan düzeylerden biridir.',
      };
    case '6':
      return {
        disks: [
          [d(0), d(3), p('6-8'), q('9-11')],
          [d(1), p('3-5'), q('6-8'), d(9)],
          [p('0-2'), q('3-5'), d(6), d(10)],
          [q('0-2'), d(4), d(7), p('9-11')],
        ],
        note: 'İki bağımsız eşlik (P ve Q) disklere dağıtılır: AYNI ANDA İKİ disk bozulsa bile veri kurtarılır. N veri diski için N+2 disk gerekir.',
      };
  }
}

const KIND_COLOR: Record<Cell['kind'], string> = {
  data: VIZ.accent,
  parity: VIZ.amber,
  parity2: VIZ.purple,
  mirror: VIZ.cyan,
};

export default function RaidViz() {
  const [level, setLevel] = useState<Level>('0');
  const [failed, setFailed] = useState<number | null>(null);
  const { disks, note } = layout(level);

  const recoverable =
    failed === null ? null : level === '0' ? false : true;

  return (
    <VizShell
      modes={(['0', '1', '3', '4', '5', '6'] as Level[]).map((l) => ({ id: l, label: `RAID ${l}` }))}
      mode={level}
      onMode={(m) => {
        setLevel(m as Level);
        setFailed(null);
      }}
      footer={
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="viz-btn"
              onClick={() => setFailed(failed === null ? 1 : null)}
            >
              {failed === null ? '⚠ Disk 1’i boz' : '↺ Diski onar'}
            </button>
            {failed !== null && (
              <span style={{ fontSize: 12.5, color: recoverable ? VIZ.green : VIZ.red, fontWeight: 700, alignSelf: 'center' }}>
                {recoverable
                  ? level === '1'
                    ? 'Veri güvende: ayna kopyadan okunmaya devam edilir.'
                    : 'Veri kurtarılabilir: Xkayıp = diğer disklerin XOR’u (eşlikten yeniden oluşturma).'
                  : 'VERİ KAYBI! RAID 0’da fazlalık yoktur.'}
              </span>
            )}
          </div>
          <p>{note}</p>
        </div>
      }
    >
      <svg viewBox="0 0 660 280" role="img" aria-label={`RAID ${level} düzeni`}>
        {disks.map((disk, di) => {
          const x = 40 + di * 155;
          const dead = failed === di;
          return (
            <g key={di} opacity={dead ? 0.9 : 1}>
              <rect x={x} y={30} width={135} height={210} rx={12} fill={VIZ.panel} stroke={dead ? VIZ.red : VIZ.border} strokeWidth={dead ? 2 : 1} />
              <text x={x + 67} y={22} textAnchor="middle" fill={dead ? VIZ.red : VIZ.muted} fontSize={11.5} fontWeight={700}>
                Fiziksel Disk {di} {dead ? '✗' : ''}
              </text>
              {disk.map((cell, ri) => {
                const color = KIND_COLOR[cell.kind];
                return (
                  <g key={ri} opacity={dead ? 0.3 : 1}>
                    <rect x={x + 10} y={42 + ri * 48} width={115} height={38} rx={7} fill={`${color}1f`} stroke={color} strokeWidth={1.2} />
                    <text x={x + 67} y={65 + ri * 48} textAnchor="middle" fill={dead ? VIZ.muted : VIZ.text} fontSize={11.5} fontWeight={cell.kind === 'data' ? 500 : 700} fontFamily="JetBrains Mono, monospace">
                      {cell.label}
                    </text>
                  </g>
                );
              })}
              {dead && (
                <g>
                  <line x1={x + 14} y1={50} x2={x + 121} y2={230} stroke={VIZ.red} strokeWidth={3} strokeLinecap="round" />
                  <line x1={x + 121} y1={50} x2={x + 14} y2={230} stroke={VIZ.red} strokeWidth={3} strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}
        {/* efsane */}
        <g fontSize={10.5}>
          <rect x={40} y={254} width={12} height={12} rx={3} fill={`${VIZ.accent}1f`} stroke={VIZ.accent} />
          <text x={58} y={264} fill={VIZ.muted}>veri şeridi</text>
          {level === '1' && (
            <>
              <rect x={140} y={254} width={12} height={12} rx={3} fill={`${VIZ.cyan}1f`} stroke={VIZ.cyan} />
              <text x={158} y={264} fill={VIZ.muted}>ayna kopya</text>
            </>
          )}
          {['3', '4', '5', '6'].includes(level) && (
            <>
              <rect x={140} y={254} width={12} height={12} rx={3} fill={`${VIZ.amber}1f`} stroke={VIZ.amber} />
              <text x={158} y={264} fill={VIZ.muted}>eşlik P (XOR)</text>
            </>
          )}
          {level === '6' && (
            <>
              <rect x={260} y={254} width={12} height={12} rx={3} fill={`${VIZ.purple}1f`} stroke={VIZ.purple} />
              <text x={278} y={264} fill={VIZ.muted}>ikinci eşlik Q</text>
            </>
          )}
        </g>
      </svg>
    </VizShell>
  );
}
