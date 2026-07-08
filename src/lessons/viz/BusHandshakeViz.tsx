import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Asenkron veri aktarımı zamanlama diyagramları: uyarmalı iletim (strobe) ve
 * el sıkışma (handshaking), kaynak/varış başlatmalı türleriyle. Dikey bir
 * zaman imleci diyagramı tarar; adım açıklaması altta eşzamanlı değişir.
 */

interface Signal {
  name: string;
  color: string;
  /** [başlangıç, bitiş, seviye] parçaları — u ∈ [0,1] zaman ekseni */
  segments: [number, number, 0 | 1 | 'data'][];
}

interface Scenario {
  signals: Signal[];
  steps: { at: number; text: string }[];
  summary: string;
}

const SCENARIOS: Record<string, Scenario> = {
  'strobe-src': {
    signals: [
      { name: 'Veri', color: VIZ.cyan, segments: [[0.15, 0.75, 'data']] },
      { name: 'Uyarı (kaynak)', color: VIZ.amber, segments: [[0, 0.25, 0], [0.25, 0.65, 1], [0.65, 1, 0]] },
    ],
    steps: [
      { at: 0.15, text: '① Kaynak veriyi yola koyar.' },
      { at: 0.25, text: '② Kaynak, uyarı (strobe) işaretini etkinleştirir: "yolda geçerli veri var".' },
      { at: 0.55, text: '③ Varış, veriyi önceden kararlaştırılan süre içinde yoldan örnekler.' },
      { at: 0.7, text: '④ Kaynak uyarıyı kaldırır ve veriyi yoldan çeker. Kaynak, verinin gerçekten alınıp alınmadığını BİLEMEZ.' },
    ],
    summary:
      'Kaynak başlatmalı uyarma: tek denetim işareti vardır. Basittir ama geri bildirim yoktur — gönderen, alıcının veriyi aldığından emin olamaz.',
  },
  'strobe-dst': {
    signals: [
      { name: 'Uyarı (varış)', color: VIZ.amber, segments: [[0, 0.2, 0], [0.2, 0.6, 1], [0.6, 1, 0]] },
      { name: 'Veri', color: VIZ.cyan, segments: [[0.3, 0.8, 'data']] },
    ],
    steps: [
      { at: 0.2, text: '① Varış, uyarı işaretiyle veri ister.' },
      { at: 0.3, text: '② Kaynak veriyi yola koyar.' },
      { at: 0.55, text: '③ Varış, kaynağın hızına göre belirlenen anda veriyi örnekler.' },
      { at: 0.75, text: '④ Alıcı, kaynağın veriyi gerçekten yola koyup koymadığını BİLEMEZ.' },
    ],
    summary:
      'Varış başlatmalı uyarma: isteği alıcı yapar; örnekleme anı kaynağın hızına göre önceden belirlenir. Yine geri bildirim yoktur.',
  },
  'hs-src': {
    signals: [
      { name: 'Veri', color: VIZ.cyan, segments: [[0.1, 0.78, 'data']] },
      { name: 'Veri geçerli (kaynak)', color: VIZ.amber, segments: [[0, 0.22, 0], [0.22, 0.62, 1], [0.62, 1, 0]] },
      { name: 'Veri kabul (varış)', color: VIZ.green, segments: [[0, 0.42, 0], [0.42, 0.78, 1], [0.78, 1, 0]] },
    ],
    steps: [
      { at: 0.1, text: '① Kaynak veriyi yola koyar.' },
      { at: 0.22, text: '② Kaynak "Veri geçerli" işaretini etkinleştirir.' },
      { at: 0.42, text: '③ Varış veriyi alır ve "Veri kabul" ile onaylar.' },
      { at: 0.62, text: '④ Kaynak onayı görünce "Veri geçerli"yi kaldırır.' },
      { at: 0.78, text: '⑤ Varış da "Veri kabul"ü kaldırır — çevrim tamamlanır. Her adım karşı tarafça DOĞRULANIR.' },
    ],
    summary:
      'El sıkışmada kaynak, "Veri kabul" gelinceye kadar veriyi yolda tutar. Arıza durumunda sonsuz beklemeyi önlemek için zaman aşımı (time-out) mekanizması kullanılır.',
  },
  'hs-dst': {
    signals: [
      { name: 'Hazır (varış)', color: VIZ.green, segments: [[0, 0.15, 0], [0.15, 0.6, 1], [0.6, 1, 0]] },
      { name: 'Veri', color: VIZ.cyan, segments: [[0.3, 0.85, 'data']] },
      { name: 'Veri geçerli (kaynak)', color: VIZ.amber, segments: [[0, 0.42, 0], [0.42, 0.72, 1], [0.72, 1, 0]] },
    ],
    steps: [
      { at: 0.15, text: '① Varış "Hazır" işaretiyle veri isteğini bildirir.' },
      { at: 0.3, text: '② Kaynak veriyi yola koyar.' },
      { at: 0.42, text: '③ Kaynak "Veri geçerli" ile verinin yolda olduğunu onaylar.' },
      { at: 0.6, text: '④ Varış veriyi alır, "Hazır"ı kaldırır.' },
      { at: 0.72, text: '⑤ Kaynak "Veri geçerli"yi kaldırır — çevrim biter. Varış, "Veri geçerli" gelinceye kadar bekler.' },
    ],
    summary:
      'Varış başlatmalı el sıkışma: isteği alıcı yapar, ama her adım yine karşılıklı onaylıdır. Zaman aşımı mekanizması burada da gereklidir.',
  },
};

