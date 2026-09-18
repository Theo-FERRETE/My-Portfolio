'use client';

import ContactForm from './contact/ContactForm';
import ContactInfo from './contact/ContactInfo';
import { useInView } from '@/lib/hooks/use-in-view';

/** Déroulé d'une prise de contact : des étapes, pas de délai promis. */
const STEPS = [
  { title: 'Vous m’écrivez', text: 'Quelques lignes sur votre besoin, via le formulaire ou par email.' },
  { title: 'On échange', text: 'Je reviens vers vous par email pour préciser le contexte et vos attentes.' },
  { title: 'On avance', text: 'Si le projet ou le poste correspond, on définit ensemble la suite.' },
];

/** Formulaire + coordonnées, puis le déroulé. L'en-tête vit dans la page. */
export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} aria-label="Formulaire et coordonnées" className="pb-14 sm:pb-16 bg-background">
      <div className={`container mx-auto px-4 sm:px-6 reveal ${inView ? 'reveal-in' : ''}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 sm:gap-10 items-start">
          <ContactForm />
          <ContactInfo />
        </div>

        <div className="max-w-5xl mx-auto mt-12 sm:mt-14">
          <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Comment ça se <span className="text-accent">passe</span> ?
          </h2>
          <ol className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="glass-card rounded-xl p-6">
                <span
                  className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-accent text-background font-bold"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-foreground/70 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
