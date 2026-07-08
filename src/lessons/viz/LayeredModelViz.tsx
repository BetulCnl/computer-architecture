import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

interface Layer {
  id: string;
  label: string;
  side: 'yazilim' | 'isa' | 'donanim';
  detail: string;
}

const LAYERS: Layer[] = [
  {
    id: 'app',
    label: 'Uygulamalar',
    side: 'yazilim',
    detail: 'Kullanıcının çalıştırdığı programlar: tarayıcı, oyun, hesap tablosu…',
  },
  {
    id: 'compiler',
    label: 'Derleyici · İşletim Sistemi · Sürücüler',
    side: 'yazilim',
    detail:
      'Yüksek düzeyli programları makine diline çeviren ve donanımı yöneten sistem yazılımları.',
  },
  {
    id: 'isa',
    label: 'Komut Kümesi Mimarisi (ISA)',
    side: 'isa',
    detail:
      'Yazılım ile donanım arasındaki sözleşme: makine dili komutları, programcıya görünen saklayıcılar ve doğal veri yapıları. Donanımın alt düzey programcıya görünen yüzüdür.',
  },
  {
    id: 'units',
    label: 'MİB · Bellek · Giriş/Çıkış',
    side: 'donanim',
    detail: 'Bilgisayarın ana işlevsel birimleri: işlemci, bellek ve çevre birim denetleyicileri.',
  },
  {
    id: 'digital',
    label: 'Sayısal Devreler',
    side: 'donanim',
    detail: 'Saklayıcılar, ALU, çoğullayıcılar… Lojik kapılardan kurulan işlevsel bloklar.',
  },
  {
    id: 'gates',
    label: 'Transistörler ve Kapılar',
    side: 'donanim',
    detail: 'En alt katman: silisyum üzerindeki transistörlerden oluşan lojik kapılar.',
  },
];

const SIDE_COLORS = { yazilim: VIZ.cyan, isa: VIZ.accent, donanim: VIZ.green } as const;
const SIDE_LABELS = { yazilim: 'Yazılım', isa: 'Arayüz', donanim: 'Donanım' } as const;

/** Bir bilgisayar sisteminin katmanlı modeli — katmana tıkla, açıklamasını gör. */
export default function LayeredModelViz() {
  const [active, setActive] = useState<Layer>(LAYERS[2]!);

  const H = 46;
  const GAP = 8;

  return (
    <VizShell
      footer={
        <p>
          <strong style={{ color: SIDE_COLORS[active.side] }}>{active.label}:</strong>{' '}
          {active.detail}
        </p>
      }
    >
      <svg viewBox="0 0 640 356" role="img" aria-label="Katmanlı bilgisayar modeli">
        {LAYERS.map((layer, i) => {
          const y = 12 + i * (H + GAP);
          const isActive = layer.id === active.id;
          const color = SIDE_COLORS[layer.side];
          const isIsa = layer.side === 'isa';
          return (
            <g
              key={layer.id}
              onClick={() => setActive(layer)}
              style={{ cursor: 'pointer' }}
              opacity={isActive ? 1 : 0.72}
            >
              <rect
                x={110}
                y={y}
                width={420}
                height={H}
                rx={10}
                fill={isActive ? `${color}22` : VIZ.panel}
                stroke={isActive ? color : VIZ.border}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isIsa ? '6 4' : undefined}
              />
              <text
                x={320}
                y={y + H / 2 + 4.5}
                textAnchor="middle"
                fill={isActive ? VIZ.text : VIZ.muted}
                fontSize={13.5}
                fontWeight={isIsa ? 700 : 600}
                fontFamily="Inter, sans-serif"
              >
                {layer.label}
              </text>
            </g>
          );
        })}
        {/* yan etiketler */}
        <text x={70} y={72} textAnchor="middle" fill={VIZ.cyan} fontSize={11.5} fontWeight={700} transform="rotate(-90 70 72)">
          {SIDE_LABELS.yazilim}
        </text>
        <text x={70} y={260} textAnchor="middle" fill={VIZ.green} fontSize={11.5} fontWeight={700} transform="rotate(-90 70 260)">
          {SIDE_LABELS.donanim}
        </text>
        <line x1={84} y1={16} x2={84} y2={118} stroke={VIZ.cyan} strokeWidth={2} strokeLinecap="round" />
        <line x1={84} y1={182} x2={84} y2={344} stroke={VIZ.green} strokeWidth={2} strokeLinecap="round" />
        <text x={556} y={148} fill={VIZ.accent} fontSize={11} fontWeight={700}>
          Sözleşme
        </text>
      </svg>
    </VizShell>
  );
}
