import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * 2 bitlik dinamik dallanma öngörüsü — interaktif sonlu durumlu makine.
 * Kullanıcı "dallanma oldu / olmadı" düğmeleriyle gerçek sonucu girer;
 * otomat durum değiştirir, öngörü isabeti sayılır. Ders notlarındaki
 * (Buzluca 2.70) klasik 2-bit otomat: karar ancak peş peşe iki yanlış
 * öngörüden sonra değişir.
 */

type StateId = '11' | '10' | '01' | '00';

const STATES: Record<StateId, { x: number; y: number; predict: boolean; label: string }> = {
  '11': { x: 130, y: 90, predict: true, label: 'Güçlü VAR' },
  '10': { x: 380, y: 90, predict: true, label: 'Zayıf VAR' },
  '01': { x: 380, y: 240, predict: false, label: 'Zayıf YOK' },
  '00': { x: 130, y: 240, predict: false, label: 'Güçlü YOK' },
};

/** klasik 2-bit öngörü otomatı geçişleri (Buzluca 2.70) */
const NEXT: Record<StateId, { taken: StateId; notTaken: StateId }> = {
  '11': { taken: '11', notTaken: '10' },
  '10': { taken: '11', notTaken: '00' },
  '01': { taken: '11', notTaken: '00' },
  '00': { taken: '01', notTaken: '00' },
};

export default function BranchPredictionViz() {
  const [state, setState] = useState<StateId>('11');
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [last, setLast] = useState<string | null>(null);

  const apply = (taken: boolean) => {
    const predicted = STATES[state].predict;
    const correct = predicted === taken;
    setStats((s) => (correct ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 }));
    setLast(
      `Öngörü: dallanma ${predicted ? 'VAR' : 'YOK'} · Gerçekleşen: ${taken ? 'VAR' : 'YOK'} → ${
        correct ? 'doğru ✓' : 'yanlış ✗ (iş hattı boşaltılır)'
      }`,
    );
    setState(NEXT[state][taken ? 'taken' : 'notTaken']);
  };

  const edge = (from: StateId, to: StateId, taken: boolean) => {
    const a = STATES[from];
    const b = STATES[to];
    const color = taken ? VIZ.green : VIZ.red;
    if (from === to) {
      // kendine dönen ok
      const left = a.x < 250;
      return (
        <g key={`${from}-${taken}`}>
          <path
            d={`M ${a.x + (left ? -58 : 58)} ${a.y - 14} C ${a.x + (left ? -110 : 110)} ${a.y - 44}, ${a.x + (left ? -110 : 110)} ${a.y + 16}, ${a.x + (left ? -58 : 58)} ${a.y + 14}`}
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            markerEnd="url(#bp-arrow)"
            opacity={0.75}
          />
        </g>
      );
    }
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    // çift yönlü kenarlarda çakışmayı önlemek için hafif kaydırma
    const off = 10;
    const px = -uy * off;
    const py = ux * off;
    return (
      <line
        key={`${from}-${to}-${taken}`}
        x1={a.x + ux * 66 + px}
        y1={a.y + uy * 34 + py}
        x2={b.x - ux * 66 + px}
        y2={b.y - uy * 34 + py}
        stroke={color}
        strokeWidth={1.6}
        markerEnd="url(#bp-arrow)"
        opacity={0.75}
      />
    );
  };

  return (
    <VizShell
      footer={
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <button type="button" className="viz-btn" onClick={() => apply(true)}>
              Dallanma OLDU
            </button>
            <button type="button" className="viz-btn" onClick={() => apply(false)}>
              Dallanma OLMADI
            </button>
            <button
              type="button"
              className="viz-btn ghost"
              onClick={() => {
                setState('11');
                setStats({ correct: 0, wrong: 0 });
                setLast(null);
              }}
            >
              ↺ Sıfırla
            </button>
          </div>
          <p>
            {last ?? 'Gerçek sonucu düğmelerle girin; otomatın kararını izleyin.'}{' '}
            <strong style={{ color: VIZ.green }}>{stats.correct} doğru</strong> ·{' '}
            <strong style={{ color: VIZ.red }}>{stats.wrong} yanlış</strong> öngörü. Karar ancak peş
            peşe iki yanlış öngörüden sonra değişir — iç içe döngülerde 1-bit yönteme göre daha az
            hata yapar.
          </p>
        </div>
      }
    >
      <svg viewBox="0 0 520 330" role="img" aria-label="2 bit dallanma öngörü otomatı">
        <defs>
          <marker id="bp-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={VIZ.muted} />
          </marker>
        </defs>
        {edge('11', '11', true)}
        {edge('11', '10', false)}
        {edge('10', '11', true)}
        {edge('10', '00', false)}
        {edge('01', '11', true)}
        {edge('01', '00', false)}
        {edge('00', '01', true)}
        {edge('00', '00', false)}
        {(Object.keys(STATES) as StateId[]).map((id) => {
          const s = STATES[id];
          const active = id === state;
          const color = s.predict ? VIZ.green : VIZ.red;
          return (
            <g key={id}>
              <ellipse
                cx={s.x}
                cy={s.y}
                rx={66}
                ry={34}
                fill={active ? `${color}26` : VIZ.panel}
                stroke={active ? color : VIZ.border}
                strokeWidth={active ? 2.5 : 1}
              />
              <text x={s.x} y={s.y - 4} textAnchor="middle" fill={active ? VIZ.text : VIZ.muted} fontSize={13} fontWeight={800} fontFamily="JetBrains Mono, monospace">
                {id}
              </text>
              <text x={s.x} y={s.y + 14} textAnchor="middle" fill={color} fontSize={10.5} fontWeight={700}>
                {s.label} → {s.predict ? 'dallan' : 'dallanma'}
              </text>
            </g>
          );
        })}
        <text x={260} y={320} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
          yeşil ok: dallanma oldu · kırmızı ok: dallanma olmadı
        </text>
      </svg>
    </VizShell>
  );
}
