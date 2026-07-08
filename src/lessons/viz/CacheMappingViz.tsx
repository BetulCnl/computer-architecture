import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Cep bellek dönüşüm (mapping) yöntemleri — ders notlarındaki örnek sistemle:
 * Ana bellek 256K sözcük (18 bit adres), blok boyu 16 sözcük (w=4),
 * cep bellek 2K sözcük = 128 çerçeve (f=7). Kümeli yöntemde 2'li kümeler (s=6).
 * MİB'ten gelen örnek adresin alanlara bölünüşü ve cep bellekte arama şekli
 * interaktif olarak gösterilir.
 */

const ADDRESSES = [
  { bits: '001001001011111000', label: '$092F8' },
  { bits: '000000010000000110', label: '$00406' },
  { bits: '111111100000001001', label: '$3F809' },
];

type Mode = 'assoc' | 'direct' | 'set';

const FIELDS: Record<Mode, { name: string; len: number; color: string; desc: string }[]> = {
  assoc: [
    { name: 'Blok numarası (takı)', len: 14, color: VIZ.accent, desc: 'takı belleğinde TÜM çerçevelerde paralel (çağrışımlı) aranır' },
    { name: 'Sözcük', len: 4, color: VIZ.green, desc: 'blok içindeki sözcüğü seçer' },
  ],
  direct: [
    { name: 'Takı', len: 7, color: VIZ.accent, desc: 'çerçevedeki takı ile karşılaştırılır' },
    { name: 'Çerçeve no', len: 7, color: VIZ.amber, desc: 'bloğun yerleşebileceği TEK çerçeveyi doğrudan belirler' },
    { name: 'Sözcük', len: 4, color: VIZ.green, desc: 'blok içindeki sözcüğü seçer' },
  ],
  set: [
    { name: 'Takı', len: 8, color: VIZ.accent, desc: 'küme İÇİNDE çağrışımlı olarak aranır' },
    { name: 'Küme no', len: 6, color: VIZ.amber, desc: 'bloğun yerleşeceği kümeyi doğrudan belirler' },
    { name: 'Sözcük', len: 4, color: VIZ.green, desc: 'blok içindeki sözcüğü seçer' },
  ],
};

const SUMMARY: Record<Mode, string> = {
  assoc:
    'Tam çağrışımlı: bir blok cep bellekteki HERHANGİ bir çerçeveye yerleşebilir — en esnek ve en yüksek vuru oranı; ama pahalı çağrışımlı bellek (CAM) gerektirir ve yer değiştirme algoritmasına (LRU/FIFO) ihtiyaç vardır.',
  direct:
    'Doğrudan dönüşüm: her bloğun yerleşebileceği çerçeve sabittir (çerçeve = blok mod 128). Arama ve yer değiştirme kararı gerekmez — basit ve ucuz; ama aynı çerçeveyi paylaşan iki blok, cep boş olsa bile birbirini kovar (çakışma ıskası).',
  set: 'Kümeli-çağrışımlı: iki yöntemin dengesi. Küme, doğrudan dönüşümle sabit belirlenir; blok küme İÇİNDEKİ herhangi bir çerçeveye (burada 2 çerçeve: 2-yollu) yerleşebilir. Küme başına çerçeve sayısı artırılırsa tam çağrışımlıya yaklaşır.',
};

