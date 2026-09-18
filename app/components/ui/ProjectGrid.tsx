import type { Project } from '@/lib/data';
import ProjectCard from '@/app/components/ui/ProjectCard';

/**
 * Grille de cartes projet, partagée par l'accueil, la liste et la fiche projet.
 * Les cartes sont centrées : une rangée incomplète reste équilibrée au lieu de
 * laisser un trou à droite.
 */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {projects.map((project) => (
        <li
          key={project.id}
          className="w-full max-w-[24rem] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
        >
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
