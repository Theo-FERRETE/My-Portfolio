'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace, type Mesh } from 'three';

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
const MATCAP_SIZE = 256;

/**
 * Dessine une matcap de métal poli, au lieu de faire calculer un environnement
 * par drei. Une matcap encode tout l'éclairage dans une image indexée par la
 * normale : ni lumières, ni cubemap, ni pré-filtrage PMREM au chargement, et un
 * shader nettement plus court à compiler que celui de meshStandardMaterial —
 * or la compilation de shader bloque le thread principal.
 */
function createChromeMatcap(metal: string, accent: string): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = MATCAP_SIZE;
  canvas.height = MATCAP_SIZE;
  const ctx = canvas.getContext('2d')!;
  const c = MATCAP_SIZE / 2;

  // Horizon : clair vers le haut, sombre vers le bas — ce qui donne au métal
  // sa lecture « ciel / sol » caractéristique.
  const horizon = ctx.createLinearGradient(0, 0, 0, MATCAP_SIZE);
  horizon.addColorStop(0, metal);
  horizon.addColorStop(0.44, '#6d6d76');
  horizon.addColorStop(0.6, '#1c1c21');
  horizon.addColorStop(1, '#0b0b0e');
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, MATCAP_SIZE, MATCAP_SIZE);

  // Reflet spéculaire principal, en haut à gauche.
  const specular = ctx.createRadialGradient(c * 0.62, c * 0.5, 2, c * 0.62, c * 0.5, c * 0.85);
  specular.addColorStop(0, 'rgba(255,255,255,0.95)');
  specular.addColorStop(0.3, 'rgba(255,255,255,0.28)');
  specular.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = specular;
  ctx.fillRect(0, 0, MATCAP_SIZE, MATCAP_SIZE);

  // Liseré teinté sur le bord : c'est lui qui porte la couleur du thème.
  ctx.globalCompositeOperation = 'lighter';
  const rim = ctx.createRadialGradient(c, c, c * 0.68, c, c, c);
  rim.addColorStop(0, 'rgba(0,0,0,0)');
  rim.addColorStop(1, accent);
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(c, c, c, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export default function ChromeObject({
  variant,
  size = variant === 'hero' ? 2.2 : 1.1,
  rotationSpeed = 0.15,
  accentColor = ACCENT_COLOR,
  metalColor = METAL_COLOR,
}: ChromeObjectProps) {
  const meshRef = useRef<Mesh>(null);

  const matcap = useMemo(
    () => createChromeMatcap(metalColor, accentColor),
    [metalColor, accentColor]
  );

  // Libère la texture précédente au changement de thème, sinon chaque bascule
  // de couleur abandonne une texture sur le GPU.
  useEffect(() => () => matcap.dispose(), [matcap]);

  useFrame((_, delta) => {
    if (!meshRef.current || rotationSpeed === 0) return;
    meshRef.current.rotation.x += delta * rotationSpeed * 0.4;
    meshRef.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <mesh ref={meshRef} scale={size}>
      {variant === 'hero' && <icosahedronGeometry args={[1, 2]} />}
      {variant === 'skills' && <torusGeometry args={[0.7, 0.28, 16, 64]} />}
      {variant === 'projects' && <octahedronGeometry args={[1, 2]} />}
      <meshMatcapMaterial matcap={matcap} />
    </mesh>
  );
}
