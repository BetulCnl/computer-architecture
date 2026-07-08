import { useState } from 'react';
import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Kesme öncelik devreleri: papatya zinciri (seri) ve paralel öncelik
 * (öncelik kodlayıcısı). Animasyon "kesme kabul" işaretinin yolculuğunu ve
 * vektör numarasının veri yoluna çıkışını gösterir.
 * Senaryo: Kaynak 2 ile Kaynak 3 aynı anda istekte bulunur — öncelik 2'de.
 */

const CYCLE = 8;

export default function BusArbitrationViz() {
  const [mode, setMode] = useState('daisy');
  const player = useVizPlayer();
  const u = (player.t % CYCLE) / CYCLE;

  // fazlar: 0-0.2 istekler, 0.2-0.6 kabul yayılımı, 0.6-0.85 vektör, 0.85-1 khp
  const requesting = u >= 0.1;
  const ackPhase = u >= 0.25;
  const vectorPhase = u >= 0.65;

  const RING_X = [150, 330, 510];
  const ackProgress = Math.min(Math.max((u - 0.25) / 0.35, 0), 1);

  const footer =
    mode === 'daisy' ? (
      <p>
        <strong>Papatya zinciri (donanım yoklaması):</strong> MİB&apos;in kesme kabul işareti
        halkalardan <em>seri</em> geçer. İstekte bulunmayan halka işareti bir sonrakine iletir;
        istekte bulunan ilk halka işareti keser ve vektör numarasını veri yoluna koyar. Zincirin
        başındaki kaynak her zaman en yüksek önceliklidir — öncelik, fiziksel bağlantı sırasıyla
        belirlenir.
      </p>
    ) : (
      <p>
        <strong>Paralel öncelik devresi:</strong> Tüm istekler bir kesme istek saklayıcısında
        tutulur ve <em>öncelik kodlayıcısına</em> (priority encoder) paralel girer. Kodlayıcı, aynı
        anda gelen isteklerden en yüksek öncelikli olanın numarasını üretir; maske saklayıcısı ile
        istenen kaynaklar yazılımla engellenebilir. Karar tek adımda verilir — zincir gecikmesi
        yoktur.
      </p>
    );

  return (
    <VizShell
      player={player}
      modes={[
        { id: 'daisy', label: 'Papatya Zinciri' },
        { id: 'parallel', label: 'Paralel Öncelik' },
      ]}
      mode={mode}
      onMode={(m) => {
        setMode(m);
        player.reset();
      }}
      footer={footer}
    >
      {mode === 'daisy' ? (
        <svg viewBox="0 0 660 300" role="img" aria-label="Papatya zinciri">
          {/* MİB */}
          <rect x={20} y={60} width={90} height={70} rx={10} fill={VIZ.panel} stroke={VIZ.accent} strokeWidth={1.6} />
          <text x={65} y={100} textAnchor="middle" fill={VIZ.text} fontSize={13} fontWeight={750}>
            MİB
          </text>
          {/* INT hattı */}
          <line x1={65} y1={130} x2={65} y2={260} stroke={requesting ? VIZ.red : VIZ.border} strokeWidth={2} />
          <line x1={65} y1={260} x2={570} y2={260} stroke={requesting ? VIZ.red : VIZ.border} strokeWidth={2} />
          <text x={80} y={252} fill={requesting ? VIZ.red : VIZ.muted} fontSize={10.5} fontWeight={700}>
            INT (ortak kesme isteği hattı)
          </text>
          {/* kabul hattı MİB → halka1 */}
          <line x1={110} y1={80} x2={RING_X[0]! - 45} y2={80} stroke={ackPhase ? VIZ.green : VIZ.border} strokeWidth={2.4} markerEnd={ackPhase ? 'url(#ba-g)' : undefined} />
          <text x={112} y={70} fill={ackPhase ? VIZ.green : VIZ.muted} fontSize={10.5} fontWeight={700}>
            Kesme kabul
          </text>
          <defs>
            <marker id="ba-g" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={VIZ.green} />
            </marker>
          </defs>
          {/* halkalar */}
          {RING_X.map((x, i) => {
            const n = i + 1;
            const wants = requesting && (n === 2 || n === 3);
            const wins = n === 2;
            const ackArrived = ackPhase && ackProgress > i / 3;
            const passes = n === 1; // istek yok → PO ile iletir
            return (
              <g key={n}>
                <rect x={x - 45} y={50} width={110} height={60} rx={10} fill={ackArrived && wins ? `${VIZ.green}22` : VIZ.panel} stroke={ackArrived && wins ? VIZ.green : VIZ.border} strokeWidth={ackArrived && wins ? 2.2 : 1.2} />
                <text x={x + 10} y={75} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700}>
                  Halka {n}
                </text>
                <text x={x + 10} y={93} textAnchor="middle" fill={VIZ.muted} fontSize={9.5}>
                  öncelik {n}
                </text>
                {/* PO → sonraki halka */}
                {i < 2 && (
                  <line
                    x1={x + 65}
                    y1={80}
                    x2={RING_X[i + 1]! - 45}
                    y2={80}
                    stroke={ackPhase && ackProgress > (i + 0.8) / 3 && passes ? VIZ.green : VIZ.border}
                    strokeWidth={2.4}
                    markerEnd={ackPhase && passes && ackProgress > (i + 0.8) / 3 ? 'url(#ba-g)' : undefined}
                  />
                )}
                {/* kaynak */}
                <rect x={x - 45} y={160} width={110} height={54} rx={10} fill={wants ? `${VIZ.red}18` : VIZ.panel} stroke={wants ? VIZ.red : VIZ.border} strokeWidth={wants ? 1.8 : 1.2} />
                <text x={x + 10} y={183} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700}>
                  Kaynak {n}
                </text>
                <text x={x + 10} y={200} textAnchor="middle" fill={wants ? VIZ.red : VIZ.muted} fontSize={9.5} fontWeight={wants ? 700 : 400}>
                  {wants ? 'kesme isteği VAR' : 'istek yok'}
                </text>
                <line x1={x + 10} y1={110} x2={x + 10} y2={160} stroke={VIZ.border} strokeWidth={2} />
                <line x1={x + 10} y1={214} x2={x + 10} y2={260} stroke={wants ? VIZ.red : VIZ.border} strokeWidth={2} />
                {/* kazanan halkanın INTACK'i */}
                {ackArrived && wins && (
                  <text x={x + 10} y={137} textAnchor="middle" fill={VIZ.green} fontSize={10} fontWeight={700}>
                    INTACK ↓
                  </text>
                )}
                {/* halka 2 zinciri keser */}
                {ackArrived && wins && vectorPhase && (
                  <text x={x + 88} y={70} textAnchor="middle" fill={VIZ.red} fontSize={12} fontWeight={800}>
                    ✕
                  </text>
                )}
              </g>
            );
          })}
          {vectorPhase && (
            <text x={330} y={290} textAnchor="middle" fill={VIZ.amber} fontSize={12} fontWeight={700}>
              Kaynak 2 vektör numarasını veri yoluna koyuyor → MİB, KHP-2&apos;nin adresini tablodan alıyor.
              Kaynak 3 isteğini sürdürüyor.
            </text>
          )}
        </svg>
      ) : (
        <svg viewBox="0 0 660 300" role="img" aria-label="Paralel öncelik devresi">
          {/* kaynaklar */}
          {[1, 2, 3, 4].map((n, i) => {
            const wants = requesting && (n === 2 || n === 3);
            const y = 30 + i * 62;
            return (
              <g key={n}>
                <rect x={30} y={y} width={130} height={48} rx={9} fill={wants ? `${VIZ.red}18` : VIZ.panel} stroke={wants ? VIZ.red : VIZ.border} strokeWidth={wants ? 1.8 : 1.2} />
                <text x={95} y={y + 21} textAnchor="middle" fill={VIZ.text} fontSize={11.5} fontWeight={700}>
                  Kaynak {n}
                </text>
                <text x={95} y={y + 37} textAnchor="middle" fill={wants ? VIZ.red : VIZ.muted} fontSize={9.5}>
                  {wants ? 'istek VAR' : 'istek yok'}
                </text>
                <line x1={160} y1={y + 24} x2={250} y2={y + 24} stroke={wants ? VIZ.red : VIZ.border} strokeWidth={2} markerEnd={wants ? 'url(#pa-r)' : undefined} />
                <text x={205} y={y + 16} textAnchor="middle" fill={VIZ.muted} fontSize={9.5} fontFamily="JetBrains Mono, monospace">
                  I{n - 1}
                </text>
              </g>
            );
          })}
          <defs>
            <marker id="pa-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={VIZ.red} />
            </marker>
          </defs>
          {/* istek saklayıcısı + kodlayıcı */}
          <rect x={250} y={40} width={120} height={220} rx={10} fill={VIZ.panel} stroke={VIZ.border} />
          <text x={310} y={66} textAnchor="middle" fill={VIZ.text} fontSize={11} fontWeight={700}>
            Kesme İstek
          </text>
          <text x={310} y={82} textAnchor="middle" fill={VIZ.text} fontSize={11} fontWeight={700}>
            Saklayıcısı
          </text>
          <text x={310} y={110} textAnchor="middle" fill={VIZ.muted} fontSize={10} fontFamily="JetBrains Mono, monospace">
            {requesting ? '0 1 1 0' : '0 0 0 0'}
          </text>
          <text x={310} y={150} textAnchor="middle" fill={VIZ.text} fontSize={11} fontWeight={700}>
            + Maske
          </text>
          <text x={310} y={168} textAnchor="middle" fill={VIZ.muted} fontSize={10} fontFamily="JetBrains Mono, monospace">
            1 1 1 1
          </text>
          <rect x={410} y={80} width={140} height={140} rx={10} fill={ackPhase ? `${VIZ.green}14` : VIZ.panel} stroke={ackPhase ? VIZ.green : VIZ.border} strokeWidth={ackPhase ? 2 : 1.2} />
          <text x={480} y={135} textAnchor="middle" fill={VIZ.text} fontSize={12} fontWeight={750}>
            Öncelik
          </text>
          <text x={480} y={153} textAnchor="middle" fill={VIZ.text} fontSize={12} fontWeight={750}>
            Kodlayıcısı
          </text>
          <line x1={370} y1={150} x2={410} y2={150} stroke={requesting ? VIZ.red : VIZ.border} strokeWidth={2.4} markerEnd={requesting ? 'url(#pa-r)' : undefined} />
          {ackPhase && (
            <>
              <text x={480} y={185} textAnchor="middle" fill={VIZ.green} fontSize={11} fontWeight={700} fontFamily="JetBrains Mono, monospace">
                seçilen: Kaynak 2
              </text>
              <line x1={550} y1={150} x2={620} y2={150} stroke={VIZ.green} strokeWidth={2.4} markerEnd="url(#ba-g2)" />
              <defs>
                <marker id="ba-g2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={VIZ.green} />
                </marker>
              </defs>
              <text x={585} y={140} textAnchor="middle" fill={VIZ.green} fontSize={10} fontWeight={700}>
                INT → MİB
              </text>
            </>
          )}
          {vectorPhase && (
            <text x={330} y={290} textAnchor="middle" fill={VIZ.amber} fontSize={12} fontWeight={700}>
              INTACK gelince Kaynak 2&apos;nin vektör adresi saklayıcısına çıkış izni verilir (VAD → veri yolu).
            </text>
          )}
        </svg>
      )}
    </VizShell>
  );
}
