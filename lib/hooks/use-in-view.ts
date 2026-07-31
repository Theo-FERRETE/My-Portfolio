'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Passe à `true` la première fois que l'élément entre dans le viewport, et y reste.
 * Sert à déclencher les animations d'apparition des sections sans les rejouer au scroll.
 */
export function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
