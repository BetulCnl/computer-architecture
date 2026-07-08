import { useMemo, useState } from 'react';
import { VizShell, VIZ } from '@/lessons/viz/VizShell';

/**
 * IEEE 754 (32 bit, single) interaktif gösterim.
 * Kullanıcı ondalık bir sayı girer; işaret / yükseltilmiş üs / kesir alanları
 * bit bit gösterilir. Bitlere tıklanarak da sayı değiştirilebilir.
 * Özel değerler (0, ±∞, NaN, denormalize) tanınır.
 */

function encode(value: number): number {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setFloat32(0, value);
  return new DataView(buf).getUint32(0);
}

function decode(bits: number): number {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setUint32(0, bits);
  return new DataView(buf).getFloat32(0);
}

export default function Ieee754Viz() {
  const [input, setInput] = useState('22.625');
  const [bits, setBits] = useState(() => encode(22.625));

  const value = decode(bits);
  const sign = (bits >>> 31) & 1;
  const exp = (bits >>> 23) & 0xff;
  const frac = bits & 0x7fffff;

  const kind =
    exp === 0 && frac === 0
      ? `${sign ? '−' : '+'}0 (özel gösterilim: E=0, F=0)`
      : exp === 255 && frac === 0
        ? `${sign ? '−' : '+'}∞ (E=255, F=0)`
        : exp === 255
          ? 'NaN — Not a Number (E=255, F≠0); 0/0 gibi tanımsız işlemlerin sonucu'
          : exp === 0
            ? 'Normalize olmayan (denormal) sayı (E=0, F≠0) — 2⁻¹²⁶dan küçük değerler için; gizli 1 yoktur'
            : `Normalize sayı: (−1)^S × 1.F × 2^(E−127) — gizli 1 bellekte tutulmaz`;

  const expBits = exp.toString(2).padStart(8, '0');
  const fracBits = frac.toString(2).padStart(23, '0');

  const flip = (i: number) => setBits((b) => (b ^ (1 << (31 - i))) >>> 0);

  const apply = () => {
    const v = Number(input.replace(',', '.'));
    if (!Number.isNaN(v)) setBits(encode(v));
  };

  const BIT_W = 19;
  const startX = (660 - 32 * BIT_W) / 2;

  const bitCells = useMemo(() => {
    const all = `${sign}${expBits}${fracBits}`;
    return all.split('').map((b, i) => ({
      bit: b,
      field: i === 0 ? 'sign' : i <= 8 ? 'exp' : 'frac',
    }));
  }, [sign, expBits, fracBits]);

  const FIELD_COLOR = { sign: VIZ.red, exp: VIZ.amber, frac: VIZ.accent } as const;

  return (
    <VizShell
      footer={
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 12.5, display: 'flex', gap: 8, alignItems: 'center' }}>
              Ondalık sayı:
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
                style={{
                  background: 'transparent',
                  border: `1px solid ${VIZ.border}`,
                  borderRadius: 6,
                  color: VIZ.text,
                  padding: '5px 9px',
                  width: 120,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12.5,
                }}
              />
            </label>
            <button type="button" className="viz-btn" onClick={apply}>
              Kodla →
            </button>
            {['22.625', '0.1', '-1', '0', '1e40'].map((v) => (
              <button
                key={v}
                type="button"
                className="viz-mode"
                style={{ border: `1px solid ${VIZ.border}` }}
                onClick={() => {
                  setInput(v);
                  setBits(encode(Number(v)));
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <p>{kind}. Üs, karşılaştırmayı kolaylaştırmak için 127 &quot;ökçe&quot; (bias) ile
            yükseltilir: saklanan E = gerçek üs + 127. Bitlere tıklayarak da değiştirebilirsiniz.
          </p>
        </div>
      }
    >
      <svg viewBox="0 0 660 240" role="img" aria-label="IEEE 754 bit alanları">
        {/* bitler */}
        {bitCells.map((cell, i) => {
          const color = FIELD_COLOR[cell.field as keyof typeof FIELD_COLOR];
          return (
            <g key={i} onClick={() => flip(i)} style={{ cursor: 'pointer' }}>
              <rect x={startX + i * BIT_W} y={46} width={BIT_W - 2} height={30} rx={4} fill={`${color}20`} stroke={color} strokeWidth={0.9} />
              <text x={startX + i * BIT_W + BIT_W / 2 - 1} y={66} textAnchor="middle" fill={VIZ.text} fontSize={12} fontFamily="JetBrains Mono, monospace">
                {cell.bit}
              </text>
            </g>
          );
        })}
        {/* alan etiketleri */}
        <line x1={startX} y1={86} x2={startX + BIT_W - 2} y2={86} stroke={VIZ.red} strokeWidth={2} />
        <text x={startX + BIT_W / 2} y={102} textAnchor="middle" fill={VIZ.red} fontSize={10.5} fontWeight={700}>
          S
        </text>
        <line x1={startX + BIT_W} y1={86} x2={startX + 9 * BIT_W - 2} y2={86} stroke={VIZ.amber} strokeWidth={2} />
        <text x={startX + 5 * BIT_W} y={102} textAnchor="middle" fill={VIZ.amber} fontSize={10.5} fontWeight={700}>
          Üs E (8 bit) = {exp} {exp > 0 && exp < 255 ? `→ gerçek üs ${exp - 127}` : ''}
        </text>
        <line x1={startX + 9 * BIT_W} y1={86} x2={startX + 32 * BIT_W - 2} y2={86} stroke={VIZ.accent} strokeWidth={2} />
        <text x={startX + 20 * BIT_W} y={102} textAnchor="middle" fill={VIZ.accent} fontSize={10.5} fontWeight={700}>
          Kesir F — mantis (23 bit)
        </text>

        {/* çözümleme */}
        <text x={330} y={140} textAnchor="middle" fill={VIZ.text} fontSize={14} fontFamily="JetBrains Mono, monospace">
          {exp > 0 && exp < 255
            ? `(−1)^${sign} × 1.${fracBits.replace(/0+$/, '') || '0'}₂ × 2^${exp - 127}`
            : kind.split('—')[0]}
        </text>
        <text x={330} y={172} textAnchor="middle" fill={VIZ.green} fontSize={17} fontWeight={800} fontFamily="JetBrains Mono, monospace">
          = {Number.isNaN(value) ? 'NaN' : value === Infinity ? '+∞' : value === -Infinity ? '−∞' : value.toPrecision(9).replace(/\.?0+$/, '')}
        </text>
        <text x={330} y={210} textAnchor="middle" fill={VIZ.muted} fontSize={11}>
          32 bitte yalnız ~7 anlamlı ondalık basamak saklanabilir — 0.1 gibi sayılar tam gösterilemez,
          yuvarlama hatası kaçınılmazdır.
        </text>
      </svg>
    </VizShell>
  );
}
