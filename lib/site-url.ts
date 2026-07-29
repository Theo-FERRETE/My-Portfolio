// URL canonique du site — utilisée par metadataBase, sitemap.ts et robots.ts.
// Surchageable via NEXT_PUBLIC_SITE_URL (ex: environnements de preview).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://theo-ferrete.fr').replace(/\/$/, '');