const DURATION = 7;

export default function BusHandshakeViz() {
  const [mode, setMode] = useState('strobe-src');
  const player = useVizPlayer();
  const sc = SCENARIOS[mode] ?? SCENARIOS['strobe-src']!;
  const u = Math.min((player.t % DURATION) / (DURATION * 0.85), 1);

  const W = 660;
  const LX = 190;
  const PW = W - LX - 24;
  const ROW = 56;
  const H = 40 + sc.signals.length * ROW + 16;
  const activeStep = [...sc.steps].reverse().find((s) => u >= s.at);

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'strobe-src', label: 'Uyarma · kaynak' },
        { id: 'strobe-dst', label: 'Uyarma · varış' },
        { id: 'hs-src', label: 'El sıkışma · kaynak' },
        { id: 'hs-dst', label: 'El sıkışma · varış' },
      ]}
      mode={mode}
      onMode={(m) => {
        setMode(m);
        player.reset();
      }}
      footer={
        <div>
          <p style={{ minHeight: '2.6em', color: VIZ.text }}>
            {activeStep?.text ?? 'Animasyon zaman ekseni boyunca ilerler…'}
          </p>
          <p>{sc.summary}</p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Zamanlama diyagramı">
        {sc.signals.map((sig, i) => {
          const yBase = 34 + i * ROW + 34; // lojik 0 çizgisi
          const yHigh = yBase - 24;
          return (
            <g key={sig.name}>
              <text x={LX - 12} y={yBase - 8} textAnchor="end" fill={sig.color} fontSize={11.5} fontWeight={650}>
                {sig.name}
              </text>
              {sig.segments.map(([a, b, level], j) => {
                const x1 = LX + a * PW;
                const x2 = LX + b * PW;
                if (level === 'data') {
                  // veri yolu: geçerli veri şeridi
                  return (
                    <g key={j}>
                      <line x1={LX} y1={yBase - 12} x2={x1} y2={yBase - 12} stroke={VIZ.border} strokeWidth={1.4} />
                      <line x1={x2} y1={yBase - 12} x2={LX + PW} y2={yBase - 12} stroke={VIZ.border} strokeWidth={1.4} />
                      <path
                        d={`M ${x1} ${yBase - 12} L ${x1 + 8} ${yHigh} H ${x2 - 8} L ${x2} ${yBase - 12} L ${x2 - 8} ${yBase} H ${x1 + 8} Z`}
                        fill={`${sig.color}1f`}
                        stroke={sig.color}
                        strokeWidth={1.4}
                      />
                      <text x={(x1 + x2) / 2} y={yBase - 8} textAnchor="middle" fill={sig.color} fontSize={10.5} fontWeight={700}>
                        Geçerli Veri
                      </text>
                    </g>
                  );
                }
                const y = level === 1 ? yHigh : yBase;
                const prev = sig.segments[j - 1];
                return (
                  <g key={j}>
                    <line x1={x1} y1={y} x2={x2} y2={y} stroke={sig.color} strokeWidth={2} />
                    {prev && prev[2] !== level && (
                      <line x1={x1} y1={yHigh} x2={x1} y2={yBase} stroke={sig.color} strokeWidth={2} />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* zaman imleci */}
        <line x1={LX + u * PW} y1={20} x2={LX + u * PW} y2={H - 10} stroke={VIZ.text} strokeWidth={1.4} opacity={0.75} strokeDasharray="3 3" />
        <text x={LX} y={16} fill={VIZ.muted} fontSize={10.5}>
          zaman →
        </text>
      </svg>
    </VizShell>
  );
}
