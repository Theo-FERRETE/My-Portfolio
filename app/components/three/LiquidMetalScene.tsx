'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import ChromeObject, { type SceneVariant } from './ChromeObject';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface LiquidMetalSceneProps {
  variant: SceneVariant;
  visible?: boolean;
  accentColor?: string;
  metalColor?: string;
}

function PointerTilt({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!enabled) {
      // Respecte prefers-reduced-motion : aucune animation basée sur le curseur ou le scroll.
      return;
    }

    const { x, y } = state.pointer;
    groupRef.current.rotation.y += (x * 0.35 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (-y * 0.25 - groupRef.current.rotation.x) * 0.04;

    // Parallaxe légère au scroll — lecture directe de scrollY dans la frame loop,
    // pas de listener ni de re-render React.
    const scrollTarget = Math.min(window.scrollY / 800, 1) * 0.3;
    groupRef.current.position.y += (scrollTarget - groupRef.current.position.y) * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function LiquidMetalScene({
  variant,
  visible = true,
  accentColor = '#6ee7ff',
  metalColor = '#e8e8ea',
}: LiquidMetalSceneProps) {
  const reducedMotion = useReducedMotion();
  const isHero = variant === 'hero';

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={visible ? 'always' : 'never'}
      camera={{ position: [0, 0, isHero ? 4.2 : 3.2], fov: 38 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
    >
      <Suspense fallback={null}>
        <PointerTilt enabled={!reducedMotion}>
          <ChromeObject
            variant={variant}
            rotationSpeed={reducedMotion ? 0 : isHero ? 0.22 : 0.16}
            size={isHero ? 1.15 : 0.85}
            accentColor={accentColor}
            metalColor={metalColor}
          />
        </PointerTilt>
      </Suspense>
    </Canvas>
  );
}
