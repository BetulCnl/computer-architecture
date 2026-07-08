import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Bellek hiyerarşisi piramidi (Buzluca 6.1). Katmana tıklandığında boyut,
 * gecikme ve teknoloji bilgisi gösterilir.
 */
const LEVELS = [
  { id: 'L0', name: 'İç Saklayıcılar', size: '≈ 1 KB', time: '0,5–1 ns', tech: 'MİB içinde flip-flop; ALU’nun doğrudan çalıştığı en hızlı katman.' },
  { id: 'L1', name: 'L1 Cep Bellek', size: '≈ 64 KB', time: '2–3 ns', tech: 'Çekirdeğe özel SRAM; çoğunlukla komut ve veri için ayrı (Harvard).' },
  { id: 'L2', name: 'L2 Cep Bellek', size: '≈ 1 MB', time: '≈ 10 ns', tech: 'SRAM; günümüzde çekirdekler arasında paylaşılabilir (L3 ile birlikte).' },
  { id: 'L3', name: 'Ana Bellek', size: '≈ 4–64 GB', time: '50–100 ns', tech: 'DRAM; kapasite yüküyle saklama, periyodik tazeleme gerektirir.' },
  { id: 'L4', name: 'Yerel Disk (SSD/HDD)', size: '≈ 500 GB+', time: '≈ 0,1–10 ms', tech: 'Kalıcı saklama; verisi önce ana belleğe getirilir, doğrudan erişilmez.' },
  { id: 'L5', name: 'Uzak Saklama (Bulut)', size: 'sınırsız', time: '≈ 100 ms', tech: 'Dağıtık dosya sistemleri, web sunucuları, bulut depolama.' },
];

export default function MemoryHierarchyViz() {
  const [sel, setSel] = useState(1);
  const active = LEVELS[sel]!;

  return (
    <VizShell
      footer={
        <p>
          <strong style={{ color: VIZ.accent }}>{active.name}</strong> — boyut: {active.size} ·
          erişim: {active.time}. {active.tech} Yukarı çıktıkça <strong>hız ve birim maliyet
          artar</strong>, aşağı indikçe <strong>kapasite büyür</strong>; hiyerarşi, sık kullanılan
          veriyi üst katmanlarda tutarak ortalama erişim süresini düşürür.
        </p>
      }
    >
      <svg viewBox="0 0 660 320" role="img" aria-label="Bellek hiyerarşisi piramidi">
        {LEVELS.map((lv, i) => {
          const topW = 110 + i * 88;
          const botW = 110 + (i + 1) * 88;
          const y = 16 + i * 46;
          const isActive = i === sel;
          const cx = 300;
          return (
            <g key={lv.id} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <path
                d={`M ${cx - topW / 2} ${y} H ${cx + topW / 2} L ${cx + botW / 2} ${y + 42} H ${cx - botW / 2} Z`}
                fill={isActive ? `${VIZ.accent}30` : VIZ.panel}
                stroke={isActive ? VIZ.accent : VIZ.border}
                strokeWidth={isActive ? 2 : 1}
              />
              <text x={cx} y={y + 22} textAnchor="middle" fill={isActive ? VIZ.text : VIZ.muted} fontSize={12} fontWeight={700}>
                {lv.name}
              </text>
              <text x={cx} y={y + 36} textAnchor="middle" fill={isActive ? '#a8c7ff' : VIZ.muted} fontSize={9.5} fontFamily="JetBrains Mono, monospace">
                {lv.size} · {lv.time}
              </text>
            </g>
          );
        })}
        {/* eksen okları */}
        <line x1={620} y1={40} x2={620} y2={280} stroke={VIZ.green} strokeWidth={2} markerEnd="url(#mh-g)" />
        <text x={636} y={165} textAnchor="middle" fill={VIZ.green} fontSize={10.5} fontWeight={700} transform="rotate(90 636 165)">
          kapasite artar →
        </text>
        <line x1={40} y1={280} x2={40} y2={40} stroke={VIZ.amber} strokeWidth={2} markerEnd="url(#mh-a)" />
        <text x={24} y={165} textAnchor="middle" fill={VIZ.amber} fontSize={10.5} fontWeight={700} transform="rotate(-90 24 165)">
          hız ve maliyet artar →
        </text>
        <defs>
          <marker id="mh-g" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={VIZ.green} />
          </marker>
          <marker id="mh-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={VIZ.amber} />
          </marker>
        </defs>
      </svg>
    </VizShell>
  );
}
