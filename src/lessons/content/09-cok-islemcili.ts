import type { Lesson } from '@/lessons/types';

/**
 * Ders 09 — Çok İşlemcili / Çok Çekirdekli Sistemler
 * Kaynak: itu_dersNotlari/09ÇokİşlemciliSistemler (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '09-cok-islemcili',
  order: 9,
  sourceFolder: '09ÇokİşlemciliSistemler',
  title: 'Çok İşlemcili Sistemler',
  subtitle:
    'Saat hızı duvara çarpınca yol paralellikten geçti: Flynn sınıflandırması, SMP ve NUMA, kümeler, MESI protokolüyle cep bellek tutarlılığı ve paralelliğin sınırları.',
  minutes: 50,
  heroComponent: 'cpu',
  sections: [
    {
      kind: 'heading',
      id: 'paralellik',
      title: 'Paralellik düzeyleri',
      lead: 'Performansı (ve bazen erişilebilirliği) artırmak için çok sayıda işlevsel birim paralel çalıştırılır — ama paralellik tek bir şey değildir.',
    },
    {
      kind: 'list',
      items: [
        '**Komut düzeyinde:** iş hattı — farklı komutların alt bölümleri aynı anda işlenir (2. ders).',
        '**Paralel programlama:** bir görevin parçaları farklı işlemcilerde koşar.',
        '**İş/süreç düzeyinde:** bağımsız uygulamalar farklı işlemcilerde çalışır.',
        '**Veri düzeyinde:** çok sayıda ALU ya da veri iş hattı; bir dizinin farklı elemanları aynı anda işlenir.',
      ],
    },
    {
      kind: 'heading',
      id: 'flynn',
      title: 'Flynn sınıflandırması',
      lead: 'Michael Flynn’in 1966 tarihli sorusu hâlâ geçerli: kaç komut katarı, kaç veri katarı?',
    },
    {
      kind: 'table',
      head: ['Sınıf', 'Açılımı', 'Anlamı', 'Örnek'],
      rows: [
        ['SISD', 'Tek komut, tek veri', 'Klasik tek işlemci', 'Geleneksel uniprocessor'],
        ['SIMD', 'Tek komut, çoklu veri', 'Tek komut tüm işlem birimlerini yönetir; her PU kendi verisiyle çalışır', 'Vektör ve dizi işlemcileri, GPU’ların özü'],
        ['MISD', 'Çok komut, tek veri', 'Farklı komutlar aynı veri üzerinde — ticari örneği yok', '(kuramsal; güvenlik amaçlı yedekli hesap)'],
        ['MIMD', 'Çok komut, çok veri', 'Bağımsız işlemciler farklı verilerle farklı komutlar yürütür', 'Çok çekirdekli işlemciler, kümeler'],
      ],
    },
    {
      kind: 'prose',
      body: [
        'MIMD ikiye ayrılır: **paylaşılan bellekli (sıkı bağlı)** sistemlerde işlemciler ortak bir belleği paylaşır ve onun üzerinden haberleşir; **dağıtılmış bellekli (gevşek bağlı)** sistemlerde bağımsız bilgisayarlar bir ağla bağlanır ve mesajlaşır. Paylaşılan bellekliler de bellek erişim süresine göre ikiye ayrılır: **SMP/UMA** ve **NUMA**.',
      ],
    },
    {
      kind: 'viz',
      viz: 'multiprocessor',
      title: 'İnteraktif · Üç Organizasyon',
      caption: 'SMP’de ortak yol darboğazına, NUMA’da hızlı/yavaş erişim ayrımına, kümede mesaj aktarımına dikkat edin.',
    },
    {
      kind: 'prose',
      body: [
        '**SMP (Symmetric Multiprocessor) / UMA:** özdeş işlemciler tek adres uzayını, belleği ve G/Ç birimlerini paylaşır; tek işletim sistemi her şeyi yönetir; bellek erişim süresi herkes için aynıdır. Ortak yol basit, esnek ve güvenilirdir (pasif eleman) — ama **zaman paylaşımlı** kullanıldığından bir birim yoldayken diğerleri bekler; işlemci sayısı pratikte 16–64 ile sınırlıdır. Çare, sık kullanılan verileri işlemcilere özel cep belleklerde tutmaktır… bu da birazdan göreceğimiz tutarlılık sorununu doğurur.',
        '**NUMA (Non-Uniform Memory Access):** tek adres uzayı korunur ama fiziksel bellek işlemcilere dağıtılır — her işlemci kendi modülüne hızlı, uzak modüllere yavaş erişir. Veriler ve işler yöresellik gözetilerek dağıtılırsa, ortak yol darboğazı olmadan büyük ölçekli paylaşılan bellek elde edilir.',
        '**Kümeler (clusters):** her düğüm kendi adres uzayına sahip bağımsız bir bilgisayardır; iletişim **mesaj aktarımıyla** yapılır. Ölçeklenebilirlik (binlerce makine), yüksek erişilebilirlik (bir düğümün arızası servisi durdurmaz) ve üstün fiyat/performans sunar. On binlerce sunucuya ulaşan kümeler **depo ölçekli bilgisayarlar** olarak adlandırılır — bulut bilişimin fiziksel gerçeği budur.',
      ],
    },
    {
      kind: 'heading',
      id: 'tutarlilik',
      title: 'Cep bellek tutarlılığı (Cache Coherency)',
      lead: 'Aynı verinin kopyaları farklı ceplerde yaşarken biri güncellenirse ne olur? İşte çok işlemcili tasarımın en incelikli problemi.',
    },
    {
      kind: 'prose',
      body: [
        'İşlemci 1 ve İşlemci 2, X=7 değerini kendi ceplerine almış olsun. İşlemci 1, X’i 8 yaparsa İşlemci 2’nin cebindeki 7 artık **geçersizdir** — ama İşlemci 2 bunu bilmez. Yazılım çözümleri (derleyicinin riskli değişkenleri hiç cebe aldırmaması) aşırı ihtiyatlı ve verimsizdir; asıl yük donanımdadır.',
        'İki donanım ailesi vardır. **Dizin protokolleri:** ana bellekteki bir dizinde hangi cebin hangi bloğu tuttuğu merkezi olarak izlenir; yazmak isteyen işlemci merkezden **özel erişim** ister, merkez diğer kopyaları geçersiz kılar. Merkez darboğaz olabilir ama karmaşık bağlantılı büyük sistemlerde etkilidir. **Gözetleme (snoopy) protokolleri:** sorumluluk tüm cep denetçilerine dağıtılır; her denetçi ortak yoldaki yayınları **dinler** (snooping) ve gerektiğinde kendi kopyasını geçersiz kılar — ortak yollu SMP’lerin doğal çözümü. Deneyimler, *yazma-geçersiz kılma* yaklaşımının *yazma-güncelleme* yayınına göre çok daha az bant genişliği kullandığını göstermiştir.',
      ],
    },
    {
      kind: 'prose',
      body: [
        'En bilinen gözetlemeli protokol **MESI**’dir: her cep çerçevesi dört durumdan birindedir — **M**odified (değiştirilmiş; tek geçerli kopya bende, bellek eski), **E**xclusive (özel; bellekle aynı, başka cepte yok), **S**hared (paylaşılan; bellekle aynı, başkalarında da olabilir), **I**nvalid (geçersiz). Durum, hem yerel işlemcinin erişimleriyle hem de gözetlenen yol trafiğiyle değişir; sonradan yazma (write-back) ile uyumludur.',
      ],
    },
    {
      kind: 'viz',
      viz: 'cache-coherence',
      title: 'İnteraktif · MESI Simülatörü',
      caption:
        'Klasik senaryoyu deneyin: MİB1 okusun (I→E), MİB2 okusun (E→S,S), MİB1 yazsın (S→M, diğeri I), sonra MİB2 okusun (M→S, bellek güncellenir).',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Sınav örneği (Buzluca 9.29-30)',
      body: [
        'MİB1’in cebinde X çerçevesi M durumundayken MİB2 X’e yazmak isterse: MİB2 "değiştirme niyetiyle okuma" yayını yapar → MİB1 "ana bellek geçersiz" der, değiştirilmiş çerçeveyi belleğe yazar ve kendi kopyasını I yapar → MİB2 yayını tekrarlar, bloğu bellekten okur, sözcüğü değiştirir ve durumu M yapar. Ayrıca: SMP’de X her iki cepte de aynı KÜMEYE düşer (aynı fiziksel adres) ama küme içindeki çerçeve bilinemez.',
      ],
    },
    {
      kind: 'heading',
      id: 'sinirlar',
      title: 'Paralel işlemenin zorlukları',
      lead: 'İşlemci eklemek bedava hız demek değildir: programın sıralı kısmı, iletişim maliyeti ve senkronizasyon her zaman paydadadır.',
    },
    {
      kind: 'list',
      items: [
        'Programlardaki **sınırlı paralellik** — bazı işlemciler boş kalır (yük dengeleme sorunu).',
        'İşlemciler arası **iletişimin ek yükü**.',
        'Paralel program **yazmanın zorluğu**: benzer yüklü bağımsız parçalara bölme, zamanlama/planlama.',
        '**Senkronizasyon**: bağımlılıklar ve kritik bölgeler (5. dersteki TAS/bölünemez çevrim burada hayati olur).',
      ],
    },
    {
      kind: 'viz',
      viz: 'amdahl',
      title: 'İnteraktif · Paralelliğin Sınırı',
      caption:
        'Kaydırıcıyla oynayın: programın %10’u sıralı kaldığında 64 işlemci bile 10× hızlanmayı geçemez.',
    },
    {
      kind: 'callout',
      tone: 'history',
      title: 'Performans engeli ve ötesi',
      body: [
        'Cep bellek, iş hattı ve çok çekirdek gibi mimari buluşlar performansı on yıllar boyunca taşıdı; ama Moore yasası ve Dennard ölçeklemesi sona ererken büyük veri, makine öğrenmesi gibi alanların gereksinimi exaflop düzeyini aştı. Uzmanlar, sektörün öngörülen "performans engeline" (performance wall) ulaştığını ve yeni eleman/mimari arayışlarının (IEEE Rebooting Computing) kaçınılmaz olduğunu söylüyor.',
      ],
    },
    {
      kind: 'quiz',
      question: 'MESI’de bir çerçeve E (Exclusive) durumundayken yerel işlemci ona yazarsa ne olur?',
      options: [
        'Yola "geçersiz kıl" yayını yapılır ve durum M olur',
        'Hiçbir yol trafiği oluşmadan sessizce yazılır; durum E→M olur',
        'Önce ana bellek güncellenir, durum S olur',
        'Yazma reddedilir; önce S durumuna geçilmelidir',
      ],
      answer: 1,
      explain:
        'E durumu "tek kopya bende ve temiz" demektir: başka cepte kopya olmadığı garanti olduğundan yayına gerek yoktur. İşlemci yazar, çerçeve M olur, ana bellek eskir — MESI’nin E durumunun tüm varlık nedeni bu sessiz yazmadır.',
    },
    {
      kind: 'quiz',
      question: 'Bir programın %95’i paralelleştirilebiliyorsa sonsuz işlemciyle ulaşılabilecek en yüksek hızlanma kaçtır?',
      options: ['95×', 'Sınırsız', '20×', '5×'],
      answer: 2,
      explain:
        'S = 1/((1−p) + p/n); n→∞ için S→1/(1−p) = 1/0,05 = 20. Sıralı %5, hızlanmayı 20× ile sınırlar — Amdahl yasasının acımasız aritmetiği.',
    },
  ],
};

export default lesson;
