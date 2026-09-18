/** Navigation publique, partagée par l'en-tête (bureau et mobile) et le pied de page. */
export const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/projects', label: 'Projets' },
  { href: '/skills', label: 'Compétences' },
  { href: '/contact', label: 'Contact' },
] as const;

/** En-tête : Contact est porté par le bouton « Me contacter », pas besoin du lien en double. */
export const HEADER_NAV_ITEMS = NAV_ITEMS.filter((item) => item.href !== '/contact');

export const CV_PATH = '/CV_Theo_Ferrete.pdf';

/**
 * Statut affiché dans les badges (Hero, pages internes, Contact, bloc de fin).
 * C'est la seule ligne à changer quand la situation évolue, par exemple :
 * 'Recherche une alternance · Bachelor CDA' ou 'Disponible pour des missions freelance'.
 */
export const AVAILABILITY_LABEL = 'Ouvert aux opportunités · alternance, poste ou mission';
