'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, Download, Palette, Check } from 'lucide-react';
import { useTheme, THEMES } from '@/app/components/providers/ThemeProvider';

function ThemeMenu({ iconSize = 16 }: { iconSize?: number }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 border border-border rounded-full text-foreground hover:border-accent hover:text-accent transition-colors duration-300"
        aria-label="Choisir un thème"
        aria-expanded={open}
      >
        <Palette size={iconSize} />
      </button>

      {open && (
        <div className="glass absolute right-0 top-full mt-2 w-44 rounded-xl p-1.5 z-50">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTheme(t.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                theme === t.value ? 'tint text-foreground' : 'text-foreground/70 hover-tint hover:text-foreground'
              }`}
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.swatch }} aria-hidden />
              <span className="flex-1 text-left">{t.label}</span>
              {theme === t.value && <Check size={14} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    { href: '/skills', label: 'Compétences' },
    { href: '/projects', label: 'Projets' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
            Théo FERRETE
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors duration-300 ${
                      pathname === item.href
                        ? 'text-accent'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-accent"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <a
              href="/CV_Theo_Ferrete.pdf"
              download
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-full font-medium text-sm hover:border-accent hover:text-accent transition-colors duration-300"
            >
              <Download size={14} />
              CV
            </a>

            <ThemeMenu />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeMenu iconSize={18} />

            {/* Mobile menu button */}
            <button
              className="p-2 text-foreground transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 md:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu panel */}
            <div className="glass fixed top-16 left-0 right-0 md:hidden z-40">
              <ul className="py-4 space-y-2 px-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2.5 rounded-lg transition-colors duration-300 text-sm font-medium ${
                        pathname === item.href
                          ? 'tint text-accent'
                          : 'text-foreground/70 hover-tint hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="px-4 pb-4">
                <a
                  href="/CV_Theo_Ferrete.pdf"
                  download
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-border text-foreground rounded-full font-medium text-sm hover:border-accent hover:text-accent transition-colors duration-300"
                >
                  <Download size={14} />
                  Télécharger CV
                </a>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
