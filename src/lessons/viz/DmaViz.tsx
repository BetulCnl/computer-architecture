import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * DMA veri aktarımı animasyonu. Blok diyagram: MİB, DMAC, bellek, G/Ç.
 * Kipler: blok aktarımı (burst) ve çevrim çalma (cycle stealing).
 * Yolun sahibi renkle gösterilir; veri G/Ç ↔ bellek arasında MİB'e uğramadan
 * akar (örtülü/fly-by DMA).
 */

const CYCLE = 6;

export default function DmaViz() {
  const [mode, setMode] = useState('burst');
  const player = useVizPlayer();
  const u = (player.t % CYCLE) / CYCLE;

  // faz hesabı
  // burst: 0-0.15 MİB'te, 0.15-0.2 BR/BG, 0.2-0.85 DMAC blok aktarır, 0.85-1 MİB
  // steal: her 0.25'lik dilimde: yarısı MİB, yarısı DMAC (tek sözcük)
  const isBurst = mode === 'burst';
  let busOwner: 'cpu' | 'dma' = 'cpu';
  let transferring = false;
  let handshake = false;
  if (isBurst) {
    if (u >= 0.15 && u < 0.2) handshake = true;
    if (u >= 0.2 && u < 0.85) {
      busOwner = 'dma';
      transferring = true;
    }
  } else {
    const seg = (u * 4) % 1;
    if (seg >= 0.4 && seg < 0.5) handshake = true;
    if (seg >= 0.5 && seg < 0.95) {
      busOwner = 'dma';
      transferring = true;
    }
  }

  const busColor = busOwner === 'dma' ? VIZ.green : VIZ.accent;
  const wordIndex = isBurst
    ? Math.floor(((u - 0.2) / 0.65) * 8)
    : Math.floor(u * 4);

  const Box = ({ x, y, w, h, label, sub, color }: { x: number; y: number; w: number; h: number; label: string; sub?: string; color: string }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={VIZ.panel} stroke={color} strokeWidth={1.6} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 5)} textAnchor="middle" fill={VIZ.text} fontSize={13} fontWeight={700}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={VIZ.muted} fontSize={10}>
          {sub}
        </text>
      )}
    </g>
  );

  // veri parçacığı: G/Ç (x≈520) → bellek (x≈340) yol üzerinden
  const p = !transferring ? 0 : isBurst ? (((u - 0.2) / 0.65) * 8) % 1 : (((u * 4) % 1) - 0.5) / 0.45;

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'burst', label: 'Blok aktarımı (Burst)' },
        { id: 'steal', label: 'Çevrim çalma (Cycle stealing)' },
      ]}
      mode={mode}
      onMode={(m) => {
        setMode(m);
        player.reset();
      }}
      footer={
        isBurst ? (
          <p>
            <strong>Blok aktarımı:</strong> DMAC yolu bir kez alır, önceden belirlenen blok boyu
            kadar veriyi (burada 8 sözcük) peş peşe aktarır, sonra yolu MİB&apos;e geri verir. En
            hızlı kiptir ama MİB uzun süre sistem yolundan yalıtılmış kalır — dosya/program
            yüklemede idealdir.
          </p>
        ) : (
          <p>
            <strong>Çevrim çalma:</strong> DMAC her seferinde yolu isteyip <em>tek bir sözcük</em>{' '}
            aktarır ve yolu hemen MİB&apos;e bırakır. MİB, komut çözme ve iç hesap gibi belleğe
            erişmeyen çevrimlerinde çalışmayı sürdürür; aktarım daha uzun sürer ama MİB uzun süre
            durdurulmaz.
          </p>
        )
      }
    >
      <svg viewBox="0 0 660 300" role="img" aria-label="DMA aktarımı">
        {/* sistem yolu */}
        <line x1={60} y1={170} x2={620} y2={170} stroke={busColor} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
        <text x={340} y={192} textAnchor="middle" fill={busColor} fontSize={11} fontWeight={700}>
          Sistem yolu — sahibi: {busOwner === 'dma' ? 'DMA denetçisi' : 'MİB'}
        </text>

        <Box x={60} y={40} w={150} h={80} label="MİB" sub={busOwner === 'cpu' ? 'yol çevrimi yapıyor' : 'iç işlemler sürüyor'} color={VIZ.accent} />
        <Box x={260} y={40} w={150} h={80} label="DMAC" sub={busOwner === 'dma' ? 'belleği adresliyor' : 'istek bekliyor'} color={VIZ.green} />
        <Box x={270} y={210} w={140} h={70} label="Bellek" color={VIZ.purple} />
        <Box x={480} y={210} w={140} h={70} label="G/Ç Arabirimi" sub="disk · ağ · ses" color={VIZ.amber} />

        {/* birim-yol bağlantıları */}
        <line x1={135} y1={120} x2={135} y2={165} stroke={VIZ.border} strokeWidth={4} />
        <line x1={335} y1={120} x2={335} y2={165} stroke={VIZ.border} strokeWidth={4} />
        <line x1={340} y1={175} x2={340} y2={210} stroke={VIZ.border} strokeWidth={4} />
        <line x1={550} y1={175} x2={550} y2={210} stroke={VIZ.border} strokeWidth={4} />

        {/* BR/BG el sıkışması */}
        {handshake && (
          <g>
            <path d="M 260 70 H 218" stroke={VIZ.red} strokeWidth={2} markerEnd="url(#dma-arrow-r)" />
            <text x={239} y={62} textAnchor="middle" fill={VIZ.red} fontSize={11} fontWeight={700}>
              BR
            </text>
            <path d="M 210 96 H 252" stroke={VIZ.green} strokeWidth={2} markerEnd="url(#dma-arrow-g)" />
            <text x={231} y={112} textAnchor="middle" fill={VIZ.green} fontSize={11} fontWeight={700}>
              BG
            </text>
          </g>
        )}
        <defs>
          <marker id="dma-arrow-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={VIZ.red} />
          </marker>
          <marker id="dma-arrow-g" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={VIZ.green} />
          </marker>
        </defs>

        {/* veri parçacıkları: G/Ç → yol → bellek */}
        {transferring &&
          [0, 0.25, 0.5].map((off) => {
            const q = (p + off) % 1;
            // 550,205 → 550,170 → 340,170 → 340,205
            let x: number;
            let y: number;
            if (q < 0.2) {
              x = 550;
              y = 205 - (q / 0.2) * 35;
            } else if (q < 0.8) {
              x = 550 - ((q - 0.2) / 0.6) * 210;
              y = 170;
            } else {
              x = 340;
              y = 170 + ((q - 0.8) / 0.2) * 35;
            }
            return <circle key={off} cx={x} cy={y} r={5.5} fill={VIZ.amber} stroke="#fff" strokeWidth={0.8} />;
          })}

        {/* aktarım sayacı */}
        {transferring && (
          <text x={340} y={26} textAnchor="middle" fill={VIZ.green} fontSize={12} fontWeight={700}>
            {isBurst
              ? `Blok aktarılıyor: ${Math.min(wordIndex + 1, 8)}/8 sözcük — yol MİB'e verilmiyor`
              : `Sözcük ${(wordIndex % 4) + 1} aktarılıyor — sonra yol hemen MİB'e dönecek`}
          </text>
        )}
        {!transferring && !handshake && (
          <text x={340} y={26} textAnchor="middle" fill={VIZ.accent} fontSize={12} fontWeight={700}>
            MİB sistem yolunu kullanıyor{isBurst ? '' : ' (DMAC sıradaki sözcük için istek hazırlıyor)'}
          </text>
        )}
        {handshake && (
          <text x={340} y={26} textAnchor="middle" fill={VIZ.red} fontSize={12} fontWeight={700}>
            DMAC yolu istiyor (BR) → MİB yol çevrimini bitirip yolu bırakıyor (BG)
          </text>
        )}
      </svg>
    </VizShell>
  );
}
