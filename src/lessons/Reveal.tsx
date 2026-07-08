import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Kaydırmayla tetiklenen giriş animasyonu.
 *
 * Bölüm görünür alana girerken `.revealed` sınıfı eklenir; geçişin kendisi
 * CSS'tedir (transform + opacity + blur). `prefers-reduced-motion` ayarına
 * saygı CSS tarafında gösterilir. Paylaşılan tek IntersectionObserver
 * kullanılır ki yüzlerce bölüm de performansı etkilemesin.
 */

type RevealCallback = (visible: boolean) => void;

let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function getObserver(): IntersectionObserver {
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry.isIntersecting);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );
  return sharedObserver;
}

export function observeReveal(el: Element, cb: RevealCallback): () => void {
  const observer = getObserver();
  callbacks.set(el, cb);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer.unobserve(el);
  };
}

export function Reveal({ children, as: Tag = 'div' }: { children: ReactNode; as?: 'div' | 'section' }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeReveal(el, (visible) => {
      // bir kez görünür olduysa geri saklamayız — okuma akışı titremesin
      if (visible) el.classList.add('revealed');
    });
  }, []);

  return (
    <Tag ref={ref} className="reveal">
      {children}
    </Tag>
  );
}
