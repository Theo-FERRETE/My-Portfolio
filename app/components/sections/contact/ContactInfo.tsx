'use client';

import { Download, Github, Linkedin, Mail, Circle } from 'lucide-react';
import { CV_PATH } from '@/app/components/layout/nav-items';

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: Github, url: 'https://www.github.com/Theo-FERRETE' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/theo-ferrete/' },
  { name: 'Email', icon: Mail, url: 'mailto:theo.ferrete@gmail.com' },
];

export default function ContactInfo() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="glass-card p-6 sm:p-8 rounded-xl">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
          On se connecte ?
        </h3>
        <p className="text-foreground/70 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
          Je suis toujours partant pour discuter de projets intéressants ou juste échanger sur le
          développement web. Hésite pas à me contacter !
        </p>

        <a
          href={CV_PATH}
          download
          className="flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-6 py-3 sm:py-4 mb-6 bg-accent text-background font-mono font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm sm:text-base"
        >
          <Download size={18} />
          curl -O cv.pdf
        </a>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-border hover:border-accent transition-colors duration-300 group"
            >
              <social.icon
                size={20}
                className="shrink-0 text-foreground/70 group-hover:text-accent transition-colors duration-300"
              />
              <span className="font-mono font-medium text-foreground/70 group-hover:text-accent truncate text-sm sm:text-base">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="border border-accent/30 bg-accent/5 p-6 sm:p-8 rounded-xl">
        <h3 className="font-mono text-xl sm:text-2xl font-bold mb-4 text-foreground">status</h3>
        <p className="text-foreground/70 leading-relaxed text-sm sm:text-base flex items-start gap-2">
          <Circle size={10} className="fill-accent-green text-accent-green shrink-0 mt-1.5" aria-hidden />
          <span>
            Ouais, dispo pour de nouveaux projets ! Je réponds généralement en moins de 48h.
          </span>
        </p>
      </div>
    </div>
  );
}
