import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Görüntü (sanal) adres → fiziksel adres dönüşümü animasyonu.
 * Kipler: TLB vuru (hızlı yol), TLB ıska (sayfa tablosuna gidilir),
 * sayfa hatası (sayfa diskten getirilir).
 */

const CYCLE = 8;

type Mode = 'tlb-hit' | 'tlb-miss' | 'page-fault';

const STEPS: Record<Mode, { at: number; text: string }[]> = {
  'tlb-hit': [
    { at: 0.05, text: '① MİB görüntü adres üretir: sayfa no = 5, sayfa içi no (offset) = $2A4.' },
    { at: 0.3, text: '② TLB’de (çağrışımlı bellek) sayfa 5 paralel aranır → VURU! Blok numarası anında alınır.' },
    { at: 0.6, text: '③ Fiziksel adres oluşturuldu: blok 9 + offset. Sayfa tablosuna hiç gidilmedi — ek bellek erişimi yok.' },
  ],
  'tlb-miss': [
    { at: 0.05, text: '① MİB görüntü adres üretir: sayfa no = 7, offset = $0B0.' },
    { at: 0.25, text: '② TLB’de sayfa 7 aranır → ISKA. Hızlı yol kullanılamıyor.' },
    { at: 0.45, text: '③ Ana bellekteki sayfa tablosuna gidilir (PTBR + sayfa no) — fazladan bir bellek erişimi.' },
    { at: 0.65, text: '④ Tabloda V=1: sayfa bellekte, blok 3’teymiş. Fiziksel adres oluşturulur.' },
    { at: 0.85, text: '⑤ TLB güncellenir: sayfa 7 → blok 3 kaydedilir; bir dahaki erişim vuru olacak.' },
  ],
  'page-fault': [
    { at: 0.05, text: '① MİB görüntü adres üretir: sayfa no = 2, offset = $1F0.' },
    { at: 0.2, text: '② TLB ıska → sayfa tablosuna gidilir.' },
    { at: 0.38, text: '③ Tabloda V=0: sayfa ana bellekte DEĞİL → SAYFA HATASI (page fault) sıra dışı durumu!' },
    { at: 0.55, text: '④ İşletim sistemi bu prosesi bloke eder; DMAC sayfayı diskten boş bir bloğa aktarır. Bu sırada MİB başka bir proses çalıştırır.' },
    { at: 0.8, text: '⑤ Sayfa geldi: tablo ve TLB güncellenir, komut yeniden yürütülür — bu kez vuru.' },
  ],
};

