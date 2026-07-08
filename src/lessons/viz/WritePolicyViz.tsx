import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Yazma politikaları animasyonu: doğrudan yazma (write-through) ve bayraklı
 * sonradan yazma (flagged write-back). MİB'in art arda yazmaları sırasında
 * verinin nereye gittiği ve kirlenme (dirty) bitinin rolü gösterilir.
 */

const CYCLE = 8;

export default function WritePolicyViz() {
  const [mode, setMode] = useState('wt');
  const player = useVizPlayer();
  const u = (player.t % CYCLE) / CYCLE;
  const isWT = mode === 'wt';

  // 3 yazma (0.05, 0.3, 0.55), ardından 0.8'de blok kaldırma (WB'de geri yazma)
  const writes = [0.05, 0.3, 0.55];
  const writeActive = writes.find((w) => u >= w && u < w + 0.18);
  const wp = writeActive !== undefined ? (u - writeActive) / 0.18 : 0;
  const evicting = u >= 0.8;
  const dirty = !isWT && u >= writes[0]! + 0.1 && u < 0.93;

  const Box = ({ x, y, w, h, label, color, sub }: { x: number; y: number; w: number; h: number; label: string; color: string; sub?: string }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={VIZ.panel} stroke={color} strokeWidth={1.6} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 5)} textAnchor="middle" fill={VIZ.text} fontSize={13} fontWeight={700}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fill={VIZ.muted} fontSize={10}>
          {sub}
        </text>
      )}
    </g>
  );

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'wt', label: 'Doğrudan Yazma (WT)' },
        { id: 'wb', label: 'Sonradan Yazma (FWB)' },
      ]}
      mode={mode}
      onMode={(m) => {
        setMode(m);
        player.reset();
      }}
      footer={
        isWT ? (
          <p>
            <strong>Doğrudan yazma (write-through):</strong> her yazmada veri hem cep belleğe hem
            ana belleğe yazılır. Cep ve ana bellek her an tutarlıdır (+) ama her yazma yavaş ana
            belleği bekler (−). Blok kaldırılırken geri yazmaya gerek yoktur.
          </p>
        ) : (
          <p>
            <strong>Bayraklı sonradan yazma (flagged write-back):</strong> yazmalar yalnızca cep
            belleğe yapılır ve çerçevenin <em>kirlenme (dirty) biti</em> 1 yapılır. Blok cepten
            kaldırılırken kirliyse ana belleğe geri yazılır; hiç değişmediyse yazma masrafı hiç
            oluşmaz. Yazmalar hızlıdır (+) ama cep ile ana bellek geçici olarak tutarsızdır (−).
          </p>
        )
      }
    >
      <svg viewBox="0 0 660 260" role="img" aria-label="Yazma politikası animasyonu">
        <Box x={40} y={80} w={130} h={80} label="MİB" color={VIZ.accent} sub={writeActive !== undefined ? 'STORE yürütüyor' : ''} />
        <Box x={260} y={80} w={150} h={80} label="Cep Bellek" color={VIZ.green} sub={`blok: X ${dirty ? '· D=1 (kirli)' : !isWT ? '· D=0' : ''}`} />
        <Box x={490} y={80} w={140} h={80} label="Ana Bellek" color={VIZ.purple} />

        <line x1={170} y1={120} x2={260} y2={120} stroke={VIZ.border} strokeWidth={5} />
        <line x1={410} y1={120} x2={490} y2={120} stroke={VIZ.border} strokeWidth={5} />

        {/* kirlenme biti rozet */}
        {!isWT && (
          <g>
            <circle cx={398} cy={92} r={11} fill={dirty ? VIZ.red : VIZ.panel} stroke={dirty ? VIZ.red : VIZ.border} strokeWidth={1.4} />
            <text x={398} y={96} textAnchor="middle" fill={dirty ? '#fff' : VIZ.muted} fontSize={10} fontWeight={800}>
              D
            </text>
          </g>
        )}

        {/* yazma parçacıkları */}
        {writeActive !== undefined && (
          <>
            <circle cx={170 + wp * 90} cy={120} r={6} fill={VIZ.amber} stroke="#fff" strokeWidth={0.8} />
            {isWT && <circle cx={410 + wp * 80} cy={120} r={6} fill={VIZ.amber} stroke="#fff" strokeWidth={0.8} opacity={0.9} />}
          </>
        )}

        {/* kaldırma / geri yazma */}
        {evicting && (
          <g>
            {!isWT && dirty && (
              <>
                <circle cx={410 + ((u - 0.8) / 0.15) * 80} cy={120} r={6} fill={VIZ.red} stroke="#fff" strokeWidth={0.8} />
                <text x={450} y={150} textAnchor="middle" fill={VIZ.red} fontSize={11} fontWeight={700}>
                  kirli blok geri yazılıyor
                </text>
              </>
            )}
            <text x={330} y={40} textAnchor="middle" fill={VIZ.amber} fontSize={12} fontWeight={700}>
              Blok cepten kaldırılıyor (yer değiştirme)…
              {isWT ? ' geri yazmaya gerek yok — ana bellek zaten güncel.' : ''}
            </text>
          </g>
        )}
        {writeActive !== undefined && (
          <text x={330} y={40} textAnchor="middle" fill={VIZ.amber} fontSize={12} fontWeight={700}>
            Yazma #{writes.indexOf(writeActive) + 1}: {isWT ? 'cep + ana bellek birlikte güncelleniyor' : 'yalnız cep bellek güncelleniyor, D←1'}
          </text>
        )}

        {/* sayaç: ana bellek yazma sayısı */}
        <text x={330} y={230} textAnchor="middle" fill={VIZ.muted} fontSize={11.5}>
          Bu çevrimdeki ana bellek yazma sayısı:{' '}
          <tspan fill={VIZ.text} fontWeight={700}>
            {isWT
              ? writes.filter((w) => u >= w + 0.18).length + (writeActive !== undefined && wp > 0.9 ? 1 : 0)
              : evicting && u >= 0.93
                ? 1
                : 0}
          </tspan>
          {isWT ? ' (her yazmada bir)' : ' (yalnız kaldırma anında, blok kirliyse)'}
        </text>
      </svg>
    </VizShell>
  );
}
