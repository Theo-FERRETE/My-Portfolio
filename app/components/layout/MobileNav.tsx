'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { NAV_ITEMS, CV_PATH } from './nav-items';

const FOCUSABLE = 'a[href], button:not([disabled])';

interface MobileNavProps {
  pathname: string;
  onClose: () => void;
  /** Reçoit le focus quand le panneau se ferme. */
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Panneau de navigation mobile. Tant qu'il est ouvert : le fond ne défile plus,
 * Échap ferme, et le focus clavier reste piégé à l'intérieur.
 */
export default function MobileNav({ pathname, onClose, returnFocusRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        returnFocusRef.current?.focus();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, returnFocusRef]);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 md:hidden z-40" onClick={onClose} aria-hidden />

      <div id="menu-mobile" ref={panelRef} className="glass-raised fixed top-16 left-0 right-0 md:hidden z-40">
        <ul className="py-4 space-y-2 px-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
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
            href={CV_PATH}
            download
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-border text-foreground rounded-lg font-medium text-sm hover:border-accent hover:text-accent transition-colors duration-300"
          >
            <Download size={14} />
            Télécharger CV
          </a>
        </div>
      </div>
    </>
  );
}
