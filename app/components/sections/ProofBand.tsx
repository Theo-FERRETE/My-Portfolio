import type { Skill } from '@/lib/data';
import { getSkillIcon } from '@/lib/skill-icons';

/**
 * Bandeau de crédibilité sous le Hero : la stack qui défile.
 * La liste est dupliquée pour une boucle sans à-coup ; la copie est masquée
 * aux lecteurs d'écran.
 */
export default function ProofBand({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  return (
    <section
      id="apercu"
      aria-labelledby="stack-titre"
      className="border-y border-border bg-surface/40 py-10 sm:py-12 scroll-mt-20"
    >
      <h2
        id="stack-titre"
        className="text-center text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-foreground/50"
      >
        Les technologies avec lesquelles je construis
      </h2>

      <div className="marquee mt-8">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee-track" aria-hidden={copy === 1 || undefined}>
            {skills.map((skill) => {
              const { Icon, color } = getSkillIcon(skill.name);
              return (
                <li
                  key={skill.id}
                  className="flex items-center gap-2.5 shrink-0 font-medium text-sm sm:text-base text-foreground/60"
                >
                  <Icon size={24} color={color} aria-hidden />
                  {skill.name}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </section>
  );
}
