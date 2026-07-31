export interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

/** Retour succès/erreur d'un formulaire de l'admin. */
export default function AdminStatusMessage({ message }: { message: StatusMessage | null }) {
  if (!message) return null;

  return (
    <p
      role="status"
      className={`p-4 rounded-lg ${
        message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
      }`}
    >
      {message.text}
    </p>
  );
}
