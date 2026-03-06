'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  const handleLogoDoubleClick = () => {
    router.push('/admin/dashboard');
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div 
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent cursor-default select-none"
              onDoubleClick={handleLogoDoubleClick}
              title="Portfolio"
            >
              Théo FERRETE
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Dev web qui aime créer des trucs sympas sur internet. Basé à Rognac, France.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://github.com/Theo-FERRETE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-purple-600 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/theo-ferrete/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-purple-600 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-purple-600 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="/contact"
                className="p-2 bg-gray-800 hover:bg-purple-600 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
              >
                → Accueil
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
              >
                → À propos
              </Link>
              <Link
                href="/skills"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
              >
                → Compétences
              </Link>
              <Link
                href="/projects"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
              >
                → Projets
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
              >
                → Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="flex flex-col space-y-3 text-gray-400 text-sm">
              <p className="flex items-center">
                <Mail size={16} className="mr-2 text-purple-400" />
                theo.ferrete@gmail.com
              </p>
              <p className="mt-4 leading-relaxed">
                Dispo pour discuter de projets web ou opportunités de collab.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Théo FERRETE. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm flex items-center">
              Fait avec Next.js et beaucoup de café ☕
            </p>
          </div>
        </div>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10"></div>
    </footer>
  );
}
