'use client';

import { useMemo, useState } from 'react';
import {
  AdminErrorBanner,
  AdminGuard,
  AdminPageHeader,
  AdminSpinner,
} from '@/app/admin/_components';
import { useAdminList } from '@/app/admin/_hooks/use-admin-list';
import MessageCard from './_components/MessageCard';
import type { ContactMessage } from '@/lib/data';

type Filter = 'all' | ContactMessage['status'];

const FILTER_LABELS: Record<Filter, string> = {
  all: 'Tous',
  new: 'Nouveaux',
  read: 'Lus',
  replied: 'Répondus',
};

function MessagesScreen() {
  const { items: messages, setItems, isLoading, error } =
    useAdminList<ContactMessage>('/api/admin/contact-messages');
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const counters = useMemo(
    () => ({
      all: messages.length,
      new: messages.filter((m) => m.status === 'new').length,
      read: messages.filter((m) => m.status === 'read').length,
      replied: messages.filter((m) => m.status === 'replied').length,
    }),
    [messages]
  );

  const filteredMessages = useMemo(
    () => (activeFilter === 'all' ? messages : messages.filter((m) => m.status === activeFilter)),
    [messages, activeFilter]
  );

  const updateMessage = async (
    id: number,
    payload: { status?: ContactMessage['status']; replyMessage?: string }
  ) => {
    const res = await fetch(`/api/admin/contact-messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Échec de la mise à jour');

    const updated = await res.json();
    setItems((prev) => prev.map((msg) => (msg.id === id ? updated : msg)));
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await updateMessage(id, { status: 'read' });
    } catch (err) {
      console.error(err);
      alert('Impossible de marquer ce message comme lu.');
    }
  };

  const handleReply = async (message: ContactMessage) => {
    const draft = (replyDrafts[message.id] ?? message.replyMessage ?? '').trim();
    if (!draft) {
      alert("Ajoute d'abord un texte de réponse.");
      return;
    }

    try {
      await updateMessage(message.id, { status: 'replied', replyMessage: draft });

      const subject = encodeURIComponent('Réponse à votre message - Portfolio Théo Ferrete');
      const body = encodeURIComponent(`${draft}\n\n--\nThéo Ferrete`);
      window.location.assign(`mailto:${message.email}?subject=${subject}&body=${body}`);
    } catch (err) {
      console.error(err);
      alert('Impossible de préparer la réponse pour le moment.');
    }
  };

  if (isLoading) {
    return <AdminSpinner label="Chargement des messages..." />;
  }

  return (
    <div className="min-h-screen">
      <AdminPageHeader title="Messages de contact" backHref="/admin/dashboard" />

      <main className="container mx-auto px-6 py-10">
        <AdminErrorBanner message={error} />

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrer les messages">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => {
            const active = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                aria-pressed={active}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: active ? 'var(--admin-accent)' : 'var(--admin-surface)',
                  color: active ? 'var(--admin-background)' : 'var(--admin-foreground)',
                  border: active ? 'none' : '1px solid var(--admin-border)',
                }}
              >
                {FILTER_LABELS[key]} ({counters[key]})
              </button>
            );
          })}
        </div>

        {filteredMessages.length === 0 ? (
          <p className="admin-card p-8 text-center admin-text-muted">Aucun message pour ce filtre.</p>
        ) : (
          <div className="space-y-5">
            {filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                draft={replyDrafts[message.id] ?? message.replyMessage ?? ''}
                onDraftChange={(value) =>
                  setReplyDrafts((prev) => ({ ...prev, [message.id]: value }))
                }
                onMarkAsRead={() => handleMarkAsRead(message.id)}
                onReply={() => handleReply(message)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <AdminGuard loadingLabel="Chargement des messages...">
      <MessagesScreen />
    </AdminGuard>
  );
}
