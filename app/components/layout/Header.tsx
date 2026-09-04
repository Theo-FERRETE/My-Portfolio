'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, Download } from 'lucide-react';
import MobileNav from './MobileNav';
import { NAV_ITEMS, CV_PATH } from './nav-items';

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
          <Link
            href="/"
            className="font-mono text-base sm:text-lg font-bold tracking-tight text-foreground truncate"
          >
            theo<span className="text-accent">@</span>portfolio
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`relative text-sm font-medium transition-colors duration-300 ${
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

            <a
              href={CV_PATH}
              download
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg font-medium text-sm hover:border-accent hover:text-accent transition-colors duration-300"
            >
              <Download size={14} />
              CV
            </a>
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
