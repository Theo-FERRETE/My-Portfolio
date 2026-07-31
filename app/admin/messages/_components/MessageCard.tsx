'use client';

import type { ContactMessage } from '@/lib/data';

const STATUS_STYLES: Record<ContactMessage['status'], { label: string; className: string }> = {
  new: { label: 'Nouveau', className: 'bg-blue-500/15 text-blue-400' },
  read: { label: 'Lu', className: 'bg-amber-500/15 text-amber-400' },
  replied: { label: 'Répondu', className: 'bg-green-500/15 text-green-400' },
};

interface MessageCardProps {
  message: ContactMessage;
  draft: string;
  onDraftChange: (value: string) => void;
  onMarkAsRead: () => void;
  onReply: () => void;
}

export default function MessageCard({
  message,
  draft,
  onDraftChange,
  onMarkAsRead,
  onReply,
}: MessageCardProps) {
  const status = STATUS_STYLES[message.status];

  return (
    <article className="admin-card p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold">{message.name}</h2>
          <p className="text-sm admin-text-muted">{message.email}</p>
          <p className="text-xs admin-text-muted mt-1">
            {new Date(message.createdAt).toLocaleString('fr-FR')}
          </p>
        </div>

        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <p className="whitespace-pre-wrap mb-4">{message.message}</p>

      {message.replyMessage && (
        <div
          className="mb-4 p-3 rounded-lg"
          style={{ background: 'var(--admin-background)', border: '1px solid var(--admin-border)' }}
        >
          <p className="text-xs font-semibold admin-text-muted mb-1">
            Dernière réponse enregistrée
          </p>
          <p className="text-sm whitespace-pre-wrap">{message.replyMessage}</p>
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor={`reply-${message.id}`}
          className="block text-sm font-medium admin-text-muted mb-2"
        >
          Réponse
        </label>
        <textarea
          id={`reply-${message.id}`}
          rows={4}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Écris ta réponse ici..."
          className="admin-input w-full px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {message.status === 'new' && (
          <button
            onClick={onMarkAsRead}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Marquer comme lu
          </button>
        )}

        <button onClick={onReply} className="admin-btn-primary px-4 py-2 text-sm transition-all">
          Répondre par email
        </button>
      </div>
    </article>
  );
}
