'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, Linkedin, Mail, Coffee } from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  const handleLogoDoubleClick = () => {
    router.push('/admin/dashboard');
  };

  return (
    <footer className="relative bg-background text-foreground border-t border-border">
      {/* Ligne d'accent */}
      <div className="h-px bg-accent/40"></div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div
              className="text-2xl sm:text-3xl font-bold tracking-tight cursor-default select-none"
              onDoubleClick={handleLogoDoubleClick}
              title="Portfolio"
            >
              Théo FERRETE
            </div>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed max-w-xs">
              Dev web qui aime créer des trucs sympas sur internet. Basé à Rognac, France.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4 pt-2">
              <a
                href="https://github.com/Theo-FERRETE"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-accent hover:text-accent rounded-lg transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/theo-ferrete/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-accent hover:text-accent rounded-lg transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="/contact"
                className="p-2 border border-border hover:border-accent hover:text-accent rounded-lg transition-colors duration-300"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Navigation</h3>
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              <Link
                href="/"
                className="text-foreground/60 hover:text-accent transition-colors duration-300 inline-block text-sm sm:text-base"
              >
                Accueil
              </Link>
              <Link
                href="/about"
                className="text-foreground/60 hover:text-accent transition-colors duration-300 inline-block text-sm sm:text-base"
              >
                À propos
              </Link>
              <Link
                href="/skills"
                className="text-foreground/60 hover:text-accent transition-colors duration-300 inline-block text-sm sm:text-base"
              >
                Compétences
              </Link>
              <Link
                href="/projects"
                className="text-foreground/60 hover:text-accent transition-colors duration-300 inline-block text-sm sm:text-base"
              >
                Projets
              </Link>
              <Link
                href="/contact"
                className="text-foreground/60 hover:text-accent transition-colors duration-300 inline-block text-sm sm:text-base"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Contact</h3>
            <div className="flex flex-col space-y-2 sm:space-y-3 text-foreground/60 text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <Mail size={14} className="sm:size-4 text-accent shrink-0" />
                <span className="truncate">theo.ferrete@gmail.com</span>
              </p>
              <p className="mt-2 sm:mt-4 leading-relaxed">
                Dispo pour discuter de projets web ou opportunités de collab.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-3 sm:gap-0">
            <p className="text-foreground/50 text-xs sm:text-sm">
              © {new Date().getFullYear()} Théo FERRETE. Tous droits réservés.
            </p>
            <p className="text-foreground/40 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5">
              Fait avec Next.js et beaucoup de café <Coffee size={14} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
