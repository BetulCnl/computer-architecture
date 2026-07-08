import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Görselleştirmelerin ortak zaman motoru.
 *
 * requestAnimationFrame tabanlı bir saat üretir; oynat/duraklat/hız/sıfırla
 * denetimlerini tek yerde toplar. `prefers-reduced-motion` etkinse animasyon
 * duraklatılmış başlar — kullanıcı yine de elle oynatabilir.
 */
export interface VizPlayer {
  /** saniye cinsinden animasyon zamanı (hız çarpanı uygulanmış) */
  t: number;
  playing: boolean;
  speed: number;
  toggle: () => void;
  reset: () => void;
  setSpeed: (s: number) => void;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useVizPlayer(autoplay = true): VizPlayer {
  const [playing, setPlaying] = useState(autoplay && !prefersReducedMotion());
  const [speed, setSpeed] = useState(1);
  const [t, setT] = useState(0);
  const last = useRef<number | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (!playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (last.current !== null) {
        setT((prev) => prev + ((now - last.current!) / 1000) * speedRef.current);
      }
      last.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const reset = useCallback(() => {
    setT(0);
    last.current = null;
  }, []);

  return { t, playing, speed, toggle, reset, setSpeed };
}
