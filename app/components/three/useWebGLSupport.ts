import { useSyncExternalStore } from 'react';

let cachedSupport: boolean | null = null;

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function subscribe(): () => void {
  // Le support WebGL ne change pas après le montage — rien à écouter.
  return () => {};
}

function getSnapshot(): boolean | null {
  if (cachedSupport === null) {
    cachedSupport = detectWebGL();
  }
  return cachedSupport;
}

function getServerSnapshot(): boolean | null {
  return null;
}

export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
