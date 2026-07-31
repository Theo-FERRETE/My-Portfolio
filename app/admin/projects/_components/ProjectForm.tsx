'use client';

import {
  AdminErrorBanner,
  AdminField,
  AdminFormActions,
  AdminPageHeader,
  AdminSpinner,
} from '@/app/admin/_components';
import { useResourceForm } from '@/app/admin/_hooks/use-resource-form';

const LIST_PATH = '/admin/projects';
const ENDPOINT = '/api/admin/projects';

interface ProjectFormValues extends Record<string, unknown> {
  title: string;
  description: string;
  image: string;
  /** Saisi en texte séparé par des virgules, converti en tableau à l'envoi. */
  tags: string;
  link: string;
  github: string;
  featured: boolean;
}

const EMPTY: ProjectFormValues = {
  title: '',
  description: '',
  image: '',
  tags: '',
  link: '',
  github: '',
  featured: false,
};

/** Formulaire de projet, en création (`id` absent) comme en édition. */
export default function ProjectForm({ id }: { id?: string }) {
  const { values, isEditing, isLoading, isSaving, error, handleChange, handleSubmit } =
    useResourceForm<ProjectFormValues>({
      endpoint: ENDPOINT,
      id,
      listPath: LIST_PATH,
      emptyValues: EMPTY,
      notFoundMessage: "Ce projet n'existe pas.",
      fromApi: (data) => ({
        title: (data.title as string) || '',
        description: (data.description as string) || '',
        image: (data.image as string) || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        link: (data.link as string) || '',
        github: (data.github as string) || '',
        featured: Boolean(data.featured),
      }),
      toApi: (v) => ({
        ...v,
        tags: v.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    });

  if (isLoading) {
    return <AdminSpinner label="Chargement du projet..." />;
  }

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title={isEditing ? 'Modifier le projet' : 'Ajouter un projet'}
        backHref={LIST_PATH}
      />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="admin-card p-8 space-y-6">
            <AdminErrorBanner message={error} />

            <AdminField label="Titre" required>
              {({ id: fieldId, className }) => (
                <input
                  id={fieldId}
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  className={className}
                  required
                />
              )}
            </AdminField>

            <AdminField label="Description" required>
              {({ id: fieldId, className }) => (
                <textarea
                  id={fieldId}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  rows={4}
                  className={className}
                  required
                />
              )}
            </AdminField>

            <AdminField label="Image" required hint="URL de l'image ou un chemin local">
              {({ id: fieldId, className }) => (
                <input
                  id={fieldId}
                  type="text"
                  name="image"
                  value={values.image}
                  onChange={handleChange}
                  placeholder="https://unsplash.com/... ou /images/projects/mon-image.webp"
                  className={className}
                  required
                />
              )}
            </AdminField>

            <AdminField label="Technos utilisées" required hint="Séparées par des virgules">
              {({ id: fieldId, className }) => (
                <input
                  id={fieldId}
                  type="text"
                  name="tags"
                  value={values.tags}
                  onChange={handleChange}
                  placeholder="React, Node.js, PostgreSQL..."
                  className={className}
                  required
                />
              )}
            </AdminField>

            <AdminField label="Lien" required>
              {({ id: fieldId, className }) => (
                <input
                  id={fieldId}
                  type="url"
                  name="link"
                  value={values.link}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={className}
                  required
                />
              )}
            </AdminField>

            <AdminField label="Lien GitHub">
              {({ id: fieldId, className }) => (
                <input
                  id={fieldId}
                  type="url"
                  name="github"
                  value={values.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className={className}
                />
              )}
            </AdminField>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={values.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--admin-accent)' }}
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium admin-text-muted">
                Projet important (mettre en avant)
              </label>
            </div>

            <AdminFormActions
              isSaving={isSaving}
              submitLabel={isEditing ? 'Enregistrer' : 'Créer'}
              savingLabel="Enregistrement..."
              cancelHref={LIST_PATH}
            />
          </form>
        </div>
      </main>
    </div>
  );
}
