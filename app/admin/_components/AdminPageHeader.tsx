import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  /** Icône de section, dans un badge coloré à gauche du titre. */
  icon?: LucideIcon;
  /** Couleur du badge d'icône et du liseré du bas — défaut : rouge de marque. */
  color?: string;
  /** Affiche un lien de retour vers cette route. */
  backHref?: string;
  backLabel?: React.ReactNode;
  /** Libellé accessible du lien de retour quand `backLabel` est une icône. */
  backAriaLabel?: string;
  /** Actions optionnelles affichées à droite de l'en-tête. */
  actions?: React.ReactNode;
}

/** Bandeau de titre commun à toutes les pages de l'admin. */
export default function AdminPageHeader({
  title,
  subtitle,
  icon: Icon,
  color = 'var(--admin-accent)',
  backHref,
  backLabel = '← Retour',
  backAriaLabel,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-header relative">
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, ${color}, transparent 60%)` }}
        aria-hidden
      />
      <div className="container mx-auto px-6 py-5">
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
            {Icon && (
              <span
                className="p-2.5 rounded-lg shrink-0"
                style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                aria-hidden
              >
                <Icon size={22} style={{ color }} />
              </span>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate" style={{ color }}>
                {title}
              </h1>
              {subtitle && <p className="text-sm admin-text-muted mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}
