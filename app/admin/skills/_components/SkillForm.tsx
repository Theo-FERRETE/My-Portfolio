'use client';

import {
  AdminErrorBanner,
  AdminField,
  AdminFormActions,
  AdminPageHeader,
  AdminSpinner,
} from '@/app/admin/_components';
import { useResourceForm } from '@/app/admin/_hooks/use-resource-form';

const LIST_PATH = '/admin/skills';
const ENDPOINT = '/api/admin/skills';

export const SKILL_CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Database', 'Tools', 'Design'];

interface SkillFormValues extends Record<string, unknown> {
  name: string;
  category: string;
  icon: string;
  description: string;
}

const EMPTY: SkillFormValues = {
  name: '',
  category: '',
  icon: '⚡',
  description: '',
};

/** Formulaire de compétence, en création (`id` absent) comme en édition. */
export default function SkillForm({ id }: { id?: string }) {
  const { values, isEditing, isLoading, isSaving, error, handleChange, handleSubmit } =
    useResourceForm<SkillFormValues>({
      endpoint: ENDPOINT,
      id,
      listPath: LIST_PATH,
      emptyValues: EMPTY,
      notFoundMessage: "Cette compétence n'existe pas.",
      fromApi: (data) => ({
        name: (data.name as string) || '',
        category: (data.category as string) || '',
        icon: (data.icon as string) || '⚡',
        description: (data.description as string) || '',
      }),
    });

  if (isLoading) {
    return <AdminSpinner label="Chargement de la compétence..." />;
  }

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title={isEditing ? 'Modifier la compétence' : 'Ajouter une compétence'}
        backHref={LIST_PATH}
      />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="admin-card p-8 space-y-6">
            <AdminErrorBanner message={error} />

            <AdminField label="Nom" required>
              {({ id: fieldId, className }) => (
                <input
                  id={fieldId}
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Ex: React"
                  className={className}
                  required
                />
              )}
            </AdminField>

            <AdminField label="Catégorie" required>
              {({ id: fieldId, className }) => (
                <select
                  id={fieldId}
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className={className}
                  required
                >
                  <option value="">Choisis une catégorie</option>
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </AdminField>

            <AdminField label="Icône" required hint="Un emoji qui représente la techno">
              {({ id: fieldId, className }) => (
                <input
                  id={fieldId}
                  type="text"
                  name="icon"
                  value={values.icon}
                  onChange={handleChange}
                  placeholder="⚛️ ou 🚀"
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
                  rows={3}
                  placeholder="Pourquoi tu kiffes cette techno"
                  className={className}
                  required
                />
              )}
            </AdminField>

            <AdminFormActions
              isSaving={isSaving}
              submitLabel={isEditing ? 'Enregistrer' : 'Ajouter'}
              savingLabel="Enregistrement..."
              cancelHref={LIST_PATH}
            />
          </form>
        </div>
      </main>
    </div>
  );
}