export default function VirtualMemoryViz() {
  const [mode, setMode] = useState<Mode>('tlb-hit');
  const player = useVizPlayer();
  const u = (player.t % CYCLE) / CYCLE;
  const steps = STEPS[mode];
  const active = [...steps].reverse().find((s) => u >= s.at) ?? steps[0]!;
  const stepIdx = steps.indexOf(active);

  const pageNo = mode === 'tlb-hit' ? 5 : mode === 'tlb-miss' ? 7 : 2;
  const showPT = mode !== 'tlb-hit' && stepIdx >= 2;
  const fault = mode === 'page-fault' && stepIdx >= 2;
  const resolved =
    (mode === 'tlb-hit' && stepIdx >= 2) ||
    (mode === 'tlb-miss' && stepIdx >= 3) ||
    (mode === 'page-fault' && stepIdx >= 4);

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'tlb-hit', label: 'TLB Vuru' },
        { id: 'tlb-miss', label: 'TLB Iska' },
        { id: 'page-fault', label: 'Sayfa Hatası' },
      ]}
      mode={mode}
      onMode={(m) => {
        setMode(m as Mode);
        player.reset();
      }}
      footer={<p style={{ minHeight: '3.9em' }}>{active.text}</p>}
    >
      <svg viewBox="0 0 660 310" role="img" aria-label="Sanal bellek adres dönüşümü">
        {/* görüntü adres */}
        <g>
          <rect x={30} y={30} width={130} height={34} rx={7} fill={`${VIZ.accent}20`} stroke={VIZ.accent} strokeWidth={1.4} />
          <text x={95} y={51} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700} fontFamily="JetBrains Mono, monospace">
            sayfa {pageNo}
          </text>
          <rect x={162} y={30} width={90} height={34} rx={7} fill={`${VIZ.green}20`} stroke={VIZ.green} strokeWidth={1.4} />
          <text x={207} y={51} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700} fontFamily="JetBrains Mono, monospace">
            offset
          </text>
          <text x={140} y={20} textAnchor="middle" fill={VIZ.muted} fontSize={10.5}>
            Görüntü (sanal) adres — MİB üretir
          </text>
        </g>

        {/* TLB */}
        <rect x={40} y={110} width={200} height={110} rx={10} fill={VIZ.panel} stroke={stepIdx >= 1 ? (mode === 'tlb-hit' ? VIZ.green : VIZ.red) : VIZ.border} strokeWidth={stepIdx >= 1 ? 2 : 1} />
        <text x={140} y={130} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700}>
          TLB (çağrışımlı bellek)
        </text>
        {[
          { p: 5, b: 9 },
          { p: 12, b: 1 },
          { p: 30, b: 6 },
        ].map((row, i) => {
          const hot = stepIdx >= 1 && row.p === pageNo;
          return (
            <g key={row.p}>
              <rect x={52} y={140 + i * 24} width={176} height={20} rx={4} fill={hot ? `${VIZ.green}26` : 'transparent'} stroke={hot ? VIZ.green : VIZ.border} strokeWidth={hot ? 1.6 : 0.8} />
              <text x={140} y={154 + i * 24} textAnchor="middle" fill={hot ? VIZ.text : VIZ.muted} fontSize={10.5} fontFamily="JetBrains Mono, monospace">
                sayfa {row.p} → blok {row.b} · V=1 RWX
              </text>
            </g>
          );
        })}
        {stepIdx >= 1 && mode !== 'tlb-hit' && (
          <text x={140} y={236} textAnchor="middle" fill={VIZ.red} fontSize={11.5} fontWeight={700}>
            sayfa {pageNo} TLB’de yok → ISKA
          </text>
        )}
        <line x1={140} y1={64} x2={140} y2={110} stroke={VIZ.border} strokeWidth={2.5} markerEnd="url(#vm-a)" />
        <defs>
          <marker id="vm-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={VIZ.muted} />
          </marker>
        </defs>

        {/* sayfa tablosu */}
        <rect x={290} y={110} width={190} height={140} rx={10} fill={VIZ.panel} stroke={showPT ? (fault ? VIZ.red : VIZ.amber) : VIZ.border} strokeWidth={showPT ? 2 : 1} opacity={mode === 'tlb-hit' ? 0.45 : 1} />
        <text x={385} y={130} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700}>
          Sayfa Tablosu (ana bellekte)
        </text>
        {[
          { p: 2, v: mode === 'page-fault' && stepIdx < 4 ? 0 : 1, b: mode === 'page-fault' ? 5 : 8 },
          { p: 5, v: 1, b: 9 },
          { p: 7, v: 1, b: 3 },
        ].map((row, i) => {
          const hot = showPT && row.p === pageNo;
          return (
            <g key={row.p}>
              <rect x={302} y={140 + i * 26} width={166} height={22} rx={4} fill={hot ? (row.v ? `${VIZ.amber}26` : `${VIZ.red}26`) : 'transparent'} stroke={hot ? (row.v ? VIZ.amber : VIZ.red) : VIZ.border} strokeWidth={hot ? 1.6 : 0.8} />
              <text x={385} y={155 + i * 26} textAnchor="middle" fill={hot ? VIZ.text : VIZ.muted} fontSize={10.5} fontFamily="JetBrains Mono, monospace">
                sayfa {row.p} · V={row.v} {row.v ? `→ blok ${row.b}` : '→ diskte!'}
              </text>
            </g>
          );
        })}
        {showPT && <line x1={240} y1={165} x2={290} y2={165} stroke={VIZ.amber} strokeWidth={2.5} markerEnd="url(#vm-a)" />}

        {/* fiziksel bellek + disk */}
        <rect x={520} y={80} width={110} height={150} rx={10} fill={VIZ.panel} stroke={resolved ? VIZ.green : VIZ.border} strokeWidth={resolved ? 2 : 1} />
        <text x={575} y={100} textAnchor="middle" fill={VIZ.text} fontSize={11} fontWeight={700}>
          Fiziksel Bellek
        </text>
        {Array.from({ length: 4 }, (_, i) => (
          <g key={i}>
            <rect x={532} y={110 + i * 28} width={86} height={22} rx={4} fill={resolved && i === 1 ? `${VIZ.green}30` : 'transparent'} stroke={resolved && i === 1 ? VIZ.green : VIZ.border} strokeWidth={resolved && i === 1 ? 1.6 : 0.8} />
            <text x={575} y={125 + i * 28} textAnchor="middle" fill={VIZ.muted} fontSize={10} fontFamily="JetBrains Mono, monospace">
              blok {i === 1 ? (mode === 'tlb-hit' ? 9 : mode === 'tlb-miss' ? 3 : 5) : i * 4}
            </text>
          </g>
        ))}
        <rect x={520} y={250} width={110} height={40} rx={10} fill={VIZ.panel} stroke={fault && stepIdx === 3 ? VIZ.red : VIZ.border} strokeWidth={fault && stepIdx === 3 ? 2 : 1} />
        <text x={575} y={274} textAnchor="middle" fill={VIZ.muted} fontSize={11} fontWeight={700}>
          Disk
        </text>
        {fault && stepIdx === 3 && (
          <g>
            <line x1={575} y1={250} x2={575} y2={234} stroke={VIZ.red} strokeWidth={2.5} markerEnd="url(#vm-r)" />
            <defs>
              <marker id="vm-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={VIZ.red} />
              </marker>
            </defs>
            <text x={500} y={268} textAnchor="end" fill={VIZ.red} fontSize={10.5} fontWeight={700}>
              DMAC sayfayı diskten getiriyor…
            </text>
          </g>
        )}
        {resolved && (
          <g>
            <rect x={505} y={30} width={140} height={34} rx={7} fill={`${VIZ.green}20`} stroke={VIZ.green} strokeWidth={1.6} />
            <text x={575} y={51} textAnchor="middle" fill={VIZ.text} fontSize={11} fontWeight={700} fontFamily="JetBrains Mono, monospace">
              fiziksel adres ✓
            </text>
          </g>
        )}
      </svg>
    </VizShell>
  );
}
