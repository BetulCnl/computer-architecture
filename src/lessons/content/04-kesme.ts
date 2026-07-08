import type { Lesson } from '@/lessons/types';

/**
 * Ders 04 — Kesme (Interrupt)
 * Kaynak: itu_dersNotlari/04Kesme_interrupt (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '04-kesme',
  order: 4,
  sourceFolder: '04Kesme_interrupt',
  title: 'Kesme (Interrupt)',
  subtitle:
    'Donanımın "bir dakika, önce bana bak" deme biçimi: kesme kaynakları, öncelik devreleri, vektör tabloları, iç içe kesmeler ve sıra dışı durumlar.',
  minutes: 40,
  heroComponent: 'cpu',
  sections: [
    {
      kind: 'heading',
      id: 'tasarim',
      title: 'Üç tasarım problemi',
      lead: 'Bir dış birimde belli bir koşul oluştuğunda birim, MİB’e kesme isteği gönderir. Ama bu basit fikir üç zor soruyu beraberinde getirir.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Kaynak:** Bir MİB’e birden fazla kesme kaynağı bağlıysa, isteğin hangi kaynaktan geldiği nasıl belirlenir?',
        '**Öncelik:** Aynı anda birden fazla istek gelirse hangisi önce karşılanır?',
        '**Başlangıç adresi:** Kabul edilen kaynağa ilişkin kesme hizmet programının (KHP / ISR) adresi nasıl bulunur?',
      ],
    },
    {
      kind: 'prose',
      body: [
        'En yalın düzen (örneğin MC6802) tek bir kesme girişine sahiptir: tüm kaynaklar açık kollektörlü çıkışlarla aynı IRQ hattına bağlanır, tek bir KHP çalışır ve kaynak, programın içinde **yoklamayla** (polling) belirlenir — öncelik de yoklama sırasıyla oluşur. Daha gelişmiş düzenlerde (örneğin x86) işlemcinin kesme kabul (INTA) çıkışı vardır ve kaynaklar bir **kesme öncelik devresi** üzerinden bağlanır; isteği kabul edilen kaynak, **vektör numarasını** veri yolundan MİB’e bildirir.',
        'MİB, hizmet programlarının adres bilgilerini bir **kesme vektör tablosunda** tutar. Vektörlü çalışmada kaynak, tablodaki satır numarasını (vektör numarası) gönderir; MİB o satırdan KHP başlangıç adresini alıp PC’ye yazar (68000 böyle çalışır). **Otovektörlü** çalışmada ise vektör numarası kaynaktan alınmaz; her kesme düzeyi için tabloda önceden belirlenmiş sabit bir satır vardır. 68000 her iki yöntemi de destekler.',
      ],
    },
    {
      kind: 'heading',
      id: 'oncelik',
      title: 'Kesme öncelik devreleri',
      lead: 'Aynı anda gelen isteklerden hangisinin kazanacağını donanım iki klasik yöntemle belirler.',
    },
    {
      kind: 'viz',
      viz: 'bus-arbitration',
      title: 'İnteraktif · Papatya Zinciri ve Paralel Öncelik',
      caption:
        'Senaryo: Kaynak 2 ve Kaynak 3 aynı anda istek gönderiyor. Papatya zincirinde kesme kabul işareti halkalardan seri geçer; paralel devrede öncelik kodlayıcısı kararı tek adımda verir.',
    },
    {
      kind: 'prose',
      body: [
        '**Papatya zincirinde (daisy chain)** öncelik, fiziksel bağlantı sırasıyla belirlenir: MİB’den çıkan kesme kabul işareti önce zincirin başındaki halkaya gelir. Halkaya bağlı cihaz istekte bulunduysa halka, INTACK’i kendi kaynağına yönlendirir, kaynak vektör adresini veri yoluna çıkarır ve halka PO çıkışını kapatarak işaretin zincirde ilerlemesini keser. İstek yoksa işaret sonraki halkaya geçer — bu yönteme **donanım yoklaması** da denir. Vektör adresini kaynağın değil öncelik devresinin tuttuğu ikinci bir sürüm de vardır.',
        '**Paralel öncelik devresinde** tüm istekler bir kesme istek saklayıcısında tutulur ve bir **öncelik kodlayıcısına** (priority encoder) paralel girer; kodlayıcı en yüksek öncelikli isteğin numarasını üretir. **Maske saklayıcısı** istenen kaynakları yazılımla engellemeye, kaynak başına **vektör adres saklayıcıları** da vektör numaralarını esnekçe değiştirmeye olanak verir.',
      ],
    },
    {
      kind: 'heading',
      id: 'khp',
      title: 'Kesme anında neler olur?',
      lead: 'Kesilen program, kesildiğinden habersiz kalmalı. Bunu sağlayan şey, donanımın kesme çevriminde ve RTI komutunda yaptığı simetrik işlemlerdir.',
    },
    {
      kind: 'viz',
      viz: 'interrupt',
      title: 'İnteraktif · Kesme Zaman Çizgisi ve İç İçe Kesmeler',
      caption:
        '"Tek kesme" kipinde yığının rolünü, "İç içe kesmeler" kipinde düzey/maske etkileşimini izleyin (68000’in 4.29 örneği).',
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'Kesme çevrimi (donanım yapar, program değil)',
      body: [
        'SP ← SP−1;  M[SP] ← PC   (geri dönüş adresi yığına)',
        'INTACK ← 1;  PC ← vektör adresi (ya da PC ← Tablo[VNo])',
        'SP ← SP−1;  M[SP] ← SR   (durum saklayıcısı yığına);  IEN ← 0 (diğer kesmeler maskelenir)',
        'Dönüşte RTI: SR ← M[SP]; SP ← SP+1; PC ← M[SP]; SP ← SP+1',
      ],
    },
    {
      kind: 'prose',
      body: [
        'Bu hazırlık ve dönüş işlemleri çok sayıda bellek erişimi gerektirdiğinden **zaman alıcıdır**. Ders notlarındaki örnek bunu çarpıcı gösterir: komut çevrimi toplamı 170 ns olan bir MİB’de, kesme hazırlığı 200 ns ve KHP 500 ns sürüyorsa, 10 sözcüğün kesmeli yöntemle aktarımı 8700 ns alır — sözcük başına 870 ns! Sık veri aktarımı için kesme uygun değildir; doğru araç 5. dersin konusu olan DMA’dır.',
        '**İç içe kesmelerde** (nested interrupts) 68000’in üç bitlik IPL girişlerinden gelen düzey (1–7), durum saklayıcısındaki maske bitleriyle (I2 I1 I0) karşılaştırılır: istek ancak düzeyi maskeden **büyükse** kabul edilir (7. düzey maskelenemez). Kabulde, kabul edilen düzey maskeye yazılır; böylece eşit ve düşük öncelikli istekler otomatik engellenir. Yüksek öncelikli bir iş, düşük öncelikli KHP’yi kesebilir — tersi asla.',
      ],
    },
    {
      kind: 'quiz',
      question:
        'Maske 100 (düzey 4 çalışıyor) iken 2. düzeyden kesme isteği gelirse ne olur?',
      options: [
        'KHP-4 kesilir, KHP-2 başlar',
        'İstek kaybolur',
        'İstek bekletilir; KHP-4 bitip maske düşünce kabul edilir',
        'İşlemci iki KHP’yi paralel çalıştırır',
      ],
      answer: 2,
      explain:
        'Kesme isteği ancak düzeyi maskeden büyükse kabul edilir (2 ≤ 4 → red). Kaynak isteğini sürdürür; KHP-4’ün sonundaki RTE maskeyi eski değerine döndürünce bekleyen istek işleme alınır.',
    },
    {
      kind: 'heading',
      id: 'exceptions',
      title: 'Sıra dışı durumlar (Exceptions)',
      lead: 'Kesme, buzdağının görünen ucudur: işlemci içinden ve dışından gelen tüm olağan dışı olaylar aynı mekanizmadan geçer.',
    },
    {
      kind: 'table',
      title: 'MC68000 sıra dışı durumları',
      head: ['Kaynağı', 'Örnekler'],
      rows: [
        ['Dış kaynaklı', 'Reset · Yol hatası (BERR) · Kesme istekleri (vektörlü/otovektörlü)'],
        [
          'İç kaynaklı',
          'İzleme (trace, adım adım hata ayıklama) · Adres hatası (tek adrese word erişimi) · Yazılım kesmeleri (TRAP #0–15, TRAPV, CHK) · Geçersiz komut · Komut benzetimi (Line A/F) · Yetkisiz komut · Sıfıra bölme',
        ],
      ],
    },
    {
      kind: 'prose',
      body: [
        'Sıra dışı durum oluştuğunda işlemci; SR’nin kopyasını çıkarır, **yönetici (supervisor) konumuna** geçer (S←1), izlemeyi kapatır, PC’yi ve SR’nin eski kopyasını yığına yazar ve hizmet programının adresini vektör tablosundan alır. Hizmet programı **RTE** (Return from Exception) ile biter. Yol/adres hatalarında yığına ek bilgiler de (erişilen adres, komut sözcüğü, işlev kodları) yazılır; BERR işlenirken ikinci bir BERR oluşursa işlemci kendini sistemden yalıtıp **HALT** konumuna geçer — bellekteki verileri korumanın son çaresi.',
        '**Ayrıcalık konumları**, modern işletim sistemlerinin temelidir: 68000 kullanıcı (user) ve yönetici (supervisor) konumlarından birindedir ve her konumun ayrı yığın işaretçisi vardır (USP/SSP). `STOP`, `RESET` ve SR’ye yazan komutlar yalnız yönetici konumunda çalışır. Kullanıcı konumundan yönetici konumuna geçişin **tek yolu** bir sıra dışı durumdur — bu yüzden kullanıcı programları sistem kaynaklarına ancak **yazılım kesmeleriyle** (TRAP #0–15) kontrollü biçimde erişebilir. Bugünkü "system call" mekanizması tam olarak budur.',
        'Zarif bir başka kullanım da **komut benzetimidir** (instruction emulation): $A ve $F ile başlayan işlem kodları 68000’de "gerçeklenmemiş komut" sıra dışı durumu doğurur. Tasarımcı, donanımda var olmayan bir komutu bu kodlarla tanımlayıp davranışını hizmet programında yazılımla gerçekleyebilir — programlar bu "sanal komutu" gerçek komutlar gibi kullanır.',
      ],
    },
    {
      kind: 'quiz',
      question: 'Kullanıcı programı neden doğrudan G/Ç arabirimine yazamaz da TRAP komutu kullanır?',
      options: [
        'TRAP daha hızlı olduğu için',
        'G/Ç arabirimi yalnız yönetici konumunda erişilebilir yapılmıştır; TRAP, kontrollü biçimde yönetici konumuna geçen tek kapıdır',
        'TRAP komutu G/Ç adreslerini otomatik hesapladığı için',
        'Kullanıcı programları bellek kullanamadığı için',
      ],
      answer: 1,
      explain:
        'Sistem tasarımında kritik kaynaklara erişim yönetici konumuyla sınırlanır (örn. FC çıkışlarıyla adres çözmede). Kullanıcı konumundan yönetici konumuna yalnız sıra dışı durumla geçilebildiğinden, TRAP hizmet programları işletim sisteminin denetimli servis kapısı olur.',
    },
  ],
};

export default lesson;
