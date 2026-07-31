'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseResourceFormOptions<TForm> {
  /** Racine de l'API, ex. `/api/admin/projects`. */
  endpoint: string;
  /** Identifiant à éditer. Absent = création. */
  id?: string;
  /** Route de retour après enregistrement ou annulation. */
  listPath: string;
  /** Valeurs d'un formulaire vierge. */
  emptyValues: TForm;
  /** Convertit la réponse de l'API en valeurs de formulaire. */
  fromApi: (data: Record<string, unknown>) => TForm;
  /** Convertit les valeurs de formulaire en corps de requête. */
  toApi?: (values: TForm) => unknown;
  /** Message affiché si la ressource éditée est introuvable. */
  notFoundMessage?: string;
}

const REDIRECT_DELAY_MS = 2000;

/**
 * Chargement, saisie et enregistrement d'une ressource de l'admin. Les pages
 * « nouveau » et « éditer » ne diffèrent que par la présence d'un `id`, ce qui
 * évite d'avoir deux écrans quasi identiques à maintenir en parallèle.
 */
export function useResourceForm<TForm extends Record<string, unknown>>({
  endpoint,
  id,
  listPath,
  emptyValues,
  fromApi,
  toApi,
  notFoundMessage = 'Cette ressource est introuvable.',
}: UseResourceFormOptions<TForm>) {
  const router = useRouter();
  const isEditing = id !== undefined;

  const [values, setValues] = useState<TForm>(emptyValues);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${endpoint}/${id}`);
        if (cancelled) return;

        if (!res.ok) {
          setError(notFoundMessage);
          setTimeout(() => router.push(listPath), REDIRECT_DELAY_MS);
          return;
        }

        setValues(fromApi(await res.json()));
      } catch (err) {
        console.error('Erreur de chargement:', err);
        if (!cancelled) setError('Impossible de charger cette ressource.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // `fromApi` est redéfinie à chaque rendu chez les appelants : on ne recharge
    // que sur un vrai changement de ressource.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, id, isEditing, listPath, notFoundMessage, router]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const nextValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      setValues((prev) => ({ ...prev, [name]: nextValue }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch(isEditing ? `${endpoint}/${id}` : endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toApi ? toApi(values) : values),
      });

      if (res.ok) {
        router.push(listPath);
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Impossible d\'enregistrer, réessayez.');
    } catch (err) {
      console.error('Erreur d\'enregistrement:', err);
      setError('Erreur réseau. Vérifiez votre connexion puis réessayez.');
    } finally {
      setIsSaving(false);
    }
  };

  return { values, isEditing, isLoading, isSaving, error, handleChange, handleSubmit };
}
