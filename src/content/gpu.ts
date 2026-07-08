import type { PartContent } from '@/content/cpu';

export const gpuContent: Record<string, PartContent> = {
  'gpu.die': {
    title: 'GPU Çekirdeği',
    summary: 'Kütlesel paralel matematik için tasarlanmış binlerce küçük çekirdek.',
    details:
      'İşlemcide bir avuç güçlü çekirdek varken, GPU çekirdeği aynı anda çalışan binlerce daha basit çekirdek barındırır. Bir kareyi çizmek, aynı matematiği milyonlarca piksele uygulamak demektir — bu mimarinin tam da beslendiği iş yükü. Aynı paralellik bugün yapay zekâ modellerini de eğitiyor.',
  },
  'gpu.vram': {
    title: 'GDDR Bellek',
    summary: 'Çekirdeğin etrafını saran ultra geniş, ultra hızlı bellek.',
    details:
      'Grafik belleği, gecikmeyi feda edip müthiş bant genişliği kazanır: dokular ve kare verileri, yüzlerce bit genişliğinde bir yol üzerinden saniyede terabaytlarca akar. Yongalar çekirdeği çevreler, çünkü bu hızlarda iletken yolun her milimetresi önemlidir.',
  },
  'gpu.vrm': {
    title: 'Güç Katı (VRM)',
    summary: '12 V’u, çekirdek için ~1 V’ta yüzlerce ampere dönüştürür.',
    details:
      'Modern bir GPU yaklaşık bir voltta 300+ watt çekebilir — bu yüzlerce amper demektir. VRM bu yükü çok sayıda faza böler; her fazda bir bobin (metal küpler) ve kondansatörler bulunur. Saniyede milyonlarca kez anahtarlama yaparak gerilimi, vahşi yük dalgalanmalarında bile sarsılmaz tutar.',
  },
  'gpu.heatsink': {
    title: 'Soğutucu Kanatçıklar',
    summary: 'Kaportanın altına gizlenmiş yoğun bir alüminyum radyatör.',
    details:
      'Çekirdeğin ve belleğin ısısı, bir buhar odası ya da ısı borularıyla bu kanatçık dizisine yayılır. Kanatçıklar, küçük ve aşırı sıcak bir noktayı, hava akımının gerçekten soğutabileceği geniş ve ılık bir yüzeye dönüştürür.',
  },
  'gpu.fans': {
    title: 'Eksenel Fanlar',
    summary: 'Havayı kanatçıkların arasından geçirip karttan dışarı atar.',
    details:
      'Fanlar havayı soğutucu kanatçıklarının arasına zorlar ve karttan dışarı üfler. Modern kartların çoğu boştayken sessizlik için fanları tamamen durdurur; bazıları komşu kanatlar arasındaki türbülansı azaltmak için fanları zıt yönlerde döndürür.',
  },
  'gpu.shroud': {
    title: 'Fan Kaportası',
    summary: 'Hava akışını yönlendirir — ve kartın görünümünü belirler.',
    details:
      'Plastik kaporta, fanların havasını yanlardan kaçmak yerine kanatçıkların arasından geçmeye zorlar. Aynı zamanda kartın yüzüdür: endüstriyel tasarım, aydınlatma ve marka kimliği, özünde büyük bir radyatör olan bu yapının etrafına sarılır.',
  },
  'gpu.pcb': {
    title: 'Grafik Kartı PCB’si',
    summary: 'Yoğun, çok katmanlı bir kart — bilgisayarınızın içindeki bilgisayar.',
    details:
      'GPU kartı kendi işlemcisini, kendi belleğini ve kendi güç katını taşır: PCIe üzerinden ana sisteme bağlanan eksiksiz bir bilgisayar. Üst düzey kartlar, avuç genişliğinde bir alanda binlerce yüksek hızlı bağlantıyı yönlendirmek için 12+ bakır katman kullanır.',
  },
  'gpu.pcie': {
    title: 'PCIe Konnektörü',
    summary: '×16 yuva bağlantısı — kartın veri can damarı.',
    details:
      'On altı PCIe şeridi kartı işlemciye bağlar ve saniyede onlarca gigabayt taşır. Komutlar, dokular ve hesap verileri — hepsi bu kenardan geçer. Konnektör ayrıca 75 W güç sağlar; fazlası yardımcı güç kablolarından gelir.',
  },
  'gpu.backplate': {
    title: 'Arka Plaka',
    summary: 'Kartı sağlamlaştırır ve bir miktar ısı emer.',
    details:
      'Ağır soğutucular uzun bir PCB’yi zamanla eğerek lehim noktalarını zorlayabilir. Metal arka plaka bir omurga görevi görür; çoğu zaman termal pedlerle kartın arka yüzündeki bellek ve VRM’den ısı da çeker.',
  },
  'gpu.bracket': {
    title: 'G/Ç Braketi',
    summary: 'Kartı kasaya sabitler ve görüntü çıkışlarını dışarı açar.',
    details:
      'Braket kasaya vidalanır, kartın ağırlığını taşır ve DisplayPort/HDMI çıkışlarını kasa kesitine hizalar. Birçok kartta sıcak havanın dışarı atıldığı yolun da bir parçasıdır.',
  },
};
