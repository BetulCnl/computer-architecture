import type { ComponentId } from '@/state/app';

/**
 * Ders içeriği şeması — "Bilgisayar Mimarisi" interaktif ders kitabının
 * tek veri sözleşmesi.
 *
 * Bir ders = bir içerik dosyası (`src/lessons/content/NN-*.ts`).
 * İçerik dosyaları saf veridir: React yok, sahne erişimi yok. Görselleştirmeler
 * `viz` bölümleriyle kimlik (VizId) üzerinden, donanım modelleri `model3d`
 * bölümleriyle ComponentId üzerinden bağlanır. Böylece içerik; işlenmeden,
 * gözden geçirilebilir ve yeni ders eklemek = tek dosya eklemek olur
 * (registry `import.meta.glob` ile otomatik keşfeder).
 */

/** Kayıtlı görselleştirme bileşenlerinin kimlikleri (bkz. lessons/viz/vizRegistry). */
export type VizId =
  | 'layered-model'
  | 'cpu-cycle'
  | 'von-neumann-harvard'
  | 'performance-walls'
  | 'pipeline'
  | 'branch-prediction'
  | 'bus-handshake'
  | 'bus-arbitration'
  | 'io-mapping'
  | 'interrupt'
  | 'dma'
  | 'memory-hierarchy'
  | 'cache-mapping'
  | 'write-policy'
  | 'disk-geometry'
  | 'raid'
  | 'hamming'
  | 'virtual-memory'
  | 'multiprocessor'
  | 'cache-coherence'
  | 'amdahl'
  | 'ieee754';

/** Metin gövdesi mini biçimlendirme destekler: **kalın**, *eğik*, `kod`. */
export type RichText = string;

export type LessonSection =
  | {
      /** Bölüm başlığı — içindekiler ve kaydırma çıpası bundan üretilir. */
      kind: 'heading';
      id: string;
      title: string;
      lead?: RichText;
    }
  | { kind: 'prose'; body: RichText[] }
  | { kind: 'list'; title?: string; ordered?: boolean; items: RichText[] }
  | {
      kind: 'callout';
      tone: 'info' | 'tip' | 'warning' | 'formula' | 'example' | 'history';
      title?: string;
      body: RichText[];
    }
  | { kind: 'table'; title?: string; head: string[]; rows: RichText[][] }
  | {
      /** İnteraktif görselleştirme — vizRegistry'den kimliğiyle çözülür. */
      kind: 'viz';
      viz: VizId;
      title?: string;
      caption?: RichText;
      props?: Record<string, unknown>;
    }
  | {
      /** Gömülü prosedürel donanım modeli (laboratuvardaki üreticiler yeniden kullanılır). */
      kind: 'model3d';
      component: ComponentId;
      title?: string;
      caption?: RichText;
      /** işlem simülasyonu (veri akışı parçacıkları) açık başlasın mı */
      sim?: boolean;
      /** 0 = birleşik, 1 = tam patlatılmış */
      explode?: number;
    }
  | {
      /** Kendini sınama sorusu — anında geri bildirimli. */
      kind: 'quiz';
      question: RichText;
      options: RichText[];
      /** doğru seçeneğin indeksi */
      answer: number;
      explain: RichText;
    };

export interface Lesson {
  /** URL ve kayıt anahtarı, ör. "02-is-hatti" */
  id: string;
  /** Kenar çubuğundaki sıra (ders notu klasörünün numarası) */
  order: number;
  /** itu_dersNotlari altındaki kaynak klasörün adı */
  sourceFolder: string;
  title: string;
  subtitle: string;
  /** tahmini çalışma süresi (dakika) */
  minutes: number;
  /** kapak sahnesinde gösterilecek donanım modeli */
  heroComponent?: ComponentId;
  sections: LessonSection[];
}
