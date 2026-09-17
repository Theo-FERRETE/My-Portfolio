/** Nom de fichier plausible pour l'onglet d'éditeur, dérivé du chemin d'image d'un projet. */
export function previewFilename(imagePath: string): string {
  if (!imagePath) return 'aucun-aperçu';
  return imagePath.split('/').pop() || 'preview.png';
}
