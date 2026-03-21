'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      void fetchMessages();
    }
  }, [status]);

  async function fetchMessages() {
    try {
      const res = await fetch('/api/admin/contact-messages');
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateMessage(id: number, payload: { status?: 'new' | 'read' | 'replied'; replyMessage?: string }) {
    const res = await fetch(`/api/admin/contact-messages/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Echec de la mise a jour');
    }

    const updated = await res.json();
    setMessages((prev) => prev.map((msg) => (msg.id === id ? updated : msg)));
  }

  async function handleMarkAsRead(id: number) {
    try {
      await updateMessage(id, { status: 'read' });
    } catch (error) {
      console.error(error);
      alert('Impossible de marquer ce message comme lu.');
    }
  }

  async function handleReply(message: ContactMessage) {
    const draft = (replyDrafts[message.id] || '').trim();
    if (!draft) {
      alert('Ajoute d\'abord un texte de reponse.');
      return;
    }

    try {
      await updateMessage(message.id, {
        status: 'replied',
        replyMessage: draft,
      });

      const subject = encodeURIComponent('Reponse a votre message - Portfolio Theo Ferrete');
      const body = encodeURIComponent(`${draft}\n\n--\nTheo Ferrete`);
      window.location.href = `mailto:${message.email}?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error(error);
      alert('Impossible de preparer la reponse pour le moment.');
    }
  }

  const filteredMessages = useMemo(() => {
    if (activeFilter === 'all') {
      return messages;
    }
    return messages.filter((msg) => msg.status === activeFilter);
  }, [messages, activeFilter]);

  const counters = useMemo(() => {
    return {
      all: messages.length,
      new: messages.filter((m) => m.status === 'new').length,
      read: messages.filter((m) => m.status === 'read').length,
      replied: messages.filter((m) => m.status === 'replied').length,
    };
  }, [messages]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Messages de contact
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Tous ({counters.all})
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'new'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Nouveaux ({counters.new})
          </button>
          <button
            onClick={() => setActiveFilter('read')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'read'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Lus ({counters.read})
          </button>
          <button
            onClick={() => setActiveFilter('replied')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'replied'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Repondus ({counters.replied})
          </button>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center text-gray-600 dark:text-gray-400">
            Aucun message pour ce filtre.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredMessages.map((message) => (
              <article
                key={message.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {message.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                      message.status === 'new'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : message.status === 'read'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {message.status === 'new' ? 'Nouveau' : message.status === 'read' ? 'Lu' : 'Repondu'}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                  {message.message}
                </p>

                {message.replyMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Derniere reponse enregistree</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{message.replyMessage}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor={`reply-${message.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reponse
                  </label>
                  <textarea
                    id={`reply-${message.id}`}
                    rows={4}
                    value={replyDrafts[message.id] ?? message.replyMessage ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReplyDrafts((prev) => ({ ...prev, [message.id]: value }));
                    }}
                    placeholder="Ecris ta reponse ici..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {message.status === 'new' && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                    >
                      Marquer comme lu
                    </button>
                  )}

                  <button
                    onClick={() => handleReply(message)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                  >
                    Repondre par email
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
