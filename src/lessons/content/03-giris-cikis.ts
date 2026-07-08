import type { Lesson } from '@/lessons/types';

/**
 * Ders 03 — Giriş/Çıkış Organizasyonu ve Yol Erişimleri
 * Kaynak: itu_dersNotlari/03GirişÇıkışOrganizasyonu_YolErişimi (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '03-giris-cikis',
  order: 3,
  sourceFolder: '03GirişÇıkışOrganizasyonu_YolErişimi',
  title: 'Giriş/Çıkış Organizasyonu ve Yol Erişimi',
  subtitle:
    'Klavyeden diske, her çevre birimi işlemciyle nasıl konuşur? Adres haritaları, arabirimler, el sıkışma protokolleri ve gerçek bir işlemcinin yol çevrimleri.',
  minutes: 35,
  heroComponent: 'motherboard',
  sections: [
    {
      kind: 'heading',
      id: 'baglanti',
      title: 'MİB – G/Ç bağlantı yöntemleri',
      lead: 'Amaç, iç saklama birimleri (saklayıcılar, bellek) ile çevre birimler (klavye, disk, ağ kartı…) arasında veri aktarmaktır. İlk soru: G/Ç birimleri adres haritasının neresinde?',
    },
    {
      kind: 'viz',
      viz: 'io-mapping',
      title: 'İnteraktif · Yalıtılmış ve Bellek Haritalı G/Ç',
      caption:
        'Intel x86 yalıtılmış (IN/OUT komutlu), Motorola 68K bellek haritalı yaklaşımı kullanır.',
    },
    {
      kind: 'prose',
      body: [
        '**Yalıtılmış G/Ç haritasında** bellek ve G/Ç için ayrı adres haritaları vardır; bir denetim hattı (Bellek/GÇ) hangi haritaya erişildiğini belirler ve erişim komutları ayrıdır (`LOAD/STORE` — `IN/OUT`). **Bellek haritalı G/Ç’de** ise G/Ç arabirimleri bellek adres uzayının belirli aralıklarına yerleşir; her şeye aynı komutlarla erişilir, ayrı G/Ç komutuna gerek kalmaz.',
        'Çevre birimler MİB yollarına doğrudan değil, **G/Ç arabirimleri** üzerinden bağlanır. Arabirim; hız farkını dengeler (tampon), veri yapılarını ve kodları dönüştürür, hata düzeltme yapar ve elektriksel/mekanik işaret dönüşümünü üstlenir. Tipik bir arabirimde veri portları, durum ve denetim saklayıcıları, zamanlayıcı ve kesme isteği (IRQ) çıkışı bulunur.',
      ],
    },
    {
      kind: 'heading',
      id: 'aktarim-yontemleri',
      title: 'Üç veri aktarım yöntemi',
      lead: 'G/Ç birimi ile bellek arasında veriyi kim taşır ve hazır olup olmadığını kim gözler? Cevaba göre üç yöntem doğar.',
    },
    {
      kind: 'prose',
      body: [
        '**1. Programlı aktarım (yoklama/polling):** MİB bir programla sürekli arabirimin bayraklarını (hazır/meşgul) okur; veri hazır olunca aktarımı yine kendisi yapar. Basittir, ek donanım istemez; ama **meşgul bekleme** (busy-waiting) sırasında MİB başka hiçbir iş yapamaz. Yapacak başka işi olmayan basit gömülü sistemler için uygundur.',
        '**2. Kesmeli G/Ç:** MİB arabirimi, hazır olduğunda kesme isteği üretecek şekilde koşullar ve kendi işine döner. Kesme gelince o anki programı bırakır, veri aktarımını yapan **kesme hizmet programını** (KHP) çalıştırır ve kaldığı yere döner. Meşgul bekleme ortadan kalkar; ama kesmeye giriş-çıkışın ek yükleri vardır (geri dönüş adresi ve durum saklama — 4. ders). Çok sık veri aktaran uygulamalar için uygun değildir.',
        '**3. Doğrudan bellek erişimi (DMA):** ek bir donanım birimi olan **DMA denetçisi** (DMAC) veri aktarımını tamamen üstlenir; veriler MİB’e hiç uğramaz. Yoğun, büyük bloklu aktarımların (disk, ağ) yöntemi budur — 5. derste ayrıntısıyla inceleyeceğiz.',
      ],
    },
    {
      kind: 'table',
      title: 'Görev dağılımı özeti',
      head: ['Yöntem', 'Arabirimi kim gözler?', 'Veriyi kim aktarır?'],
      rows: [
        ['Programlı G/Ç', 'MİB (program — meşgul bekleme)', 'MİB (program)'],
        ['Kesmeli G/Ç', 'Kesme mekanizması (donanım)', 'MİB (kesme hizmet programı)'],
        ['DMA', 'DMAC', 'DMAC'],
      ],
    },
    {
      kind: 'quiz',
      question: 'Saniyede on binlerce kez küçük veri aktaran bir uygulamada kesmeli G/Ç neden kötü bir seçimdir?',
      options: [
        'Kesmeler veri kaybettirdiği için',
        'Her kesmede hazırlık ve geri dönüş işlemlerinin (PC/SR yığına, vektör okuma) maliyeti aktarılan veriye göre çok büyük olduğu için',
        'Kesmeli G/Ç yalnız yavaş cihazlarda çalıştığı için',
        'MİB kesme sırasında belleğe erişemediği için',
      ],
      answer: 1,
      explain:
        'Kesmeye giriş/çıkışta çok sayıda bellek erişimi yapılır. Aktarım başına bu ek yük ödenirse sık ve küçük aktarımlarda verim çöker; bu senaryonun doğru aracı DMA’dır.',
    },
    {
      kind: 'heading',
      id: 'asenkron',
      title: 'Asenkron veri aktarımı: uyarma ve el sıkışma',
      lead: 'İki bağımsız birim ortak saat olmadan nasıl güvenle veri alışverişi yapar? İki soru cevaplanmalı: gönderen veriyi gerçekten koydu mu, alıcı gerçekten aldı mı?',
    },
    {
      kind: 'viz',
      viz: 'bus-handshake',
      title: 'İnteraktif · Zamanlama Diyagramları',
      caption:
        'Dört kipi karşılaştırın: uyarmalı iletimde tek taraf konuşur ve geri bildirim yoktur; el sıkışmada her adım karşılıklı onaylanır.',
    },
    {
      kind: 'prose',
      body: [
        '**Uyarmalı iletimde (strobe)** tek denetim işareti vardır ve süreler önceden kararlaştırılır. Kaynak başlatmalı sürümde gönderen, verinin alınıp alınmadığını bilemez; varış başlatmalı sürümde alıcı, verinin gerçekten yola konduğundan emin olamaz.',
        '**El sıkışmada (handshaking)** ise ikinci bir işaret bu belirsizliği giderir: kaynak "veri geçerli" der, varış "veri kabul" ile onaylar; işaretler karşılıklı olarak kaldırılır. Kaynak, onay gelinceye kadar veriyi yolda tutar. Arıza durumunda sonsuz beklemeyi önlemek için her iki tarafta da **zaman aşımı (time-out)** mekanizması bulunur.',
      ],
    },
    {
      kind: 'heading',
      id: 'yol-cevrimi',
      title: 'Gerçek işlemcilerde yol çevrimleri',
      lead: 'Kavramlar gerçek donanımda nasıl görünür? MC6802 senkron-uyarmalı, MC68000 asenkron-el sıkışmalı erişimin klasik örnekleridir.',
    },
    {
      kind: 'prose',
      body: [
        'MC6802, bellek erişimini saat işaretiyle senkronlar ve **VMA** (Valid Memory Address) uyarısıyla başlatır; saat 1’den 0’a inince yol çevrimi tamamlanır. MC68000 ise el sıkışmalı çalışır: işlemci **AS′** (Address Strobe) ile geçerli adresi duyurur, adreslenen birim veriyi alıp verdiğini **DTACK′** (Data Transfer Acknowledge) ile bildirir. DTACK zamanında gelmezse işlemci **bekleme çevrimleri** (wait states) ekler — yavaş bellekler böylece kendi hızlarında yanıt verebilir.',
        '16 bitlik veri yoluna 8 bitlik iki bellek paralel bağlanır; **UDS′/LDS′** hatları tek/çift adresli bayt ve word erişimlerini seçer (A0 hattı dışarı çıkmaz; tek adrese word erişimi adres hatası doğurur). Sonsuz beklemeye karşı bir sayaç, yol çevrimi beklenenden uzun sürerse **BERR′** (Bus Error) girişini tetikler. İşlemcinin **FC2-FC0 işlev kodu** çıkışları her yol çevriminde durumu (kullanıcı/yönetici, veri/program erişimi, kesme kabul) dışarı bildirir — bu kodlarla aynı adrese ayrı program ve veri bellekleri bile yerleştirilebilir.',
      ],
    },
    {
      kind: 'model3d',
      component: 'motherboard',
      title: 'Gerçek Donanım · Anakart',
      caption:
        'Bu dersteki tüm yollar — adres, veri, denetim hatları — anakartın bakır izlerinde yaşar. Simülasyonu açıp yonga setinden yuvalara veri akışını izleyin.',
      sim: true,
    },
    {
      kind: 'quiz',
      question: 'MC68000’de DTACK′ işareti hiç gelmezse ne olur?',
      options: [
        'İşlemci veriyi rastgele bir anda örnekler',
        'Yol çevrimi iptal edilir ve komut atlanır',
        'İşlemci bekleme çevrimleri ekler; bir zaman aşımı sayacı BERR′ üreterek yol hatası sıra dışı durumunu başlatır',
        'İşlemci otomatik olarak senkron erişime geçer',
      ],
      answer: 2,
      explain:
        'El sıkışmalı erişimde işlemci DTACK gelene dek bekleme durumları ekler. Sonsuz beklemeyi önlemek için dışarıya bağlanan sayaç, AS′ uzun süre etkin kalırsa BERR′ girişini etkinleştirir ve yol hatası işlemleri başlar (4. derste "sıra dışı durumlar").',
    },
  ],
};

export default lesson;
