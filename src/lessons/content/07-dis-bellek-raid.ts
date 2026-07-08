import type { Lesson } from '@/lessons/types';

/**
 * Ders 07 — Dış Bellek Sistemi ve RAID
 * Kaynak: itu_dersNotlari/07DışBellekSistemi_RAID (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '07-dis-bellek-raid',
  order: 7,
  sourceFolder: '07DışBellekSistemi_RAID',
  title: 'Dış Bellek ve RAID',
  subtitle:
    'Dönen plakalardan disk dizilerine: manyetik disk geometrisi, erişim süresinin anatomisi, RAID düzeyleri ve belleklerde hata düzelten kodlar.',
  minutes: 40,
  heroComponent: 'ssd',
  sections: [
    {
      kind: 'heading',
      id: 'disk',
      title: 'Manyetik disk geometrisi',
      lead: 'Veriler; plakaların yüzeylerindeki eş merkezli izlere (track), izlerdeki sektörlere yazılır. Aynı hizadaki izler bir silindir oluşturur.',
    },
    {
      kind: 'prose',
      body: [
        'Her plakanın iki yüzeyi vardır; bir yüzeyde binlerce iz, bir izde yüzlerce **sektör** (çoğunlukla 512 bayt) bulunur. Komşu izler ve sektörler, kafanın doğru yeri okuması için boşluklarla ayrılır. Veriler sektörler halinde aktarılır.',
        'Kapasite çarpımla bulunur: (bayt/sektör) × (sektör/iz) × (iz/yüzey) × (yüzey/plaka) × (plaka/disk). Örnek: 512 × 300 × 20.000 × 2 × 5 ≈ 28,6 GB.',
      ],
    },
    {
      kind: 'viz',
      viz: 'disk-geometry',
      title: 'İnteraktif · Disk Erişimi Anatomisi',
      caption:
        'Bir sektör okumanın üç aşamasını izleyin. Sürenin neredeyse tamamı mekanik hareketlerde (konumlanma + dönüş) geçer.',
    },
    {
      kind: 'callout',
      tone: 'formula',
      title: 'Erişim süresi',
      body: [
        'Ta = Ts (konumlanma / seek, ~9 ms) + Tr (dönüş gecikmesi = yarım tur; 7200 RPM için ~4 ms) + Tt (aktarım; bir sektör için ~0,02 ms)',
        'Belirleyici bileşenler Ts ve Tr’dir — bu yüzden ardışık erişim, rastgele erişimden kat kat hızlıdır.',
      ],
    },
    {
      kind: 'prose',
      body: [
        'Disk kapasiteleri **alansal yoğunluk** (inç kareye düşen bit) artışıyla büyüdü: 1997–2003 arasında yılda %100 artışla kapasite her yıl ikiye katlandı; GB başına maliyet 1983–2011 arasında **milyon kat** iyileşti. Yine de DRAM, diskten ~100.000 kat düşük gecikmeye sahiptir (GB başına 30–150 kat pahalı olmak koşuluyla).',
        'İkisinin arasına **flash bellek** yerleşir: uçucu değildir, diskten 100–1000 kat hızlıdır, GB maliyeti diskin 15–25 katı ama DRAM’ın 15–20’de biridir. Düşük güç tüketimi onu taşınabilir cihazların standardı yaptı; sınırlı yazma ömrü ise sunucularda dikkatli kullanım gerektirir.',
      ],
    },
    {
      kind: 'model3d',
      component: 'ssd',
      title: 'Gerçek Donanım · NVMe SSD',
      caption:
        'Mekanik gecikmelerin hiçbirine sahip olmayan flash tabanlı depolama: denetçi, NAND yongaları ve DRAM önbelleği. Patlatılmış görünümde katmanları ayırın.',
      explode: 0.4,
    },
    {
      kind: 'heading',
      id: 'raid',
      title: 'RAID: Fazlalıklı Bağımsız Diskler Dizisi',
      lead: 'Tek büyük pahalı disk yerine paralel çalışan çok sayıda ucuz disk: performans paralellikten, güvenilirlik fazlalık bilgiden gelir.',
    },
    {
      kind: 'list',
      title: 'Tüm RAID düzeylerinin ortak üç özelliği',
      ordered: true,
      items: [
        'Birden fazla fiziksel disk, işletim sistemine **tek bir mantıksal disk** olarak görünür.',
        'Mantıksal olarak ardışık veriler, **şeritler** (strip) halinde farklı disklere dağıtılır; aynı sıradaki şeritler bir **bant** (stripe) oluşturur.',
        'Fazlalık olarak **eşlik (parity)** bilgileri tutulur; bir disk fiziksel olarak bozulduğunda içeriği yeniden oluşturulabilir.',
      ],
    },
    {
      kind: 'viz',
      viz: 'raid',
      title: 'İnteraktif · RAID Düzeyleri',
      caption:
        'Düzeyleri gezin ve "Disk 1’i boz" düğmesiyle arıza senaryosunu deneyin: RAID 0 veriyi kaybeder, diğerleri kurtarır.',
    },
    {
      kind: 'prose',
      body: [
        '**RAID 0** yalnızca şeritleme yapar: fazlalık yoktur, bu yüzden "gerçek" bir RAID sayılmaz; ama iki tür kazanç sağlar — büyük bir istek N şeride paralel erişir (aktarım hızı) ve farklı isteklerin farklı disklere düşme olasılığı yükselir (kuyruk bekleme süresi). Şerit boyu iş yüküne göre seçilir: büyük ardışık aktarımlar (video, kopyalama) küçük şerit; sık ve küçük rastgele istekler (veritabanı) büyük şerit ister.',
        '**RAID 1** aynalamadır: her veri iki diske yazılır (2N disk). Okuma iki kopyadan hızlı olanla yapılır, kurtarma anındadır; maliyet en yüksektir. **RAID 2**, Hamming kodu kullanır — ancak bozulan diskin hangisi olduğu fiziksel olarak zaten bilindiğinden bu karmaşıklık gereksizdir ve ticari kullanımı yoktur.',
        '**RAID 3**: senkron dönen diskler + küçük şeritler + veri sayısından bağımsız tek eşlik diski. Eşlik biti, aynı sıradaki bitlerin XOR’udur: `X4(i) = X0(i) ⊕ X1(i) ⊕ X2(i) ⊕ X3(i)`. Disk 1 bozulursa içeriği `X1 = X0 ⊕ X2 ⊕ X3 ⊕ X4` ile geri kazanılır — bu mekanizma RAID 3–6’nın hepsinde aynıdır. Büyük blok aktarımlarında (dosya sunucusu) mükemmel, bağımsız küçük erişimlerde zayıftır.',
        '**RAID 4**: bağımsız diskler + büyük şeritler + tek eşlik diski. Küçük bir yazmada bile eşlik güncellenmelidir; `X4′ = X4 ⊕ X1′ ⊕ X1` özdeşliği sayesinde bu iş 2 okuma + 2 yazmaya iner (**yazma cezası**) — ama eşlik diski her yazmada meşgul olduğundan **darboğaza** dönüşür. **RAID 5** eşlik bloklarını tüm disklere dağıtarak bu darboğazı ortadan kaldırır; en yaygın düzeylerdendir. **RAID 6** iki bağımsız eşlik (P ve Q) tutar: aynı anda iki disk bozulsa bile veri kurtarılır (N+2 disk).',
      ],
    },
    {
      kind: 'quiz',
      question: 'RAID 5’in RAID 4’e göre temel üstünlüğü nedir?',
      options: [
        'Daha az disk kullanması',
        'Eşlik bloklarını tüm disklere dağıtarak tek eşlik diski darboğazını ortadan kaldırması',
        'İki disk arızasına dayanması',
        'Eşlik yerine aynalama kullanması',
      ],
      answer: 1,
      explain:
        'RAID 4’te her yazma aynı eşlik diskine uğrar; bağımsız yazmalar bile birbirini bekler. RAID 5 eşliği döngüsel olarak dağıttığından farklı bantlardaki yazmalar farklı disklerin eşliklerini günceller ve paralel ilerleyebilir.',
    },
    {
      kind: 'heading',
      id: 'hamming',
      title: 'Belleklerde hata sezme ve düzeltme',
      lead: 'Fazlalık fikri diskle sınırlı değil: ana belleklerdeki tek bitlik bozulmalar (soft error) Hamming kodlarıyla anında düzeltilir.',
    },
    {
      kind: 'prose',
      body: [
        'Yazarken veriden k adet eşlik biti hesaplanıp birlikte saklanır; okurken eşlikler yeniden hesaplanır ve saklananlarla XOR’lanır. Çıkan k bitlik **sendrom** sıfırsa hata yoktur; sıfırdan farklıysa değeri, **hatalı bitin yerini** söyler — bit tümlenerek düzeltilir (SEC: Single Error Correction). m veri biti için gereken eşlik sayısı `m + k ≤ 2ᵏ − 1` koşulundan bulunur.',
        'Kod sözcüğünün sonuna bir tek/çift eşlik biti daha eklenirse çift hatalar da sezilir (**SEC-DED**). Sunucu belleklerindeki yaygın ECC kodlaması 64 veri + 7 + 1 = 72 bittir — yalnızca %12,5 fazlalıkla tek hata düzeltme, çift hata sezme.',
      ],
    },
    {
      kind: 'viz',
      viz: 'hamming',
      title: 'İnteraktif · 4:7 Hamming Kodu',
      caption:
        'Veri bitlerini değiştirin, sonra okunan koddaki herhangi bir bite tıklayıp bozun: sendromun hatayı nasıl bulduğunu izleyin.',
    },
    {
      kind: 'quiz',
      question: 'RAID 3’ün basit XOR eşliği normalde yalnız hata SEZEBİLİRKEN, disklerde neden hata DÜZELTEBİLİYOR?',
      options: [
        'XOR aslında her zaman hata düzeltir',
        'Diskler Hamming kodunu da birlikte kullandığı için',
        'Bozulan diskin HANGİSİ olduğu fiziksel olarak bilindiği için: yer bilgisi + eşlik = kayıp verinin yeniden hesaplanması',
        'Eşlik diski verinin tam kopyasını tuttuğu için',
      ],
      answer: 2,
      explain:
        'Hata düzeltmede asıl zorluk hatanın YERİNİ bulmaktır (Hamming sendromunun işi budur). Disk dizisinde arızalı disk kendini belli eder; yer bilindiğinde kayıp bitler, sağlam disklerin XOR’uyla doğrudan yeniden üretilir.',
    },
  ],
};

export default lesson;
