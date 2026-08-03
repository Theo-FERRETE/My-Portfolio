'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useWebGLSupport } from './useWebGLSupport';
import { useCanvasActive } from './use-canvas-active';
import { useTheme } from '@/app/components/providers/ThemeProvider';
import type { SceneVariant } from './ChromeObject';

const LiquidMetalScene = dynamic(() => import('./LiquidMetalScene'), {
  ssr: false,
  loading: () => null,
});

const ACCENT_BY_THEME = {
  obsidian: '#6ee7ff',
  nebula: '#c084fc',
  emerald: '#34d399',
  crimson: '#f87171',
  amber: '#fbbf24',
  sapphire: '#60a5fa',
  rose: '#f472b6',
} as const;

const METAL_COLOR_BY_THEME = {
  obsidian: '#e8e8ea',
  nebula: '#e8e2f5',
  emerald: '#dff2e8',
  crimson: '#f5e0e0',
  amber: '#f5ecd9',
  sapphire: '#dde7f5',
  rose: '#f5e0ec',
} as const;

interface ChromeCanvasProps {
  variant: SceneVariant;
  visible?: boolean;
  className?: string;
}

export default function ChromeCanvas({ variant, visible = true, className }: ChromeCanvasProps) {
  const webgl = useWebGLSupport();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const accentColor = ACCENT_BY_THEME[theme];
  const metalColor = METAL_COLOR_BY_THEME[theme];

  // Visibilité réelle, réévaluée en continu. L'appelant peut encore couper la
  // scène via `visible`, mais ne peut plus la laisser tourner hors écran.
  const active = useCanvasActive(containerRef);

  // Laisse l'hydratation et le premier rendu se terminer avant de charger
  // le bundle three.js (~1 Mo) et de compiler les shaders, pour ne pas
  // bloquer le thread principal pendant le chargement initial.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setIdle(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  // Le bundle n'est téléchargé qu'une fois la scène réellement approchée, puis
  // on le garde monté : re-créer un contexte WebGL à chaque scroll coûterait
  // plus cher que de laisser la boucle de rendu en pause.
  // Ajustement pendant le rendu plutôt que dans un effect, pour ne pas déclencher
  // un rendu en cascade (cf. https://react.dev/learn/you-might-not-need-an-effect).
  const [loaded, setLoaded] = useState(false);
  if (!loaded && idle && active) setLoaded(true);

  if (webgl === false) {
    return (
      <div
        ref={containerRef}
        className={className}
        aria-hidden
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}30, transparent 65%)`,
        }}
      />
    );
  }

  return (
    <div ref={containerRef} className={className} aria-hidden>
      {webgl && loaded && (
        <LiquidMetalScene
          variant={variant}
          visible={visible && active}
          accentColor={accentColor}
          metalColor={metalColor}
        />
      )}
    </div>
  );
}
