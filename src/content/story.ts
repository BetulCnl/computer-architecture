import type { CameraPose, ComponentId } from '@/state/app';

/**
 * Guided tour: "the life of your data" — a curated path through the machine.
 * Camera poses are in scene units (models are normalized to radius ≈ 2.8,
 * centered near the origin at y ≈ 0.2).
 */
export interface TourChapter {
  id: string;
  component: ComponentId;
  title: string;
  body: string;
  explode: number;
  sim: boolean;
  camera: CameraPose;
}

export const tourChapters: TourChapter[] = [
  {
    id: 'intro',
    component: 'motherboard',
    title: 'Makineye Hoş Geldiniz',
    body: 'Bir bilgisayardaki her şey bu kart üzerinden bağlanır. Güç, veri ve denetim sinyalleri onu saniyede milyarlarca kez kat eder. Gelin, izlerini sürelim.',
    explode: 0,
    sim: true,
    camera: { position: [3.8, 4.6, 4.6], target: [0, 0.1, 0] },
  },
  {
    id: 'motherboard-exploded',
    component: 'motherboard',
    title: 'Yüzeyin Altındaki Şehir',
    body: 'Yüzeyi kaldırın; anakart mahallelerini gösterir: işlemci yuvası, bellek yuvaları, genişleme şeritleri ve yonga seti — her birinin kendine ait bir görevi var.',
    explode: 0.85,
    sim: true,
    camera: { position: [-3.4, 3.8, 5.2], target: [0, 0.6, 0] },
  },
  {
    id: 'cpu',
    component: 'cpu',
    title: 'Beyin',
    body: 'İşlemci saniyede milyarlarca komut yürütür. Veri, alt yüzündeki binden fazla altın temas noktasından içeri akar.',
    explode: 0,
    sim: true,
    camera: { position: [2.9, 2.2, 3.6], target: [0, 0.2, 0] },
  },
  {
    id: 'cpu-inside',
    component: 'cpu',
    title: 'Kapağın Altında',
    body: 'Isı dağıtıcının altında, milyarlarca transistör barındıran tırnak boyutunda bir silisyum çekirdek yatar — gökkuşağı parıltısı, nano ölçekli devre katmanlarından gelir.',
    explode: 1,
    sim: false,
    camera: { position: [3.4, 1.6, 3.4], target: [0, 0.5, 0] },
  },
  {
    id: 'ram',
    component: 'ram',
    title: 'Çalışma Belleği',
    body: 'RAM, işlemcinin çalışma masasıdır: göz kamaştırıcı hızda, ama güç kesilince her şeyi unutur. DDR5 modülleri, üzerlerindeki PMIC ile kendi gerilimlerini bile düzenler.',
    explode: 0.65,
    sim: true,
    camera: { position: [2.6, 2.4, 4.4], target: [0, 0.3, 0] },
  },
  {
    id: 'ssd',
    component: 'ssd',
    title: 'Uzun Süreli Bellek',
    body: 'NVMe SSD, verilerinizi hiçbir hareketli parça olmadan saklar ve PCIe şeritleri üzerinden doğrudan işlemciye akıtır — konnektörden NAND’a yolculuğunu izleyin.',
    explode: 0.5,
    sim: true,
    camera: { position: [1.8, 3.4, 3.8], target: [0, 0.3, 0] },
  },
  {
    id: 'gpu',
    component: 'gpu',
    title: 'Paralel Güç Merkezi',
    body: 'Binlerce küçük çekirdek piksellerinizi çizer ve yapay zekâ modellerini eğitir. Bu tek kartın üzerinde eksiksiz bir bilgisayar yaşar: işlemci, bellek, güç katı.',
    explode: 0.9,
    sim: true,
    camera: { position: [-3.6, 3.2, 4.6], target: [0, 0.5, 0] },
  },
  {
    id: 'cooler',
    component: 'cooler',
    title: 'Hayatta Tutmak',
    body: 'Bütün o hesaplama ısıya dönüşür. Isı boruları onu bakır soğuk plakadan kanatçık yığınına taşır; fan da süpürüp götürür — sıcaklığın yukarı yolculuğunu izleyin.',
    explode: 0,
    sim: true,
    camera: { position: [3.4, 1.8, 4.2], target: [0, 0.4, 0] },
  },
  {
    id: 'finale',
    component: 'cpu',
    title: 'Artık Biliyorsunuz',
    body: 'Altı bileşen, tek makine. Turdan çıkın ve her parçayı kendiniz keşfedin — nasıl çalıştığını öğrenmek için herhangi bir şeye tıklayın.',
    explode: 0,
    sim: true,
    camera: { position: [4.6, 3.0, 5.6], target: [0, 0.2, 0] },
  },
];
