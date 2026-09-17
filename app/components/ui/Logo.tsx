/** Marque du site : monogramme + nom, partagé entre l'en-tête et le pied de page. */
export default function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const mark = size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  const name = size === 'lg' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg';

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`inline-flex items-center justify-center rounded-lg bg-accent text-background font-extrabold tracking-tight ${mark}`}
        aria-hidden
      >
        TF
      </span>
      <span className={`font-bold tracking-tight text-foreground whitespace-nowrap ${name}`}>
        Théo Ferrete<span className="text-accent">.</span>
      </span>
    </span>
  );
}
