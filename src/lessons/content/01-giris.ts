import type { Lesson } from '@/lessons/types';

/**
 * Ders 01 — Giriş: Bilgisayar Mimarisine Bakış
 * Kaynak: itu_dersNotlari/01Giris (Feza Buzluca, İTÜ Bilgisayar Mühendisliği)
 */
const lesson: Lesson = {
  id: '01-giris',
  order: 1,
  sourceFolder: '01Giris',
  title: 'Bilgisayar Mimarisine Giriş',
  subtitle:
    'Bilgisayarı sihirli bir kara kutu olmaktan çıkarıyoruz: katmanlı model, işlemci sınıfları, komut çevrimi ve performansın gerçek sınırları.',
  minutes: 30,
  heroComponent: 'cpu',
  sections: [
    {
      kind: 'heading',
      id: 'neden',
      title: 'Bu dersi neden öğreniyoruz?',
      lead: 'IEEE/ACM müfredatlarının ortak mesajı: bilgisayar mühendisi, programları "bir sihir sonucu" çalıştıran kapalı bir kutuyla yetinemez.',
    },
    {
      kind: 'prose',
      body: [
        'Bilgisayar mimarisi, bilgisayar mühendisliğinin temel taşlarından biridir. Yüksek performanslı yazılım geliştirmek isteyen bir mühendisin **paralellik**, **hız** ve **gecikme** kavramlarını donanım düzeyinde anlaması gerekir; çünkü yazdığınız her satır kod, sonunda bir işlemcinin saat çevrimlerine, bellek erişimlerine ve veri yollarına dönüşür.',
        'Uygun bir bilgisayar sistemi seçebilmek de aynı bilgiyi ister: MİB’in saat hızı, bir komutun çevrim sayısı, bellek boyutu ve ortalama bellek erişim süresi gibi büyüklüklerin sistem performansına etkisini ancak mimariyi bilen biri doğru değerlendirebilir.',
        'Ayrıca yazılım/donanım arayüzünde çalışmak zorlu ödünleşimler (trade-off) içerir: güvenliğin kritik olduğu bir sistemde mühendis, tasarladığı donanım ve yazılımı beklenmedik değerleri de kapsayacak şekilde test ederek sistemin güvenli çalışmasını sağlamakla yükümlüdür.',
      ],
    },
    {
      kind: 'list',
      title: 'Dersin üç amacı',
      ordered: true,
      items: [
        'Hız ve maliyet gibi unsurları gözeterek **donanım çözümleri üretebilmek** için bilgisayar mimarisini öğrenmek.',
        'İşlemci yapısı, hız, bellek kapasitesi gibi seçenekleri değerlendirip belirli bir projeye **uygun bilgisayar sistemini seçebilmek**.',
        'Büyük veya gömülü (embedded) sistemler için **kaliteli yazılım geliştirebilmek**.',
      ],
    },
    {
      kind: 'callout',
      tone: 'info',
      title: 'Yol Haritası',
      body: [
        'Bu dizide sırasıyla şu konuları işleyeceğiz: iş hattı (pipeline) ve komut düzeyinde paralellik → giriş/çıkış organizasyonu ve yol erişimi → kesmeler → doğrudan bellek erişimi (DMA) → cep bellek (cache) → dış bellek ve RAID → bellek yönetimi ve görüntü bellek → çok işlemcili sistemler ve cep bellek tutarlılığı → kayan noktalı sayılar.',
      ],
    },
    {
      kind: 'heading',
      id: 'katmanli-model',
      title: 'Bir bilgisayar sisteminin katmanlı modeli',
      lead: 'Transistörlerden uygulamalara uzanan yolda her katman, bir alttakinin karmaşıklığını gizler. Ortadaki kritik sözleşme: Komut Kümesi Mimarisi (ISA).',
    },
    {
      kind: 'viz',
      viz: 'layered-model',
      title: 'İnteraktif · Katmanlı Model',
      caption: 'Katmanlara tıklayarak her birinin rolünü inceleyin.',
    },
    {
      kind: 'prose',
      body: [
        '**Komut Kümesi Mimarisi (Instruction Set Architecture — ISA)**, donanımın alt düzey programcıya görünen yüzüdür: makine dili komutları, programcıya görünen saklayıcılar ve işlemcinin doğal veri yapıları bu sözleşmenin parçasıdır. Derleyici bu sözleşmeye göre kod üretir; donanım bu sözleşmeyi yerine getirmeyi taahhüt eder. Aynı ISA’yı gerçekleyen iki işlemci, iç yapıları bambaşka olsa bile aynı programları çalıştırır.',
      ],
    },
    {
      kind: 'heading',
      id: 'mib-siniflari',
      title: 'Merkezi İşlem Birimlerinin sınıflandırılması',
      lead: 'MİB’leri üç eksende gruplayabiliriz: operand sayısı, komut kümesi felsefesi (CISC/RISC) ve komut-veri belleklerinin ayrılığı (Von Neumann/Harvard).',
    },
    {
      kind: 'list',
      title: 'Operand sayısına göre',
      items: [
        '**Sıfır operandlı** makineler — yığın yapılı (stack machine) olarak da adlandırılır.',
        '**Bir adresli** makineler — akümülatörlü (accumulator) makineler.',
        '**İki operandlı** makineler — saklayıcı-saklayıcı, saklayıcı-bellek veya bellek-bellek.',
        '**Üç operandlı** makineler — `ADD R1, R2, R3` gibi; modern RISC işlemcilerin tercihi.',
      ],
    },
    {
      kind: 'prose',
      body: [
        '**CISC** (Complex Instruction Set Computer) felsefesinin amacı, makine dilini yüksek düzeyli dillere yaklaştırarak derleyicilerin işini kolaylaştırmak ve yetenekli komutlarla daha kısa programlar yazabilmekti. Bunun bedeli: 100–250 arası komut, karmaşık adresleme kipleri, doğrudan bellek üzerinde işlem yapan komutlar ve mikroprogramlı denetim birimi. Yan etkileri de var — farklı uzunluklarda komutlar çözmeyi ve önceden okumayı (prefetch) zorlaştırır, bazı komutlar neredeyse hiç kullanılmaz, iç yapı karmaşıklaşır.',
        '**RISC** (Reduced Instruction Set Computer) ise gözlemden doğdu: CISC makinelerde derlenen gerçek programlar incelendiğinde atamaların çokluğu, verilerin çoğunlukla yerel ve basit olduğu, en büyük yükü alt program çağrılarının oluşturduğu görüldü. Alt programların %98’i 6 veya daha az parametre aktarıyor, çağrı derinliği %99 oranında 8’den az kalıyordu. Bu verilerle, daha az bellek erişimi yapan sade işlemciler tasarlandı.',
      ],
    },
    {
      kind: 'table',
      title: 'CISC ve RISC karşılaştırması',
      head: ['Özellik', 'CISC', 'RISC'],
      rows: [
        ['Komut sayısı', 'Çok (100–250)', 'Az (~30), işlevleri basit'],
        ['Komut uzunluğu', 'Değişken — çözme zor', 'Sabit (örn. 32 bit) — çözme kolay'],
        ['Adresleme kipleri', 'Çok ve karmaşık (dolaylı bellek erişimi)', 'Az ve basit (örn. 3 kip)'],
        ['Bellek erişimi', 'Komutlar bellek üzerinde işlem yapabilir', 'Yalnız load/store komutları belleğe erişir'],
        ['Denetim birimi', 'Mikroprogramlı', 'Devrelendirilmiş (hardwired)'],
        ['Saklayıcı sayısı', 'Az', 'Çok (128–256, register file)'],
        ['Örnekler', 'VAX, PDP-11, x86 (Pentium öncesi), 68K', 'MIPS, SPARC, PowerPC, ARM, AVR'],
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Günümüzdeki durum',
      body: [
        'Saf CISC ya da saf RISC neredeyse kalmadı: Pentium II ve sonrası dış kabuğu CISC olan ama iç çekirdeği RISC gibi çalışan **karma** tasarımlardır; PowerPC gibi RISC’ler de bazı CISC özellikleri edinmiştir. ARM bugün telefonlardan gömülü denetleyicilere kadar her yerdedir — RISC felsefesinin zaferi büyük ölçüde enerji verimliliğinden gelir.',
      ],
    },
    {
      kind: 'heading',
      id: 'von-neumann-harvard',
      title: 'Von Neumann ve Harvard mimarileri',
      lead: 'Komutlar ve veriler aynı bellekte mi (Von Neumann) yoksa ayrı belleklerde mi (Harvard) duruyor? Bu tek karar, iş hattından cep belleğe kadar her şeyi etkiler.',
    },
    {
      kind: 'viz',
      viz: 'von-neumann-harvard',
      title: 'İnteraktif · İki Mimarinin Karşılaştırması',
      caption:
        'Mavi noktalar komut, yeşil noktalar veri trafiği. Harvard mimarisinde iki akış eşzamanlı ilerleyebilir — 2. derste göreceğimiz komut iş hattının ön koşulu.',
    },
    {
      kind: 'prose',
      body: [
        'MİB’in içinde iki ana birim vardır. **Veri işleme birimi**; saklayıcılar, aritmetik-lojik birim (ALU) ve kayan noktalı işlem birimi gibi bölümlerden oluşur ve veriler üzerinde asıl işlemleri yapar. **Denetim birimi** ise komutları çözer, yorumlar ve veri işleme birimindeki elemanlara gerekli denetim işaretlerini gönderir — bilgisayarın çalışmasını yöneten beyindir. Denetim birimi ya eşzamanlı ardışıl bir sayısal devre olarak (devrelendirilmiş/hardwired) ya da makine komutlarını mikroprogram parçalarına dönüştüren mikroprogramlı yapıda gerçeklenir.',
      ],
    },
    {
      kind: 'heading',
      id: 'komut-cevrimi',
      title: 'Komut çevrimi: MİB’in kalp atışı',
      lead: 'Sonlu durumlu bir makine olarak tasarlanan MİB dört ana durumdan birinde bulunur ve bu döngüde saniyede milyarlarca kez döner.',
    },
    {
      kind: 'viz',
      viz: 'cpu-cycle',
      title: 'İnteraktif · Komut Çevrimi Durum Makinesi',
      caption:
        'Komut alma → çözme → operand alma → yürütme → kesme sorgulama. Kesme kavramını 4. derste derinlemesine inceleyeceğiz.',
    },
    {
      kind: 'model3d',
      component: 'cpu',
      title: 'Gerçek Donanım · İşlemci',
      caption:
        'Bu döngünün tamamı, tırnak büyüklüğündeki silisyum kalıbın (die) içinde gerçekleşir. Modeli sürükleyerek inceleyin; katmanlarına ayırmak için laboratuvara geçin.',
      explode: 0.35,
    },
    {
      kind: 'quiz',
      question: 'Bir RISC işlemcide aşağıdakilerden hangisini görmeyi **beklemezsiniz**?',
      options: [
        'Sabit uzunlukta komutlar',
        'Doğrudan bellek üzerinde işlem yapan aritmetik komutlar',
        'Çok sayıda saklayıcı (register file)',
        'Devrelendirilmiş (hardwired) denetim birimi',
      ],
      answer: 1,
      explain:
        'RISC’te belleğe yalnızca load/store komutlarıyla erişilir; aritmetik işlemler her zaman saklayıcılar üzerinde yapılır. Bellek üzerinde doğrudan işlem yapan komutlar CISC’in karakteristiğidir.',
    },
    {
      kind: 'heading',
      id: 'evrim',
      title: 'Bilgisayarların evrimi ve performans engelleri',
      lead: 'ENIAC’ın 30 tonundan 5 GHz’lik çok çekirdekli işlemcilere: bu yolculuğu iki güç şekillendirdi — malzeme gelişimi ve yapısal (mimari) gelişme.',
    },
    {
      kind: 'callout',
      tone: 'history',
      title: 'Kilometre Taşları',
      body: [
        '**Z3 (1941)** — Konrad Zuse’nin röleli elektromekanik makinesi, ilk genel amaçlı bilgisayar. **ENIAC (1946)** — ilk genel amaçlı *elektronik* bilgisayar: 30 ton, 140 kW, saniyede 5000 toplama. **Intel 4004 (1971)** — ilk mikroişlemci: 2300 transistör, 740 kHz. **Intel 8086 (1978)** — x86 ailesinin ilk üyesi: 29.000 transistör. **Pentium 4 HT (2003)** — çok iplikli çalışma, 55 milyon transistör, 3,4 GHz. **Core i9-9900 (2019)** — 8 çekirdek, 5 GHz turbo, üç düzeyli cep bellek.',
      ],
    },
    {
      kind: 'viz',
      viz: 'performance-walls',
      title: 'İnteraktif · Performansın Üç Grafiği',
      caption:
        'Üç sekmeyi de inceleyin: Moore yasası yavaşlıyor, saat hızı güç engeline çarptı, işlemci–bellek makası ise cep belleği zorunlu kıldı.',
    },
    {
      kind: 'prose',
      body: [
        '**Moore yasası** (Gordon Moore, 1965): bir yongaya sığdırılabilen transistör sayısı yaklaşık her 18 ayda ikiye katlanır. Bu öngörü yarım yüzyıl geçerli kaldı; günümüzde artış hızı düşüyor ve yasanın 2025 civarında sona ereceği öngörülüyor.',
        '**Güç engeli (power wall):** transistör başına dinamik güç `P ~ V²f` ile orantılıdır. 2003’te işlemci başına güç tüketimi 200 W’ı aşınca soğutma, kişisel bilgisayarlar için karşılanamayacak kadar pahalı hale geldi. Sektör bir karar verdi: Moore yasası sürdürüldü ama **saat hızı artışından vazgeçildi**. Aynı dönemde **Dennard ölçeklemesi** de sona erdi — transistörler küçülse bile gerilim ve akım artık aynı oranda düşürülemiyordu.',
        'Transistör bütçesi bundan böyle saat hızına değil **paralelliğe** harcandı: iş hattı, çok sayıda ALU, çok çekirdek ve cep bellekler. Ancak paralelleştirmenin de sınırları vardır — işleri her zaman paralel alt işlemlere bölmek mümkün değildir ve alt işler arası bağımlılıklar ile iletişim maliyeti performansı düşürür (bu konuyu 9. derste Amdahl yasasıyla nicelleştireceğiz).',
        'Üçüncü engel dengesizliktir: işlemci hızı, bellek erişim süresinden çok daha hızlı iyileşti. 4,2 GHz’lik dört çekirdekli bir Core i7-6700 tepe noktada ~500 GiB/s bant genişliği isterken DRAM ana bellek bunun yalnızca %6,8’ini (34 GiB/s) sağlayabilir. Aradaki açık; cep bellek, geniş veri yolları ve paralel bellek erişimiyle kapatılır — 6. dersin konusu.',
      ],
    },
    {
      kind: 'heading',
      id: 'olcum',
      title: 'Performans nasıl ölçülür, kapasite nasıl adlandırılır?',
    },
    {
      kind: 'prose',
      body: [
        'MIPS (saniyedeki milyon komut) ve MFLOPS gibi ham sayılar, farklı komut kümelerine sahip işlemcileri karşılaştırmakta yetersiz kalır — bir CISC komutu bir RISC komutundan çok daha fazla iş yapabilir. Bu yüzden endüstri, gerçek programlardan oluşan **SPEC** değerlendirme paketlerini kullanır: işlemciler için SPEC CPU2017, Java sunucuları için SPECjbb, e-posta sunucuları için SPECmail gibi.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'KB mi KiB mi?',
      body: [
        'SI önekleri kesinlikle 10’un kuvvetleridir: 1 kB = 1000 bayt. İkinin kuvvetleri için IEEE 1541-2002 standardındaki ikili önekler kullanılır: **Ki** = 2¹⁰, **Mi** = 2²⁰, **Gi** = 2³⁰, **Ti** = 2⁴⁰. Fark büyüdükçe açılır: 1 TB (10¹²) ile 1 TiB (2⁴⁰) arasında yaklaşık %10 fark vardır. Uygulamada disk boyutu, aktarım hızı ve işlemci frekansı onlu; RAM ve cep bellek boyutları ikili öneklerle ifade edilir.',
      ],
    },
    {
      kind: 'quiz',
      question: '2003 civarında işlemci saat hızlarının artışı neden durdu?',
      options: [
        'Transistörler daha fazla küçültülemediği için',
        'Yonga başına güç tüketimi, ekonomik olarak soğutulamayacak düzeye ulaştığı için',
        'Yazılımlar daha yüksek hıza gerek duymadığı için',
        'Bellek hızları işlemcileri geçtiği için',
      ],
      answer: 1,
      explain:
        'Dinamik güç P ~ V²f ilişkisiyle artar. 200 W/yonga sınırına gelindiğinde soğutma maliyeti karşılanamaz oldu (güç engeli); Moore yasası sürdürüldü ama frekans artışından vazgeçilip çok çekirdeğe geçildi.',
    },
  ],
};

export default lesson;
