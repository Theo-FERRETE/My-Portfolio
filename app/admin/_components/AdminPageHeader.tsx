import Link from 'next/link';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  /** Affiche un lien de retour vers cette route. */
  backHref?: string;
  backLabel?: React.ReactNode;
  /** Libellé accessible du lien de retour quand `backLabel` est une icône. */
  backAriaLabel?: string;
  /** Actions optionnelles placées à gauche du sélecteur de thème. */
  actions?: React.ReactNode;
}

/** Bandeau de titre commun à toutes les pages de l'admin. */
export default function AdminPageHeader({
  title,
  subtitle,
  backHref,
  backLabel = '← Retour',
  backAriaLabel,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-header">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {backHref && (
              <Link
                href={backHref}
                aria-label={backAriaLabel}
                className="admin-text-muted hover:opacity-80 shrink-0"
              >
                {backLabel}
              </Link>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold admin-text-accent truncate">{title}</h1>
              {subtitle && <p className="text-sm admin-text-muted mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {actions}
            <AdminThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
