import Hero from '@/app/components/sections/Hero';
import About from '@/app/components/sections/About';
import ContactCta from '@/app/components/sections/ContactCta';
import { getProfile, getProjects, getSkills } from '@/lib/data';

export const revalidate = 60;

// Accueil volontairement court : le profil en un coup d'œil, puis un lien.
// Le détail des projets vit sur /projects, celui des technos sur /skills.
export default async function Home() {
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ]);

  return (
    <main id="contenu">
      <Hero hasContentBelow />
      <About profile={profile} projects={projects} skills={skills} />
      <ContactCta />
    </main>
  );
}
