import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * 5 katmanlı RISC iş hattının (IF·DR·EX·ME·WB) uzay-zaman diyagramı.
 * Kipler: ideal akış, veri çatışması (durdurma), operand yönlendirme ve
 * koşullu dallanma (boşaltma). Zamanla hücreler tek tek dolar; ders notlarındaki
 * (Buzluca 2.16–2.58) örnek programlar birebir kullanılmıştır.
 */

const STAGE_COLORS: Record<string, string> = {
  IF: VIZ.accent,
  DR: VIZ.cyan,
  EX: VIZ.amber,
  ME: VIZ.purple,
  WB: VIZ.green,
  '—': VIZ.red,
};

interface Row {
  label: string;
  /** çevrim → katman adı ('—' = durdurma kabarcığı, '' = boş) */
  cells: string[];
  killed?: boolean;
}

interface Scenario {
  rows: Row[];
  cycles: number;
  note: string;
  annotation?: { cycle: number; text: string };
}

const SCENARIOS: Record<string, Scenario> = {
  ideal: {
    cycles: 8,
    rows: [
      { label: 'Komut 1', cells: ['IF', 'DR', 'EX', 'ME', 'WB'] },
      { label: 'Komut 2', cells: ['', 'IF', 'DR', 'EX', 'ME', 'WB'] },
      { label: 'Komut 3', cells: ['', '', 'IF', 'DR', 'EX', 'ME', 'WB'] },
      { label: 'Komut 4', cells: ['', '', '', 'IF', 'DR', 'EX', 'ME', 'WB'] },
    ],
    note:
      'İdeal durum: dallanma ve veri bağımlılığı yok. İlk komut k = 5 çevrimde biter; iş hattı dolduktan sonra her çevrimde bir komut tamamlanır.',
    annotation: { cycle: 5, text: 'iş hattı doldu' },
  },
  hazard: {
    cycles: 8,
    rows: [
      { label: 'ADD R1,R2,R3', cells: ['IF', 'DR', 'EX', 'ME', 'WB'] },
      { label: 'SUB R3,R4,R5', cells: ['', 'IF', '—', '—', 'DR', 'EX', 'ME', 'WB'] },
    ],
    note:
      'SUB, R3 saklayıcısını ADD güncellemeden okumak ister (RAW — gerçek bağımlılık). Çatışma sezme birimi iş hattını durdurur; saklayıcı dosyası çevrimin ilk yarısında yazılıp ikinci yarısında okunduğu için gecikme 2 çevrimdir.',
    annotation: { cycle: 3, text: 'veri çatışması sezildi → durdur (stall)' },
  },
  forwarding: {
    cycles: 7,
    rows: [
      { label: 'ADD R1,R2,R3', cells: ['IF', 'DR', 'EX', 'ME', 'WB'] },
      { label: 'SUB R3,R4,R5', cells: ['', 'IF', 'DR', 'EX', 'ME', 'WB'] },
    ],
    note:
      'Operand yönlendirme (forwarding/bypass): ALU çıkışı (EX/ME saklayıcısı) doğrudan ALU girişine bağlanır. SUB, R3’ün güncel değerini saklayıcı dosyasından değil ALU çıkışından alır — durdurma gerekmez, performans düşmez.',
    annotation: { cycle: 4, text: 'EX → EX bypass' },
  },
  branch: {
    cycles: 8,
    rows: [
      { label: 'SUB R1,R2,R1', cells: ['IF', 'DR', 'EX', 'ME', 'WB'] },
      { label: 'BGT $1C', cells: ['', 'IF', 'DR', 'EX', 'ME', 'WB'] },
      { label: 'ADD R1,R1,R2', cells: ['', '', 'IF', 'DR'], killed: true },
      { label: 'ADD R3,R4,R2', cells: ['', '', '', 'IF'], killed: true },
      { label: 'Hedef: STL $00(R6),R2', cells: ['', '', '', '', 'IF', 'DR', 'EX', 'ME'] },
    ],
    note:
      'Koşullu dallanma: karar ve hedef adres EX katmanında belli olur. O ana dek iş hattına alınan iki komut, dallanma gerçekleşince WB’ye ulaşmadan boşaltılır (flush) — dallanma cezası 2 çevrim.',
    annotation: { cycle: 4, text: 'dallanma VAR → iş hattı boşaltılıyor' },
  },
};

const CELL = 52;
const ROWH = 40;
const LABELW = 168;
const STEP_SECONDS = 0.9;

