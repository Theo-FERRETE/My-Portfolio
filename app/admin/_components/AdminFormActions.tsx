import Link from 'next/link';

interface AdminFormActionsProps {
  isSaving: boolean;
  submitLabel: string;
  savingLabel: string;
  cancelHref: string;
}

/** Barre « Enregistrer / Annuler » en pied de formulaire. */
export default function AdminFormActions({
  isSaving,
  submitLabel,
  savingLabel,
  cancelHref,
}: AdminFormActionsProps) {
  return (
    <div className="flex gap-4 pt-6" style={{ borderTop: '1px solid var(--admin-border)' }}>
      <button
        type="submit"
        disabled={isSaving}
        className="admin-btn-primary flex-1 px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? savingLabel : submitLabel}
      </button>
      <Link href={cancelHref} className="admin-btn-secondary px-6 py-3 transition-all">
        Annuler
      </Link>
    </div>
  );
}
