import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Yalıtılmış G/Ç ile bellek haritalı G/Ç karşılaştırması.
 * Adres haritası ve komut farkı tek bakışta görünür.
 */
export default function IoMappingViz() {
  const [mode, setMode] = useState('isolated');
  const isolated = mode === 'isolated';

  const Region = ({ x, y, w, h, label, range, color }: { x: number; y: number; w: number; h: number; label: string; range: string; color: string }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={`${color}1c`} stroke={color} strokeWidth={1.4} />
      <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fill={VIZ.text} fontSize={12.5} fontWeight={650}>
        {label}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fill={VIZ.muted} fontSize={10.5} fontFamily="JetBrains Mono, monospace">
        {range}
      </text>
    </g>
  );

  return (
    <VizShell
      modes={[
        { id: 'isolated', label: 'Yalıtılmış G/Ç' },
        { id: 'mapped', label: 'Bellek Haritalı G/Ç' },
      ]}
      mode={mode}
      onMode={setMode}
      footer={
        isolated ? (
          <p>
            Bellek ve G/Ç için <strong>ayrı adres haritaları</strong> vardır; hangi haritaya
            erişildiğini bir denetim hattı (Bellek/GÇ) belirler. Erişim komutları da ayrıdır:
            bellek için <code>LOAD/STORE</code>, G/Ç için <code>IN/OUT</code>. Örnek: Intel x86
            ailesi.
          </p>
        ) : (
          <p>
            Bellek ve G/Ç birimleri <strong>aynı adres haritasını</strong> paylaşır; G/Ç
            arabirimleri belleğin belirli adres aralıklarına yerleşir ve hepsine aynı komutlarla (
            <code>MOVE/LOAD/STORE</code>) erişilir. Ayrı G/Ç komutuna gerek kalmaz. Örnek: Motorola
            68XX/68K ailesi.
          </p>
        )
      }
    >
      <svg viewBox="0 0 660 300" role="img" aria-label="G/Ç adresleme yöntemleri">
        {/* MİB */}
        <rect x={30} y={100} width={130} height={90} rx={10} fill={VIZ.panel} stroke={VIZ.accent} strokeWidth={1.6} />
        <text x={95} y={140} textAnchor="middle" fill={VIZ.text} fontSize={15} fontWeight={750}>
          MİB
        </text>
        <text x={95} y={162} textAnchor="middle" fill={VIZ.muted} fontSize={10.5} fontFamily="JetBrains Mono, monospace">
          {isolated ? 'LOAD/STORE · IN/OUT' : 'MOVE / LOAD / STORE'}
        </text>
        {/* yol */}
        <line x1={160} y1={145} x2={250} y2={145} stroke={VIZ.border} strokeWidth={9} strokeLinecap="round" />
        <text x={205} y={130} textAnchor="middle" fill={VIZ.muted} fontSize={10.5}>
          adres + veri yolu
        </text>
        {isolated ? (
          <>
            {/* Bellek/GÇ seçim hattı */}
            <line x1={160} y1={170} x2={250} y2={170} stroke={VIZ.amber} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={205} y={188} textAnchor="middle" fill={VIZ.amber} fontSize={10.5} fontWeight={700}>
              Bellek / GÇ hattı
            </text>
            <text x={355} y={30} textAnchor="middle" fill={VIZ.accent} fontSize={12} fontWeight={750}>
              Bellek Haritası
            </text>
            <Region x={270} y={40} w={170} h={56} label="Bellek 1" range="$0000 – $0FFF" color={VIZ.accent} />
            <Region x={270} y={102} w={170} h={56} label="Bellek 2" range="$1000 – $FFFF" color={VIZ.accent} />
            <text x={545} y={30} textAnchor="middle" fill={VIZ.green} fontSize={12} fontWeight={750}>
              G/Ç Haritası (ayrı)
            </text>
            <Region x={470} y={40} w={150} h={56} label="G/Ç 1" range="$00 – $0F" color={VIZ.green} />
            <Region x={470} y={102} w={150} h={56} label="G/Ç 2" range="$10 – $FF" color={VIZ.green} />
            <text x={330} y={240} fill={VIZ.muted} fontSize={11.5}>
              Aynı adres değeri iki haritada farklı birimleri gösterebilir;
            </text>
            <text x={330} y={258} fill={VIZ.muted} fontSize={11.5}>
              seçimi Bellek/GÇ denetim hattı yapar.
            </text>
          </>
        ) : (
          <>
            <text x={430} y={30} textAnchor="middle" fill={VIZ.accent} fontSize={12} fontWeight={750}>
              Tek Ortak Adres Haritası
            </text>
            <Region x={290} y={40} w={280} h={50} label="Bellek 1" range="$0000 – $0FFF" color={VIZ.accent} />
            <Region x={290} y={96} w={280} h={50} label="G/Ç 1" range="$1000 – $1FFF" color={VIZ.green} />
            <Region x={290} y={152} w={280} h={50} label="Bellek 2" range="$2000 – $2FFF" color={VIZ.accent} />
            <Region x={290} y={208} w={280} h={50} label="G/Ç 2" range="$3000 – $3FFF" color={VIZ.green} />
          </>
        )}
      </svg>
    </VizShell>
  );
}
