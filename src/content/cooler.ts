import type { PartContent } from '@/content/cpu';

export const coolerContent: Record<string, PartContent> = {
  'cooler.base': {
    title: 'Soğuk Plaka',
    summary: 'İşlemciye doğrudan bastıran parlatılmış bakır taban.',
    details:
      'Bakır taban milimetrenin kesirleri hassasiyetinde düz işlenir ve arada termal macunla işlemcinin ısı dağıtıcısına kenetlenir. Burada bakır kullanılır, çünkü ısıyı alüminyumdan neredeyse iki kat iyi iletir — ısı soğutucuya olabildiğince hızlı girmelidir.',
  },
  'cooler.pipes': {
    title: 'Isı Boruları',
    summary: 'Buharlaşan sıvıyla ısı taşıyan kapalı bakır tüpler.',
    details:
      'Her boru, vakum içinde az miktarda sıvı barındırır. Sıcak tabanda buharlaşır, buhar olarak boruda yukarı koşar, serin uçta yoğuşur ve kılcal fitil boyunca geri döner — hareketli parçasız, kendi kendini pompalayan ve ısıyı katı metalden çok daha iyi taşıyan bir çevrim.',
  },
  'cooler.fins': {
    title: 'Kanatçık Yığını',
    summary: 'Onlarca alüminyum kanatçık, kuleyi dev bir radyatöre dönüştürür.',
    details:
      'Kanatçıkların varlık nedeni yüzey alanını en üst düzeye çıkarmaktır — açılsa bu yığın metrekarelerce yer kaplar. Isı, ısı borularından her kanatçığa yayılır; fan aralarından hava geçirip onu süpürür. Kanatçık aralığı, yüzey alanı ile hava direnci arasında ayarlanmış bir uzlaşmadır.',
  },
  'cooler.fan': {
    title: 'Soğutma Fanı',
    summary: 'Kanatçık yığınından sürekli bir hava akımı geçirir.',
    details:
      'Fan, havayı kanatçıkların arasına zorlayan basınç farkını yaratır. Kanat biçimi, sayısı ve açısı en az gürültüyle en çok havayı taşıyacak şekilde tasarlanır; PWM denetimi sayesinde anakart onu sessiz rölantiden yük altındaki tam güce kadar her hızda döndürebilir.',
  },
};
