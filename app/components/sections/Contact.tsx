'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Github, Linkedin, Mail, Circle } from 'lucide-react';
import ChromeCanvas from '@/app/components/three/ChromeCanvas';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Impossible d\'envoyer le message pour le moment.',
        });
        return;
      }

      setSubmitStatus({
        type: 'success',
        message: 'Message envoyé avec succès. Je reviens vers vous rapidement !',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Erreur réseau. Vérifiez votre connexion puis réessayez.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (submitStatus) {
      setSubmitStatus(null);
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://www.github.com/Theo-FERRETE' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/theo-ferrete/' },
    { name: 'Email', icon: Mail, url: 'mailto:theo.ferrete@gmail.com' },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* 3D plein format */}
      <ChromeCanvas
        variant="projects"
        visible={isVisible}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-foreground tracking-tight">
            On discute ?
          </h2>
          <p className="text-center text-foreground/60 mb-12 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Un projet en tête ? Une question ? Ou juste envie de parler code ? Envoyez-moi un message !
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-2xl">
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
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border tint text-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none text-sm sm:text-base"
                  placeholder="Votre nom"
                />
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
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border tint text-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none text-sm sm:text-base"
                  placeholder="votre@email.com"
                />
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
                  required
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border tint text-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none resize-none text-sm sm:text-base"
                  placeholder="Votre message..."
                />
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

            {/* Informations de contact */}
            <div className="space-y-6 sm:space-y-8">
              <div className="glass p-6 sm:p-8 rounded-2xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
                  On se connecte ?
                </h3>
                <p className="text-foreground/60 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  Je suis toujours partant pour discuter de projets intéressants ou juste
                  échanger sur le développement web. Hésite pas à me contacter !
                </p>

                <a
                  href="/CV_Theo_Ferrete.pdf"
                  download
                  className="flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-6 py-3 sm:py-4 mb-6 bg-accent text-background font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  <Download size={18} />
                  Télécharger mon CV
                </a>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-border hover:border-accent transition-colors duration-300 group"
                    >
                      <social.icon size={20} className="shrink-0 text-foreground/70 group-hover:text-accent transition-colors duration-300" />
                      <span className="font-medium text-foreground/70 group-hover:text-accent truncate text-sm sm:text-base">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="border border-accent/30 bg-accent/5 p-6 sm:p-8 rounded-2xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
                  Dispo ?
                </h3>
                <p className="text-foreground/60 leading-relaxed text-sm sm:text-base flex items-start gap-2">
                  <Circle size={10} className="fill-emerald-400 text-emerald-400 shrink-0 mt-1.5" />
                  <span>
                    Ouais, dispo pour de nouveaux projets !
                    Je réponds généralement en moins de 48h.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
