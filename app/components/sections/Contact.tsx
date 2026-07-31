'use client';

import ChromeCanvas from '@/app/components/three/ChromeCanvas';
import SectionHeading from '@/app/components/ui/SectionHeading';
import ContactForm from './contact/ContactForm';
import ContactInfo from './contact/ContactInfo';
import { useInView } from '@/lib/hooks/use-in-view';

export default function Contact({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* 3D plein format */}
      <ChromeCanvas
        variant="projects"
        visible={inView}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`max-w-5xl mx-auto reveal ${inView ? 'reveal-in' : ''}`}>
          <SectionHeading
            as={headingLevel}
            title="On discute ?"
            subtitle="Un projet en tête ? Une question ? Ou juste envie de parler code ? Envoyez-moi un message !"
            className="mb-12 sm:mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
