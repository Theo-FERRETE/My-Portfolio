'use client';

import { useEffect, useRef, useState } from 'react';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('C\'est envoyé ! 🚀');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { name: 'GitHub', icon: '💻', url: 'https://www.github.com/Theo-FERRETE', color: 'hover:text-gray-700' },
    { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/theo-ferrete/', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com', color: 'hover:text-blue-400' },
    { name: 'Email', icon: '📧', url: 'mailto:theo.ferrete@gmail.com', color: 'hover:text-red-600' },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contactez-moi
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Une question ou un projet ? N'hésitez pas à me contacter !
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Formulaire */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"></div>
              <form onSubmit={handleSubmit} className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm sm:text-base"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm sm:text-base"
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none text-sm sm:text-base"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* Informations de contact */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
                  Restons connectés
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  Je suis toujours ouvert aux nouvelles opportunités et collaborations. 
                  N'hésitez pas à me contacter via le formulaire ou les réseaux sociaux.
                </p>

                <a
                  href="/cv.pdf"
                  download
                  className="flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-6 py-3 sm:py-4 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Télécharger mon</span> CV
                </a>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 group ${social.color} gap-2`}
                      title={social.name}
                    >
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{social.icon}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-inherit hidden sm:inline text-xs sm:text-sm">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 sm:p-8 rounded-3xl shadow-xl text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                  Disponibilité
                </h3>
                <p className="text-purple-100 leading-relaxed text-xs sm:text-sm">
                  🟢 Actuellement disponible pour de nouveaux projets et collaborations.
                  Je réponds généralement sous 24-48 heures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
