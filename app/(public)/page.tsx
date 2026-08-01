import Hero from '@/app/components/sections/Hero';
import FeaturedProjects from '@/app/components/sections/FeaturedProjects';
import ContactCta from '@/app/components/sections/ContactCta';
import { getProjects } from '@/lib/data';
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

// Accueil volontairement court : une vitrine de projets, puis un lien.
// Le détail des technos vit sur /skills, le formulaire sur /contact.
export default async function Home() {
  const projects = await getProjects();

  return (
    <main id="contenu">
      <Hero hasContentBelow={projects.length > 0} />
      <FeaturedProjects projects={pickFeatured(projects)} />
      <ContactCta />
    </main>
  );
}
