import type { PartContent } from '@/content/cpu';

export const ssdContent: Record<string, PartContent> = {
  'ssd.controller': {
    title: 'NVMe Denetçisi',
    summary: 'Her okuma ve yazmayı yöneten küçük bir işlemci.',
    details:
      'Denetçi, özel amaçlı çok çekirdekli bir yongadır: mantıksal adresleri fiziksel NAND sayfalarına eşler, yazmaları dengeli dağıtır (aşınma dengeleme), bit hatalarını anında düzeltir ve işlemciyle PCIe üzerinden NVMe protokolüyle konuşur — flash için tasarlanmış, binlerce paralel komut kuyruğuna sahip bir protokol.',
  },
  'ssd.nand': {
    title: 'NAND Flash',
    summary: 'Verilerinizin gerçekten yaşadığı yer — yüzlerce katman yükseklikte.',
    details:
      'NAND hücreleri elektronları yalıtılmış bir kapıda hapseder; bu yüzden veri, güç olmadan da kalıcıdır. Modern 3D NAND, 200’den fazla hücre katmanını dikey olarak istifler ve hücre başına birden çok bit saklar. Buradaki her paket, bloklar halinde silinip yeniden yazılan yüz milyarlarca hücre içerir.',
  },
  'ssd.dram': {
    title: 'DRAM Önbelleği',
    summary: 'Sürücünün adres haritası için hızlı çalışma belleği.',
    details:
      'Denetçi, mantıksal-fiziksel adres haritasını anında erişim için bu DRAM yongasında tutar. Ucuz sürücüler bunu atlar (yerine ana sistemin belleğini kullanır) — sürekli yük altında ucuz ve üst düzey NVMe sürücüler arasındaki en gerçek farklardan biri budur.',
  },
  'ssd.smds': {
    title: 'Pasif Elemanlar',
    summary: 'Gücü ve sinyalleri temiz tutan kondansatörler ve dirençler.',
    details:
      'Onlarca minik kondansatör, NAND etkinliğinin yoğunlaştığı ve akım talebinin sıçradığı anlarda 3,3 V beslemeyi süzer. Bazı kurumsal sürücüler acil güç kaynağı olarak daha büyük kondansatörler ekler: güç aniden kesilirse denetçi, yoldaki verileri güvenle yazabilir.',
  },
  'ssd.pcb': {
    title: 'M.2 PCB’si',
    summary: 'Koca 2,5 inç sürücülerin yerini alan 22 × 80 mm’lik kart.',
    details:
      'M.2 2280’deki "2280" yalnızca boyuttur: 22 mm genişlik, 80 mm uzunluk. Kasasız, kablosuz ve hareketli parçasız — sürücünün tamamı, anakarta düz yatan tek bir küçük kart üzerindeki bir avuç yongadır.',
  },
  'ssd.contacts': {
    title: 'M.2 Kenar Konnektörü',
    summary: 'İşlemciye doğrudan PCIe bağlantısı — arada dönüştürücü yonga yok.',
    details:
      'Bu altın parmaklar, dört PCIe şeridini doğrudan işlemciye taşır. Çentiğin konumu "anahtardır": bunun gibi bir M-key kenarı, PCIe ×4 NVMe anlamına gelir. NVMe sürücülerin SATA’dan kat kat hızlı olmasının nedeni bu doğrudan bağlantıdır.',
  },
};
