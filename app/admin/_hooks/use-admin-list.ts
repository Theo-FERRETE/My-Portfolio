'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Charge une collection depuis l'API d'admin. Les écrans de liste répétaient tous
 * le même trio état/chargement/erreur autour d'un `fetch`.
 */
export function useAdminList<T>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Réponse ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error(`Erreur de chargement (${endpoint}):`, err);
      setError('Impossible de charger les données.');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, setItems, isLoading, error, reload };
}
