import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Von Neumann ve Harvard mimarileri karşılaştırması.
 * Yollar üzerinde akan noktalar komut (mavi) ve veri (yeşil) trafiğini
 * gösterir: Von Neumann'da aynı yolu sırayla paylaşırlar, Harvard'da
 * eşzamanlı akarlar.
 */
export default function VonNeumannHarvardViz() {
  const [mode, setMode] = useState('von-neumann');
  const player = useVizPlayer();
  const t = player.t;

  const isVN = mode === 'von-neumann';
  // Von Neumann: tek yol — komut ve veri dönüşümlü (yarım periyotlar)
  const phase = Math.floor(t) % 2; // 0: komut, 1: veri
  const u = t % 1;

  const Box = ({ x, y, w, h, label, color = VIZ.border }: { x: number; y: number; w: number; h: number; label: string; color?: string }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={VIZ.panel} stroke={color} strokeWidth={1.4} />
      <text x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle" fill={VIZ.text} fontSize={13} fontWeight={650} fontFamily="Inter, sans-serif">
        {label}
      </text>
    </g>
  );

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'von-neumann', label: 'Von Neumann' },
        { id: 'harvard', label: 'Harvard' },
      ]}
      mode={mode}
      onMode={setMode}
      footer={
        isVN ? (
          <p>
            Komutlar ve veriler <strong>aynı bellekte</strong> tutulur; ortak adres/veri yolunu
            sırayla kullanırlar. MİB, aynı anda hem komut hem operand okuyamaz — buna{' '}
            <strong>Von Neumann darboğazı</strong> denir.
          </p>
        ) : (
          <p>
            Komut ve veri bellekleri <strong>ayrıdır</strong>; adres ve veri yolları da ayrı olduğu
            için MİB aynı anda hem komut alır hem operand erişimi yapar. Komut iş hattı için
            idealdir; adını Harvard Mark I bilgisayarından alır.
          </p>
        )
      }
    >
      <svg viewBox="0 0 660 250" role="img" aria-label={isVN ? 'Von Neumann mimarisi' : 'Harvard mimarisi'}>
        <Box x={40} y={85} w={150} h={80} label="MİB" color={VIZ.accent} />
        {isVN ? (
          <>
            <Box x={430} y={85} w={180} h={80} label="Bellek (komut + veri)" />
            {/* ortak yol */}
            <line x1={190} y1={125} x2={430} y2={125} stroke={VIZ.border} strokeWidth={10} strokeLinecap="round" />
            <text x={310} y={105} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
              ortak adres + veri yolu
            </text>
            {/* dönüşümlü trafik */}
            {[0, 0.35, 0.7].map((off) => {
              const p = (u + off) % 1;
              const x = phase === 0 ? 430 - p * 240 : 190 + p * 240;
              return (
                <circle
                  key={off}
                  cx={x}
                  cy={125}
                  r={5}
                  fill={phase === 0 ? VIZ.accent : VIZ.green}
                />
              );
            })}
            <text x={310} y={160} textAnchor="middle" fill={phase === 0 ? VIZ.accent : VIZ.green} fontSize={12} fontWeight={700}>
              {phase === 0 ? '→ komut okunuyor…' : '→ veri aktarılıyor…'}
            </text>
            <text x={310} y={225} textAnchor="middle" fill={VIZ.muted} fontSize={11.5}>
              Aynı yol paylaşıldığından komut ve veri erişimi ardışıktır.
            </text>
          </>
        ) : (
          <>
            <Box x={430} y={30} w={180} h={70} label="Komut Belleği" color={VIZ.accent} />
            <Box x={430} y={150} w={180} h={70} label="Veri Belleği" color={VIZ.green} />
            <line x1={190} y1={112} x2={430} y2={65} stroke={VIZ.border} strokeWidth={8} strokeLinecap="round" />
            <line x1={190} y1={138} x2={430} y2={185} stroke={VIZ.border} strokeWidth={8} strokeLinecap="round" />
            {[0, 0.5].map((off) => {
              const p = (u + off) % 1;
              return (
                <g key={off}>
                  <circle cx={430 - p * 240} cy={65 + p * 47} r={5} fill={VIZ.accent} />
                  <circle cx={430 - p * 240} cy={185 - p * 47} r={5} fill={VIZ.green} />
                </g>
              );
            })}
            <text x={310} y={20} textAnchor="middle" fill={VIZ.accent} fontSize={11.5} fontWeight={700}>
              komut yolu — eşzamanlı
            </text>
            <text x={310} y={240} textAnchor="middle" fill={VIZ.green} fontSize={11.5} fontWeight={700}>
              veri yolu — eşzamanlı
            </text>
          </>
        )}
      </svg>
    </VizShell>
  );
}
