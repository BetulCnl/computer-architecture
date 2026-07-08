/**
 * Educational content for the CPU model, keyed by PartNode.contentKey.
 * Content lives here — never in components — so it can be reviewed,
 * extended and localized independently of rendering code.
 */
export interface PartContent {
  title: string;
  summary: string;
  details: string;
}

export const cpuContent: Record<string, PartContent> = {
  'cpu.ihs': {
    title: 'Tümleşik Isı Dağıtıcı (IHS)',
    summary: 'Çekirdeği koruyan ve ısıyı yayan nikel kaplı bakır kapak.',
    details:
      'IHS, silisyum çekirdeğin (die) yoğun ve noktasal ısısını daha geniş bir yüzeye dağıtır; böylece soğutucu bu ısıyı emebilir. Ayrıca kırılgan çekirdeği montaj basıncından fiziksel olarak korur. Modern işlemcilerde daha iyi ısı iletimi için çekirdeğe indiyumla lehimlenir.',
  },
  'cpu.paste': {
    title: 'Termal Arayüz Malzemesi (TIM)',
    summary: 'Çekirdek ile ısı dağıtıcı arasındaki mikroskobik boşlukları doldurur.',
    details:
      'Parlatılmış metal yüzeylerde bile yalıtkan hava hapseden mikroskobik girintiler vardır. TIM — lehim ya da termal macun — bu boşlukları doldurur ve ısının çekirdekten IHS’ye verimli akmasını sağlar. O olmasaydı modern bir işlemci saniyeler içinde aşırı ısınırdı.',
  },
  'cpu.die': {
    title: 'Silisyum Çekirdek (Die)',
    summary: 'Asıl işlemci: tırnak boyutunda bir yongada milyarlarca transistör.',
    details:
      'Çekirdek, bir silisyum plakadan (wafer) kesilir; işlemci çekirdeklerini, cep belleği ve G/Ç mantığını barındırır — her biri birkaç nanometre genişliğinde milyarlarca transistör. Gerçek çekirdeklerde görülen gökkuşağı parıltısı, ışığın nano ölçekli devre katmanlarında kırınımından gelir.',
  },
  'cpu.smds': {
    title: 'SMD Kondansatörler',
    summary: 'Çekirdeğe ulaşan gücü düzleştiren minik kondansatörler.',
    details:
      'Bir işlemci saniyede milyarlarca kez anahtarlama yapar ve akım talebinde keskin sıçramalara yol açar. Bu çok katmanlı seramik kondansatörler çekirdeğe olabildiğince yakın durur ve mikroskobik güç depoları gibi davranarak besleme gerilimini kararlı tutar.',
  },
  'cpu.substrate': {
    title: 'Paket Taşıyıcısı (Substrate)',
    summary: 'Çekirdeği anakarta bağlayan minyatür bir devre kartı.',
    details:
      'Taşıyıcı, çekirdeğin binlerce mikroskobik bağlantısını alttaki daha büyük temas yüzeylerine yayan çok katmanlı bir baskı devredir. İçindeki sinyal ve güç yolları en az yonganın kendisi kadar özenle tasarlanır.',
  },
  'cpu.pads': {
    title: 'LGA Temas Yüzeyleri',
    summary: 'Yuvadaki yaylı pimlerle buluşan altın kaplama temas noktaları.',
    details:
      'Land Grid Array (LGA) paketinde pimler anakart yuvasında bulunur; işlemcinin altında ise binden fazla düz, altın kaplama temas yüzeyi vardır. Altın oksitlenmediği için yıllarca güvenilir bağlantı garanti eder.',
  },
};
