/** Écran de chargement plein écran de l'admin. */
export default function AdminSpinner({ label = 'Chargement...' }: { label?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center" role="status">
        <div
          className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}
        />
        <p className="admin-text-muted">{label}</p>
      </div>
    </div>
  );
}
