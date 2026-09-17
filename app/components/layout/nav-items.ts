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

/** Libellé de disponibilité affiché sur le site (Hero, Contact, pied de page). */
export const AVAILABILITY_LABEL = 'Ouvert aux opportunités · poste ou freelance';
