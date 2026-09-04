import { useId } from 'react';

interface AdminFieldProps {
  label: string;
  required?: boolean;
  /** Précision affichée sous le champ. */
  hint?: string;
  children: (props: { id: string; className: string }) => React.ReactNode;
}

const INPUT_CLASS = 'admin-input w-full px-4 py-2';

/**
 * Libellé + champ + précision. Le `children` est une fonction pour que le champ
 * reçoive l'`id` généré et reste correctement associé à son `<label>`, ce
 * qui manquait aux formulaires de l'admin.
 */
export default function AdminField({ label, required, hint, children }: AdminFieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium admin-text-muted mb-2">
        {label} {required && <span aria-hidden>*</span>}
      </label>
      {children({ id, className: INPUT_CLASS })}
      {hint && <p className="mt-1 text-sm admin-text-muted">{hint}</p>}
    </div>
  );
}
