import type { PartContent } from '@/content/cpu';

export const ramContent: Record<string, PartContent> = {
  'ram.spreader': {
    title: 'Isı Dağıtıcı Kapak',
    summary: 'Bellek yongalarını soğutan — ve bunu şık yapan — alüminyum kabuk.',
    details:
      'DDR5 modülleri önceki nesillerden daha fazla güç çeker; modül üzerindeki güç devresi de ekstra ısı ekler. Alüminyum kabuk, DRAM paketlerinden ısıyı çekip kasa içi hava akımına yayar. Birçok tüketici modülünde aynı zamanda tasarım öğesi ve RGB taşıyıcısıdır.',
  },
  'ram.chips': {
    title: 'DRAM Paketleri',
    summary: 'Çalışan programlarınızı tutan yongalar — milyarlarca minik kondansatör.',
    details:
      'Her pakette, her bitin milisaniyeler içinde yükünü kaçıran mikroskobik bir kondansatör olduğu DRAM çekirdekleri bulunur. Bellek denetçisi her hücreyi saniyede binlerce kez tazelemek zorundadır — RAM’in güç kesilince her şeyi unutmasının nedeni budur. İki yüzdeki yongalar modül kapasitesini ikiye katlar.',
  },
  'ram.pmic': {
    title: 'Güç Yönetim Yongası (PMIC)',
    summary: 'DDR5, gerilim düzenlemesini anakarttan modülün üzerine taşıdı.',
    details:
      'DDR5’in tanımlayıcı değişikliği budur: her modüldeki PMIC, 5 V girişi DRAM’in gereksindiği hassas düşük gerilimlere dönüştürür. Yerel düzenleme daha temiz güç, yüksek hızlarda daha iyi sinyal bütünlüğü ve anakartların asla sunamayacağı modül başına denetim demektir.',
  },
  'ram.pcb': {
    title: 'Modül PCB’si',
    summary: 'Her iletken yolun uzunluğu eşlenmiş, hassas tasarlanmış bir kart.',
    details:
      'DDR5 hızlarında sinyaller öyle hızlı ilerler ki birkaç milimetre fazla yol, veri zamanlamasını kaydırır. PCB her veri hattını eşlenmiş uzunluklarla yönlendirir — gerçek modüllerdeki kıvrımlı yollar süsleme değil, bilinçli gecikme eşlemesidir.',
  },
  'ram.contacts': {
    title: 'Kenar Konnektörü',
    summary: 'Saniyede milyarlarca aktarım taşıyan 288 altın kaplama parmak.',
    details:
      'Modülün kenarı doğrudan DIMM yuvasına takılır. DDR5, 288 pini korur ama onları modül başına iki bağımsız 32 bitlik kanala yeniden düzenler. Ortadan kaçık çentik, modülün ters ya da bir DDR4 yuvasına takılmasını önler.',
  },
};
