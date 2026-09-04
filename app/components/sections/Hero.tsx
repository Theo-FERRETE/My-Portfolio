import Link from 'next/link';
import { Download, ChevronDown } from 'lucide-react';

/** Une ligne de code, pré-découpée en tokens colorés façon coloration syntaxique. */
function CodeLine({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

const KEYWORD = 'text-accent';
const PROP = 'text-accent-amber';
const STRING = 'text-accent-green';
const STATUS = 'text-accent-teal';
const BOOL = 'text-accent-teal';
const PUNCT = 'text-foreground/40';

export default function Hero({ hasContentBelow = false }: { hasContentBelow?: boolean }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 sm:pt-32 bg-background">
      {/* Lueur discrète derrière la fenêtre d'éditeur, pas de 3D, un simple dégradé statique */}
      <div
        className="absolute inset-x-0 top-1/3 -translate-y-1/2 h-[70%] -z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 50%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto animate-fadeIn">
          {/* Fenêtre d'éditeur */}
          <div className="glass-raised rounded-2xl overflow-hidden animate-slideDown">
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" aria-hidden />
              <span className="ml-3 font-mono text-xs text-foreground/50 tint px-2.5 py-1 rounded">
                profil.ts
              </span>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6 px-4 sm:px-8 py-6 sm:py-8 font-mono text-[13px] xs:text-sm sm:text-lg md:text-xl leading-7 sm:leading-9 overflow-x-auto">
              <div className="text-right text-foreground/25 select-none">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
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
                  <span className={PUNCT}>:</span> <span className={STRING}>&quot;Développeur Full Stack&quot;</span>
                  <span className={PUNCT}>,</span>
                </CodeLine>
                <CodeLine>
                  {'  '}
                  <span className={PROP}>stack</span>
                  <span className={PUNCT}>:</span> <span className={PUNCT}>[</span>
                  <span className={STRING}>&quot;Next.js&quot;</span>
                  <span className={PUNCT}>,</span> <span className={STRING}>&quot;TypeScript&quot;</span>
                  <span className={PUNCT}>,</span> <span className={STRING}>&quot;Node&quot;</span>
                  <span className={PUNCT}>],</span>
                </CodeLine>
                <CodeLine>
                  {'  '}
                  <span className={PROP}>status</span>
                  <span className={PUNCT}>:</span> <span className={STATUS}>&quot;ouvert aux opportunités&quot;</span>
                  <span className={PUNCT}>,</span>
                </CodeLine>
                <CodeLine>
                  {'  '}
                  <span className={PROP}>availableNow</span>
                  <span className={PUNCT}>:</span> <span className={BOOL}>true</span>
                  <span className={PUNCT}>,</span>
                </CodeLine>
                <CodeLine>
                  <span className={PUNCT}>{'};'}</span>
                </CodeLine>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center justify-center mt-8 sm:mt-10 animate-fadeIn delay-500">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Voir les projets
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-border text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent text-sm sm:text-base"
            >
              Me contacter
            </Link>
            <a
              href="/CV_Theo_Ferrete.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-2 py-3 sm:py-4 text-foreground/70 font-medium hover:text-accent text-sm sm:text-base"
            >
              <Download size={16} />
              Télécharger le CV
            </a>
          </div>
        </div>
      </div>

      {hasContentBelow && (
        <a
          href="#apercu"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 p-2 rounded-lg text-foreground/70 hover:text-accent"
        >
          <span className="text-xs uppercase tracking-[0.15em]">Découvrir</span>
          <ChevronDown size={18} className="animate-bounce motion-reduce:animate-none" aria-hidden />
        </a>
      )}
    </section>
  );
}
