import type { Lesson } from '@/lessons/types';

/**
 * Ders 05 — Doğrudan Bellek Erişimi (DMA)
 * Kaynak: itu_dersNotlari/05DogrudanBellekErişimi_DMA (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '05-dma',
  order: 5,
  sourceFolder: '05DogrudanBellekErişimi_DMA',
  title: 'Doğrudan Bellek Erişimi (DMA)',
  subtitle:
    'Disk dosyası kopyalanırken işlemciniz neden yorulmaz? Çünkü veri taşıma işini MİB değil, sistem yolunu devralan özel bir denetçi yapar.',
  minutes: 35,
  heroComponent: 'ssd',
  sections: [
    {
      kind: 'heading',
      id: 'fikir',
      title: 'Temel fikir: yolu devret, işine bak',
      lead: 'Yoklamalı ve kesmeli yöntemlerde veri MİB üzerinden akar. DMA’da ise MİB gibi bellek adresleyebilen bir denetçi (DMAC) devreye girer.',
    },
    {
      kind: 'prose',
      body: [
        'DMA; disk, ekran kartı, ses kartı ve ağ kartı gibi birimlerle bellek arasında **yoğun, büyük bloklu** veri aktarımı için kullanılır. Ayrıca çok çekirdekli sistemlerde işlemciler arası aktarımda ve bellekten belleğe kopyalamada da işe yarar.',
        'MİB, veri aktarımı gerektiğinde DMAC’ı **koşullar** (programlar): hangi G/Ç arabirimi ile hangi bellek bölgesi arasında ne kadar veri aktarılacağını denetçinin saklayıcılarına yazar. Bu andan sonra G/Ç işi DMAC’ındır: G/Ç birimi hazır olduğunda DMAC sistem yolunu MİB’den ister (**BR — Bus Request**), MİB o anki *yol çevrimini* (komutunu değil!) bitirip kendini yoldan yalıtır ve **BG (Bus Grant)** ile yanıtlar. Aktarım sırasında MİB, bellek gerektirmeyen iç işlerine devam edebilir. Önemli bir ayrıntı: MİB, DMAC isteklerini kesmeler gibi maskeleyemez.',
        'Bir DMAC’ın içinde tipik olarak adres saklayıcısı, **sözcük sayacı**, denetim ve durum saklayıcıları bulunur. İki tip vardır: **açık (flow-through) DMA’da** veri önce DMAC’a okunur sonra hedefe yazılır; **örtülü (fly-by) DMA’da** DMAC yalnızca adres ve denetim işaretlerini üretir, veri G/Ç ile bellek arasında doğrudan tek çevrimde akar — daha hızlıdır ama tek adres kullanıldığından bellekten belleğe aktarım yapamaz.',
      ],
    },
    {
      kind: 'viz',
      viz: 'dma',
      title: 'İnteraktif · DMA Aktarım Kipleri',
      caption:
        'BR/BG el sıkışmasını ve yolun sahipliğini izleyin. Veri parçacıklarının MİB’e hiç uğramadan G/Ç’den belleğe aktığına dikkat edin (örtülü DMA).',
    },
    {
      kind: 'list',
      title: 'Üç aktarım kipi',
      items: [
        '**Blok aktarımı (burst):** DMAC yolu alır ve blok bitene kadar bırakmaz. En hızlısıdır; MİB uzun süre yoldan yalıtılır. Program/dosya yüklemede idealdir — MİB zaten o veriyi bekliyordur.',
        '**Çevrim çalma (cycle stealing):** her seferinde tek sözcük aktarılır, yol hemen MİB’e geri verilir. MİB komut çözme ve iç hesap çevrimlerinde çalışmayı sürdürür; aktarım uzar ama MİB uzun süre durmaz.',
        '**Saydam aktarım (transparent/hidden):** DMAC yalnızca MİB’in yolu kullanmadığı anlarda araya girer — MİB hiç yavaşlamaz; ama MİB’in komutlarını gözleyen pahalı ek donanım gerekir ve aktarım en uzun sürendir.',
      ],
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Sayılarla: kesme mi DMA mı?',
      body: [
        'Ders notlarındaki paralel örnek: aynı MİB’de 10 sözcüğün aktarımı kesmeli yöntemle 8700 ns sürerken, çevrim çalan örtülü DMA ile 1100 ns’de biter — üstelik bu sürede MİB 5 komut da yürütmüş olur. DMAC, MİB’in yürütme gibi belleğe erişmeyen çevrimlerinde aktarım yaparak zamanı ikiye katlar.',
      ],
    },
    {
      kind: 'quiz',
      question: 'Kesme hizmet programı (KHP) çalışırken DMAC’ın aktaracak verisi varsa ne olur?',
      options: [
        'DMAC, KHP bitene kadar bekler',
        'KHP de komutlardan oluşan bir program olduğundan DMAC, KHP’nin yol çevrimleri arasında aktarıma devam eder',
        'Kesme, DMA isteğini iptal eder',
        'Sistem kilitlenir',
      ],
      answer: 1,
      explain:
        'DMA ile kesme mekanizmaları bağımsızdır: DMAC yol isteklerini kesme çevriminin ve KHP’nin bellek erişimleri arasında da sürdürür. Kesmelerin yolun alınıp verilmesiyle ilgisi yoktur.',
    },
    {
      kind: 'heading',
      id: 'uc-hat',
      title: 'Üç hatlı DMA ve yol hakemi',
      lead: 'Sistemde birden fazla DMA denetçisi varsa yolun bir sonraki sahibini kim belirler?',
    },
    {
      kind: 'prose',
      body: [
        'MC68000, iki hatlı (BR/BG) düzene üçüncü bir işaret ekler: **BGACK (Bus Grant Acknowledge)**. BG artık "yolu verdim" değil "yolu vermeye hazırım" anlamına gelir; yolu devralan birim BGACK’i etkinleştirerek sahipliği ilan eder ve aktarım bitene dek etkin tutar. Devralmadan önce üç koşulu gözler: **AS′ etkisiz** (önceki yol çevrimi bitmiş — AS etkinken çevrim bölünemez), **DTACK′ etkisiz** (kimse yolu kullanmıyor) ve **BGACK etkisiz** (önceki sahip yolu bırakmış).',
        'Birden fazla denetçinin olduğu sistemlerde **yol hakemi** (bus arbiter) istekleri toplar, 68000’e tek BR iletir ve gelen BG’yi istekte bulunan en yüksek öncelikli denetçiye yönlendirir. BGACK üretemeyen iki hatlı denetçiler bağlanırsa BGACK işlemlerini hakem üstlenir.',
        'Bir adım ötesi **G/Ç işlemcisidir** (I/O Processor): MİB + DMAC + G/Ç arabirimlerinin birleşimi, kendi özel komut kümesi ve bazen yerel belleğiyle. MİB ona yalnızca "şu G/Ç programını çalıştır" der; İşlemci aktarımın yanında format dönüştürme, şifreleme ve hata düzeltme gibi işleri de yapar.',
      ],
    },
    {
      kind: 'heading',
      id: 'tas',
      title: 'Bölünemez yol çevrimi ve TAS',
      lead: 'Paylaşılan bir bayrağı "oku, test et, yaz" ile korumak ister misiniz? Bu üç adım bölünebiliyorsa koruma çöker.',
    },
    {
      kind: 'prose',
      body: [
        'Semafor gibi senkronizasyon yapıları için 68000, **TAS (Test-And-Set)** komutunu sunar: tek komut ve tek **oku-değiştir-yaz** yol çevrimi içinde bellek okunur, değer test edilir (Z/N bayrakları) ve en yüksek anlamlı biti 1 yapılıp geri yazılır. Bu dizi iki nedenle bölünemez: kesme istekleri komutları bölemez, ve tüm çevrim boyunca AS′ etkin kaldığından hiçbir DMAC ya da başka işlemci araya girip belleğe erişemez.',
        'Aynı denetim `TST` + `OR` gibi iki ayrı komutla yazılırsa, iki komutun arasında başka bir yol sahibi bayrağı değiştirebilir ve iki süreç aynı anda kritik bölgeye girebilir. Günümüzdeki atomik komutların (compare-and-swap vb.) atası bu fikirdir — 9. dersteki çok işlemcili senkronizasyonun da temelidir.',
      ],
    },
    {
      kind: 'model3d',
      component: 'ssd',
      title: 'Gerçek Donanım · NVMe SSD',
      caption:
        'Modern NVMe denetçileri, DMA’nın evrimleşmiş torunlarıdır: yüzlerce kuyruktan komut alıp veriyi PCIe üzerinden doğrudan ana belleğe taşırlar. Simülasyonda veri akışını izleyin.',
      sim: true,
    },
    {
      kind: 'quiz',
      question: 'Örtülü (fly-by) DMA ile bellekten belleğe kopyalama neden yapılamaz?',
      options: [
        'Bellek DMA isteklerini reddettiği için',
        'Aktarım sırasında yolda aynı anda yalnız TEK adres bulunduğundan; kaynak ve hedef adres aynı anda verilemez',
        'Örtülü DMA yalnız okuyabildiği için',
        'Sözcük sayacı bellek adreslerini saymadığı için',
      ],
      answer: 1,
      explain:
        'Örtülü DMA’da veri, DMAC üzerinden geçmeden kaynaktan hedefe tek çevrimde akar; DMAC yalnızca bir adres (bellek) ve denetim işaretleri üretir, G/Ç birimini de DMA Acknowledge ile seçer. İki farklı bellek adresi gerektiğinde açık (flow-through) DMA kullanılır.',
    },
  ],
};

export default lesson;
