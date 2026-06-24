'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import type { Mesh } from 'three';

export type SceneVariant = 'hero' | 'skills' | 'projects';

export interface ChromeObjectProps {
  variant: SceneVariant;
  size?: number;
  rotationSpeed?: number;
  accentColor?: string;
  metalColor?: string;
}

const ACCENT_COLOR = '#6ee7ff';
const METAL_COLOR = '#e8e8ea';

export default function ChromeObject({
  variant,
  size = variant === 'hero' ? 2.2 : 1.1,
  rotationSpeed = 0.15,
  accentColor = ACCENT_COLOR,
  metalColor = METAL_COLOR,
}: ChromeObjectProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || rotationSpeed === 0) return;
    meshRef.current.rotation.x += delta * rotationSpeed * 0.4;
    meshRef.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color={accentColor} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#ffffff" />

      {/* Environnement procédural simple — juste de quoi donner des reflets au métal */}
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2} color="#ffffff" scale={[6, 3, 1]} position={[-4, 2, 4]} />
        <Lightformer form="rect" intensity={2} color={accentColor} scale={[6, 3, 1]} position={[4, -2, -4]} />
      </Environment>

      <mesh ref={meshRef} scale={size}>
        {variant === 'hero' && <icosahedronGeometry args={[1, 2]} />}
        {variant === 'skills' && <torusGeometry args={[0.7, 0.28, 16, 64]} />}
        {variant === 'projects' && <octahedronGeometry args={[1, 2]} />}
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.25} envMapIntensity={1.2} />
      </mesh>
    </>
  );
}
