/** Bandeau d'erreur des formulaires de l'admin. */
export default function AdminErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-500/10 text-red-400 rounded-lg" role="alert">
      {message}
    </div>
  );
}
