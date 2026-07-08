import type { ReactNode } from 'react';

/**
 * İçerik dosyalarındaki mini biçimlendirmeyi işler:
 * **kalın**, *eğik*, `kod`. İçerik saf veri kaldığından tam bir Markdown
 * bağımlılığına gerek yoktur.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

export function renderRich(text: string): ReactNode[] {
  return text.split(TOKEN).map((chunk, i) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      return <strong key={i}>{chunk.slice(2, -2)}</strong>;
    }
    if (chunk.startsWith('`') && chunk.endsWith('`')) {
      return <code key={i}>{chunk.slice(1, -1)}</code>;
    }
    if (chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2) {
      return <em key={i}>{chunk.slice(1, -1)}</em>;
    }
    return chunk;
  });
}

export function Rich({ text }: { text: string }) {
  return <>{renderRich(text)}</>;
}
