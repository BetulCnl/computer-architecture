import type { Lesson } from '@/lessons/types';

/**
 * Ders 08 — Bellek Yönetimi ve Görüntü Bellek
 * Kaynak: itu_dersNotlari/08BellekYönetimiMemoryManagement_GörüntüBellekVirtualMemory (Feza Buzluca, İTÜ)
 */
const lesson: Lesson = {
  id: '08-bellek-yonetimi',
  order: 8,
  sourceFolder: '08BellekYönetimiMemoryManagement_GörüntüBellekVirtualMemory',
  title: 'Bellek Yönetimi ve Görüntü Bellek',
  subtitle:
    'Her program, tüm bellek yalnız kendisininmiş gibi davranır — ve hiçbiri yalan söylendiğini fark etmez. Sayfalama, sayfa tabloları, TLB ve sanal adres dünyası.',
  minutes: 40,
  heroComponent: 'ram',
  sections: [
    {
      kind: 'heading',
      id: 'amac',
      title: 'Görüntü bellek ne vaat eder?',
      lead: 'Cep bellek ile ana bellek arasındaki ilişkinin bir benzeri, ana bellek ile disk arasında kurulur — ve yine yöresellik sayesinde çalışır.',
    },
    {
      kind: 'list',
      title: 'Üç amaç',
      ordered: true,
      items: [
        'Programlara, fiziksel belleğin boyutundan bağımsız, **büyük ve kesintisiz** bir bellek alanı sunmak.',
        'Bellek blokları üzerinde **erişim denetimi** (koruma/güvenlik) sağlamak.',
        'Çok programlı sistemlerde ortak program ve verilerin **paylaşılmasını** sağlamak.',
      ],
    },
    {
      kind: 'prose',
      body: [
        'Görüntü bellek kullanılan sistemlerde MİB’in ürettiği adrese **görüntü (sanal/mantıksal) adres**, bu adreslerin kümesine **adres uzayı** denir; ana belleğin adreslerine **fiziksel adres**, alanına **bellek uzayı** denir. Bir prosesin adres uzayının parçaları fiziksel bellekte dağınık durur, kullanılmayan kısımlar disktedir — proses bunların nerede olduğunu bilmez ve bilmek zorunda da değildir.',
        'Temel yarar: programcı ve derleyici, fiziksel belleğin yapısını hiç bilmeden çalışır. Program, "tüm sistem benim" varsayımıyla derlenir; gerçek yerleştirmeyi işletim sistemi ile **bellek yönetim birimi** (MMU) çözer.',
      ],
    },
    {
      kind: 'heading',
      id: 'sayfalama',
      title: 'Sayfalı dönüşüm (Paged Mapping)',
      lead: 'Adres uzayı sabit boyutlu sayfalara, fiziksel bellek aynı boyutta sayfa çerçevelerine bölünür. Görüntü sayfa, herhangi bir çerçeveye yerleşebilir.',
    },
    {
      kind: 'prose',
      body: [
        'Görüntü adres iki alandan oluşur: **sayfa numarası** (p bit) + **sayfa içi sözcük numarası** (r bit). Dönüşümde sayfa numarası, fiziksel **blok (çerçeve) numarasına** çevrilir; offset aynen korunur. Hangi sayfanın hangi çerçevede olduğu, fiziksel bellekte tutulan ve **her prosesin kendine ait olduğu** bir **sayfa tablosunda** (page table) saklanır; aktif prosesin tablosunun yeri **PTBR** saklayıcısındadır.',
        'Tablonun her satırında çerçeve numarasının yanında **geçerlilik biti V** (sayfa bellekte mi?), **erişim hakları (RWX)** ve **değişim biti D** (dirty — sayfa bellekteyken değişti mi?) bulunur. Başvurulan sayfa bellekte değilse (V=0) **sayfa hatası** (page fault) oluşur: işletim sistemi prosesi bloke eder, DMAC sayfayı diskten getirir, bu sırada MİB başka bir prosesi çalıştırır. Programın yalnız gerek duyulan sayfalarının getirilmesine **isteğe bağlı sayfalama** (demand paging) denir.',
        'Sayfalama paylaşımı da zarifçe çözer: iki prosesin sayfa tablolarında aynı çerçeve numarası yazılırsa, farklı görüntü adresler aynı fiziksel sayfaya dönüşür — süreçler arası iletişimin temelidir.',
      ],
    },
    {
      kind: 'viz',
      viz: 'virtual-memory',
      title: 'İnteraktif · Adres Dönüşümü',
      caption:
        'Üç senaryoyu izleyin: TLB vurusunda dönüşüm anında biter; ıskada sayfa tablosuna gidilir; sayfa hatasında disk devreye girer.',
    },
    {
      kind: 'prose',
      body: [
        'Her dönüşüm için sayfa tablosuna gitmek, **fazladan bir bellek erişimi** demektir — bu bedel kabul edilemez. Çözüm yine yöresellik: sık erişilen sayfaların tanımlayıcıları, **TLB** (Translation Lookaside Buffer) adlı küçük bir çağrışımlı bellekte tutulur. Vuru olursa dönüşüm tablo erişimi olmadan yapılır; ıskada bilgi tablodan alınıp TLB’ye yazılır (dolunca FIFO/LRU ile yer değiştirilir). TLB, sayfa tablosunun cep belleğidir.',
      ],
    },
    {
      kind: 'callout',
      tone: 'example',
      title: 'LRU yaşlanma sayaçlarıyla sayfa değiştirme',
      body: [
        'Bellekte 4 çerçeve varken 0,1,2,3,0,3,4,5 başvuru zinciri gelirse: her başvuruda o sayfanın sayacı sıfırlanır, ondan küçük sayaçlar bir artırılır; yer gerektiğinde en yüksek sayaçlı ("en yaşlı") sayfa atılır. 4 numaralı sayfa geldiğinde 1 atılır, 5 geldiğinde 2 atılır — en uzun süredir kullanılmayanlar.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'İç kırıntılanma',
      body: [
        'Sayfalar bölünmez bütünler halinde taşınır. 1K sözcüklük sayfalarda 5K+1 sözcüklük bir program 6 sayfa kaplar — son sayfanın 1023 sözcüğü boşa gider ama başka proses o çerçeveyi kullanamaz. Buna **iç kırıntılanma** (internal fragmentation) denir.',
      ],
    },
    {
      kind: 'heading',
      id: 'segman',
      title: 'Segmanlı-sayfalı dönüşüm',
      lead: 'Sayfalar sabit boyutlu mekanik parçalardır; segmanlar ise mantıksal bütünlerdir: bir alt program, bir dizi, bir modül.',
    },
    {
      kind: 'prose',
      body: [
        'Mantıksal adres üç alana bölünür: **segman no + sayfa no + sayfa içi no**. Önce segman tablosundan ilgili sayfa tablosunun adresi alınır, sonra sayfa tablosundan çerçeve numarası bulunur. Segman tablosu; erişim denetimi ve uzunluk gibi bilgileri de tuttuğundan, mantıksal program parçaları üzerinde **erişim ve paylaşım denetimi** kurulabilir. Bedeli, dönüşüm başına fazladan **iki** bellek erişimidir — TLB burada daha da vazgeçilmezdir: segman+sayfa ikilisi tek satırda aranır.',
      ],
    },
    {
      kind: 'heading',
      id: 'butun-resim',
      title: 'Büyük resim: bir bellek erişiminin tam yolculuğu',
      lead: '6. ve 8. derslerin bütün mekanizmaları tek bir erişimde art arda çalışır.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'MİB mantıksal adres üretir (s, p, w).',
        '**TLB’de arama:** vuru varsa fiziksel blok numarası anında alınır → 4. adım. Iska varsa →',
        '**Segman + sayfa tablosu:** sayfa bellekteyse çerçeve numarası alınır, TLB güncellenir. Sayfa bellekte değilse **sayfa hatası** → sayfa diskten getirilir, tablolar ve TLB güncellenir.',
        '**Cep bellekte arama** (fiziksel adresle, 6. dersteki dönüşüm yöntemine göre): vuru varsa veri cepten; ıska varsa ana bellekten okunur ve blok cebe aktarılır; sayaçlar güncellenir.',
      ],
    },
    {
      kind: 'quiz',
      question: 'TLB tam olarak neyin "cep belleği"dir?',
      options: [
        'Ana bellekteki verilerin',
        'Disk sektörlerinin',
        'Sayfa (ve segman) tablosu satırlarının — yani adres dönüşüm bilgilerinin',
        'Komutların',
      ],
      answer: 2,
      explain:
        'TLB, sık kullanılan sayfaların tanımlayıcılarını (çerçeve no, erişim hakları) tutan çağrışımlı bir bellektir. Veri değil, dönüşüm bilgisi saklar; vuru olduğunda sayfa tablosuna erişim tamamen atlanır.',
    },
    {
      kind: 'quiz',
      question: 'Sayfa hatası (page fault) oluştuğunda MİB neden başka bir prosese geçer?',
      options: [
        'Sayfa tablosu kilitlendiği için',
        'Diskten sayfa getirmek milisaniyeler sürer; bu, milyonlarca komut çevrimi demektir — beklemek büyük israf olur',
        'Kesme mekanizması bunu zorunlu kıldığı için',
        'TLB temizlenmesi gerektiği için',
      ],
      answer: 1,
      explain:
        'Disk erişimi (~ms), bellek erişiminden ~100.000 kat yavaştır. İşletim sistemi prosesi bloke eder, DMAC aktarımı yürütür ve MİB bu süreyi başka proseslerin komutlarını yürüterek değerlendirir — çok programlılığın var oluş nedenlerinden biri.',
    },
  ],
};

export default lesson;
