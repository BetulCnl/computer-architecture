import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Çok işlemcili sistem organizasyonları: SMP/UMA (ortak yol),
 * NUMA (dağıtılmış paylaşılan bellek) ve küme (mesaj aktarımı).
 */

type Mode = 'smp' | 'numa' | 'cluster';

const NOTES: Record<Mode, string> = {
  smp: 'SMP/UMA: özdeş işlemciler tek ortak yol üzerinden AYNI belleği paylaşır; erişim süresi herkes için eşittir. Basit ve esnektir ama tüm trafik ortak yoldan geçtiği için işlemci sayısı sınırlıdır (~16-64) — yol darboğazdır. Çözüm: yerel cep bellekler (bu da tutarlılık sorununu doğurur).',
  numa: 'NUMA: tek adres uzayı korunur ama fiziksel bellek işlemcilere dağıtılır. Her işlemci KENDİ modülüne hızlı, uzak modüllere yavaş erişir. Veriler yöresellik gözetilerek dağıtılırsa SMP’nin yol darboğazı olmadan büyük ölçekli paylaşılan bellek elde edilir.',
  cluster: 'Küme (gevşek bağlı): her düğüm kendi adres uzayına sahip bağımsız bir bilgisayardır; iletişim ağ üzerinden MESAJ AKTARIMI ile olur. Ölçeklenebilirlik ve erişilebilirlik çok yüksektir — on binlerce sunucuya ulaşan kümeler "depo ölçekli" bilgisayarlardır (bulut bilişim).',
};

export default function MultiprocessorViz() {
  const [mode, setMode] = useState<Mode>('smp');

  const Cpu = ({ x, y, i }: { x: number; y: number; i: number }) => (
    <g>
      <rect x={x} y={y} width={110} height={54} rx={9} fill={VIZ.panel} stroke={VIZ.accent} strokeWidth={1.4} />
      <text x={x + 55} y={y + 22} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700}>
        İşlemci {i}
      </text>
      <text x={x + 55} y={y + 40} textAnchor="middle" fill={VIZ.muted} fontSize={9.5}>
        L1 cep bellek
      </text>
    </g>
  );

  const Mem = ({ x, y, w = 130, label = 'Ana Bellek' }: { x: number; y: number; w?: number; label?: string }) => (
    <g>
      <rect x={x} y={y} width={w} height={46} rx={9} fill={VIZ.panel} stroke={VIZ.purple} strokeWidth={1.4} />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fill={VIZ.text} fontSize={11} fontWeight={650}>
        {label}
      </text>
    </g>
  );

  return (
    <VizShell
      modes={[
        { id: 'smp', label: 'SMP / UMA' },
        { id: 'numa', label: 'NUMA' },
        { id: 'cluster', label: 'Küme (Cluster)' },
      ]}
      mode={mode}
      onMode={(m) => setMode(m as Mode)}
      footer={<p>{NOTES[mode]}</p>}
    >
      <svg viewBox="0 0 660 300" role="img" aria-label="Çok işlemcili sistem yapısı">
        {mode === 'smp' && (
          <>
            {[0, 1, 2].map((i) => (
              <Cpu key={i} x={70 + i * 170} y={40} i={i + 1} />
            ))}
            <line x1={50} y1={150} x2={610} y2={150} stroke={VIZ.amber} strokeWidth={10} strokeLinecap="round" />
            <text x={330} y={172} textAnchor="middle" fill={VIZ.amber} fontSize={11} fontWeight={700}>
              Paylaşılan ortak yol (zaman paylaşımlı, yol hakemli) — darboğaz!
            </text>
            {[0, 1, 2].map((i) => (
              <line key={i} x1={125 + i * 170} y1={94} x2={125 + i * 170} y2={145} stroke={VIZ.border} strokeWidth={4} />
            ))}
            <Mem x={130} y={210} w={180} label="Ana Bellek (paylaşılan)" />
            <Mem x={370} y={210} w={130} label="G/Ç" />
            <line x1={220} y1={210} x2={220} y2={155} stroke={VIZ.border} strokeWidth={4} />
            <line x1={435} y1={210} x2={435} y2={155} stroke={VIZ.border} strokeWidth={4} />
          </>
        )}
        {mode === 'numa' && (
          <>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Cpu x={60 + i * 190} y={30} i={i + 1} />
                <Mem x={50 + i * 190} y={100} label={`Bellek #${i}`} />
                <line x1={115 + i * 190} y1={84} x2={115 + i * 190} y2={100} stroke={VIZ.green} strokeWidth={4} />
                <text x={140 + i * 190} y={96} fill={VIZ.green} fontSize={9} fontWeight={700}>
                  hızlı
                </text>
                <line x1={115 + i * 190} y1={146} x2={115 + i * 190} y2={195} stroke={VIZ.border} strokeWidth={4} />
              </g>
            ))}
            <line x1={50} y1={200} x2={610} y2={200} stroke={VIZ.amber} strokeWidth={9} strokeLinecap="round" />
            <text x={330} y={224} textAnchor="middle" fill={VIZ.amber} fontSize={11} fontWeight={700}>
              Arabağlantı yapısı — uzak belleklere erişim bu yoldan (yavaş)
            </text>
            <text x={330} y={262} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
              Tek mantıksal adres uzayı: İşlemci 1, Bellek #2&apos;deki veriye de erişebilir — sadece daha yavaş.
            </text>
          </>
        )}
        {mode === 'cluster' && (
          <>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={55 + i * 190} y={30} width={130} height={130} rx={12} fill="none" stroke={VIZ.border} strokeDasharray="5 4" />
                <text x={120 + i * 190} y={22} textAnchor="middle" fill={VIZ.muted} fontSize={10}>
                  Düğüm {i + 1} (bağımsız bilgisayar)
                </text>
                <Cpu x={65 + i * 190} y={40} i={i + 1} />
                <Mem x={65 + i * 190} y={104} w={110} label="Yerel bellek" />
                <line x1={120 + i * 190} y1={160} x2={120 + i * 190} y2={205} stroke={VIZ.border} strokeWidth={4} />
              </g>
            ))}
            <line x1={60} y1={210} x2={600} y2={210} stroke={VIZ.cyan} strokeWidth={9} strokeLinecap="round" />
            <text x={330} y={234} textAnchor="middle" fill={VIZ.cyan} fontSize={11} fontWeight={700}>
              Ağ — düğümler mesaj aktarımı (message passing) ile haberleşir
            </text>
            <text x={330} y={268} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
              Ortak bellek YOK; her düğümün kendi adres uzayı var. İsteğe bağlı paylaşılan RAID diski eklenebilir.
            </text>
          </>
        )}
      </svg>
    </VizShell>
  );
}