export default function CacheMappingViz() {
  const [mode, setMode] = useState<Mode>('direct');
  const [addrIdx, setAddrIdx] = useState(0);
  const addr = ADDRESSES[addrIdx]!;
  const fields = FIELDS[mode];

  // alan değerlerini çöz
  let cursor = 0;
  const parts = fields.map((f) => {
    const bits = addr.bits.slice(cursor, cursor + f.len);
    cursor += f.len;
    return { ...f, bits, value: parseInt(bits, 2) };
  });

  const frameField = parts.find((p) => p.name.startsWith('Çerçeve') || p.name.startsWith('Küme'));

  // cep bellek çizimi: 16 temsili çerçeve
  const FRAME_COUNT = 16;
  const highlight =
    mode === 'assoc'
      ? Array.from({ length: FRAME_COUNT }, (_, i) => i)
      : mode === 'direct'
        ? [frameField!.value % FRAME_COUNT]
        : [(frameField!.value % (FRAME_COUNT / 2)) * 2, (frameField!.value % (FRAME_COUNT / 2)) * 2 + 1];

  const BIT_W = 30;
  const startX = (660 - addr.bits.length * BIT_W) / 2;

  return (
    <VizShell
      modes={[
        { id: 'assoc', label: 'Tam Çağrışımlı' },
        { id: 'direct', label: 'Doğrudan' },
        { id: 'set', label: 'Kümeli (2-yollu)' },
      ]}
      mode={mode}
      onMode={(m) => setMode(m as Mode)}
      footer={
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12 }}>MİB adresi:</span>
            {ADDRESSES.map((a, i) => (
              <button
                key={a.label}
                type="button"
                className={`viz-mode${i === addrIdx ? ' active' : ''}`}
                style={{ border: `1px solid ${VIZ.border}` }}
                onClick={() => setAddrIdx(i)}
              >
                {a.label}
              </button>
            ))}
          </div>
          <p>{SUMMARY[mode]}</p>
        </div>
      }
    >
      <svg viewBox="0 0 660 330" role="img" aria-label="Cep bellek adres dönüşümü">
        <text x={330} y={22} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
          Örnek sistem: 256K sözcük ana bellek (18 bit adres) · 16 sözcüklük bloklar · 128 çerçeveli cep bellek
        </text>
        {/* adres bitleri */}
        {addr.bits.split('').map((bit, i) => {
          let acc = 0;
          const field = parts.find((p) => {
            acc += p.len;
            return i < acc;
          })!;
          return (
            <g key={i}>
              <rect x={startX + i * BIT_W} y={40} width={BIT_W - 2} height={30} rx={4} fill={`${field.color}22`} stroke={field.color} strokeWidth={1} />
              <text x={startX + i * BIT_W + BIT_W / 2 - 1} y={60} textAnchor="middle" fill={VIZ.text} fontSize={13} fontFamily="JetBrains Mono, monospace">
                {bit}
              </text>
            </g>
          );
        })}
        {/* alan etiketleri */}
        {(() => {
          let acc = 0;
          return parts.map((p) => {
            const x = startX + acc * BIT_W;
            acc += p.len;
            return (
              <g key={p.name}>
                <line x1={x + 2} y1={80} x2={x + p.len * BIT_W - 4} y2={80} stroke={p.color} strokeWidth={2} />
                <text x={x + (p.len * BIT_W) / 2} y={97} textAnchor="middle" fill={p.color} fontSize={11} fontWeight={700}>
                  {p.name} ({p.len} bit) = {p.value}
                </text>
              </g>
            );
          });
        })()}
        {/* cep bellek çerçeveleri */}
        <text x={330} y={140} textAnchor="middle" fill={VIZ.muted} fontSize={11.5} fontWeight={700}>
          Cep bellek çerçeveleri (temsili 16 adet){mode === 'set' ? ' — 2’şerli kümeler' : ''}
        </text>
        {Array.from({ length: FRAME_COUNT }, (_, i) => {
          const x = 60 + (i % 8) * 70;
          const y = 155 + Math.floor(i / 8) * 60;
          const hot = highlight.includes(i);
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={60}
                height={44}
                rx={7}
                fill={hot ? `${VIZ.amber}26` : VIZ.panel}
                stroke={hot ? VIZ.amber : VIZ.border}
                strokeWidth={hot ? 2 : 1}
              />
              <text x={x + 30} y={y + 20} textAnchor="middle" fill={hot ? VIZ.text : VIZ.muted} fontSize={10} fontWeight={600}>
                Ç{i}
              </text>
              {hot && (
                <text x={x + 30} y={y + 35} textAnchor="middle" fill={VIZ.amber} fontSize={9} fontWeight={700}>
                  {mode === 'assoc' ? 'aranır' : 'aday'}
                </text>
              )}
              {mode === 'set' && i % 2 === 0 && (
                <rect x={x - 4} y={y - 4} width={132} height={52} rx={9} fill="none" stroke={VIZ.border} strokeDasharray="4 4" />
              )}
            </g>
          );
        })}
        <text x={330} y={300} textAnchor="middle" fill={VIZ.muted} fontSize={11.5}>
          {mode === 'assoc'
            ? 'Takı, tüm çerçevelerin takılarıyla AYNI ANDA karşılaştırılır (çağrışımlı bellek).'
            : mode === 'direct'
              ? `Yalnızca Ç${frameField!.value % FRAME_COUNT} kontrol edilir: takılar eşleşirse VURU, değilse ISKA (blok değiştirilir).`
              : 'Küme sabit; küme içindeki 2 çerçevede takı paralel aranır. İkisi de doluysa LRU ile yer değiştirilir.'}
        </text>
      </svg>
    </VizShell>
  );
}
