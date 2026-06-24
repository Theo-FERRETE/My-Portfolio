'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import ChromeObject, { type SceneVariant } from './ChromeObject';
import { useReducedMotion } from './useReducedMotion';

interface LiquidMetalSceneProps {
  variant: SceneVariant;
  visible?: boolean;
  accentColor?: string;
  metalColor?: string;
}

function PointerTilt({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y += (x * 0.35 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (-y * 0.25 - groupRef.current.rotation.x) * 0.04;
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
      camera={{ position: [0, 0, isHero ? 4.4 : 3.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <PointerTilt>
          <ChromeObject
            variant={variant}
            rotationSpeed={reducedMotion ? 0 : isHero ? 0.22 : 0.16}
            size={isHero ? 2.4 : 1.3}
            accentColor={accentColor}
            metalColor={metalColor}
          />
        </PointerTilt>
      </Suspense>
    </Canvas>
  );
}
