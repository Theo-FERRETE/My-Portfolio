import Hero from '@/app/components/sections/Hero';
import ProofBand from '@/app/components/sections/ProofBand';
import FeaturedProjects from '@/app/components/sections/FeaturedProjects';
import Services from '@/app/components/sections/Services';
import ContactCta from '@/app/components/sections/ContactCta';
import { getProjects, getSkills } from '@/lib/data';

export const revalidate = 60;

// Accueil façon landing : promesse, stack, réalisations, offre, puis contact.
// Le détail des projets vit sur /projects, celui des technos sur /skills.
export default async function Home() {
  const [projects, skills] = await Promise.all([getProjects(), getSkills()]);

  return (
    <main id="contenu">
      <Hero hasContentBelow />
      <ProofBand skills={skills} />
      <FeaturedProjects projects={projects} />
      <Services />
      <ContactCta />
    </main>
  );
}
