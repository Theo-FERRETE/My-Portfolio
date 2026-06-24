'use client';

import { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useAdminTheme } from './AdminThemeProvider';
import { ADMIN_THEMES } from './admin-theme-constants';

export default function AdminThemeSwitcher({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useAdminTheme();
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
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="admin-card p-2 admin-text-accent"
        style={{ borderColor: 'var(--admin-border)' }}
        aria-label="Choisir un thème admin"
        aria-expanded={open}
      >
        <Palette size={16} />
      </button>

      {open && (
        <div className="admin-card absolute right-0 top-full mt-2 w-48 p-1.5 z-50">
          {ADMIN_THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTheme(t.value);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium"
              style={{
                color: theme === t.value ? 'var(--admin-foreground)' : 'var(--admin-foreground)',
                opacity: theme === t.value ? 1 : 0.7,
                borderRadius: 'calc(var(--admin-radius) * 0.5)',
              }}
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.swatch }} aria-hidden />
              <span className="flex-1 text-left">{t.label}</span>
              {theme === t.value && <Check size={14} className="admin-text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
