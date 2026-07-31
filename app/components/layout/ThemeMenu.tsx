'use client';

import { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, THEMES } from '@/app/components/providers/ThemeProvider';

export default function ThemeMenu({ iconSize = 16 }: { iconSize?: number }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Échap ferme le menu et rend le focus au bouton, sinon la navigation
    // clavier reste bloquée dans un menu qu'on ne peut pas quitter.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 border border-border rounded-lg text-foreground hover:border-accent hover:text-accent transition-colors duration-300"
        aria-label="Choisir un thème"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Palette size={iconSize} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Thèmes"
          className="glass-raised absolute right-0 top-full mt-2 w-44 rounded-xl p-1.5 z-50"
        >
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="menuitemradio"
              aria-checked={theme === t.value}
              onClick={() => {
                setTheme(t.value);
                setOpen(false);
                buttonRef.current?.focus();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                theme === t.value
                  ? 'tint text-foreground'
                  : 'text-foreground/70 hover-tint hover:text-foreground'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: t.swatch }}
                aria-hidden
              />
              <span className="flex-1 text-left">{t.label}</span>
              {theme === t.value && <Check size={14} className="text-accent" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
