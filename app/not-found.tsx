import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="text-accent font-semibold mb-2">404</p>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Page introuvable
        </h1>
        <p className="text-foreground/60 mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-accent text-background rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
