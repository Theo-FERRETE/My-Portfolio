'use client';

import { Download, Github, Linkedin, Mail, Check } from 'lucide-react';
import { AVAILABILITY_LABEL, CV_PATH } from '@/app/components/layout/nav-items';

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: Github, url: 'https://www.github.com/Theo-FERRETE' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/theo-ferrete/' },
  { name: 'Email', icon: Mail, url: 'mailto:theo.ferrete@gmail.com' },
];

/** Ce qu'il est utile de préciser dans un premier message. */
const MESSAGE_TIPS = [
  'Le contexte : alternance, poste ou mission',
  'Le besoin ou les missions en quelques lignes',
  'Le calendrier envisagé',
];

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 sm:p-8 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Pour bien démarrer</h2>
        <p className="mt-3 text-foreground/70 leading-relaxed text-sm sm:text-base">
          Pour que je puisse vous répondre précisément, indiquez si possible :
        </p>
        <ul className="mt-4 space-y-2.5">
          {MESSAGE_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-foreground/80">
              <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Ailleurs</h2>

        <div className="mt-5 grid grid-cols-1 xs:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-accent transition-colors duration-300 group"
            >
              <social.icon
                size={18}
                className="shrink-0 text-foreground/70 group-hover:text-accent transition-colors duration-300"
              />
              <span className="font-medium text-foreground/70 group-hover:text-accent truncate text-sm">
                {social.name}
              </span>
            </a>
          ))}
        </div>

        <a
          href={CV_PATH}
          download
          className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 border border-border text-foreground font-semibold rounded-xl hover:border-accent hover:text-accent text-sm sm:text-base"
        >
          <Download size={18} />
          Télécharger le CV
        </a>
      </div>

      <div className="flex items-center gap-3 border border-accent-green/30 bg-accent-green/10 px-5 py-4 rounded-xl">
        <span className="relative flex w-2 h-2 shrink-0" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-accent-green opacity-75 animate-ping motion-reduce:animate-none" />
          <span className="relative w-2 h-2 rounded-full bg-accent-green" />
        </span>
        <p className="text-sm text-foreground/80">{AVAILABILITY_LABEL}</p>
      </div>
    </div>
  );
}
