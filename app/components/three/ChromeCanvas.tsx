'use client';

import dynamic from 'next/dynamic';
import { useWebGLSupport } from './useWebGLSupport';
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
  const accentColor = ACCENT_BY_THEME[theme];
  const metalColor = METAL_COLOR_BY_THEME[theme];

  if (webgl === false) {
    return (
      <div
        className={className}
        aria-hidden
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}30, transparent 65%)`,
        }}
      />
    );
  }

  if (webgl === null) {
    return <div className={className} aria-hidden />;
  }

  return (
    <div className={className} aria-hidden>
      <LiquidMetalScene variant={variant} visible={visible} accentColor={accentColor} metalColor={metalColor} />
    </div>
  );
}
