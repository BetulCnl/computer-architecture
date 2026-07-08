import { useVizPlayer } from '@/lessons/viz/useVizPlayer';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * Manyetik disk geometrisi ve erişim süresi animasyonu.
 * Plaka döner; kafa hedef ize konumlanır (Ts), hedef sektör kafanın altına
 * gelene dek dönüş beklenir (Tr), ardından sektör okunur (Tt).
 */

const CYCLE = 9;
const CX = 220;
const CY = 165;
const TRACKS = [55, 80, 105, 130];
const TARGET_TRACK = 1; // indeks
const SECTORS = 12;
const TARGET_SECTOR = 4;

export default function DiskGeometryViz() {
  const player = useVizPlayer();
  const u = (player.t % CYCLE) / CYCLE;

  // fazlar: 0-0.3 konumlanma (seek), 0.3-0.62 dönüş gecikmesi, 0.62-0.78 aktarım, sonra bekleme
  const phase = u < 0.3 ? 'seek' : u < 0.62 ? 'rot' : u < 0.78 ? 'transfer' : 'done';
  const spin = player.t * 1.6; // radyan

  // kafa: dıştan hedef ize
  const headR =
    phase === 'seek'
      ? TRACKS[3]! - (TRACKS[3]! - TRACKS[TARGET_TRACK]!) * (u / 0.3)
      : TRACKS[TARGET_TRACK]!;

  const sectorAngle = (i: number) => spin + (i * Math.PI * 2) / SECTORS;
  // hedef sektörün açısı; kafa sağda (açı 0)
  const targetA = ((sectorAngle(TARGET_SECTOR) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const reading = phase === 'transfer';

  const PHASES = [
    { id: 'seek', label: 'Konumlanma (Ts)', color: VIZ.amber, desc: 'Kafa, hedef izin üzerine mekanik olarak taşınıyor — ortalama ≈ 9 ms; erişim süresinin en büyük bileşeni.' },
    { id: 'rot', label: 'Dönüş gecikmesi (Tr)', color: VIZ.purple, desc: 'Hedef sektörün kafanın altına gelmesi bekleniyor — ortalama yarım tur; 7200 RPM diskte ≈ 4 ms.' },
    { id: 'transfer', label: 'Aktarım (Tt)', color: VIZ.green, desc: 'Sektör kafanın altından geçerken veri okunuyor — bir sektör için ≈ 0,02 ms; ihmal edilecek kadar küçük.' },
    { id: 'done', label: 'Tamamlandı', color: VIZ.accent, desc: 'Erişim bitti. Toplam süreyi konumlanma ve dönüş gecikmesi belirler; bu yüzden ardışık (sıralı) erişim rastgele erişimden kat kat hızlıdır.' },
  ];
  const current = PHASES.find((p) => p.id === phase)!;

  return (
    <VizShell
      player={player}
      footer={
        <p>
          <strong style={{ color: current.color }}>{current.label}:</strong> {current.desc}{' '}
          <code>Ta = Ts + Tr + Tt</code>
        </p>
      }
    >
      <svg viewBox="0 0 660 330" role="img" aria-label="Disk geometrisi">
        {/* plaka */}
        <circle cx={CX} cy={CY} r={145} fill={VIZ.panel} stroke={VIZ.border} />
        <circle cx={CX} cy={CY} r={30} fill="#1a1f2b" stroke={VIZ.border} />
        <text x={CX} y={CY + 4} textAnchor="middle" fill={VIZ.muted} fontSize={9}>
          mil
        </text>
        {/* izler */}
        {TRACKS.map((r, i) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={i === TARGET_TRACK ? VIZ.amber : VIZ.border} strokeWidth={i === TARGET_TRACK ? 1.6 : 1} strokeDasharray={i === TARGET_TRACK ? undefined : '3 4'} />
        ))}
        {/* sektör bölmeleri (dönen) */}
        {Array.from({ length: SECTORS }, (_, i) => {
          const a = sectorAngle(i);
          return (
            <line
              key={i}
              x1={CX + Math.cos(a) * 32}
              y1={CY + Math.sin(a) * 32}
              x2={CX + Math.cos(a) * 143}
              y2={CY + Math.sin(a) * 143}
              stroke={VIZ.border}
              strokeWidth={0.7}
              opacity={0.6}
            />
          );
        })}
        {/* hedef sektör yayı */}
        {(() => {
          const a0 = sectorAngle(TARGET_SECTOR);
          const a1 = sectorAngle(TARGET_SECTOR + 1);
          const r = TRACKS[TARGET_TRACK]!;
          const large = 0;
          return (
            <path
              d={`M ${CX + Math.cos(a0) * (r - 9)} ${CY + Math.sin(a0) * (r - 9)} A ${r - 9} ${r - 9} 0 ${large} 1 ${CX + Math.cos(a1) * (r - 9)} ${CY + Math.sin(a1) * (r - 9)} L ${CX + Math.cos(a1) * (r + 9)} ${CY + Math.sin(a1) * (r + 9)} A ${r + 9} ${r + 9} 0 ${large} 0 ${CX + Math.cos(a0) * (r + 9)} ${CY + Math.sin(a0) * (r + 9)} Z`}
              fill={reading ? `${VIZ.green}55` : `${VIZ.amber}33`}
              stroke={reading ? VIZ.green : VIZ.amber}
              strokeWidth={1.4}
            />
          );
        })()}
        {/* kafa kolu */}
        <line x1={CX + 200} y1={CY + 60} x2={CX + headR + 8} y2={CY} stroke="#3a4258" strokeWidth={7} strokeLinecap="round" />
        <circle cx={CX + headR} cy={CY} r={7} fill={reading ? VIZ.green : VIZ.amber} stroke="#fff" strokeWidth={1} />
        <text x={CX + 200} y={CY + 84} textAnchor="middle" fill={VIZ.muted} fontSize={10}>
          kafa kolu
        </text>

        {/* faz çubuğu */}
        {(() => {
          const segs = [
            { from: 0, to: 0.3, color: VIZ.amber, label: 'Ts ≈ 9 ms' },
            { from: 0.3, to: 0.62, color: VIZ.purple, label: 'Tr ≈ 4 ms' },
            { from: 0.62, to: 0.78, color: VIZ.green, label: 'Tt ≈ 0,02 ms' },
          ];
          return segs.map((s) => (
            <g key={s.label}>
              <rect x={430 + 0} y={80 + segs.indexOf(s) * 56} width={190} height={36} rx={8} fill={u >= s.from && u < s.to ? `${s.color}30` : VIZ.panel} stroke={u >= s.from && u < s.to ? s.color : VIZ.border} strokeWidth={u >= s.from && u < s.to ? 2 : 1} />
              <text x={525} y={102 + segs.indexOf(s) * 56} textAnchor="middle" fill={u >= s.from && u < s.to ? VIZ.text : VIZ.muted} fontSize={12} fontWeight={650}>
                {segs.indexOf(s) === 0 ? 'Konumlanma' : segs.indexOf(s) === 1 ? 'Dönüş gecikmesi' : 'Aktarım'} · {s.label}
              </text>
            </g>
          ));
        })()}
        <text x={525} y={60} textAnchor="middle" fill={VIZ.muted} fontSize={11.5} fontWeight={700}>
          7200 RPM örnek disk
        </text>
        {phase === 'done' && targetA < 0.6 && null}
      </svg>
    </VizShell>
  );
}
