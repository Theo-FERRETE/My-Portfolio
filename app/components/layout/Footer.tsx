'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, Linkedin, Mail } from 'lucide-react';
import { NAV_ITEMS } from './nav-items';
import Logo from '@/app/components/ui/Logo';

const SOCIAL_LINKS = [
  { label: 'GitHub', icon: Github, href: 'https://github.com/Theo-FERRETE', external: true },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/theo-ferrete/', external: true },
  { label: 'Email', icon: Mail, href: '/contact', external: false },
];

/** Pied de page compact : l'appel à l'action vit déjà dans le bloc de contact au-dessus. */
export default function Footer() {
  const router = useRouter();

  const handleLogoDoubleClick = () => {
    router.push('/admin/dashboard');
  };

  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-fit cursor-default select-none" onDoubleClick={handleLogoDoubleClick}>
            <Logo />
          </div>

          <nav aria-label="Navigation du pied de page">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-foreground/70 hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="p-2 rounded-lg text-foreground/70 hover:text-accent hover-tint"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 pt-6 border-t border-border text-center text-foreground/50 text-xs">
          © {new Date().getFullYear()} Théo Ferrete · Développeur Full Stack · Rognac, France
        </p>
      </div>
    </footer>
  );
}
