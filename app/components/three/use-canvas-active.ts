'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Dit si une scène doit réellement dessiner : élément à l'écran **et** onglet au
 * premier plan. Contrairement à `useInView`, cette valeur redevient `false` quand
 * l'élément ressort du viewport — sinon la boucle de rendu tourne à 60 fps pour
 * l'éternité une fois la section dépassée.
 */
export function useCanvasActive(ref: RefObject<HTMLElement | null>): boolean {
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === 'visible');
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return onScreen && pageVisible;
}
