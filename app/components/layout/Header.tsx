'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, Download, ArrowRight } from 'lucide-react';
import MobileNav from './MobileNav';
import Logo from '@/app/components/ui/Logo';
import { HEADER_NAV_ITEMS, CV_PATH } from './nav-items';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Ferme le menu mobile au changement de route, ajustement pendant le rendu
  // plutôt que dans un effect (cf. https://react.dev/learn/you-might-not-need-an-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4" aria-label="Navigation principale">
        <div className="flex items-center justify-between">
          <Link href="/" className="shrink-0 rounded-lg" aria-label="Théo Ferrete, accueil">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex gap-6 lg:gap-8">
              {HEADER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`relative text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                      pathname === item.href
                        ? 'text-accent'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" aria-hidden />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 lg:gap-3 whitespace-nowrap">
              <a
                href={CV_PATH}
                download
                className="flex items-center gap-2 px-3 py-2 text-foreground/70 rounded-lg font-medium text-sm hover:text-accent transition-colors duration-300"
              >
                <Download size={14} />
                CV
              </a>
              <Link
                href="/contact"
                className="group flex items-center gap-1.5 px-4 py-2 bg-accent text-background rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Me contacter
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              ref={toggleRef}
              className="p-2 text-foreground transition-colors duration-300"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="menu-mobile"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <MobileNav
            pathname={pathname}
            onClose={() => setMobileMenuOpen(false)}
            returnFocusRef={toggleRef}
          />
        )}
      </nav>
    </header>
  );
}
