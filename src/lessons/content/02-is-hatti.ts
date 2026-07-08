import type { Lesson } from '@/lessons/types';

/**
 * Ders 02 — İş Hattı (Pipeline)
 * Kaynak: itu_dersNotlari/02işHattıPipeline (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '02-is-hatti',
  order: 2,
  sourceFolder: '02işHattıPipeline',
  title: 'İş Hattı (Pipeline)',
  subtitle:
    'Bir montaj bandı gibi çalışan işlemci: komutlar üst üste bindirilerek her saat çevriminde bir komut tamamlanır — ta ki çatışmalar ve dallanmalar araya girene kadar.',
  minutes: 45,
  heroComponent: 'cpu',
  sections: [
    {
      kind: 'heading',
      id: 'kavram',
      title: 'Montaj bandından işlemciye',
      lead: 'İş hattında birden fazla iş aynı anda, farklı aşamalarda yürütülür. Fikir bir otomobil fabrikasından tanıdık.',
    },
    {
      kind: 'prose',
      body: [
        'Bir otomobil montaj bandını düşünün: kapı takma, tekerlek montajı ve cam takma için ayrı istasyonlar vardır. Bir işçi bir otomobilin camını takarken, bir sonraki istasyondaki işçi başka bir otomobilin tekerleklerini takıyordur. Hiçbir otomobil daha hızlı üretilmez; ama band dolduktan sonra **her adımda bir otomobil tamamlanır**.',
        'Bir iş hattının verimli çalışabilmesi için iki koşul gerekir: iş, farklı veriler üzerinde **defalarca tekrarlanmalı** ve paralel yürütülebilen **küçük alt işlere bölünebilmelidir**. Bir işlemcinin komut çevrimi bu tanıma tam oturur: her komut benzer aşamalardan geçer ve komutlar milyarlarca kez tekrarlanır.',
        'Genel yapıda her katman (segman) belirli, sabit bir işi yapar; katmanlar arasındaki **iş hattı saklayıcıları** (R1, R2, …) ara sonuçları tutar; tüm katmanlar ortak bir saat işaretiyle eşzamanlı çalışır. Saat periyodu, **en yavaş katmanın gecikmesi + saklayıcı gecikmesi** ile belirlenir: `tp = max(τi) + dr`.',
      ],
    },
    {
      kind: 'callout',
      tone: 'formula',
      title: 'Hızlanma (Speedup)',
      body: [
        'k katmanlı iş hattında n işin toplam süresi: T = (k + n − 1)·tp',
        'İlk iş k çevrimde biter; sonra her çevrimde bir iş tamamlanır.',
        'S = (iş hattı olmadan süre) / (iş hattı ile süre) ;  n → ∞ için S(max) = k',
      ],
    },
    {
      kind: 'prose',
      body: [
        'Teorik üst sınır k olsa da katman sayısını artırmak bedava değildir: her katmanın sonuna eklenen saklayıcılar maliyet, enerji ve boyut yükü getirir; ilk işin bekleme süresi `k·tp` uzar; dallanma cezaları büyür. Üstelik hızlanma ancak iş **kısa süreli ve dengeli** alt işlere bölünebilirse gerçekleşir: 100 ns’lik bir işi 50+50 yerine 25+25+50 diye bölmek hiçbir şey kazandırmaz — saat yine en yavaş katman olan 50 ns’ye (+5 ns saklayıcı) göre kurulur. 30+30+40 bölmesi ise çevrimi 45 ns’ye düşürür.',
      ],
    },
    {
      kind: 'heading',
      id: 'komut-is-hatti',
      title: 'Komut iş hattı ve 5 katmanlı RISC modeli',
      lead: 'Komutların üst üste bindirilerek işlenmesine komut düzeyinde paralellik denir. Bu derste klasik 5 katmanlı RISC iş hattını kullanacağız.',
    },
    {
      kind: 'list',
      title: 'Beş katman',
      ordered: true,
      items: [
        '**IF** (Instruction Fetch): Sıradaki komutu bellekten al, program sayacını artır (PC ← PC + 4).',
        '**DR** (Decode & Read): Komutu çöz, denetim işaretlerini üret, operandları saklayıcı dosyasından oku.',
        '**EX** (Execute): ALU işlemini yap; load/store adreslerini ve dallanma hedef adreslerini hesapla.',
        '**ME** (Memory): Gerekliyse veri belleğine eriş (yalnız load/store komutları).',
        '**WB** (Write Back): Sonucu saklayıcı dosyasına yaz.',
      ],
    },
    {
      kind: 'callout',
      tone: 'info',
      body: [
        'IF ve ME katmanları aynı anda belleğe erişmek ister. Bu bellek çatışmasını çözmek için komut ve veri bellekleri ayrılır — 1. derste gördüğümüz **Harvard mimarisi** tam da bu yüzden RISC iş hatlarının doğal eşidir. Gerçek işlemciler çeşitlilik gösterir: ARM7 3 katman, MIPS R4000 8 katman (superpipelined), Pentium 4 ise 20 katman kullanır.',
      ],
    },
    {
      kind: 'viz',
      viz: 'pipeline',
      title: 'İnteraktif · İş Hattı Uzay-Zaman Diyagramı',
      caption:
        'Dört kipi de deneyin: ideal akışta iş hattı dolduktan sonra her çevrimde bir komut biter; veri çatışması iş hattını durdurur; yönlendirme cezayı sıfırlar; dallanma iş hattını boşaltır.',
    },
    {
      kind: 'heading',
      id: 'sorunlar',
      title: 'İş hattı sorunları (hazards)',
      lead: 'Uygulamada üç tür sorun idealden sapmaya neden olur: kaynak çatışması, veri çatışması ve denetim sorunları.',
    },
    {
      kind: 'prose',
      body: [
        '**1. Kaynak çatışması (yapısal sorun):** aynı anda işlenen iki komut aynı kaynağa (bellek, ALU) gerek duyarsa oluşur. Çözümler: Harvard mimarisi ya da komut kuyruğu/cep bellek (bellek çatışması için); işlem birimi sayısını artırmak veya FPU gibi birimleri de iş hattı olarak tasarlamak (ALU çatışması için).',
        '**2. Veri çatışması (veri bağımlılığı):** henüz güncellenmemiş bir veri erkenden kullanılmak istenirse oluşur. `ADD R1,R2,R3` ardından gelen `SUB R3,R4,R5`, R3’ü ADD daha WB katmanına ulaşmadan okumaya kalkar — çözüm yoksa program **yanlış sonuç üretir**.',
      ],
    },
    {
      kind: 'table',
      title: 'Üç tür veri çatışması',
      head: ['Tür', 'Adı', 'Senaryo'],
      rows: [
        ['RAW (Read After Write)', 'Gerçek bağımlılık', 'Bir komut yazıyor, sonraki aynı yeri okuyor; okuma yazmadan önce yapılırsa sorun.'],
        ['WAR (Write After Read)', 'Anti bağımlılık', 'Bir komut okuyor, sonraki aynı yere yazıyor; yazma okumadan önce yapılırsa sorun.'],
        ['WAW (Write After Write)', 'Çıkış bağımlılığı', 'İki komut aynı yere yazıyor; sıra bozulursa son değer yanlış olur.'],
      ],
    },
    {
      kind: 'list',
      title: 'Veri çatışması çözümleri',
      items: [
        '**Durdurma / donanım kilidi (stall, hardware interlock):** çatışma sezme birimi bağımlı komutu geciktirir. Saklayıcı dosyası çevrimin ilk yarısında yazılıp ikinci yarısında okunursa gecikme 3 çevrimden 2’ye iner.',
        '**Operand yönlendirme (forwarding/bypass):** ALU çıkışı (EX/ME saklayıcısı) doğrudan ALU girişine bağlanır; bağımlı komut güncel değeri saklayıcı dosyasını beklemeden alır — çoğu durumda ceza tamamen kalkar. Bellekten okuma (load-use) çatışmasında ME/WB’den yönlendirme yapılır ama yine 1 çevrim gecikme kalır.',
        '**NOOP ekleme (yazılım):** derleyici araya boş komutlar koyar; etkisi durdurmayla aynıdır, performans düşer.',
        '**Optimize çözüm (yazılım):** derleyici, algoritmayı bozmadan bağımsız komutları araya taşır — mümkünse hiç gecikme oluşmaz.',
      ],
    },
    {
      kind: 'quiz',
      question:
        '`LDL $500(R4), R1` komutunun hemen ardından `ADD R1, R2, R3` geliyor. Operand yönlendirme (forwarding) donanımı olsa bile ne olur?',
      options: [
        'Hiç gecikme olmaz; bypass her şeyi çözer',
        '1 çevrim gecikme yine de gerekir, çünkü veri ancak ME katmanı sonunda bellekten gelir',
        'İş hattı tamamen boşaltılır',
        'ADD komutu R1’in eski değeriyle çalışır',
      ],
      answer: 1,
      explain:
        'Load-use çatışmasında veri, ME katmanının sonunda hazır olur; ME/WB’den ALU’ya yönlendirme yapılsa bile ADD bir çevrim bekletilmek zorundadır. Bu yüzden derleyiciler load ile kullanıcısının arasına bağımsız komut yerleştirmeye çalışır.',
    },
    {
      kind: 'heading',
      id: 'dallanma',
      title: 'Denetim sorunları: dallanmalar',
      lead: 'Dallanma komutu işlenirken, bellekte onu izleyen ama belki de hiç yürütülmemesi gereken komutlar çoktan iş hattına alınmıştır.',
    },
    {
      kind: 'prose',
      body: [
        'Örnek iş hattımızda dallanma hedef adresi EX katmanında hesaplanır ve dallanma kararı bayrak değerlerine göre verilir. Karar verilene kadar iş hattına giren komutlar, dallanma gerçekleşirse WB’ye ulaşmadan **boşaltılmalıdır** (flush). Durdurma çözümü uygulanırsa bu örnekte dallanma cezası 3 çevrimdir; karar ve hedef adres doğrudan IF’e gönderilirse 2 çevrime, koşulsuz dallanmalarda hedef hesabı DR katmanına taşınırsa **1 çevrime** iner. Koşul yanlış çıkarsa (dallanma olmazsa) ceza zaten oluşmaz.',
        'Yazılım tarafında da aynı iki seçenek vardır: derleyici dallanmadan sonra gereken sayıda **NOOP** ekler ya da — daha iyisi — dallanmadan önce gelen ve dallanmanın koşulunu etkilemeyen komutları dallanmanın peşine taşır (**gecikmeli dallanma**). Taşınacak komutlar dallanmanın hedefinden ya da düşen koldan da seçilebilir; ancak taşınan komut her iki durumda da programın anlamını bozmamalıdır.',
      ],
    },
    {
      kind: 'heading',
      id: 'ongoru',
      title: 'Dallanma öngörüsü (Branch Prediction)',
      lead: 'Beklemek yerine tahmin et: öngörü doğruysa ceza yok, yanlışsa iş hattı boşaltılır.',
    },
    {
      kind: 'prose',
      body: [
        '**Statik öngörü** iki basit strateji sunar: "her zaman dallanma yok" (sıradaki komutu almaya devam et) ya da "her zaman dallanma var". Ölçümler koşullu dallanmaların yarıdan fazlasının gerçekleştiğini gösterdiğinden ikincisi daha başarılıdır — ama hedef komutu önceden alabilmek için dallanma komutlarının hedef adreslerini tutan bir **dallanma hedef tablosu** (branch target table; IF katmanında küçük bir cep bellek) gerekir.',
        '**Dinamik öngörü** ise her koşullu dallanma komutunun geçmişini izler. **1 bitlik yöntemde** komutun son çalışmasında dallanma olduysa yine olacağı varsayılır. Zayıf noktası döngülerdir: iç içe döngülerde içteki döngü her çalıştığında biri girişte biri çıkışta olmak üzere *iki* yanlış öngörü yapılır.',
        '**2 bitlik yöntem** bu sorunu çözer: karar ancak **peş peşe iki yanlış öngörüden** sonra değişir. 100 kez dönen bir döngüde yalnızca çıkıştaki tek öngörü yanlış olur. Bu bilgiler, komut adresi + hedef adres + öngörü bitlerini tutan **dallanma geçmişi tablosunda** (branch history table) saklanır. Aynı otomatın "doyan sayaç" (saturating counter) adlı farklı geçişli bir sürümü de yaygındır.',
      ],
    },
    {
      kind: 'viz',
      viz: 'branch-prediction',
      title: 'İnteraktif · 2 Bitlik Öngörü Otomatı',
      caption:
        'Bir döngüyü canlandırın: birkaç kez "dallanma OLDU", sonra bir kez "OLMADI" deyin. Kararın tek yanlışla değişmediğine dikkat edin.',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Sınav klasiği: iç içe döngüler',
      body: [
        'İçte 10, dışta 10 kez dönen iç içe iki döngüde (toplam 110 dallanma kararı): "her zaman var" statik öngörüsü 99 doğru / 11 yanlış yapar. 1 bitlik dinamik yöntem ("var" başlangıcıyla) 90 doğru / 20 yanlış yapar — içteki döngü her tekrar başlayışında ek bir hata. 2 bitlik yöntem ise 99 doğru / 11 yanlışa geri döner: tek seferlik sapmalar kararı değiştiremez.',
      ],
    },
    {
      kind: 'quiz',
      question: '2 bitlik dinamik dallanma öngörüsünün 1 bitlik yönteme temel üstünlüğü nedir?',
      options: [
        'Dallanma hedef adresini daha hızlı hesaplaması',
        'Tek seferlik sapmalarda kararını değiştirmemesi — iç içe döngülerde hata sayısını düşürmesi',
        'Tablo için daha az bellek kullanması',
        'Koşulsuz dallanmalarda cezayı sıfırlaması',
      ],
      answer: 1,
      explain:
        'Karar ancak peş peşe iki yanlış öngörüden sonra değişir. Böylece bir döngünün çıkışındaki tek yanlış, sonraki çalıştırmanın girişinde ikinci bir hataya yol açmaz.',
    },
  ],
};

export default lesson;
