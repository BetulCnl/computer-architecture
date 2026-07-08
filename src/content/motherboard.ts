import type { PartContent } from '@/content/cpu';

export const motherboardContent: Record<string, PartContent> = {
  'mb.pcb': {
    title: 'Anakart PCB’si',
    summary: 'Tüm bileşenleri birbirine bağlayan sinir sistemi.',
    details:
      'Altı ila sekiz bakır katman, binlerce iletken yolu yönlendirir: yüksek hızlı PCIe ve bellek hatları, güç düzlemleri ve denetim sinyalleri. Bilgisayardaki her bileşen sonuçta bu kart üzerinden haberleşir — yerleşiminin kalitesi, tüm sistemin ne kadar hızlı ve kararlı çalışabileceğini belirler.',
  },
  'mb.socket': {
    title: 'İşlemci Yuvası',
    summary: 'İşlemcinin temas yüzeyleriyle buluşan binden fazla yaylı pim.',
    details:
      'LGA yuvasında narin, yaylı pimler işlemcide değil buradadır. Sabitleme çerçevesi, her pimin temas etmesi için işlemciyi özenle ayarlanmış bir kuvvetle bastırır. Eğilen tek bir pim koca bir bellek kanalını devre dışı bırakabilir — yeni kartlardaki koruyucu kapağın nedeni budur.',
  },
  'mb.vrm': {
    title: 'VRM Soğutucuları',
    summary: 'İşlemciye yüzlerce amper besleyen devrenin soğutması.',
    details:
      'Bu soğutucuların altındaki gerilim düzenleme modülü, 12 V’u işlemcinin gereksindiği ~1 V’a dönüştürür — hem de devasa akımda. Bu anahtarlamayı yapan MOSFET’ler, soğutulmazsa hız düşürecek kadar ısınır; daha güçlü VRM soğutması, üst düzey anakartların pahalı olmasının gerçek nedenlerindendir.',
  },
  'mb.dimm': {
    title: 'DDR5 DIMM Yuvaları',
    summary: 'İşlemci ile bellek arasında dört kanallı temas.',
    details:
      'Bellek yuvaları doğrudan işlemcinin içindeki bellek denetçisine bağlanır — yonga seti işin içinde değildir. Yuva çiftleri kanalları paylaşır; kılavuzun önce hangi yuvaların doldurulacağını söylemesinin nedeni budur: doğru eşleştirme çift kanal bant genişliğini açar.',
  },
  'mb.pcie': {
    title: 'PCIe Yuvaları',
    summary: 'Ekran kartları ve genişleme kartları için şeritler.',
    details:
      'Güçlendirilmiş üst yuva genellikle ×16 şeridi ekran kartı için doğrudan işlemciye bağlar; alttaki yuvalar çoğunlukla yonga seti üzerinden geçer. Her PCIe nesli şerit başına hızı ikiye katlar ve yuvalar geriye uyumludur — eski kart yeni yuvada çalışır, tersi de geçerlidir.',
  },
  'mb.chipset': {
    title: 'Yonga Seti',
    summary: 'İşlemcinin G/Ç yardımcısı — bu soğutucunun altında saklanır.',
    details:
      'Yonga seti, işlemcinin doğrudan üstlenmediği bağlantıları dağıtır: ek PCIe şeritleri, SATA bağlantı noktaları, USB, ağ. İşlemciye özel bir yüksek hızlı bağlantıyla bağlanır ve kendi soğutucusuna gereksinecek kadar sessizce ısınır.',
  },
  'mb.m2': {
    title: 'M.2 Yuvası ve Zırhı',
    summary: 'NVMe SSD’nin karta düz yattığı yer.',
    details:
      'M.2 yuvası, karta düz vidalanan sürücüye PCIe şeritleri ulaştırır — hiç kablo yoktur. Üzerindeki alüminyum zırh bir soğutucudur: hızlı NVMe sürücüler, o olmadan uzun aktarımlarda ısıdan hız düşürebilir.',
  },
  'mb.io': {
    title: 'Arka G/Ç',
    summary: 'Kasanın arkasından dışarı bakan bağlantı kümesi.',
    details:
      'USB, ağ, ses ve görüntü çıkışları dekoratif bir kaportanın altında bu kenarda toplanır. Tasarım hedefi, dış dünyaya kablosuz erişim sunarken tüm yüksek hızlı yolları işlemciye ve yonga setine olabildiğince kısa tutmaktır.',
  },
  'mb.power': {
    title: 'Güç ve Depolama Başlıkları',
    summary: '24 pinlik ATX güç girişi, SATA veri çıkışı.',
    details:
      'Uzun 24 pinlik konnektör, kartın güç kaynağından gelen ana beslemesidir; 12 V, 5 V ve 3,3 V hatlarını taşır. Yanındaki dik açılı SATA bağlantı noktaları 2,5 inç sürücülere ve sabit disklere hizmet eder — NVMe’den eski bir teknoloji, ama hâlâ her yerde.',
  },
  'mb.caps': {
    title: 'Kondansatörler',
    summary: 'Her gerilim hattını düzleştiren minik enerji depoları.',
    details:
      'Katı polimer kondansatörler, kartın güç hatlarını mikrosaniye ölçeğindeki talep sıçramalarına karşı tamponlar. Kaliteleri anakartın ömrünü belirler — 2000’lerin başındaki "kondansatör vebası" milyonlarca kartı öldürdü ve katı kondansatörleri standart yaptı.',
  },
  'mb.battery': {
    title: 'CMOS Pili',
    summary: 'Fiş çekiliyken saati ve ayarları hatırlayan düğme pil.',
    details:
      'Bu CR2032, bilgisayar elektrikten ayrıyken gerçek zamanlı saati işletir ve ürün yazılımı ayarlarını korur. Yıllarca dayanır — ve onu yerinden çıkarmak, huysuzlanan bir BIOS’u sıfırlamanın hâlâ klasik yoludur.',
  },
};
