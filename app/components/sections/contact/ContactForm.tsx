'use client';

import { useState } from 'react';

type FieldName = 'name' | 'email' | 'message';

const FIELDS: FieldName[] = ['name', 'email', 'message'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Retourne un message d'erreur, ou null si le champ est valide. */
function validateField(field: FieldName, value: string): string | null {
  const trimmed = value.trim();
  switch (field) {
    case 'name':
      return trimmed.length < 2 ? 'Indiquez au moins 2 caractères.' : null;
    case 'email':
      return EMAIL_PATTERN.test(trimmed) ? null : 'Adresse email invalide.';
    case 'message':
      return trimmed.length < 10 ? 'Votre message doit faire au moins 10 caractères.' : null;
  }
}

function fieldClass(hasError: boolean): string {
  return `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border tint text-foreground outline-none text-sm sm:text-base focus:ring-1 focus:ring-accent focus:border-accent ${
    hasError ? 'border-red-400/70' : 'border-border'
  }`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-xs text-red-400">
      {message}
    </p>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  // On n'affiche l'erreur d'un champ qu'une fois qu'il a été quitté, pour ne pas
  // signaler « invalide » pendant que la personne est encore en train de saisir.
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const errors: Partial<Record<FieldName, string>> = {};
  for (const field of FIELDS) {
    const error = validateField(field, formData[field]);
    if (error) errors[field] = error;
  }
  const isValid = Object.keys(errors).length === 0;

  const errorFor = (field: FieldName) => (touched[field] ? errors[field] : undefined);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (submitStatus) setSubmitStatus(null);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setTouched({ name: true, email: true, message: true });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitStatus({
          type: 'error',
          message: result.error || "Impossible d'envoyer le message pour le moment.",
        });
        return;
      }

      setSubmitStatus({
        type: 'success',
        message: 'Message envoyé avec succès. Je reviens vers vous rapidement !',
      });
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Erreur réseau. Vérifiez votre connexion puis réessayez.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-card p-6 sm:p-8 rounded-xl">
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-semibold text-foreground/80 mb-2">
          Nom
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={errorFor('name') ? true : undefined}
          aria-describedby={errorFor('name') ? 'name-error' : undefined}
          className={fieldClass(!!errorFor('name'))}
          placeholder="Votre nom"
        />
        <FieldError id="name-error" message={errorFor('name')} />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-semibold text-foreground/80 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={errorFor('email') ? true : undefined}
          aria-describedby={errorFor('email') ? 'email-error' : undefined}
          className={fieldClass(!!errorFor('email'))}
          placeholder="votre@email.com"
        />
        <FieldError id="email-error" message={errorFor('email')} />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-semibold text-foreground/80 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          rows={5}
          aria-invalid={errorFor('message') ? true : undefined}
          aria-describedby={errorFor('message') ? 'message-error' : undefined}
          className={`${fieldClass(!!errorFor('message'))} resize-none`}
          placeholder="Votre message..."
        />
        <FieldError id="message-error" message={errorFor('message')} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-accent text-background font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>

      {submitStatus && (
        <p
          className={`mt-4 text-sm font-medium ${
            submitStatus.type === 'success' ? 'text-accent' : 'text-red-400'
          }`}
          role="status"
          aria-live="polite"
        >
          {submitStatus.message}
        </p>
      )}
    </form>
  );
}
