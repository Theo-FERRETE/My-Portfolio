export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}
