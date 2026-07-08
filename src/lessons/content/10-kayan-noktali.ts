import type { Lesson } from '@/lessons/types';

/**
 * Ders 10 — Kayan Noktalı Sayılar (Floating Point)
 * Kaynak: itu_dersNotlari/10KaynakNoktalıSayılar_FloatingPointNumbers (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '10-kayan-noktali',
  order: 10,
  sourceFolder: '10KaynakNoktalıSayılar_FloatingPointNumbers',
  title: 'Kayan Noktalı Sayılar',
  subtitle:
    'Bilgisayar 0,1’i neden tam saklayamaz? Üstel gösterilim, IEEE 754 standardı, gizli 1, yükseltilmiş üs ve özel değerlerin (∞, NaN) dünyası.',
  minutes: 30,
  heroComponent: 'gpu',
  sections: [
    {
      kind: 'heading',
      id: 'ustel',
      title: 'Üstel (bilimsel) gösterilim',
      lead: 'Çok küçük ve çok büyük gerçel sayıları sınırlı bitlerle tutmanın yolu: sayıyı kesir ve üs olarak ikiye ayırmak.',
    },
    {
      kind: 'prose',
      body: [
        'Gösterim `±F × B^±E` biçimindedir: **F** kesir (mantis), **E** üs, **B** taban. Bellekte yalnız işaret, F ve E tutulur — taban tüm sayılar için aynı olduğundan (bilgisayarlarda B=2) saklanmaz. Örnek: 976.000.000.000.000 = +0,976×10¹⁵ → bellekte +976 ve +15.',
        'Aynı sayı üstel gösterimde birçok biçimde yazılabilir (3,14 = 314×10⁻² = 0,314×10¹). **Normalizasyon**, noktanın yerini sabit bir kurala bağlar; üs de ona göre ayarlanır. Böylece her sayının tek bir gösterimi olur ve karşılaştırma kolaylaşır.',
        'Üs işaretli bir sayıdır; işaretli sayıları karşılaştırmak zahmetlidir. Bu yüzden üs, saklanmadan önce sabit bir **ökçe** (bias) ile toplanarak hep pozitif yapılır — buna **yükseltilmiş üs** denir. k bitlik üs alanı için ökçe 2^(k−1) − 1 seçilir.',
      ],
    },
    {
      kind: 'heading',
      id: 'ieee754',
      title: 'IEEE 754 standardı',
      lead: '1985’ten beri neredeyse tüm bilgisayarların ortak dili: 32 bitlik single ve 64 bitlik double biçimler (güncel standartta half ve quadruple da var).',
    },
    {
      kind: 'table',
      head: ['Biçim', 'İşaret', 'Üs', 'Kesir', 'Ökçe (bias)'],
      rows: [
        ['Single (32 bit)', '1 bit', '8 bit', '23 bit', '127'],
        ['Double (64 bit)', '1 bit', '11 bit', '52 bit', '1023'],
      ],
    },
    {
      kind: 'prose',
      body: [
        'İkili düzende normalize sayının noktadan önceki basamağı her zaman 1’dir (sıfırdan farklı tek rakam budur): `1.F × 2^E`. Madem hep 1, saklamaya gerek yok — buna **gizli 1** (hidden one) denir ve mantise bedava bir bit kazandırır.',
        'Klasik örnek: (+22,625)₁₀ = (10110,101)₂ = **+1,0110101 × 2⁴**. İşaret 0; üs 4+127 = 131 = `10000011`; kesir `0110101…0` (gizli 1 atıldı, sağ taraf sıfırla dolduruldu). Ondalık kesri ikiliye çevirmek için 2 ile çarpma yöntemi kullanılır: 0,625 → 1(0,25) → 0(0,5) → 1(0) = 0,101.',
      ],
    },
    {
      kind: 'viz',
      viz: 'ieee754',
      title: 'İnteraktif · IEEE 754 Kodlayıcı',
      caption:
        '22.625’i inceleyin, sonra 0.1’i deneyin: kesir alanının periyodik olarak devam etmek "istediğini", ama 23 bitte kesildiğini görün. Bitlere tıklayarak sayının nasıl değiştiğini keşfedin.',
    },
    {
      kind: 'table',
      title: 'Özel değerler (single)',
      head: ['E', 'F', 'Anlamı'],
      rows: [
        ['0', '0', 'Sıfır — işaret bitine göre +0 ve −0 olmak üzere iki tane!'],
        ['255', '0', '±∞ (örneğin taşma sonucu)'],
        ['255', '≠0', 'NaN (Not a Number) — 0/0, ∞/∞ gibi tanımsız işlemler'],
        ['0', '≠0', 'Normalize olmayan (denormal) sayı — gizli 1 yok; 2⁻¹²⁶’dan küçük değerler'],
      ],
    },
    {
      kind: 'callout',
      tone: 'formula',
      title: 'Sınır değerleri',
      body: [
        'Normalize en küçük pozitif sayı (single): 2⁻¹²⁶',
        'Denormal biçimle inilebilen en küçük değer: 2⁻¹⁴⁹ — altı underflow',
        'En büyük sayı (single): (2 − 2⁻²³)×2¹²⁷ ≈ 10³⁸·⁵ ; (double): ≈ 10³⁰⁸·³',
      ],
    },
    {
      kind: 'prose',
      body: [
        'Kayan noktalı toplama/çıkarma bile başlı başına bir süreçtir: üsler karşılaştırılır, küçük üslü sayının mantisi kaydırılarak üsler eşitlenir, mantisler toplanır/çıkarılır, sonuç yeniden normalize edilir ve üs ayarlanır. Ders notlarındaki örnekte bu adımlar bir **aritmetik iş hattı** olarak gerçeklenir — 2. dersin iş hattı fikri, tek bir komutun içine kadar iner. GPU’ların binlerce çekirdeği tam da bu tür kayan noktalı iş hatlarından oluşur.',
      ],
    },
    {
      kind: 'model3d',
      component: 'gpu',
      title: 'Gerçek Donanım · Ekran Kartı',
      caption:
        'Modern bir GPU, saniyede trilyonlarca IEEE 754 işlemi yapan dev bir kayan noktalı hesap fabrikasıdır. Simülasyonda veri akışını izleyin.',
      sim: true,
    },
    {
      kind: 'quiz',
      question: 'IEEE 754’te üs neden 127 eklenerek ("yükseltilerek") saklanır?',
      options: [
        'Daha büyük sayılar gösterebilmek için',
        'Negatif üslerin saklanmasını gerektirmeden, sayıların büyüklük karşılaştırmasını basit tamsayı karşılaştırmasına indirgemek için',
        'Gizli 1 ile uyum sağlamak için',
        'NaN değerlerini kodlayabilmek için',
      ],
      answer: 1,
      explain:
        'Ökçe (bias) sayesinde üs alanı her zaman işaretsiz pozitif bir sayıdır. İki normalize sayının bit dizileri, neredeyse sıradan işaretsiz tamsayılar gibi karşılaştırılabilir — donanımda büyük kolaylık.',
    },
    {
      kind: 'quiz',
      question: '`0.1 + 0.2 == 0.3` karşılaştırması programlarda neden false çıkar?',
      options: [
        'Derleyici hatası olduğu için',
        '0,1 ve 0,2 ikili tabanda sonsuz periyodik kesirlerdir; 23/52 bitlik mantise yuvarlanarak sığdırılır ve toplamları 0,3’ün yuvarlanmış gösterimine denk gelmez',
        'Toplama işlemi üsleri yanlış eşitlediği için',
        'NaN üretildiği için',
      ],
      answer: 1,
      explain:
        'Onluk 0,1 = ikilik 0,000110011… (periyodik) — tam gösterilemez. Her sabit ve her ara sonuç yuvarlanır; biriken fark karşılaştırmayı bozar. Bu yüzden kayan noktalı eşitlik yerine tolerans (epsilon) karşılaştırması kullanılır.',
    },
  ],
};

export default lesson;
