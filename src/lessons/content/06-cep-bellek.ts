import type { Lesson } from '@/lessons/types';

/**
 * Ders 06 — Cep Bellek (Cache)
 * Kaynak: itu_dersNotlari/06CepBellek_CacheBellek (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '06-cep-bellek',
  order: 6,
  sourceFolder: '06CepBellek_CacheBellek',
  title: 'Cep Bellek (Cache)',
  subtitle:
    'İşlemci ile bellek arasındaki hız uçurumunu kapatan görünmez kahraman: bellek hiyerarşisi, yöresellik, dönüşüm yöntemleri ve yazma politikaları.',
  minutes: 50,
  heroComponent: 'ram',
  sections: [
    {
      kind: 'heading',
      id: 'hiyerarsi',
      title: 'Bellek hiyerarşisi',
      lead: 'Hızlı bellek pahalı, ucuz bellek yavaştır. Çözüm: her ikisinden uygun miktarda kullanıp sık erişilen veriyi hızlı katmanda tutan bir piramit kurmak.',
    },
    {
      kind: 'viz',
      viz: 'memory-hierarchy',
      title: 'İnteraktif · Bellek Piramidi',
      caption: 'Katmanlara tıklayın: saklayıcılardan buluta, her seviyede boyut ~1000 kat artarken hız benzer oranda düşer.',
    },
    {
      kind: 'prose',
      body: [
        'Sorunun boyutu 1. dersten tanıdık: 3,2 GHz’lik 4 çekirdekli bir Core i7’nin uç bant genişliği gereksinimi 409,6 GB/s iken DRAM tabanlı ana bellek bunun ancak %6’sını sağlar. Cep bellek (SRAM, MİB ile aynı yongada olabilir) küçük ama hızlıdır; ana bellek (DRAM) büyük ama yavaştır.',
        'Bu hiyerarşinin işe yaramasının nedeni **başvuru yöreselliğidir** (locality of reference): programların çoğu, çalışma zamanlarının %90’ını kodun yalnızca %10’unda geçirir. **Zamanda yöresellik**: bir adrese erişildiyse yakında yine erişilecektir (döngüler). **Coğrafi/uzayda yöresellik**: bir erişimin ardından büyük olasılıkla yakın bir adrese erişilir (ardışık komutlar, diziler, tablolar).',
      ],
    },
    {
      kind: 'table',
      title: 'DRAM ve SRAM',
      head: ['Özellik', 'DRAM (ana bellek)', 'SRAM (cep bellek)'],
      rows: [
        ['Hücre yapısı', '1 transistör + kapasite', 'Flip-flop, 6 transistör'],
        ['Tazeleme', 'Gerekli (~8 ms’de bir); okuma da yükü boşaltır', 'Gerekmez'],
        ['Yoğunluk / maliyet', 'Yoğun ve ucuz', 'Seyrek ve pahalı'],
        ['Hız', 'Yavaş; çevrim süresi > erişim süresi', 'Hızlı; erişim ≈ çevrim süresi'],
        ['Gelişmeler', 'SDRAM (saatli), DDR (çift kenar erişim)', '—'],
      ],
    },
    {
      kind: 'model3d',
      component: 'ram',
      title: 'Gerçek Donanım · DDR5 Bellek Modülü',
      caption:
        'Ana belleğin fiziksel hali: DRAM yongaları, adres/veri hatları ve güç yönetimi. Laboratuvarda yongaları tek tek inceleyebilirsiniz.',
      sim: true,
    },
    {
      kind: 'heading',
      id: 'mantik',
      title: 'Cep belleğin çalışma mantığı',
      lead: 'Vuru (hit): aranan veri cepte. Iska (miss): değil. Tüm tasarım, vuru oranını yükseltmek ve ıskanın maliyetini düşürmek üzerine kuruludur.',
    },
    {
      kind: 'callout',
      tone: 'formula',
      title: 'Ortalama erişim süresi',
      body: [
        'Cep erişimi 20 ns, ana bellek 100 ns, vuru oranı H = 0,9 ise (yalnız okumalar için):',
        'ta = 0,9 × 20 + 0,1 × 100 = 28 ns — belleğin %90’ı kadar hızlı, cep kadar küçük maliyetle.',
      ],
    },
    {
      kind: 'prose',
      body: [
        'Iska durumunda yalnız istenen sözcük değil, onu içeren **blok** ana bellekten cep belleğe kopyalanır — nedeni coğrafi yöresellik: bir sonraki erişim büyük olasılıkla aynı bloktadır. Blok aktarımını hızlandırmak için ardışık adresler farklı bellek modüllerine dağıtılır (**geçişli bellek / interleaving**); böylece bloğun sözcüklerine paralel erişilir.',
        'Cep dolarken hangi blok atılacak? En yaygın **yer değiştirme algoritmaları**: **FIFO** (en uzun süredir cepte olan çıkar) ve **LRU** (Least Recently Used — son zamanlarda en az kullanılan çıkar; her çerçeveye erişim geçmişini tutan yaşlanma sayaçları eklenir). Tüm bu işleri yürüten donanıma **cep bellek yönetim birimi** denir.',
        'Aramanın hızlı olması için özel bir bellek türü kullanılır: **çağrışımlı bellek** (CAM — Content Addressable Memory). Veriye adresle değil *içerikle* erişilir: aranan değer tüm satırlarda **aynı anda, paralel** karşılaştırılır; anahtar (key) saklayıcısı hangi bitlerin aranacağını seçer, geçerlilik bitleri boş satırları eler.',
      ],
    },
    {
      kind: 'heading',
      id: 'mapping',
      title: 'Dönüşüm (mapping) yöntemleri',
      lead: 'Ana bellekteki bir blok, cep bellekte nereye yerleşir? Üç cevap, üç ödünleşim: esneklik, maliyet ve basitlik.',
    },
    {
      kind: 'viz',
      viz: 'cache-mapping',
      title: 'İnteraktif · Adres Dönüşümü',
      caption:
        'Ders notlarındaki örnek sistem: 256K sözcük ana bellek, 16 sözcüklük bloklar, 128 çerçeveli cep. Üç yöntemde aynı adresin nasıl farklı yorumlandığını inceleyin.',
    },
    {
      kind: 'prose',
      body: [
        '**Tam çağrışımlı (fully associative):** adres, blok numarası (takı) + sözcük olarak bölünür; blok **herhangi bir çerçeveye** yerleşebilir ve takı tüm çerçevelerde paralel aranır. En esnek, en yüksek vuru oranı; ama büyük CAM pahalıdır ve yer değiştirme kararı gerekir.',
        '**Doğrudan dönüşüm (direct mapping):** adres, takı + çerçeve no + sözcük olarak bölünür; her bloğun gidebileceği çerçeve sabittir (çerçeve = blok mod çerçeve sayısı). Arama ve karar yok — ucuz ve basit; ama aynı çerçeveyi paylaşan iki blok, cep yarı boş olsa bile birbirini kovar (çakışma ıskaları vuru oranını düşürür).',
        '**Kümeli-çağrışımlı (set associative):** ikisinin dengesi. Küme, doğrudan dönüşümle sabit belirlenir (küme = blok mod küme sayısı); blok, kümenin içindeki herhangi bir çerçeveye yerleşir ve takı yalnız o kümede paralel aranır. Küme başına çerçeve sayısı artırıldıkça tam çağrışımlıya yaklaşır — modern işlemcilerde 4/8/16 yollu kümeler standarttır.',
      ],
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Dizinin adresi vuru oranını değiştirir',
      body: [
        'Blok boyu 16 sözcük olan sistemde 10 elemanlı bir dizi düşünün. Dizi $00002’den başlarsa tek bloğa sığar: ilk erişim ıska, kalan 9’u vuru. Aynı dizi $0000A’dan başlarsa iki bloğa yayılır: 2 ıska, 8 vuru — ve cepte iki çerçeve işgal eder. Verilerin belleğe yerleştirilme biçimi, cep performansını doğrudan etkiler.',
      ],
    },
    {
      kind: 'quiz',
      question:
        'Doğrudan dönüşümlü bir cepte, program sırayla iki adrese sürekli dönüşümlü erişiyor ve ikisinin de "çerçeve no" alanı aynı. Ne olur?',
      options: [
        'İkisi de cepte kalır; sorun olmaz',
        'Her erişim ıska olur: bloklar sürekli birbirini kovar (çakışma), cep boş olsa bile',
        'Cep yönetim birimi ikinci bloğu başka çerçeveye koyar',
        'LRU algoritması sorunu çözer',
      ],
      answer: 1,
      explain:
        'Doğrudan dönüşümde bloğun yeri sabittir ve seçme şansı yoktur — LRU da uygulanamaz. Aynı çerçeveyi paylaşan iki blok dönüşümlü erişilirse her seferinde yer değiştirir (thrashing). Kümeli-çağrışımlı yöntem tam da bunu hafifletmek için vardır.',
    },
    {
      kind: 'heading',
      id: 'yazma',
      title: 'Cep – ana bellek etkileşimi: okuma ve yazma politikaları',
      lead: 'Okumada veri nereden gelir, yazmada iki kopya nasıl tutarlı kalır?',
    },
    {
      kind: 'viz',
      viz: 'write-policy',
      title: 'İnteraktif · Doğrudan Yazma ve Sonradan Yazma',
      caption:
        'Üç yazma + bir blok kaldırma senaryosunda ana belleğe kaç kez yazıldığını sayın; kirlenme (dirty) bitinin rolüne dikkat edin.',
    },
    {
      kind: 'prose',
      body: [
        '**Okuma ıskasında** iki seçenek vardır: **doğrudan okuma (RT)** — blok cebe getirilirken istenen sözcük paralel olarak MİB’e de verilir; **dolaylı okuma (NRT)** — blok önce cebe gelir, MİB cepten okur. Bunlar MİB-cep-ana bellek bağlantısının paralel mi seri mi olduğuna karşılık düşer.',
        '**Yazma vurusunda**: **doğrudan yazma (write-through, WT)** her yazmayı hem cebe hem ana belleğe işler — bellek her an tutarlıdır ama her yazma yavaştır. **Sonradan yazma (write-back, WB)** yalnız cebe yazar; blok cepten kaldırılırken belleğe yazılır. **Bayraklı** sürümünde (FWB) her çerçeveye bir **kirlenme (dirty) biti** eklenir ve yalnız gerçekten değişmiş bloklar geri yazılır.',
        '**Yazma ıskasında**: **cebe yükleyerek yazma (write allocate, WA)** bloğu cebe de getirir; **yüklemeden yazma (NWA)** yalnız ana belleğe yazar. WT genellikle NWA ile (WTNWA), WB ise cebi güncel tutmak için WA ile (WBWA) eşleştirilir.',
      ],
    },
    {
      kind: 'callout',
      tone: 'formula',
      title: 'Ortalama erişim süresi formülleri (w: yazma oranı, h: vuru oranı)',
      body: [
        'WTWA (RT/LT):  ta = (1−w)·h·tcache + (1−h)·ttrans + w·tmain',
        'WTNWA (RT/LT):  ta = (1−w)·h·tcache + (1−w)(1−h)·ttrans + w·tmain',
        'SWB-WA (NRT):  ta = tcache + (1−h)·2·ttrans   (biri eski bloğu geri koyma, biri yenisini getirme)',
        'FWB-WA (NRT):  ta = tcache + (1−h)(1+wd)·ttrans   (wd: bloğun kirli olma olasılığı)',
      ],
    },
    {
      kind: 'callout',
      tone: 'history',
      title: 'Cep belleğin evrimi',
      body: [
        'Intel 386’ya kadar cep, yonga dışında SRAM’dı. 486 (1989) 8 KB’lık L1’i yongaya taşıdı; Pentium komut ve veri ceplerini ayırdı (Harvard); Pentium Pro L2’yi de pakete aldı. Bugünkü Core i7/i9’larda çekirdek başına L1 + L2 ve tüm çekirdeklerin paylaştığı büyük bir L3 ("smart cache") bulunur.',
      ],
    },
    {
      kind: 'quiz',
      question:
        'Sonradan yazma (write-back) kullanan bir sistemde ana bellekteki veri ne zaman güncellenir?',
      options: [
        'Her yazma işleminde',
        'Blok cepten kaldırılırken (bayraklı sürümde yalnız kirliyse)',
        'Her okuma ıskasında',
        'Belirli aralıklarla, zamanlayıcıyla',
      ],
      answer: 1,
      explain:
        'WB’de yazmalar yalnız cebe yapılır ve dirty bit işaretlenir; ana bellek ancak blok yer değiştirme sırasında güncellenir. Bu, yazma trafiğini azaltır ama cep ile bellek geçici olarak tutarsız kalır — 9. derste bu durumun çok işlemcili sistemlerde doğurduğu tutarlılık sorununu göreceğiz.',
    },
  ],
};

export default lesson;
