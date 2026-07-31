import Hero from '@/app/components/sections/Hero';
import FeaturedProjects from '@/app/components/sections/FeaturedProjects';
import StackStrip from '@/app/components/sections/StackStrip';
import ContactCta from '@/app/components/sections/ContactCta';
import { getProjects, getSkills } from '@/lib/data';
import type { Project } from '@/lib/data';

export const revalidate = 60;

const FEATURED_COUNT = 3;

/** Les projets mis en avant d'abord, complétés par les plus récents. */
function pickFeatured(projects: Project[]): Project[] {
  const byRecent = [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const featured = byRecent.filter((p) => p.featured);
  const rest = byRecent.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, FEATURED_COUNT);
}

export default async function Home() {
  const [projects, skills] = await Promise.all([getProjects(), getSkills()]);

  return (
    <main id="contenu">
      <Hero hasContentBelow={projects.length > 0} />
      <FeaturedProjects projects={pickFeatured(projects)} />
      <StackStrip skills={skills} />
      <ContactCta />
    </main>
  );
}
