import { useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * MESI cep bellek tutarlılık protokolü — interaktif simülasyon.
 * İki işlemcili SMP: kullanıcı MİB1/MİB2 için oku/yaz işlemleri tetikler,
 * X değişkeninin her iki cep bellekteki MESI durumları ve ana bellek
 * geçerliliği canlı izlenir (Buzluca 9.22-9.28).
 */

type S = 'M' | 'E' | 'S' | 'I';

interface SysState {
  c1: S;
  c2: S;
  memValid: boolean;
  log: string;
}

const COLORS: Record<S, string> = { M: VIZ.red, E: VIZ.amber, S: VIZ.green, I: VIZ.muted };
const NAMES: Record<S, string> = {
  M: 'Modified (değiştirilmiş)',
  E: 'Exclusive (özel)',
  S: 'Shared (paylaşılan)',
  I: 'Invalid (geçersiz)',
};

function step(st: SysState, cpu: 1 | 2, op: 'read' | 'write'): SysState {
  const me = cpu === 1 ? st.c1 : st.c2;
  const other = cpu === 1 ? st.c2 : st.c1;
  let nMe = me;
  let nOther = other;
  let memValid = st.memValid;
  let log = '';

  if (op === 'read') {
    if (me !== 'I') {
      log = `MİB${cpu}: okuma VURU — veri kendi cebinden okundu, durum değişmedi (${me}).`;
    } else {
      if (other === 'M') {
        nOther = 'S';
        memValid = true;
        nMe = 'S';
        log = `MİB${cpu}: okuma ISKA. Diğer cepteki değiştirilmiş kopya ana belleğe yazıldı (M→S); MİB${cpu} okudu (I→S).`;
      } else if (other === 'E' || other === 'S') {
        nOther = 'S';
        nMe = 'S';
        log = `MİB${cpu}: okuma ISKA. Diğer cep "paylaşıyorum" yanıtı verdi (→S); MİB${cpu} bellekten okudu (I→S).`;
      } else {
        nMe = 'E';
        log = `MİB${cpu}: okuma ISKA. Kopya başka cepte yok → bellekten okundu, durum I→E (özel).`;
      }
    }
  } else {
    if (me === 'M') {
      log = `MİB${cpu}: yazma VURU — tek değiştirilmiş kopya zaten kendinde; durum M kaldı.`;
    } else if (me === 'E') {
      nMe = 'M';
      memValid = false;
      log = `MİB${cpu}: yazma VURU — kopya özeldi, sessizce güncellendi (E→M). Ana bellek artık eski.`;
    } else if (me === 'S') {
      nMe = 'M';
      nOther = other === 'S' ? 'I' : other;
      memValid = false;
      log = `MİB${cpu}: yazma VURU (paylaşılan) — yola "geçersiz kıl" yayını yapıldı; diğer kopya I oldu, kendi S→M.`;
    } else {
      if (other === 'M') {
        nOther = 'I';
        nMe = 'M';
        memValid = false;
        log = `MİB${cpu}: yazma ISKA. Diğer cep değiştirilmiş kopyayı belleğe yazıp geçersiz kıldı (M→I); MİB${cpu} bloğu okuyup değiştirdi (I→M).`;
      } else {
        nOther = other === 'I' ? 'I' : 'I';
        nMe = 'M';
        memValid = false;
        log = `MİB${cpu}: yazma ISKA. "Değiştirme niyetiyle oku" yayını; diğer kopyalar geçersiz, blok okunup değiştirildi (I→M).`;
      }
    }
  }
  return cpu === 1 ? { c1: nMe, c2: nOther, memValid, log } : { c1: nOther, c2: nMe, memValid, log };
}

const INITIAL: SysState = {
  c1: 'I',
  c2: 'I',
  memValid: true,
  log: 'Başlangıç: X yalnız ana bellekte; her iki cep de geçersiz (I). Bir işlem seçin.',
};

export default function CacheCoherenceViz() {
  const [st, setSt] = useState<SysState>(INITIAL);

  const Cache = ({ cpu, state, x }: { cpu: number; state: S; x: number }) => (
    <g>
      <rect x={x} y={40} width={190} height={60} rx={10} fill={VIZ.panel} stroke={VIZ.accent} strokeWidth={1.4} />
      <text x={x + 95} y={65} textAnchor="middle" fill={VIZ.text} fontSize={13} fontWeight={750}>
        MİB {cpu}
      </text>
      <text x={x + 95} y={84} textAnchor="middle" fill={VIZ.muted} fontSize={10}>
        yerel cep bellek
      </text>
      <rect x={x + 25} y={116} width={140} height={44} rx={9} fill={`${COLORS[state]}1f`} stroke={COLORS[state]} strokeWidth={2} />
      <text x={x + 95} y={135} textAnchor="middle" fill={COLORS[state]} fontSize={13} fontWeight={800} fontFamily="JetBrains Mono, monospace">
        X : {state}
      </text>
      <text x={x + 95} y={152} textAnchor="middle" fill={VIZ.muted} fontSize={9}>
        {NAMES[state]}
      </text>
      <line x1={x + 95} y1={160} x2={x + 95} y2={196} stroke={VIZ.border} strokeWidth={4} />
    </g>
  );

  return (
    <VizShell
      footer={
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <button type="button" className="viz-btn" onClick={() => setSt((s) => step(s, 1, 'read'))}>
              MİB1: X&apos;i OKU
            </button>
            <button type="button" className="viz-btn" onClick={() => setSt((s) => step(s, 1, 'write'))}>
              MİB1: X&apos;e YAZ
            </button>
            <button type="button" className="viz-btn" onClick={() => setSt((s) => step(s, 2, 'read'))}>
              MİB2: X&apos;i OKU
            </button>
            <button type="button" className="viz-btn" onClick={() => setSt((s) => step(s, 2, 'write'))}>
              MİB2: X&apos;e YAZ
            </button>
            <button type="button" className="viz-btn ghost" onClick={() => setSt(INITIAL)}>
              ↺ Sıfırla
            </button>
          </div>
          <p style={{ minHeight: '2.6em', color: VIZ.text }}>{st.log}</p>
          <p>
            MESI, gözetlemeli (snoopy) bir <em>yazma-geçersiz kılma</em> protokolüdür: her cep
            denetçisi ortak yolu dinler ve yayınlara göre kendi kopyasının durumunu değiştirir.
          </p>
        </div>
      }
    >
      <svg viewBox="0 0 660 300" role="img" aria-label="MESI protokolü">
        <Cache cpu={1} state={st.c1} x={70} />
        <Cache cpu={2} state={st.c2} x={400} />
        {/* ortak yol */}
        <line x1={50} y1={202} x2={610} y2={202} stroke={VIZ.amber} strokeWidth={9} strokeLinecap="round" />
        <text x={330} y={224} textAnchor="middle" fill={VIZ.amber} fontSize={10.5} fontWeight={700}>
          paylaşılan ortak yol — denetçiler yayınları &quot;gözetler&quot; (snooping)
        </text>
        {/* ana bellek */}
        <rect x={240} y={240} width={180} height={48} rx={10} fill={VIZ.panel} stroke={st.memValid ? VIZ.green : VIZ.red} strokeWidth={1.8} />
        <text x={330} y={260} textAnchor="middle" fill={VIZ.text} fontSize={12} fontWeight={700}>
          Ana Bellek
        </text>
        <text x={330} y={278} textAnchor="middle" fill={st.memValid ? VIZ.green : VIZ.red} fontSize={10.5} fontWeight={700}>
          X kopyası: {st.memValid ? 'GÜNCEL' : 'ESKİ (geçersiz)'}
        </text>
        <line x1={330} y1={207} x2={330} y2={240} stroke={VIZ.border} strokeWidth={4} />
      </svg>
    </VizShell>
  );
}
