import type { ReactNode } from 'react';

interface EditorWindowProps {
  filename: string;
  /** Slot aligné à droite dans la barre de titre, ex. un badge "phare". */
  action?: ReactNode;
  children: ReactNode;
  /** Élévation/radius : à la charge de l'appelant, pas de valeur par défaut. */
  className?: string;
  titleBarClassName?: string;
}

/** Chrome façon fenêtre d'éditeur (points macOS + onglet nom de fichier), partagé entre
    le Hero, la carte projet et la page détail projet. */
export default function EditorWindow({
  filename,
  action,
  children,
  className = '',
  titleBarClassName = 'px-4 sm:px-5 py-3',
}: EditorWindowProps) {
  return (
    <div className={className}>
      <div className={`flex items-center gap-2 border-b border-border ${titleBarClassName}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" aria-hidden />
        <span className="ml-3 font-mono text-xs text-foreground/50 tint px-2.5 py-1 rounded truncate">
          {filename}
        </span>
        {action && <span className="ml-auto shrink-0">{action}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}
