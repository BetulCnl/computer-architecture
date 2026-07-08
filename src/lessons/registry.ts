import notesFolders from 'virtual:ders-notlari';
import type { Lesson } from '@/lessons/types';

/**
 * Ders kayıt defteri — iki kaynaktan otomatik beslenir:
 *
 * 1. `src/lessons/content/*.ts` içindeki yazılmış dersler
 *    (`import.meta.glob` ile keşif: yeni ders = tek içerik dosyası).
 * 2. `itu_dersNotlari/` klasör taraması (Vite eklentisi `virtual:ders-notlari`).
 *    İçeriği henüz yazılmamış bir not klasörü, kenar çubuğunda otomatik olarak
 *    "hazırlanıyor" durumundaki bir ders girdisi olarak görünür.
 */

interface ContentModule {
  default: Lesson;
}

const modules = import.meta.glob<ContentModule>('./content/*.ts', { eager: true });

const authored: Lesson[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order);

const authoredFolders = new Set(authored.map((l) => l.sourceFolder));

/** "03GirişÇıkışOrganizasyonu_YolErişimi" → "Giriş Çıkış Organizasyonu / Yol Erişimi" */
function humanizeFolderName(folder: string): string {
  return folder
    .replace(/^\d+/, '')
    .replace(/_/g, ' / ')
    .replace(/([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g, '$1 $2')
    .trim();
}

export interface LessonEntry {
  id: string;
  order: number;
  title: string;
  /** true → içerik yazılmış; false → sadece not klasörü algılandı */
  ready: boolean;
  lesson?: Lesson;
}

/** Kenar çubuğunda listelenen tüm dersler, sayısal sırada. */
export const lessonEntries: LessonEntry[] = [
  ...authored.map((lesson) => ({
    id: lesson.id,
    order: lesson.order,
    title: lesson.title,
    ready: true,
    lesson,
  })),
  ...notesFolders
    .filter((folder) => /^\d+/.test(folder) && !authoredFolders.has(folder))
    .map((folder) => {
      const order = Number(folder.match(/^\d+/)?.[0] ?? 999);
      return {
        id: `taslak-${order}`,
        order,
        title: humanizeFolderName(folder),
        ready: false,
      };
    }),
].sort((a, b) => a.order - b.order);

export function getLesson(id: string): Lesson | null {
  return lessonEntries.find((e) => e.id === id)?.lesson ?? null;
}
