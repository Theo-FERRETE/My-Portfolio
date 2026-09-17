'use client';

import ContactForm from './contact/ContactForm';
import ContactInfo from './contact/ContactInfo';
import { useInView } from '@/lib/hooks/use-in-view';

/** Formulaire + coordonnées. L'en-tête vit dans la page. */
export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} aria-label="Formulaire et coordonnées" className="pb-20 sm:pb-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 sm:gap-10 items-start reveal ${
            inView ? 'reveal-in' : ''
          }`}
        >
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
