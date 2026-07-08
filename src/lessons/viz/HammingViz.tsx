import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * 4:7 Hamming kodu — interaktif (Buzluca 7.23-24).
 * Kullanıcı 4 veri bitini seçer; eşlikler hesaplanır. Kod sözcüğündeki
 * herhangi bir bite tıklayarak "bozar"; sendrom hatalı biti bulur ve düzeltir.
 */

const codeword = (d: number[]): number[] => {
  const [d0, d1, d2, d3] = d as [number, number, number, number];
  return [d0, d1, d2, d3, d0 ^ d1 ^ d2, d1 ^ d2 ^ d3, d0 ^ d1 ^ d3];
};

const LABELS = ['d0', 'd1', 'd2', 'd3', 'p0', 'p1', 'p2'];

/** sendrom (s0 s1 s2) → hatalı bit indeksi (LABELS sırasına göre) */
const SYNDROME_MAP: Record<string, string> = {
  '000': 'yok',
  '001': 'p2',
  '010': 'p1',
  '011': 'd3',
  '100': 'p0',
  '101': 'd0',
  '110': 'd2',
  '111': 'd1',
};

export default function HammingViz() {
  const [data, setData] = useState([1, 0, 1, 1]);
  const [flipped, setFlipped] = useState<number | null>(null);

  const sent = codeword(data);
  const received = sent.map((b, i) => (i === flipped ? b ^ 1 : b));
  const [r0, r1, r2, r3, rp0, rp1, rp2] = received as [number, number, number, number, number, number, number];
  const s0 = rp0 ^ (r0 ^ r1 ^ r2);
  const s1 = rp1 ^ (r1 ^ r2 ^ r3);
  const s2 = rp2 ^ (r0 ^ r1 ^ r3);
  const syndrome = `${s0}${s1}${s2}`;
  const located = SYNDROME_MAP[syndrome]!;

  const BIT = 62;
  const startX = (660 - 7 * BIT) / 2;

  return (
    <VizShell
      footer={
        <p>
          Sendrom <code>s0 s1 s2 = {s0} {s1} {s2}</code> →{' '}
          {located === 'yok' ? (
            <strong style={{ color: VIZ.green }}>hata yok.</strong>
          ) : (
            <>
              <strong style={{ color: VIZ.red }}>hatalı bit: {located}</strong> — donanım bu biti
              tümleyerek düzeltir.
            </>
          )}{' '}
          Eşlikler: <code>p0=d0⊕d1⊕d2</code>, <code>p1=d1⊕d2⊕d3</code>, <code>p2=d0⊕d1⊕d3</code>.
          Alıcı, eşlikleri yeniden hesaplayıp gelenlerle XOR&apos;lar; sıfırdan farklı sendrom
          hatanın YERİNİ söyler. Kod sözcüğüne bir bit daha (q) eklenirse çift hatalar da sezilir
          (SEC-DED).
        </p>
      }
    >
      <svg viewBox="0 0 660 300" role="img" aria-label="Hamming kodu">
        <text x={330} y={26} textAnchor="middle" fill={VIZ.muted} fontSize={11.5}>
          ① Veri bitlerine tıklayıp değiştirin — eşlikler otomatik hesaplanır
        </text>
        {/* gönderilen */}
        <text x={startX - 14} y={72} textAnchor="end" fill={VIZ.muted} fontSize={11}>
          Yazılan
        </text>
        {sent.map((b, i) => {
          const isData = i < 4;
          const color = isData ? VIZ.accent : VIZ.amber;
          return (
            <g
              key={i}
              onClick={() => {
                if (!isData) return;
                setData((d) => d.map((v, j) => (j === i ? v ^ 1 : v)));
                setFlipped(null);
              }}
              style={{ cursor: isData ? 'pointer' : 'default' }}
            >
              <rect x={startX + i * BIT} y={50} width={BIT - 8} height={36} rx={7} fill={`${color}20`} stroke={color} strokeWidth={1.4} />
              <text x={startX + i * BIT + (BIT - 8) / 2} y={73} textAnchor="middle" fill={VIZ.text} fontSize={15} fontWeight={700} fontFamily="JetBrains Mono, monospace">
                {b}
              </text>
              <text x={startX + i * BIT + (BIT - 8) / 2} y={100} textAnchor="middle" fill={color} fontSize={10.5} fontFamily="JetBrains Mono, monospace">
                {LABELS[i]}
              </text>
            </g>
          );
        })}
        <text x={330} y={132} textAnchor="middle" fill={VIZ.muted} fontSize={11.5}>
          ② Okunan koddaki bir bite tıklayın — belleğin o biti bozduğunu (soft error) canlandırır
        </text>
        {/* alınan */}
        <text x={startX - 14} y={178} textAnchor="end" fill={VIZ.muted} fontSize={11}>
          Okunan
        </text>
        {received.map((b, i) => {
          const isFlipped = i === flipped;
          const isLocated = LABELS[i] === located;
          const color = isFlipped ? VIZ.red : i < 4 ? VIZ.accent : VIZ.amber;
          return (
            <g key={i} onClick={() => setFlipped(isFlipped ? null : i)} style={{ cursor: 'pointer' }}>
              <rect x={startX + i * BIT} y={156} width={BIT - 8} height={36} rx={7} fill={`${color}20`} stroke={color} strokeWidth={isFlipped ? 2.2 : 1.4} />
              <text x={startX + i * BIT + (BIT - 8) / 2} y={179} textAnchor="middle" fill={isFlipped ? VIZ.red : VIZ.text} fontSize={15} fontWeight={700} fontFamily="JetBrains Mono, monospace">
                {b}
              </text>
              {isLocated && located !== 'yok' && (
                <text x={startX + i * BIT + (BIT - 8) / 2} y={214} textAnchor="middle" fill={VIZ.red} fontSize={12} fontWeight={800}>
                  ▲ sendrom burayı gösteriyor
                </text>
              )}
            </g>
          );
        })}
        {/* sendrom kutusu */}
        <rect x={230} y={236} width={200} height={44} rx={9} fill={located === 'yok' ? `${VIZ.green}14` : `${VIZ.red}14`} stroke={located === 'yok' ? VIZ.green : VIZ.red} strokeWidth={1.6} />
        <text x={330} y={254} textAnchor="middle" fill={VIZ.text} fontSize={12} fontWeight={700} fontFamily="JetBrains Mono, monospace">
          sendrom = {s0} {s1} {s2}
        </text>
        <text x={330} y={272} textAnchor="middle" fill={located === 'yok' ? VIZ.green : VIZ.red} fontSize={11.5} fontWeight={700}>
          {located === 'yok' ? 'hata yok' : `hata → ${located}, tümlenerek düzeltilir`}
        </text>
      </svg>
    </VizShell>
  );
}
