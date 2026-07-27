'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#f2f2f0',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Une erreur est survenue
          </h1>
          <p style={{ opacity: 0.7, marginBottom: '2rem' }}>
            Le site a rencontré un problème inattendu. Merci de réessayer.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: '#f2f2f0',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