export default function PipelineViz({ initialMode = 'ideal' }: { initialMode?: string }) {
  const [mode, setMode] = useState(initialMode);
  const player = useVizPlayer();
  const sc = SCENARIOS[mode] ?? SCENARIOS.ideal!;
  const currentCycle = Math.min(Math.floor(player.t / STEP_SECONDS) + 1, sc.cycles);

  const W = LABELW + sc.cycles * CELL + 16;
  const H = 46 + sc.rows.length * ROWH + 30;

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'ideal', label: 'İdeal' },
        { id: 'hazard', label: 'Veri çatışması' },
        { id: 'forwarding', label: 'Yönlendirme' },
        { id: 'branch', label: 'Dallanma' },
      ]}
      mode={mode}
      onMode={(m) => {
        setMode(m);
        player.reset();
      }}
      footer={<p>{sc.note}</p>}
    >
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="İş hattı uzay-zaman diyagramı">
        {/* çevrim başlıkları */}
        {Array.from({ length: sc.cycles }, (_, c) => (
          <text
            key={c}
            x={LABELW + c * CELL + CELL / 2}
            y={20}
            textAnchor="middle"
            fill={c + 1 === currentCycle ? VIZ.text : VIZ.muted}
            fontSize={12}
            fontWeight={c + 1 === currentCycle ? 800 : 500}
            fontFamily="JetBrains Mono, monospace"
          >
            {c + 1}
          </text>
        ))}
        <text x={LABELW - 10} y={20} textAnchor="end" fill={VIZ.muted} fontSize={10.5}>
          saat çevrimi →
        </text>
        {/* aktif çevrim sütunu */}
        <rect
          x={LABELW + (currentCycle - 1) * CELL}
          y={28}
          width={CELL}
          height={sc.rows.length * ROWH + 4}
          fill={VIZ.accentSoft}
          rx={8}
        />
        {/* satırlar */}
        {sc.rows.map((row, r) => {
          const y = 34 + r * ROWH;
          return (
            <g key={row.label}>
              <text
                x={LABELW - 10}
                y={y + ROWH / 2 + 4}
                textAnchor="end"
                fill={row.killed ? VIZ.red : VIZ.text}
                fontSize={11.5}
                fontFamily="JetBrains Mono, monospace"
                opacity={row.killed ? 0.8 : 1}
              >
                {row.label}
              </text>
              {row.cells.map((stage, c) => {
                if (!stage || c + 1 > currentCycle) return null;
                const x = LABELW + c * CELL;
                const isBubble = stage === '—';
                const wasKilled = row.killed && currentCycle >= 4;
                const color = STAGE_COLORS[stage] ?? VIZ.muted;
                return (
                  <g key={c} opacity={wasKilled ? 0.35 : 1}>
                    <rect
                      x={x + 3}
                      y={y + 3}
                      width={CELL - 6}
                      height={ROWH - 8}
                      rx={7}
                      fill={isBubble ? 'transparent' : `${color}2e`}
                      stroke={color}
                      strokeWidth={1.4}
                      strokeDasharray={isBubble || wasKilled ? '4 3' : undefined}
                    />
                    <text
                      x={x + CELL / 2}
                      y={y + ROWH / 2 + 3.5}
                      textAnchor="middle"
                      fill={color}
                      fontSize={11.5}
                      fontWeight={700}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {stage}
                    </text>
                    {wasKilled && (
                      <line
                        x1={x + 8}
                        y1={y + ROWH - 8}
                        x2={x + CELL - 8}
                        y2={y + 6}
                        stroke={VIZ.red}
                        strokeWidth={1.6}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* yönlendirme oku */}
        {mode === 'forwarding' && currentCycle >= 4 && (
          <g>
            <path
              d={`M ${LABELW + 2 * CELL + CELL / 2} ${34 + ROWH - 4} C ${LABELW + 2.7 * CELL} ${34 + ROWH * 1.35}, ${LABELW + 3 * CELL} ${34 + ROWH * 1.1} ${LABELW + 3 * CELL + CELL / 2} ${34 + ROWH + 6}`}
              fill="none"
              stroke={VIZ.green}
              strokeWidth={2.2}
              markerEnd="url(#pl-arrow)"
            />
            <defs>
              <marker id="pl-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={VIZ.green} />
              </marker>
            </defs>
          </g>
        )}
        {/* açıklama balonu */}
        {sc.annotation && currentCycle >= sc.annotation.cycle && (
          <text
            x={LABELW + sc.cycles * CELL - 4}
            y={H - 10}
            textAnchor="end"
            fill={VIZ.amber}
            fontSize={11.5}
            fontWeight={700}
          >
            ⚑ {sc.annotation.text}
          </text>
        )}
      </svg>
    </VizShell>
  );
}
