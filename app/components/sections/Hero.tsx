import Image from 'next/image';
import Link from 'next/link';
import { Download, ChevronDown, ArrowRight } from 'lucide-react';
import EditorWindow from '@/app/components/ui/EditorWindow';
import { AVAILABILITY_LABEL, CV_PATH } from '@/app/components/layout/nav-items';

/** Une ligne de code, pré-découpée en tokens colorés façon coloration syntaxique. */
function CodeLine({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

const KEYWORD = 'text-accent';
const PROP = 'text-accent-amber';
const STRING = 'text-accent-green';
const BOOL = 'text-accent-teal';
const PUNCT = 'text-foreground/40';

export default function Hero({ hasContentBelow = false }: { hasContentBelow?: boolean }) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-28 pb-16 sm:pt-32 bg-background">
      {/* Lueur discrète derrière la fenêtre d'éditeur, pas de 3D, un simple dégradé statique */}
      <div
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 45% 55% at 72% 45%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-center">
          {/* Message : ce que j'apporte avant qui je suis */}
          <div className="text-center lg:text-left animate-rise">
            <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-green/30 bg-accent-green/10 text-accent-green text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent-green" aria-hidden />
              {AVAILABILITY_LABEL}
            </p>

            <h1 className="mt-6 text-3xl xs:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-foreground leading-tight">
              Des applications web <span className="text-accent">complètes</span>, de l&apos;interface à l&apos;API.
            </h1>

            <p className="mt-6 text-sm sm:text-base text-foreground/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Développeur full stack, je conçois et développe des applications web avec{' '}
              <span className="font-semibold text-foreground">Next.js</span>,{' '}
              <span className="font-semibold text-foreground">TypeScript</span> et{' '}
              <span className="font-semibold text-foreground">Node</span>. Alternance, poste ou mission : voyons
              ce que je peux apporter à votre équipe ou à votre projet.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-center lg:justify-start mt-8 sm:mt-10">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                Me contacter
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={CV_PATH}
                download
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-border text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent text-sm sm:text-base"
              >
                <Download size={18} />
                Télécharger mon CV
              </a>
            </div>
            <Link
              href="/projects"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-accent"
            >
              ou voir mes projets
              <ArrowRight size={14} />
            </Link>

            {/* Signature : un visage et un nom, pour ne pas vendre qu'une stack */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-3">
              <Image
                src="/images/profile/avatar.png"
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-accent/60"
                priority
              />
              <div className="text-left">
                <p className="font-semibold text-foreground leading-tight">Théo Ferrete</p>
                <p className="text-sm text-foreground/60">Développeur Full Stack · Rognac, France</p>
              </div>
            </div>
          </div>

          {/* Visuel : l'identité "éditeur de code" en illustration */}
          <div className="animate-rise">
            <EditorWindow
              filename="profil.ts"
              className="glass-raised rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-5 px-4 sm:px-6 py-6 sm:py-7 font-mono text-[12px] sm:text-sm leading-7 overflow-x-auto">
                <div className="text-right text-foreground/25 select-none" aria-hidden>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <div key={n}>{n}</div>
                  ))}
                </div>
                <div className="whitespace-pre">
                  <CodeLine>
                    <span className={KEYWORD}>const</span> developer <span className={PUNCT}>= {'{'}</span>
                  </CodeLine>
                  <CodeLine>
                    {'  '}
                    <span className={PROP}>name</span>
                    <span className={PUNCT}>:</span> <span className={STRING}>&quot;Théo Ferrete&quot;</span>
                    <span className={PUNCT}>,</span>
                  </CodeLine>
                  <CodeLine>
                    {'  '}
                    <span className={PROP}>role</span>
                    <span className={PUNCT}>:</span> <span className={STRING}>&quot;Full Stack&quot;</span>
                    <span className={PUNCT}>,</span>
                  </CodeLine>
                  <CodeLine>
                    {'  '}
                    <span className={PROP}>stack</span>
                    <span className={PUNCT}>:</span> <span className={PUNCT}>[</span>
                    <span className={STRING}>&quot;Next.js&quot;</span>
                    <span className={PUNCT}>,</span> <span className={STRING}>&quot;TS&quot;</span>
                    <span className={PUNCT}>,</span> <span className={STRING}>&quot;Node&quot;</span>
                    <span className={PUNCT}>],</span>
                  </CodeLine>
                  <CodeLine>
                    {'  '}
                    <span className={PROP}>ouvertA</span>
                    <span className={PUNCT}>:</span> <span className={PUNCT}>[</span>
                    <span className={STRING}>&quot;alternance&quot;</span>
                    <span className={PUNCT}>,</span> <span className={STRING}>&quot;poste&quot;</span>
                    <span className={PUNCT}>,</span> <span className={STRING}>&quot;mission&quot;</span>
                    <span className={PUNCT}>],</span>
                  </CodeLine>
                  <CodeLine>
                    {'  '}
                    <span className={PROP}>disponible</span>
                    <span className={PUNCT}>:</span> <span className={BOOL}>true</span>
                    <span className={PUNCT}>,</span>
                  </CodeLine>
                  <CodeLine>
                    <span className={PUNCT}>{'};'}</span>
                  </CodeLine>
                </div>
              </div>
            </EditorWindow>
          </div>
        </div>
      </div>

      {hasContentBelow && (
        <a
          href="#apercu"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1 p-2 rounded-lg text-foreground/70 hover:text-accent"
        >
          <span className="text-xs uppercase tracking-[0.15em]">Découvrir</span>
          <ChevronDown size={18} className="animate-bounce motion-reduce:animate-none" aria-hidden />
        </a>
      )}
    </section>
  );
}
